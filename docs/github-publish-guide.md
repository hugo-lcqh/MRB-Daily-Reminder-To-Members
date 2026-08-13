# GitHub Publish Guide

The local repository is ready to publish.

## Recommended Repository

- Owner: `hugo-lcqh`
- Repository name: `mrb-teams-reminder-flow`
- Visibility: `Private` recommended

## Option A: Create Repository In GitHub UI

1. Open `https://github.com/new`.
2. Owner: `hugo-lcqh`.
3. Repository name: `mrb-teams-reminder-flow`.
4. Choose `Private`.
5. Do not add README, `.gitignore`, or license from GitHub UI because this repository already has local files.
6. Create the repository.

Then run:

```powershell
git push -u origin main
```

## Option B: Use GitHub CLI

Install and login:

```powershell
gh auth login
```

Create and push:

```powershell
gh repo create hugo-lcqh/mrb-teams-reminder-flow --private --source . --remote origin --push
```

## If Remote Already Exists

Check the remote:

```powershell
git remote -v
```

Expected:

```text
origin  https://github.com/hugo-lcqh/mrb-teams-reminder-flow.git (fetch)
origin  https://github.com/hugo-lcqh/mrb-teams-reminder-flow.git (push)
```
