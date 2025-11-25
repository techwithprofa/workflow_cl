# Git Workflow Skill

Expert knowledge of Git workflows and best practices for version control.

## Git Basics

### Common Commands
```bash
# Status and history
git status
git log --oneline --graph --all
git diff
git diff --staged

# Branching
git branch feature-name
git checkout feature-name
git checkout -b feature-name  # Create and checkout

# Modern alternative
git switch feature-name
git switch -c feature-name    # Create and switch

# Staging and committing
git add file.txt
git add .
git commit -m "Commit message"
git commit -am "Add and commit tracked files"

# Pushing and pulling
git push origin branch-name
git push -u origin branch-name  # Set upstream
git pull origin main
git fetch origin

# Undoing changes
git restore file.txt            # Discard changes
git restore --staged file.txt   # Unstage
git reset HEAD~1                # Undo last commit (keep changes)
git reset --hard HEAD~1         # Undo last commit (discard changes)
```

## Branching Strategy

### Git Flow
```
main (production)
├── develop (integration)
│   ├── feature/user-auth
│   ├── feature/payment
│   └── feature/dashboard
├── hotfix/critical-bug
└── release/v1.2.0
```

### Trunk-Based Development
```
main (always deployable)
├── feature/short-lived-feature-1
└── feature/short-lived-feature-2
```

### Feature Branch Workflow
```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/user-authentication

# Make changes and commit
git add .
git commit -m "Add user authentication"

# Keep up-to-date with main
git checkout main
git pull origin main
git checkout feature/user-authentication
git rebase main  # or: git merge main

# Push to remote
git push -u origin feature/user-authentication

# Create pull request
# After review and approval, merge to main
```

## Commit Messages

### Conventional Commits
```bash
# Format: <type>(<scope>): <description>

# Types:
feat: add user authentication
fix: resolve login redirect issue
docs: update README with setup instructions
style: format code with prettier
refactor: extract validation logic to helper
perf: optimize image loading
test: add tests for user service
chore: update dependencies
ci: add GitHub Actions workflow

# With scope:
feat(auth): add password reset functionality
fix(api): handle null response from database
docs(readme): add installation instructions

# With breaking change:
feat!: change API response format

BREAKING CHANGE: API now returns { data, meta } instead of flat object

# Multi-line:
feat: add user dashboard

- Add dashboard layout
- Implement user stats widget
- Add recent activity feed

Closes #123
```

### Good Commit Messages
```bash
# Good: Clear and descriptive
git commit -m "Fix null pointer exception in user profile"
git commit -m "Add validation for email field"
git commit -m "Refactor authentication middleware"

# Bad: Vague or uninformative
git commit -m "fix bug"
git commit -m "update"
git commit -m "changes"
git commit -m "WIP"
```

## Merge Strategies

### Merge Commit
```bash
git checkout main
git merge feature/branch --no-ff

# Creates merge commit preserving history
# * Merge feature/branch into main
# |\
# | * Feature commit 2
# | * Feature commit 1
# |/
# * Main commit
```

### Rebase
```bash
git checkout feature/branch
git rebase main

# Replays feature commits on top of main
# * Feature commit 2
# * Feature commit 1
# * Main commit (latest)

# Clean, linear history
```

### Squash and Merge
```bash
git checkout main
git merge --squash feature/branch
git commit -m "Add feature X"

# Combines all feature commits into one
# * Add feature X
# * Main commit
```

## Interactive Rebase

### Clean Up Commits
```bash
git rebase -i HEAD~3

# Editor opens:
pick abc1234 Add feature A
pick def5678 Fix typo
pick ghi9012 Update docs

# Change to:
pick abc1234 Add feature A
fixup def5678 Fix typo      # Merge into previous
fixup ghi9012 Update docs   # Merge into previous

# Or reword:
reword abc1234 Add feature A  # Change commit message
pick def5678 Fix typo
pick ghi9012 Update docs

# Or reorder:
pick ghi9012 Update docs
pick abc1234 Add feature A
pick def5678 Fix typo
```

## Resolving Conflicts

```bash
# During merge/rebase, conflicts occur
git merge feature/branch
# CONFLICT (content): Merge conflict in file.txt

# Open file, you'll see:
<<<<<<< HEAD
Current code in main
=======
Code from feature branch
>>>>>>> feature/branch

# Edit to resolve, then:
git add file.txt
git commit

# During rebase:
# Fix conflicts, then:
git add file.txt
git rebase --continue

# Or abort:
git rebase --abort
```

## Advanced Git

### Stashing
```bash
# Save work in progress
git stash
git stash save "Work in progress on feature X"

# List stashes
git stash list

# Apply stash
git stash apply
git stash apply stash@{1}

# Apply and remove
git stash pop

# Clear all stashes
git stash clear
```

### Cherry-Pick
```bash
# Apply specific commit to current branch
git cherry-pick abc1234

# Cherry-pick range
git cherry-pick abc1234..def5678

# Cherry-pick without committing
git cherry-pick -n abc1234
```

### Bisect (Find Bug)
```bash
# Find commit that introduced bug
git bisect start
git bisect bad                 # Current version is bad
git bisect good v1.0           # v1.0 was good

# Git checks out middle commit
# Test it, then:
git bisect good  # or git bisect bad

# Repeat until bug found
# Git will tell you: "abc1234 is the first bad commit"

git bisect reset  # Return to original state
```

### Reflog (Recover Lost Commits)
```bash
# View all ref updates
git reflog

# Output:
abc1234 HEAD@{0}: commit: Add feature
def5678 HEAD@{1}: reset: moving to HEAD~1
ghi9012 HEAD@{2}: commit: Fix bug

# Recover "lost" commit
git checkout ghi9012
git checkout -b recovery-branch
```

## Git Hooks

### Pre-commit Hook
```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run linter
npm run lint
if [ $? -ne 0 ]; then
  echo "Linting failed. Commit aborted."
  exit 1
fi

# Run tests
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

### Husky (Modern Hooks)
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## Best Practices

### Commit Often
- Small, focused commits
- Easier to review
- Easier to revert
- Better git bisect results

### Meaningful Branches
```bash
# Good: Descriptive names
feature/user-authentication
bugfix/login-redirect
hotfix/critical-security-issue
refactor/payment-processing

# Bad: Generic names
feature/new-feature
fix/bug
update
my-branch
```

### Pull Before Push
```bash
# Always update local branch first
git pull origin main
# Or with rebase:
git pull --rebase origin main

# Then push
git push origin feature-branch
```

### Never Rewrite Public History
```bash
# Don't force push to main/shared branches
git push --force origin main  # DANGEROUS!

# OK for your own feature branch:
git push --force-with-lease origin feature-branch
```

### Use .gitignore
```bash
# .gitignore
node_modules/
.env
.env.local
.DS_Store
*.log
dist/
build/
.next/
coverage/
```

## Collaborative Workflows

### Pull Request Process
1. Create feature branch
2. Make changes and commit
3. Push to remote
4. Open pull request
5. Request reviews
6. Address feedback
7. Get approval
8. Merge to main

### Code Review Guidelines
- Review within 24 hours
- Be constructive and specific
- Approve if no blocking issues
- Request changes if critical issues
- Comment for suggestions/questions

## Troubleshooting

### Accidentally Committed to Wrong Branch
```bash
# Move commit to new branch
git branch feature-branch
git reset --hard HEAD~1
git checkout feature-branch
```

### Committed Secrets
```bash
# Remove from history (DANGEROUS)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/secret.env" \
  --prune-empty --tag-name-filter cat -- --all

# Or use BFG Repo-Cleaner (faster)
bfg --delete-files secret.env
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Rotate the exposed secret immediately!
```

### Large Files
```bash
# Use Git LFS for large files
git lfs install
git lfs track "*.psd"
git lfs track "*.mp4"
git add .gitattributes
```
