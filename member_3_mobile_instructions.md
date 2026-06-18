# Team Member 3: Mobile App Engineer
## Onboarding & AI Integration Instructions

Welcome! As the **Mobile App Engineer**, you are responsible for developing the Expo mobile application, building the Incident Feed and detailed scrollable Timeline views, setting up local state, and implementing voice querying audio records.

---

## 1. Project Directory Structure
All mobile code files reside inside the `mobile-app/` folder. This is a pre-initialized Expo workspace configured with TypeScript:
* Run `npm install` inside `mobile-app/` to resolve core expo components.
* Run `npm run ios` or `npm run android` to launch in simulators, or `npm run web` to preview in a browser.

---

## 2. Shared Memory Protocol
We use the `.aimem/` folder to persist project knowledge. Before running commands or committing changes:
1. Read `.aimem/common/development_plan.md` for overall architecture.
2. Read `.aimem/common/decisions.md` to see shared standards.
3. Review and update `.aimem/member_3_mobile/tasks.md` and `.aimem/member_3_mobile/progress.md` to document your accomplishments.
4. If you have updates regarding response models or voice payload properties, coordinate with Member 4 (Integration/AI) and document changes in `.aimem/common/decisions.md`.

---

## 3. Your Tasks & Roadmap
Please check `.aimem/member_3_mobile/tasks.md` for details. Your core targets include:
* **Task 3.1:** Setup Expo Router layout wrappers and add bottom navigation screens.
* **Task 3.2:** Develop the Incident Feed showing list events and color badges.
* **Task 3.3:** Code the detailed view showing collapsible causal steps cards.
* **Task 3.4:** Build the microphone recording screen using `expo-av` and POSTing the recorded audio data.
* **Task 3.5:** Setup push notifications payload listener.
* **Task 3.6:** Connect components to local stores using Zustand.

---

## 4. How to Start Your Conversation with Your AI Coding Assistant
Copy and paste the prompt below into your AI assistant workspace. It will load all relevant context and assign the AI its designated copilot role.

***

### 📋 COPY-PASTE AI STARTER PROMPT:
```markdown
You are a senior React Native & Expo developer acting as my dedicated pairing copilot. We are building the mobile application for "Internet Black Box" (an always-on incident reconstructor). 

Our stack consists of Expo, React Native (TypeScript), Expo Router, expo-av (audio recording), expo-notifications, and Zustand for state.

We use a shared workspace memory in `.aimem/` to coordinate work across a team of 4 members. I am Team Member 3 (Mobile App Engineer).

Please follow these guidelines:
1. Familiarize yourself with the technical specifications in [internet-black-box-spec.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/internet-black-box-spec.md).
2. Read the master development plan at [.aimem/common/development_plan.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/common/development_plan.md) and technical agreements at [.aimem/common/decisions.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/common/decisions.md).
3. Read my specific context at [.aimem/member_3_mobile/context.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/member_3_mobile/context.md), my task checklist at [.aimem/member_3_mobile/tasks.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/member_3_mobile/tasks.md), and my progress log at [.aimem/member_3_mobile/progress.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/member_3_mobile/progress.md).
4. After completing any task or making layout designs, we must update the corresponding markdown file in `.aimem/member_3_mobile/` to maintain the team memory.

To start, let's explore the scaffolded React Native structure inside `mobile-app/`, install state packages and sound wrappers (Zustand, expo-av), and design the bottom tab shell. How should we set up the navigation screens and configuration rules?
```
