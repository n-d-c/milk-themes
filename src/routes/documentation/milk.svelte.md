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

## Setup Custom Theme

Copy and edit and existing theme to get started.

```zsh
cp -rfp ./static/themes/blank ./static/themes/yourtheme
```

In the theme edit the file:

```zsh
code ./static/themes/yourtheme/info.js
```

to create the themes base settings.

Replace the theme's logo at:

```zsh
code ./static/themes/yourtheme/logo_theme.svg
```

Set the theme fonts and colors in the theme's stylesheet

```zsh
code ./static/themes/yourtheme/style.css
```

Set the themes four main block styles in the theme's stylesheet

```zsh
code ./static/themes/yourtheme/style.css
```

Replace the images at

```zsh
./static/img/profile_1200x1200.*
./static/img/socialmedia_1200x630.*
```

Replace ALL the images at

```zsh
./static/ico/*
```

Create your themes layouts make sure at a minimum to have Layout_Blank.svelte and Layout_Main.svelte

```zsh
code ./static/themes/yourtheme/Layout_Xxxxx.svelte
```

Set your data sources and update all values including setting the site to your new theme:

```zsh
code ./src/config/config.hjson
```

Run the site locally

```zsh
pnpm run dev;
```

Edit your site and create the site content at

```zsh
/src/routes/*
```

including the default layout file if needed although usually fine as it just loads other layouts and headers.

```zsh
code /src/routes/$layout.svelte
```
