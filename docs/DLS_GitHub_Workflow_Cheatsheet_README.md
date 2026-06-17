# DLS GitHub Workflow Cheatsheet

Professional Git + GitHub workflow for the **DLS Backend / Dynamic Lecture System** project.

Project board:

[Open DLS GitHub Project Board](https://github.com/users/DorManDel/projects/2/views/2)

---

## 1. Workflow Goal

The goal is to keep the project clean, organized, and easy for collaborators to work on.

Use this flow:

```txt
GitHub Issue → Branch → Commit → Push → Pull Request → Review/Test → Merge → Done
```

Do **not** work randomly on `main`.
Do **not** merge untested code directly into the final branch.

---

## 2. Branch Strategy

Recommended branch structure:

```txt
main
└── db-integrations-and-tests
    ├── feature/12-db-health-check
    ├── feature/13-questions-sql-repository
    ├── fix/14-socket-connection-error
    ├── docs/15-readme-installation
    └── test/16-postman-collection
```

### Branch Roles

| Branch | Purpose |
| ------ | ------- |
| `main` | Stable version only |
| `db-integrations-and-tests` | Integration branch for SQL, API tests, Socket.IO tests, and final backend work |
| `feature/...` | New feature work |
| `fix/...` | Bug fixes |
| `docs/...` | README/documentation changes |
| `test/...` | Tests, Postman collections, connection tests |
| `refactor/...` | Code cleanup without changing behavior |

---

## 3. Project Board Columns

Recommended GitHub Project columns:

```txt
Backlog → Ready → In Progress → In Review → Testing → Done
```

Optional column:

```txt
Blocked
```

### Column Meaning

| Column | Meaning |
| ------ | ------- |
| `Backlog` | Ideas/tasks not started yet |
| `Ready` | Clear task, ready to be assigned |
| `In Progress` | Someone is working on it |
| `In Review` | Pull Request opened and waiting for review |
| `Testing` | Code works but needs testing with frontend/Postman/DB |
| `Done` | Merged, tested, and documented |
| `Blocked` | Cannot continue because something is missing/broken |

---

## 4. GitHub Issues = Tasks

Every real task should have a GitHub Issue.

Good issue examples:

```txt
Connect frontend questions to backend REST API
Replace in-memory questions store with MySQL repository
Add database health-check route
Add Socket.IO frontend connection test
Create Postman collection for Questions API
Update README installation section
Deploy backend to Render
```

Bad issue examples:

```txt
Fix stuff
Work on backend
Make it better
Database
```

---

## 5. Recommended Labels

Use labels to keep tasks searchable.

### Type Labels

```txt
type: feature
type: bug
type: docs
type: test
type: refactor
```

### Area Labels

```txt
area: backend
area: frontend
area: database
area: socket
area: api
area: postman
area: deploy
area: docs
```

### Priority Labels

```txt
priority: P0
priority: P1
priority: P2
```

Meaning:

| Priority | Meaning |
| -------- | ------- |
| `P0` | Must finish for submission |
| `P1` | Important but not blocking immediately |
| `P2` | Nice to have |

### Status Labels

```txt
status: blocked
status: needs-review
status: needs-testing
```

---

## 6. Issue Template

Use this structure when opening a new issue:

```md
## Goal

What should be done?

## Why

Why is this task needed?

## Tasks

- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

## Acceptance Criteria

This task is done when:

- [ ] The feature works locally
- [ ] The relevant API route / UI / DB logic was tested
- [ ] No console errors appear
- [ ] No server errors appear
- [ ] README/docs were updated if needed

## Related Area

Backend / Frontend / Database / Socket.IO / Postman / Deployment

## Suggested Branch

```txt
feature/issue-number-short-name
```
```

---

## 7. Pull Request Template

Use this structure when opening a Pull Request:

```md
## What Changed?

- 

## Related Issue

Closes #

## How Was It Tested?

- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] Checked `/api/health`
- [ ] Tested with Postman
- [ ] Tested frontend connection
- [ ] Tested database connection if relevant
- [ ] Checked browser console
- [ ] Checked server terminal logs

## Screenshots / Logs

Add screenshots, terminal logs, Postman screenshots, or browser console screenshots if relevant.

## Checklist

- [ ] Code is clean
- [ ] No sensitive data committed
- [ ] `.env` is not committed
- [ ] `.env.example` is updated if needed
- [ ] README/docs updated if needed
- [ ] PR targets the correct branch
```

---

## 8. Creating a Branch From the Integration Branch

Use this when starting a new task.

```bash
git fetch origin
git switch db-integrations-and-tests
git pull origin db-integrations-and-tests
git switch -c feature/12-db-health-check
```

If the branch does not exist locally yet:

```bash
git fetch origin
git switch -c db-integrations-and-tests origin/db-integrations-and-tests
git switch -c feature/12-db-health-check
```

---

## 9. Daily Work Commands

Check current state:

```bash
git status
```

See current branch:

```bash
git branch
```

Save changes:

```bash
git add .
git commit -m "feat(db): add database health check"
```

Push branch:

```bash
git push -u origin feature/12-db-health-check
```

Then open a Pull Request on GitHub.

---

## 10. Commit Message Style

Use clear commit messages.

Recommended format:

```txt
type(area): short description
```

Examples:

```txt
feat(db): add MySQL connection pool
feat(api): add database health check route
fix(socket): handle connection errors safely
docs(readme): add installation commands
test(postman): add questions API collection
refactor(store): move question logic into repository
```

### Common Types

| Type | Use For |
| ---- | ------- |
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `test` | Tests/Postman/testing files |
| `refactor` | Code structure cleanup |
| `chore` | Project maintenance |

---

## 11. Pull Request Rules

Before opening a PR:

```bash
npm install
npm run dev
```

Then check:

```txt
http://localhost:3000/api/health
```

If SQL is involved, also check:

```txt
http://localhost:3000/api/db/health
```

PR rules:

```txt
1. PR should target db-integrations-and-tests, not main.
2. PR should link to an issue using: Closes #issueNumber.
3. PR should include testing notes.
4. PR should not include .env or private files.
5. PR should be reviewed before merging.
```

---

## 12. Example Full Task Flow

Example task:

```txt
Issue #12: Add database health-check route
```

### Step 1: Create branch

```bash
git fetch origin
git switch db-integrations-and-tests
git pull origin db-integrations-and-tests
git switch -c feature/12-db-health-check
```

### Step 2: Work on code

Add the DB connection and route.

### Step 3: Test locally

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000/api/db/health
```

### Step 4: Commit

```bash
git add .
git commit -m "feat(db): add database health check"
```

### Step 5: Push

```bash
git push -u origin feature/12-db-health-check
```

### Step 6: Open PR

PR target:

```txt
db-integrations-and-tests
```

PR description:

```txt
Closes #12
```

### Step 7: Review, test, merge

After merge, move the issue to `Done`.

---

## 13. File Safety Rules

Never commit:

```txt
.env
node_modules/
private notes
local database dumps
personal files
```

Recommended `.gitignore`:

```gitignore
node_modules/
.env
.env.local
npm-debug.log*
.DS_Store
.vscode/settings.json
nozip/
```

Keep this file committed:

```txt
.env.example
```

Example `.env.example`:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=dls_db
```

---

## 14. Recommended Task List for DLS Backend

Suggested issues for the current phase:

```txt
P0 - Add MySQL connection config
P0 - Add /api/db/health route
P0 - Create SQL schema for users and questions
P0 - Replace in-memory questions store with SQL repository
P0 - Connect frontend question creation to REST API
P0 - Add Socket.IO frontend listeners
P1 - Add Postman collection tests
P1 - Add README setup and troubleshooting section
P1 - Add Render deployment configuration
P2 - Add authentication hashing later
P2 - Add admin/debug protection later
```

---

## 15. Team Rules

```txt
1. Every task gets an issue.
2. Every issue gets a branch.
3. Every branch gets a PR.
4. Every PR must be tested.
5. No direct commits to main.
6. Keep .env private.
7. Update README when setup/API changes.
8. Small commits are better than huge commits.
9. Pull before starting work.
10. Ask before changing another collaborator's files.
```

---

## 16. Quick Command Cheatsheet

### Start new feature

```bash
git fetch origin
git switch db-integrations-and-tests
git pull origin db-integrations-and-tests
git switch -c feature/ISSUE-short-name
```

### Save work

```bash
git status
git add .
git commit -m "type(area): message"
```

### Push work

```bash
git push -u origin feature/ISSUE-short-name
```

### Update your branch with latest integration branch

```bash
git fetch origin
git switch db-integrations-and-tests
git pull origin db-integrations-and-tests
git switch feature/ISSUE-short-name
git merge db-integrations-and-tests
```

### Temporarily save unfinished work

```bash
git stash push -u -m "work in progress"
```

Restore it later:

```bash
git stash pop
```

---

## 17. Definition of Done

A task is done only when:

```txt
Code works locally
API was tested
Frontend was tested if relevant
No browser console errors
No backend terminal errors
No private files committed
PR was reviewed
Branch was merged
Issue was moved to Done
README/docs updated if needed
```

---

## 18. Recommended Final Project Workflow

For the DLS final project, use this professional flow:

```txt
Plan task in GitHub Project
↓
Open GitHub Issue
↓
Create branch from db-integrations-and-tests
↓
Code locally in VS Code
↓
Test with npm run dev
↓
Test with browser/Postman/database
↓
Commit and push
↓
Open Pull Request
↓
Review and merge
↓
Move issue to Done
```

This keeps the project organized, protects the stable branch, and makes collaboration much easier.
