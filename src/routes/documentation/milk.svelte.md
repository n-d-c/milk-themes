---
layout: milkdoc
---

## Installation

If you don't have pnpm installed, please installit.

```zsh
npm i -g pnpm
```

Grab your carton of milk and make a copy from the git repo:

```zsh
mkdir <your_project> && $_;
npx degit https://github.com/rndm-user/devlove-milk.git .;
pnpm install;
```

Update domains in service-worker.js and edit the mainfest.js and /src/config/* files.

## Source Control

```zsh
git init;
git add .;
git remote add origin <your_git_repo>;
git commit;
git push origin master;
```

## Easy Updates

In order to update the version of milk on your site, please run:

```zsh
pnpm run update;
```

## Local Development

In order to run:

```zsh
pnpm run dev;
```

## Export for Production

In order to export your site, please run:

```zsh
pnpm run export;
```

## Auto Deployment

Hook a webhook up to your Git repo and set the root to the distribution directory.
