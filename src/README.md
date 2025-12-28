# Source Code Documentation

Welcome to the application core. This directory contains the logic, state management, and UI components for the Researcher's Handbook.

## 📂 Directory Structure

```graphql
src/
├── components/      # UI Components (Atomic & Layouts)
│   ├── AdminBar.jsx         # The floating admin control deck
│   ├── BentoGrid.jsx        # Responsive masonry grid for projects
│   ├── BiometricScanner.jsx # WebAuthn & visual simulation
│   ├── BlogReader.jsx       # Markdown renderer for posts
│   ├── ...
├── context/         # Global State Management
│   ├── AuthContext.jsx      # Authentication (Pass/Bio/TOTP) logic
│   └── DataContext.jsx      # Content CMS logic (LocalStorage + Sync)
├── data/            # Static Data Seeds
│   └── content.js           # Default/Initial site content
├── hooks/           # Custom React Hooks
│   └── useGitHubStats.js    # Data fetcher for GitHub API
├── styles/          # Global Styles
│   └── variables.css        # CSS Tokens (Colors, Fonts)
├── App.jsx          # Route definitions
└── main.jsx         # Entry point (Context Providers)
```

## 🧠 State Management Architecture

### `DataContext.jsx`
The application's "Brain". It handles all Content Management System (CMS) features client-side.
- **Persistence**: automatically syncs state to `localStorage.getItem('portfolio_db')`.
- **Self-Healing**: On load, it validates the schema. If critical keys (like `home` or `project`) are missing, it hot-patches them from `src/data/content.js`.
- **API**: Exports `useData()` hook with methods like `updateProject`, `addIdea`, `deleteLove`, etc.

### `AuthContext.jsx`
The Security Controller. It isolates administrative privileges from the rest of the app.
- **Session**: Manages `admin_session` persistence.
- **Capabilities**:
    - `verifyPassword(input)`: String comparison against hash.
    - `verifyTOTP(token)`: RFC 6238 validation using `otpauth`.
    - `updateCredentials(newPass, newSecret)`: The only way to modify admin secrets.

## 🎨 Styling Convention

We DO NOT use Tailwind or Bootstrap. All styling is **Vanilla CSS** with a heavy reliance on CSS Variables.

- **Variables**: Defined in `index.css` / `variables.css`.
- **Theming**: Use `var(--accent-cyber)` for the primary matrix-green color.
- **Glassmorphism**: Standard class/style:
  ```css
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  ```

## 🔐 Security Components

### `BiometricScanner.jsx`
A hybrid component that attempts Native WebAuthn first.
1.  **Phase 1**: Checks `PublicKeyCredential` availability.
2.  **Phase 2**: Calls `navigator.credentials.create()` to force an OS-level User Presence check (FaceID/TouchID).
3.  **Fallback**: If native auth fails, it renders a visual "Simulated Scanner" for demo purposes.

### `AdminBar.jsx`
This component is **conditionally rendered**. It checks `useAuth().isAdmin`. If false, it renders a tiny, invisible 50x50px triggering button at the bottom right.

## 🚀 Key Workflows

### The "Second Brain" Render Loop
1.  `ThinkingSection.jsx` subscribes to `useData()`.
2.  It filters ideas into `public` and `private` arrays.
3.  It checks `useAuth().adminMode`.
    - If `true`: Renders 'Delete' buttons and 'Add Idea' inputs.
    - If `false`: Renders read-only cards.
