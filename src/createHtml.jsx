import React from 'react';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';
import Helmet from 'react-helmet';
import rev from 'rev-manifest-path';
import serialize from 'serialize-javascript';
import {ServerStyleSheet} from 'styled-components';
import '@nib-components/react-sass-grid-support';

import Modernizr from './Modernizr';
import GoogleTagManager from './GoogleTagManager';

function vwo1(vwoAccountId) {
  return `
  var _vis_opt_account_id = ${vwoAccountId};
  var _vis_opt_protocol = (('https:' == document.location.protocol) ? 'https://' : 'http://');
  document.write('<s' + 'cript src="' + _vis_opt_protocol +
  'dev.visualwebsiteoptimizer.com/deploy/js_visitor_settings.php?v=1&a='+_vis_opt_account_id+'&url='
  +encodeURIComponent(document.URL)+'&random='+Math.random()+'" type="text/javascript">' + '<\/s' + 'cript>');
  `;
}

function vwo2() {
  return `
  if(typeof(_vis_opt_settings_loaded) == "boolean") { document.write('<s' + 'cript src="' + _vis_opt_protocol +
  'd5phz18u4wuww.cloudfront.net/vis_opt.js" type="text/javascript">' + '<\/s' + 'cript>'); }
  // if your site already has jQuery 1.4.2, replace vis_opt.js with vis_opt_no_jquery.js above
  `;
}

function vwo3() {
  return `
  if(typeof(_vis_opt_settings_loaded) == "boolean" && typeof(_vis_opt_top_initialize) == "function") {
  _vis_opt_top_initialize(); vwo_$(document).ready(function() { _vis_opt_bottom_initialize(); });
  }
  `;
}

/**
 * Create a react component for rendering the <html>
 * @param   {object}                [options]
 *
 * @param   {string}                [options.title]
 * @param   {string}                [options.description]
 * @param   {string}                [options.canonical]
 * @param   {string}                [options.robots]
 * @param   {string|Array<script>}  [options.script]
 * @param   {string|Array<script>}  [options.style]
 * @param   {boolean}               [options.static=false]
 *
 * @param   {boolean|object}        [options.visualWebsiteOptimizer]
 * @param   {number}                [options.visualWebsiteOptimizer.accountId]
 *
 * @param   {string}                [options.googleFonts]
 * @param   {string}                [options.googleTagManagerId]
 *
 * @param   {number}                [options.clippyChatTimeout]
 *
 * @returns {Html}
 */
export default function(options) {

  const config = options && options.config || null;

  let scripts = options && options.script && [].concat(options.script) || null;
  let styles = options && options.style && [].concat(options.style) || null;

  const staticMarkup = options && options.static || false;
  
  const googleTagManagerId = options && options.googleTagManagerId || null;
  const googleFonts = options && options.googleFonts || null;
  const visualWebsiteOptimizer = options && options.visualWebsiteOptimizer || false;
  
  const clippyChatTimeout = options && options.clippyChatTimeout || null;
  
  let vwoAccountId = 215379;
  if (typeof visualWebsiteOptimizer === 'object' && visualWebsiteOptimizer.accountId) {
    vwoAccountId = visualWebsiteOptimizer.accountId;
  }
  
  const revManifestPath = options && options.revManifestPath || null;
  if (revManifestPath) {
    const assetPath = rev(revManifestPath);
    styles = styles.map(style => assetPath(style));
    scripts = scripts.map(script => assetPath(script));
  }

  // ================================================================================ //
  // Gatsby sites require a few props to be added throught the dom.
  // ================================================================================ //
  
  const gatsby = options && options.gatsby || false;
  
  const htmlAttributes = options && options.htmlAttributes || null;
  const headComponents = options && options.headComponents || null;
  const bodyAttributes = options && options.bodyAttributes || null;
  const preBodyComponents = options && options.preBodyComponents || null;
  const postBodyComponents = options && options.postBodyComponents || null;
  const body = options && options.body || null;
  
  // ================================================================================ //

  const Html = props => {
    const {state, children} = props;

    //render the children elements
    let content = '';
    let cssStyleElements = [];

    if (children) {

      const sheet = new ServerStyleSheet();
      const html = sheet.collectStyles(children);

      if (staticMarkup) {
        content = renderToStaticMarkup(html);
      } else {
        content = renderToString(html);
      }

      cssStyleElements = sheet.getStyleElement();
    }

    const head = Helmet.rewind();
    let title = options && options.title && <title>{options.title}</title> || head.title.toComponent();

    let description = options && options.description;
    let canonical = options && options.canonical;

    let favicon = options && options.favicon || 'https://www.nib.com.au/favicon.ico';

    return (
      <html lang="en-AU" {...htmlAttributes}>
        <head>

          <meta charSet="utf-8"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta name="format-detection" content="telephone=no"/>
          {title}

          {description
            ? <meta name="description" content={description}/>
            : null
          }

          {canonical
            ? <link rel="canonical" href={canonical}/>
            : null
          }

          {head.meta.toComponent()}

          <Modernizr/>
          <link rel="shortcut icon" href={favicon} type="image/x-icon"/>
          
          {googleFonts
            ? <link rel="stylesheet" className="google-fonts-link-tag" href={`https://fonts.googleapis.com/css?family=${googleFonts}`}/>
            : null
          }

          {styles && styles.map(style => (<link key={style} rel="stylesheet" href={style}/>))}

          {visualWebsiteOptimizer ? <script type="text/javascript" id="vwo1" dangerouslySetInnerHTML={{__html: vwo1(vwoAccountId)}}></script> : null}
          {visualWebsiteOptimizer ? <script type="text/javascript" id="vwo2" dangerouslySetInnerHTML={{__html: vwo2()}}></script> : null}
          {visualWebsiteOptimizer ? <script type="text/javascript" id="vwo3" dangerouslySetInnerHTML={{__html: vwo3()}}></script> : null}

          {headComponents}

          {clippyChatTimeout ? <link key="clippy-chat" href="https://shared.nib.com.au/content/dist/clippy-chat.css" rel="stylesheet"/> : null}

          {cssStyleElements && cssStyleElements.length > 0 && cssStyleElements}
          
        </head>
        <body {...bodyAttributes}>
          {preBodyComponents}

          {gatsby
            ? (
              <div
                key={'body'}
                id="___gatsby"
                dangerouslySetInnerHTML={{__html: body}}
              />
            )
            : <div id="app" dangerouslySetInnerHTML={{__html: content}}/>
          }
         

          {config
            ? <script dangerouslySetInnerHTML={{__html: `window.__CONFIG__=${serialize(config, {isJSON: true})}`}}/>
            : null
          }
          {state
            ? <script dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__=${serialize(state, {isJSON: true})}`}}/>
            : null
          }

          {scripts && scripts.map(script => (<script key={script} src={script}></script>))}

          {googleTagManagerId
            ? <GoogleTagManager id={googleTagManagerId}/>
            : null
          }
          {clippyChatTimeout
            ? <span id="js-chat-timeout" data-timeout={clippyChatTimeout}></span>
            : null
          }
          {clippyChatTimeout
            ? <script src="https://shared.nib.com.au/content/dist/clippy-chat.js" defer async></script>
            : null
          }

          {postBodyComponents}
        </body>
      </html>
    );
  };

  Html.propTypes = {
    state: React.PropTypes.object,
    children: React.PropTypes.node
  };

  return Html;
}
