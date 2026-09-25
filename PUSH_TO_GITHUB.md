# Pushing to GitHub

The repository is initialized locally with one commit. Nothing has been
pushed anywhere. Pick one of the two routes below.

## Route A — with the GitHub CLI (`gh`)

```bash
cd ~/workspace/leetcode-second-pass-repo

# Create a private repo and push (change the name/visibility as you like)
gh repo create leetcode-second-pass --private --source=. --push

# Or create a public repo
gh repo create leetcode-second-pass --public --source=. --push
```

`--source=. --push` sets the remote and pushes the current branch in one step.
Verify with:

```bash
gh repo view --web
```

## Route B — manual remote

```bash
cd ~/workspace/leetcode-second-pass-repo

# 1. Create an empty repository on github.com (no README, no .gitignore,
#    no license — this repo already has them), then:
git remote add origin git@github.com:<your-username>/leetcode-second-pass.git

# 2. Push the initial commit
git push -u origin main

# Or, if your default branch should be master:
git branch -M master
git push -u origin master
```

Replace `<your-username>` with your GitHub username.

## Before you push

- `data/` (SQLite database, uploaded images) and `node_modules/` are
  git-ignored and will not be pushed.
- The repo starts with a single empty "Profile 1" — no personal data is
  included. Double-check `git status` shows only the intended files.
