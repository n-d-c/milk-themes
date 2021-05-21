---
layout: milkdoc
---

## Installation

If you don't have pnpm installed, please installit.

```zsh
npm i -g pnpm
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

## Setup New Site

Grab your carton of milk and make a copy from the git repo by forking the repo on github if you haven't already.
Once you've forked and cloned the repo you can create a branch for each site you want to create where `<newsite>` is the site name.

```zsh
git branch <newsite>
git checkout <newsite>
git push origin <newsite>
```

Update domains in service-worker.js and edit the mainfest.js and /src/config/* files.

```zsh
code ./src/service-worker.js
code ./src/mainfest.js
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

## Setup Custom Theme

Copy and edit and existing theme to get started.

```zsh
cp -rfp ./static/themes/blank ./static/themes/<yourtheme>
```

In the theme edit the file:

```zsh
code ./static/themes/<yourtheme>/info.js
```

to create the themes base settings.

Replace the theme's logo at:

```zsh
code ./static/themes/<yourtheme>/logo_theme.svg
```

Set the theme fonts and colors in the theme's stylesheet

```zsh
code ./static/themes/<yourtheme>/style.css
```

Set the themes four main block styles in the theme's stylesheet

```zsh
code ./static/themes/<yourtheme>/style.css
```

Create your themes layouts make sure at a minimum to have Layout_Blank.svelte and Layout_Main.svelte

```zsh
code ./static/themes/yourtheme/Layout_Xxxxx.svelte
```

Set your theme in the site config file and restart your dev server

```zsh
code ./src/config/config.hjson
```

## Requesting Data

Make sure you setup your data source for example:

```zsh
code ./src/config/config.hjson
```

```json
sources: {
    wordpress: "https://yourwordpresssite.com/graphql"
}
```

Stop `^C` and restart `pnpm run dev` your dev server to pickup configuration changes.

You can now request data in your components like so

```js
/* ## Data Loading ## */
let unsubscribe = () => {};
let the_title = 'Loading...';
import { Q_GET_POST_HELLOWORLD } from '$graphql/wordpress.graphql.js';
/* ## Main ## */
onMount(async () => {
    let getData = $milk?.data?.gql(
        Q_GET_POST_HELLOWORLD,
        $milk.data.sources.wordpress
    );
    unsubscribe = await getData?.subscribe(async (fetched_data) => {
        let data = await fetched_data;
        the_title = data?.posts?.nodes?.[0]?.title;
        // console.log(data);
    });
});
/* ## Exit ## */
/* important for garbage collection otherwise memory leak */
onDestroy(() => { unsubscribe(); });
```

Or pass in GraphQL varialbes like so

```js
/* ## Data Loading ## */
let unsubscribe = () => {};
let the_title = 'Loading...';
import { Q_GET_POST_BYID } from '$graphql/wordpress.graphql.js';
/* ## Main ## */
onMount(async () => {
    let queryVariables = { id: 1 };
    let getData = $milk?.data?.gql(
        Q_GET_POST_BYID,
        $milk.data.sources.wordpress,
        queryVariables
    );
    unsubscribe = await getData?.subscribe(async (fetched_data) => {
        let data = await fetched_data;
        the_title = data?.postBy?.title;
        // console.log(data);
    });
});
/* ## Exit ## */
/* important for garbage collection otherwise memory leak */
onDestroy(() => { unsubscribe(); });
```

Offset Pagination (First 8 Posts)

```js
/* ## Data Loading ## */
let unsubscribe = () => {};
let posts = {};
import { Q_GET_POSTS } from '$graphql/wordpress.graphql.js';
/* ## Main ## */
onMount(async () => {
    let queryVariables = { offset: 0, size: 8 };
    let getData = $milk?.data?.gql(
        Q_GET_POSTS,
        $milk.data.sources.wordpress,
        queryVariables
    );
    unsubscribe = await getData?.subscribe(async (fetched_data) => {
        let data = await fetched_data;
        posts = data?.posts;
        // console.log(data);
    });
});
/* ## Exit ## */
/* important for garbage collection otherwise memory leak */
onDestroy(() => { unsubscribe(); });
```
