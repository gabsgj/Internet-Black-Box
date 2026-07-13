package com.hackhazards.internetblackbox.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackhazards.internetblackbox.model.*;
import com.hackhazards.internetblackbox.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;

import java.util.*;

@Slf4j
@Service
public class WebhookService {

    private final PersonRepository personRepository;
    private final EventRepository eventRepository;
    private final SystemRepository systemRepository;
    private final FileRepository fileRepository;
    private final IncidentRepository incidentRepository;
    private final IncidentReconstructionService reconstructionService;
    private final ObjectMapper objectMapper;

    public WebhookService(PersonRepository personRepository,
                          EventRepository eventRepository,
                          SystemRepository systemRepository,
                          FileRepository fileRepository,
                          IncidentRepository incidentRepository,
                          @Lazy IncidentReconstructionService reconstructionService,
                          ObjectMapper objectMapper) {
        this.personRepository = personRepository;
        this.eventRepository = eventRepository;
        this.systemRepository = systemRepository;
        this.fileRepository = fileRepository;
        this.incidentRepository = incidentRepository;
        this.reconstructionService = reconstructionService;
        this.objectMapper = objectMapper;
    }

    /**
     * Parses and processes GitHub webhook events (e.g. push/commits and pull_request).
     */
    @Transactional("transactionManager")
    public void processGitHubWebhook(Map<String, Object> payload, String githubEventHeader) {
        log.info("Processing GitHub webhook event type: {}", githubEventHeader);
        try {
            String eventTypeStr = githubEventHeader != null ? githubEventHeader : "push";

            // Extract Repository / SystemNode details
            Map<String, Object> repoMap = (Map<String, Object>) payload.get("repository");
            String repoName = repoMap != null ? (String) repoMap.get("name") : "unknown-repo";
            String repoFullName = repoMap != null ? (String) repoMap.get("full_name") : "unknown/repo";

            SystemNode repoSystem = systemRepository.findById("github:repo:" + repoFullName)
                    .orElseGet(() -> {
                        SystemNode sys = SystemNode.builder()
                                .id("github:repo:" + repoFullName)
                                .name(repoName)
                                .type(SystemType.REPOSITORY)
                                .environment(Environment.dev)
                                .build();
                        return systemRepository.save(sys);
                    });

            if ("push".equalsIgnoreCase(eventTypeStr)) {
                // Extract Commits
                List<Map<String, Object>> commits = (List<Map<String, Object>>) payload.get("commits");
                if (commits != null) {
                    for (Map<String, Object> commitMap : commits) {
                        String commitSha = (String) commitMap.get("id");
                        String message = (String) commitMap.get("message");
                        String url = (String) commitMap.get("url");
                        String timestampStr = (String) commitMap.get("timestamp"); // ISO-8601

                        Map<String, Object> authorMap = (Map<String, Object>) commitMap.get("author");
                        String authorName = authorMap != null ? (String) authorMap.get("name") : "Unknown Author";
                        String authorEmail = authorMap != null ? (String) authorMap.get("email") : "unknown@github.com";
                        String authorUsername = authorMap != null ? (String) authorMap.get("username") : authorEmail;

                        // Find or create Person
                        Person author = personRepository.findById(authorEmail)
                                .orElseGet(() -> {
                                    Person p = Person.builder()
                                            .id(authorEmail)
                                            .name(authorName)
                                            .email(authorEmail)
                                            .role("Developer")
                                            .teams(List.of("Engineering"))
                                            .build();
                                    return personRepository.save(p);
                                });

                        // Process modified files
                        List<FileNode> modifiedFiles = new ArrayList<>();
                        List<String> addedList = (List<String>) commitMap.get("added");
                        List<String> modifiedList = (List<String>) commitMap.get("modified");
                        List<String> filesList = new ArrayList<>();
                        if (addedList != null) filesList.addAll(addedList);
                        if (modifiedList != null) filesList.addAll(modifiedList);

                        for (String filePath : filesList) {
                            String fileId = repoFullName + ":" + filePath;
                            String extension = filePath.contains(".") ? filePath.substring(filePath.lastIndexOf(".") + 1) : "unknown";
                            FileNode fileNode = fileRepository.findById(fileId)
                                    .orElseGet(() -> {
                                        FileNode fn = FileNode.builder()
                                                .id(fileId)
                                                .path(filePath)
                                                .repository(repoFullName)
                                                .language(extension)
                                                .system(repoSystem)
                                                .build();
                                        return fileRepository.save(fn);
                                    });
                            modifiedFiles.add(fileNode);
                        }

                        // Create Event
OffsetDateTime eventTime = timestampStr != null
        ? OffsetDateTime.parse(timestampStr)
        : OffsetDateTime.now();

Event commitEvent = Event.builder()
        .id("github:commit:" + commitSha)
        .type(EventType.COMMIT)
        .timestamp(eventTime)
        .source("github")
        .content("Commit: " + message)
        .severity(Severity.INFO)
        .metadata(objectMapper.writeValueAsString(commitMap))
        .affectedSystems(List.of(repoSystem))
        .modifiedFiles(modifiedFiles)
        .build();
                        eventRepository.save(commitEvent);

                        // Link Person -> Event
                        if (author.getAuthoredEvents() == null) {
                            author.setAuthoredEvents(new ArrayList<>());
                        }
                        author.getAuthoredEvents().add(commitEvent);
                        personRepository.save(author);

                        log.info("Saved commit event: {}", commitSha);
                    }
                }
            } else if ("pull_request".equalsIgnoreCase(eventTypeStr)) {
                Map<String, Object> prMap = (Map<String, Object>) payload.get("pull_request");
                if (prMap != null) {
                    String action = (String) payload.get("action"); // opened, closed, merged
                    Boolean merged = (Boolean) prMap.get("merged");
                    String title = (String) prMap.get("title");
                    Integer number = (Integer) prMap.get("number");
                    String prId = String.valueOf(prMap.get("id"));

                    Map<String, Object> userMap = (Map<String, Object>) prMap.get("user");
                    String prUser = userMap != null ? (String) userMap.get("login") : "unknown";

                    if ("closed".equalsIgnoreCase(action) && Boolean.TRUE.equals(merged)) {
                        // Create Person for PR merger
                        Person merger = personRepository.findById(prUser + "@github.com")
                                .orElseGet(() -> {
                                    Person p = Person.builder()
                                            .id(prUser + "@github.com")
                                            .name(prUser)
                                            .email(prUser + "@github.com")
                                            .role("Developer")
                                            .build();
                                    return personRepository.save(p);
                                });

                        Event prMergeEvent = Event.builder()
        .id("github:pr:" + prId)
        .type(EventType.PR_MERGE)
        .timestamp(OffsetDateTime.now())
        .source("github")
        .content(String.format("Merged PR #%d: %s", number, title))
        .severity(Severity.INFO)
        .metadata(objectMapper.writeValueAsString(prMap))
        .affectedSystems(List.of(repoSystem))
        .build();

                        eventRepository.save(prMergeEvent);

                        if (merger.getAuthoredEvents() == null) {
                            merger.setAuthoredEvents(new ArrayList<>());
                        }
                        merger.getAuthoredEvents().add(prMergeEvent);
                        personRepository.save(merger);

                        log.info("Saved PR merge event: #{}", number);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to process GitHub webhook: {}", e.getMessage(), e);
        }
    }

    /**
     * Parses and processes Slack webhook events.
     */
    @Transactional("transactionManager")
    public void processSlackWebhook(Map<String, Object> payload) {
        log.info("Processing Slack webhook event");
        try {
            Map<String, Object> event = (Map<String, Object>) payload.get("event");
            if (event == null) return;

            String type = (String) event.get("type");
            String subtype = (String) event.get("subtype");

            // Only process user messages (skip bot messages or subtypes to avoid loops)
            if ("message".equalsIgnoreCase(type) && subtype == null) {
                String text = (String) event.get("text");
                String userId = (String) event.get("user");
                String channel = (String) event.get("channel");
                String tsStr = (String) event.get("ts"); // Unix timestamp string, e.g. "1503435956.000247"
                String eventId = (String) event.get("client_msg_id");
                if (eventId == null) {
                    eventId = "slack:msg:" + tsStr;
                }

                // Find or create Person representing Slack User
                Person slackUser = personRepository.findById("slack:" + userId)
                        .orElseGet(() -> {
                            Person p = Person.builder()
                                    .id("slack:" + userId)
                                    .name("Slack User " + userId)
                                    .email(userId + "@slack.com")
                                    .role("Team Member")
                                    .build();
                            return personRepository.save(p);
                        });

                double unixTime = Double.parseDouble(tsStr);

OffsetDateTime eventTime = Instant
        .ofEpochMilli((long) (unixTime * 1000))
        .atOffset(ZoneOffset.UTC);

Event slackEvent = Event.builder()
        .id(eventId)
        .type(EventType.SLACK_MESSAGE)
        .timestamp(eventTime)
        .source("slack")
        .content(text)
        .severity(Severity.INFO)
        .metadata(objectMapper.writeValueAsString(event))
        .build();

                eventRepository.save(slackEvent);

                if (slackUser.getAuthoredEvents() == null) {
                    slackUser.setAuthoredEvents(new ArrayList<>());
                }
                slackUser.getAuthoredEvents().add(slackEvent);
                personRepository.save(slackUser);

                log.info("Saved Slack message event from user: {}", userId);
            }
        } catch (Exception e) {
            log.error("Failed to process Slack webhook: {}", e.getMessage(), e);
        }
    }

    /**
     * Parses and processes Sentry webhook events (Alerts).
     */
    @Transactional("transactionManager")
    public void processSentryWebhook(Map<String, Object> payload) {
        log.info("Processing Sentry alert webhook");
        try {
            // Sentry payloads often vary depending on format. Let's make this highly flexible.
            String message = (String) payload.get("message");
            if (message == null) {
                Map<String, Object> eventMap = (Map<String, Object>) payload.get("event");
                if (eventMap != null) {
                    message = (String) eventMap.get("title");
                }
            }
            if (message == null) {
                message = "Sentry alert triggered";
            }

            // Extract project/service affected
            String projectName = (String) payload.get("project_name");
            if (projectName == null) {
                projectName = (String) payload.get("project");
            }
            if (projectName == null) {
                projectName = "unknown-service";
            }

            // Get severity level
            String level = (String) payload.get("level");
            Severity severity = Severity.WARNING;
            if ("error".equalsIgnoreCase(level) || "fatal".equalsIgnoreCase(level)) {
                severity = Severity.CRITICAL;
            }

            // Find or create SystemNode
            String systemId = "service:" + projectName;
            String finalProjectName = projectName;
            SystemNode system = systemRepository.findById(systemId)
                    .orElseGet(() -> {
                        SystemNode sys = SystemNode.builder()
                                .id(systemId)
                                .name(finalProjectName)
                                .type(SystemType.SERVICE)
                                .environment(Environment.production)
                                .build();
                        return systemRepository.save(sys);
                    });

            String eventId = "sentry:alert:" + UUID.randomUUID();

            Event sentryEvent = Event.builder()
                    .id(eventId)
                    .type(EventType.ALERT)
                    .timestamp(java.time.OffsetDateTime.now())
                    .source("sentry")
                    .content("Sentry Alert: " + message)
                    .severity(severity)
                    .metadata(objectMapper.writeValueAsString(payload))
                    .affectedSystems(List.of(system))
                    .build();

            eventRepository.save(sentryEvent);
            log.info("Saved Sentry alert: {} for system: {}", message, projectName);

            // Auto-trigger incident reconstruction if severity is CRITICAL (Workflow 5 Anomaly Detect / Auto-trigger)
            if (severity == Severity.CRITICAL) {
                log.warn("CRITICAL Sentry alert received. Auto-triggering incident reconstruction...");
                
                String incidentId = "inc_sentry_" + System.currentTimeMillis();
                Incident autoIncident = Incident.builder()
                        .id(incidentId)
                        .title("Auto-Triggered Outage: " + message)
                        .type(IncidentType.OUTAGE)
                        .triggeredAt(LocalDateTime.now())
                        .triggeredBy("auto-anomaly")
                        .status(IncidentStatus.OPEN)
                        .severity(IncidentSeverity.P1)
                        .build();

                incidentRepository.save(autoIncident);

                // Run reconstruction asynchronously
                reconstructionService.triggerReconstruction(incidentId);
            }
        } catch (Exception e) {
            log.error("Failed to process Sentry webhook: {}", e.getMessage(), e);
        }
    }
}
