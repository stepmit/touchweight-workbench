#!/bin/zsh
# Builds the app and publishes it to GitHub Pages (the gh-pages branch).
set -e
cd "$(dirname "$0")"
npm run build
cd dist
rm -rf .git
git init -q -b gh-pages
git config user.name "stepmit"
git config user.email "stepmit@users.noreply.github.com"
touch .nojekyll
git add -A
git commit -q -m "Publish $(date '+%Y-%m-%d %H:%M')"
git -c credential.helper= -c credential.helper="!$(cd .. && pwd)/.tools/gh auth git-credential" push -q -f "$(cd .. && git remote get-url origin)" gh-pages
rm -rf .git
echo "Published: https://stepmit.github.io/touchweight-workbench/"
