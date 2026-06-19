# AI, Voice & Integration Specific Decisions

* **AI Prompt Design:** Format LLM requests with strict XML markers (`<events>`, `<guidelines>`, `<incident_context>`) to help Claude parse the Neo4j JSON extract. Force a structured JSON output model back from the LLM.
* **REST Client:** WebClient from Spring WebFlux is standard for making API requests to Anthropic and Sarvam to prevent blocking main controller threads.
* **Sarvam Settings:** Standardize on model `bulbul:v1` for text-to-speech rendering and `saarika:v2` for speech-to-text. User language preference defaults to English/Hindi and is dynamically loaded from the user configuration.
* **Workflow Engine:** Run workflows inside Spring Boot using the native task executor (`@EnableAsync`, `@EnableScheduling`) to maintain Java portability while replicating multi-stage Render-like retry pipelines.
* **Model Naming Conventions:** Mapped Neo4j graph nodes `:System` and `:File` to Java classes `SystemNode.java` and `FileNode.java` to prevent namespace collisions with core JDK classes `java.lang.System` and `java.io.File`.
* **JDK & Lombok Compatibility:** Upgraded dependency version of Lombok to `1.18.38` and explicitly configured its annotation processor in the `maven-compiler-plugin` to resolve internal `javac` TagType initialization errors under JDK 17+.

