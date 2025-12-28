# Components Directory

This directory contains all the reusable UI elements (Atoms, Molecules, Organisms) and Layouts used in the application.

## 🧱 Architecture

We follow a loose **Atomic Design** philosophy, although files are flatly grouped for easier access.

### 1- Atoms
Base-level elements that cannot be broken down further.
- **`ActionList.jsx`**: Simple list items for the History/Changelog.
- **`Button.jsx`** (Implicit): Mostly styled inline or via CSS classes specific to sections.
- **`EditableText.jsx`**: A span that turns into an input when clicked (Admin Mode only).

### 2- Molecules
Groups of atoms functioning together.
- **`ProjectCard.jsx`** / **`BentoGrid.jsx`**: The interactive tile system for the portfolio.
- **`BlogList.jsx`**: Displays a summary list of markdown posts.
- **`BiometricScanner.jsx`**: A complex molecule handling auth state and animation.

### 3- Organisms
Complex sections forming distinct parts of the interface.
- **`AdminBar.jsx`**: The floating control deck. Contains `AssetManager`, `SettingsPanel`.
- **`ThinkingSection.jsx`**: The "Second Brain" Kanban board (Ideas/Notes).
- **`AboutSection.jsx`**: Profile bio and skills.
- **`TimelineSection.jsx`**: Chronological work history.

### 4- Templates/Layouts
- **`JournalLayout.jsx`**: The master wrapper. Handles the Sidebar, Mobile Navigation, and Main Content Area scrolling.

## 🛠️ Key Components Deep Dive

### `AdminBar.jsx`
The central command center.
- **Role**: Only renders if `useAuth().isAdmin` is true.
- **Features**: Toggles "Edit Mode", opens "Settings" or "Security" modals.
- **Security**: The component itself performs a secondary check on context state to ensuring it doesn't render for guests.

### `BiometricScanner.jsx`
Implements the WebAuthn flow.
- **Props**: `onScanComplete` (callback).
- **Logic**: Tries `navigator.credentials.create()` first (Platform Auth). Falls back to a CSS animation challenge if hardware is missing.

### `ThinkingSection.jsx`
The CMS for thoughts.
- **State**: Subscribes to `useData()` for ideas.
- **Permissions**: Checks `adminMode`. If true, shows "Private" column and Delete buttons. If false, shows only Public column in read-only mode.
- **Persistence**: Updates `DataContext` immediately.

### `TryHackMeSection.jsx`
- **Data Source**: Fetches from `https://tryhackme.com/api/v2.1/public/room?username=...` via a proxy to bypass CORS (or direct if CORS allows).
- **Visuals**: Renders a glowing "Matrix" style card.
