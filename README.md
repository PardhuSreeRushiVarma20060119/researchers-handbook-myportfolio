# Researcher's Handbook - Technical Architecture & Developer Guide

The **Researcher's Handbook** is a sophisticated, single-page application (SPA) acting as a "Digital Garden" or "Second Brain" for researchers. It is engineered to provide a premium, highly interactive user experience without reliance on a traditional backend server, utilizing advanced client-side technologies for security, persistence, and state management.

## 🏗️ Architecture Overview

The system is built on a **Zero-Backend Architecture**, meaning all logic, data verification, and content management occur within the client's browser.

### Core Stack
- **Runtime**: React 19 (via Vite)
- **Styling**: Vanilla CSS3 with extensive CSS Variables (`var(--accent-cyber)`) for dynamic theming and Glassmorphism effects.
- **Visuals**: `Three.js` (@react-three/fiber) for hardware-accelerated background particle systems.
- **Routing**: `react-router-dom` v7 for client-side navigation.

### Data Persistence Layer (`DataContext`)
The application uses a hybrid data strategy:
1.  **Static Seed**: Initial content (projects, blogs, profile info) is loaded from `src/data/content.js`.
2.  **Local Hydration**: On load, the app checks `localStorage` ('portfolio_db') for a persisted state.
3.  **Self-Healing Logic**: A custom hydration engine (`src/context/DataContext.jsx`) detects schema drift or data corruption.
    - If critical sections (e.g., `home`, `about`) are missing from `localStorage` (due to a bad save or update), they are automatically hot-patched from the static seed.
    - User-generated content (Private Notes, Ideas) is preserved during this process.

---

## 🛡️ Security Architecture

Despite being a client-side application, the project implements **Enterprise-Grade Security Mechanisms** to protect the Admin Interface.

### 1. Zero-Trust Access Control
The Admin Dashboard is hidden by default. Access requires passing a multi-stage authentication gate managed by `AuthContext`.

### 2. Biometric Authentication (WebAuthn)
The system integrates with the **FIDO2 / WebAuthn API** (`navigator.credentials`) to leverage the device's native hardware security module (TPM/Secure Enclave).
- **Implementation**: `src/components/BiometricScanner.jsx`
- **Flow**:
    1.  Checks if `PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()` is true.
    2.  Calls `navigator.credentials.create()` with `authenticatorAttachment: "platform"` and `userVerification: "required"`.
    3.  This triggers **Windows Hello** (Face/Fingerprint) or **Touch ID** on macOS.
    4.  **Security Model**: This verifies *User Presence* and *Device Ownership* locally. No private keys leave the device.

### 3. Two-Factor Authentication (TOTP)
A standard RFC 6238 implementation provided by `otpauth`.
- **Secret Generation**: Uses `crypto.getRandomValues` to generate secure base32 secrets.
- **Verification**: Real-time validation against the system time window (30s).
- **Interoperability**: Compatible with Google Authenticator, Authy, and Microsoft Authenticator.

### 4. Admin Credentials Management
- **Split-Storage**: Authentication state is kept separate from Content state.
- **Wizard Flow**: Updating the password requires a strict 4-step proof:
    1.  Proof of Knowledge (Current Password)
    2.  Proof of Presence (Biometric Scan)
    3.  Proof of Possession (TOTP Device)
    4.  Action (Set New Password).

---

## 🧠 "Second Brain" System

This feature set allows the user to perform Content Management (CMS) duties directly in the production build.

### Components
- **Intellectual Changelog**: A public feed of thought evolution, similar to a commit history for ideas.
- **Idea Parking Lot**:
    - **Public**: Broad concepts shared with visitors.
    - **Private**: Admin-only encrypted-at-rest (local) scratchpad.
- **Private Notes**: A third column in the Kanban board, rendered strictly conditionally based on `isAdmin && adminMode`.

### Engineering Patterns
- **Conditional Rendering**: Components like `NoteEditor` and delete buttons are physically removed from the DOM (not just hidden) when not in Admin Mode to prevent client-side tampering via DevTools.
- **Optimistic UI**: State updates are reflected immediately in the UI while asynchronously syncing to `localStorage`.

---

## 🎨 UI/UX Design System

The interface follows a "Cyber-Research" aesthetic inspired by sci-fi interfaces and clean typography.

### Bento Grid Layout
The "Projects" section utilizes a responsive Bento Grid (`src/components/BentoGrid.jsx`).
- **CSS Grid**: `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))` for fluid layouts.
- **Hover States**: 3D transform effects using `perspective` and `rotateX/Y`.

### Glassmorphism
Extensive use of `backdrop-filter: blur()` combined with semi-transparent RGBA backgrounds to create depth and hierarchy.
- **Utility**: `SettingsPanel`, `SecurityModal`, and `AdminBar` hover above the content on a Z-index of 3000+.

---

## ⚡ Performance Optimization

- **Code Splitting**: The `HistoryViewer` (Git Stats) and `TrainingSection` (TryHackMe) fetch data lazily.
- **Memoization**: `useMemo` is used for expensive filtering operations in the Blog section.
- **Asset Management**: Large assets are loaded only when in viewport (IntersectionObserver).

---

## 🛠️ Installation & Development

### Prerequisites
- Node.js v18+
- npm v9+

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/PardhuSreeRushiVarma20060119/researchers-handbook-myportfolio.git

# 2. Enter the directory
cd researchers-handbook-myportfolio

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

### Building for Production

```bash
npm run build
# Output will be in /dist
```

### Admin Access
To access the Admin Panel in a fresh instance:
1.  Navigate to the site.
2.  Click the invisible trigger area at the bottom-right of the viewport.
3.  Default Password: `admin`.
4.  **IMMEDIATE ACTION**: Go to SECURITY > Setup 2FA & Biometrics to secure the instance.

---


## 📚 Documentation Suite

For a deeper dive into the system, consult the following documents:

- [Project Overview & Technology Stack](docs/01-project-overview.md)
- [Design System & UI Guidelines](docs/02-design-system.md)
- [Security Architecture & Threat Model](docs/03-security-architecture.md)
- [Development Process & Changelog](docs/04-development-process.md)
- [User Manual: Administrator Guide](docs/05-user-manual.md)
- [Future Roadmap](docs/06-future-roadmap.md)

---

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
Copyright (c) 2025 PardhuVarma Konduru.

