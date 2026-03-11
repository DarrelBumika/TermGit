# TermGIT

A simple CLI-based tool to track changes in your Git repository in real-time.

## Features
- **Instant feedback:** Monitors file changes and updates the status automatically.
- **Visual status:** Color-coded status labels (Modified, Added, Deleted, etc.).
- **Easy setup:** Works in any Git repository.

## Installation

### Local installation (for development)
1. Clone this repository.
2. Run `npm install`.
3. Link the package globally:
   ```bash
   npm link
   ```

### Global installation (via npm)
Once published, users can install it using:
```bash
npm install -g termgit
```

## Usage
Navigate to any Git repository in your terminal and run:
```bash
git-watch
```

## How it works
- **Chokidar:** Watches the file system for any changes.
- **Simple-Git:** Fetches the current repository status on every change.
- **Chalk:** Styles the output for a better user experience.