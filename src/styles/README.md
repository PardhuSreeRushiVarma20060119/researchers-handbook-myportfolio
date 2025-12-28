# Styles Directory

This project functions without a CSS framework (No Tailwind, No Bootstrap). We use **Vanilla CSS3** powered by CSS Variables for theming.

## `variables.css` / `index.css`

### Design Tokens
We define our design language globally at the `:root` level.

#### Colors
- `--bg-dark`: `#0a0a0a` (Main background)
- `--accent-cyber`: `#00ff41` (Matrix Green - Primary Action)
- `--accent-blue`: `#00ccff` (Secondary Action)
- `--glass-border`: `rgba(255, 255, 255, 0.1)`

#### Typography
- `--font-sans`: 'Inter', system-ui (UI Text)
- `--font-serif`: 'Playfair Display' (Headings)
- `--font-mono`: 'JetBrains Mono' (Code/Stats)

### Utility Classes
We use a small set of utility classes for common patterns:
- `.glass-panel`: Applies standard glassmorphism (blur + transparency).
- `.flex-center`: `display: flex; align-items: center; justify-content: center;`.
- `.text-gradient`: Applies background-clip text for shiny headers.

### Responsive Design
Media queries are handled standardly:
- Mobile First (default).
- `@media (min-width: 768px)` -> Tablet.
- `@media (min-width: 1024px)` -> Desktop.
