#!/usr/bin/env bash
# Aufruf im Terminal (im Projektordner):
#   chmod +x git-push.sh   # nur beim ersten Mal erforderlich
#   ./git-push.sh
#
# Das Skript fügt Änderungen hinzu, fragt nach einer Commit-Nachricht,
# erstellt den Commit und pusht den aktuellen Branch zum konfigurierten Remote.
# Es verwendet absichtlich kein --force.

set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Fehler: Dieses Skript muss innerhalb eines Git-Repositories ausgeführt werden."
  exit 1
fi

branch="$(git branch --show-current)"
if [[ -z "$branch" ]]; then
  echo "Fehler: Es ist kein Git-Branch ausgecheckt (detached HEAD)."
  exit 1
fi

remote="$(git config "branch.${branch}.remote" || true)"
if [[ -z "$remote" ]]; then
  remote="$(git remote | head -n 1)"
fi

if [[ -z "$remote" ]]; then
  echo "Fehler: Kein Git-Remote konfiguriert."
  exit 1
fi

echo "Repository: $(git rev-parse --show-toplevel)"
echo "Branch:     $branch"
echo "Remote:     $remote"
echo
git status --short
echo

read -r -p "Commit-Nachricht eingeben: " commit_message
if [[ -z "${commit_message//[[:space:]]/}" ]]; then
  echo "Fehler: Die Commit-Nachricht darf nicht leer sein."
  exit 1
fi

git add -A

if git diff --cached --quiet; then
  echo "Keine Änderungen zum Committen vorhanden."
  exit 0
fi

git commit -m "$commit_message"
git push "$remote" "$branch"

echo
echo "Fertig: Änderungen wurden nach $remote/$branch gepusht."
