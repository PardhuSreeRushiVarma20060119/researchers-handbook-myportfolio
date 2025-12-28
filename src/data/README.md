# Data Directory

This directory contains the **Static Truth** of the application.

## `content.js`
This file serves two purposes:
1.  **Initial Seed**: When a user visits the site for the first time, `DataContext` reads this file to populate the `localStorage` database.
2.  **Recovery Image**: If the local database is ever corrupted, critical sections (like Contact Info) can be "Reset" to match this file.

### Editing Content
- **For Developers**: Edit this file to change the *default* text that new users see.
- **For Admins**: Use the onsite CMS (Edit Mode) to change content for *your* session. Note that onsite changes are stored in the browser cache, not this file.

### Structure
- `home`: Hero section text.
- `about`: Bio and Skills visualization configuration.
- `timeline`: Array of job history objects.
- `projects`: Array of portfolio cases.
- `blogs`: Initial set of markdown articles.
- `contact`: Social links and email.
