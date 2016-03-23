# @nib-components/react-html

A common layout for nib applications.

## Installation

    npm install -S @nib-components/react-html

## Usage

```javascript

import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import createHtml from '@nib-components/react-html';

const Html = createHtml({
  script: ['vendor.js', 'index.js'],
  googleTagManagerId: 'GTM-XXXXXX'
});

app.get('/', (req, res) => {
  res.send(renderToStaticMarkup(
    <Html>
      <h1>Hello World!</h1>
    </Html>
  ));
});


```