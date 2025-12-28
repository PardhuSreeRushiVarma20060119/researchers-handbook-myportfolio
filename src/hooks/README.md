# Hooks Directory

Custom React Hooks for abstracting complex logic.

## `useGitHubStats.js`

### Purpose
Fetches and aggregates data from the GitHub GraphQL API to generate the "Code Activity" heatmap in the About section.

### Logic
1.  **Input**: Accepts a GitHub username.
2.  **Fetching**: Sends a `POST` request to `https://api.github.com/graphql`.
3.  **Authentication**: Requires a Personal Access Token (PAT) exposed via `import.meta.env.VITE_GITHUB_TOKEN`.
4.  **Transformation**:
    - Raw API response -> Weekly contribution counts.
    - Normalizes data for the 52-week grid visualization.
5.  **Caching**: Implements simple in-memory caching to prevent rate-limiting on re-renders.

### Usage
```javascript
const { data, loading, error } = useGitHubStats('username');
```
