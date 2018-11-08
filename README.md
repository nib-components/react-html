# @nib-components/react-html

A common layout component for use in nib apps.

**Features:**

- metadata e.g. title
- favicon
- fonts
- configurable style and script files (may be hashed for cache busting)
- Modernizr (adds the `flexbox`/`no-flexbox` classes required by our [grid](https://github.com/nib-styles/sass-grid))
- Google Tag Manager (analytics)
- Google Fonts
- Visual Website Optimizer (A/B testing)
- serialize and pass app config to the client (for client/UniversalJS apps)
- serialize and pass `redux` state to the client (for UniversalJS apps)
- inline `styled-components` css for server rendering
- Optimizely

## Installation

    npm install --save @nib-components/react-html

 > Note: You also need to have `react`, `react-dom`, `react-helmet` and `rev-manifest-path` installed.

## Usage

```javascript

import express from 'express';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import createHtml from '@nib-components/react-html';

const app = express();

const Html = createHtml({

    config,

    script: ['vendor.js', 'client.js'],
    style: ['client.css'],

    revManifestPath: {
      prefix: '/health-insurance/quote/public',
      manifest: './dist/rev-manifest.json'
    },

    googleTagManagerId: process.env.GTM_ID || 'GTM-XXXXXX',

    googleFonts: 'Lato:400,400i,700|Montserrat:400,700',

    visualWebsiteOptimizer: process.env.VWO_ENABLED || false, // OR ...
    visualWebsiteOptimizer: {
      accountId: process.env.VWO_ACCOUNT_ID // Override of default VWO Account Id
    }

});

app.get('/', (req, res) => {
  res.send(renderToStaticMarkup(
    <Html>
      <h1>Hello World!</h1>
    </Html>
  ));
});

```

> Note: This is an overly simple example, realistically you might want to use it in conjunction with something like [rechannel](https://www.npmjs.com/package/rechannel).

## API

```javascript
createHtml(options : object) : React.Component
```

Creates a React component for rendering generic meta-data and layout.

**Options:**

- `static : boolean` Optional. Render the `children` with `ReactDOM.renderToStaticMarkup()` instead of `ReactDOM.renderToString()`.  Defaults to `false`.
- `title : string` Optional. The page title. Uses `react-helmet` if unspecified.
- `description : string` Optional. The meta description.
- `canonical : string` Optional. The canonical URL.
- `favicon : string` Optional. The favicon URL. Defaults to `https://www.nib.com.au/favicon.ico`
- `script : string|array` Optional. The path(s) of a script or an array of scripts. Defaults to `'index.js'`.
- `style : string|array` Optional. The path(s) of a style or an array of styles. Defaults to `'index.css'`.
- `revManifestPath : object` Optional. Configuration for [rev-manifest-path](https://www.npmjs.com/package/rev-manifest-path)
- `config : object` Optional. The application config which will be passed to the client loaded at `window.__CONFIG__`.
- `visualWebsiteOptimizer : boolean` Optional. Whether the VWO script is enabled. Defaults to `false`.
- `googleTagManagerId : string` Optional. The GTM ID. Determines whether the GTM script is enabled.
- `googlefonts : string` Optional. The google fonts you wish to include. To be included in this format: `'Lato:400,400i,700|Montserrat:400,700'`.

**Returns:**

A React component.

## Change log

# 3.1.0

- add: Optimizely snippet

# 3.0.0

- break: No longer include nib's google fonts by default.
- add: New `googleFonts` prop to specify which fonts and weights to load: use this format: `Lato:400,400i,700|Montserrat:400,700`

# 2.0.0

- remove: Removed New Relic tag

# 1.2.0

- add: `favicon` option for use outside of nib branded solutions.

# 1.1.1

- fix: `clippy-chat` scripts moved to a subdomain, updating path.

# 1.0.0

- add: inline styled-components css for server rendering.

# 0.10.0

- breaking fix: use latest `@nib-components/react-sass-grid-support` which supports `react@15.4`
- fix: move `rev-manifest-path` from `peerDependencies` to `dependencies`
- fix: remove duplicate test dependency from `dependencies`

# 0.9.1

- fix: Stop safari from rendering numbers as tel: links

# 0.9.0

- add: clippy-chat

# 0.8.0

- remove: `<meta name="robots">`
- fix: render markup before Helmet.rewind()

# 0.7.0

- add: `<meta name="robots">` **( <- Don't use. Use [react-helmet](https://github.com/nfl/react-helmet) instead)**

# 0.6.1
- fix: vwo second line was removed in 0.6.0, now fixed

# 0.6.0

- add: added the ability to override the default VWO account

# 0.5.0

- add: added the nib favicon

# 0.4.0

- add `lang="en-AU"` to `<html>` for SEO

# 0.3.0

- add: `@nib-components/react-sass-grid-support` as required for using the custom attribute names used by `sass-grid`
 in React
- fix: bumped `rev-manifest-path` which would rewrite URLs to the root dir when no prefix was specified
