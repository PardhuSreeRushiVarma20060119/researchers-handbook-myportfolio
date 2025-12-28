# Context Directory (State Management)

This directory holds the Global State Logic for the application. We use React's `Context API` to provide "Redux-like" store capabilities without the boilerplate.

## 1. `DataContext.jsx`
The **Content Management System (CMS)** core.

### Responsibilities
- **Persistence**: Syncs all state changes to `localStorage` under the key `portfolio_db`.
- **Hydration**: Loads data on mount.
- **Self-Healing**: If `localStorage` is empty (new user) or corrupted, it loads the default seed from `src/data/content.js` and saves it. this prevents the "White Screen of Death".
- **CRUD Operations**: available via `useData()` hook.
    - `updateProject(id, data)`
    - `addIdea(idea)`
    - `deleteIdea(id)`
    - `updatePrivateNote(id, text)`

### Schema
```javascript
{
  home: { title, subtitle, ... },
  about: { bio, skills: [] },
  projects: [ { id, title, desc, ... } ],
  blogs: [ { id, title, content, ... } ],
  ideas: [ { id, text, type: 'public'/'private' } ],
  privateNotes: [ { id, text } ] // Admin Only
}
```

## 2. `AuthContext.jsx`
The **Security Controller**.

### Responsibilities
- **Session Management**: Tracks `admin_session` ('active'/'inactive').
- **Privilege Separation**:
    - `isAdmin`: True if logged in (can see AdminBar).
    - `adminMode`: True if "Edit Mode" toggle is On (can edit text/delete items).

### Security Methods
- **`login(password)`**: Simple hash check.
- **`verifyTOTP(token)`**: Validates a 6-digit code against the system secret using `otpauth`.
- **`updateCredentials(newPass, newSecret)`**: Atomically updates the admin secrets in `localStorage`.
