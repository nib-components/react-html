import React from 'react';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';
import Helmet from 'react-helmet';
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
 * @param   {string|Array<script>}  [options.script]
 * @param   {string|Array<script>}  [options.style]
 * @param   {boolean}               [options.static=false]
 *
 * @param   {boolean|object}        [options.visualWebsiteOptimizer]
 * @param   {number}                [options.visualWebsiteOptimizer.accountId]
 *
 * @param   {string}                [options.googleTagManagerId]
 *
 * @param   {number}                [options.clippyChatTimeout]
 *
 * @returns {Html}
 */
export default function(options) {

  const config = options && options.config || null;

  const scripts = options && options.script && [].concat(options.script) || ['index.js'];
  const styles = options && options.style && [].concat(options.style) || ['index.css'];

  const staticMarkup = options && options.static || false;

  const googleTagManagerId = options && options.googleTagManagerId || null;
  const visualWebsiteOptimizer = options && options.visualWebsiteOptimizer || false;

  const clippyChatTimeout = options && options.clippyChatTimeout || null;

  let vwoAccountId = 215379;
  if (typeof visualWebsiteOptimizer === 'object' && visualWebsiteOptimizer.accountId) {
    vwoAccountId = visualWebsiteOptimizer.accountId;
  }

  const Html = props => {
    const {state, children} = props;

    //render the children elements
    let content = '';
    if (children) {
      if (staticMarkup) {
        content = renderToStaticMarkup(children);
      } else {
        content = renderToString(children);
      }
    }

    const head = Helmet.rewind();
    /*
      TODO: how do we set the default title here?

       <Helmet
         defaultTitle="My Site"
         titleTemplate="My Site - %s"
       />

     */

    return (
      <html lang="en-AU" {...head.htmlAttributes.toComponent()}>
        <head>

          <meta charSet="utf-8"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta name="format-detection" content="telephone=no"/>

          {head.title.toComponent()}
          {head.base.toComponent()}
          {head.meta.toComponent()}

          <Modernizr/>
          <link rel="shortcut icon" href="https://www.nib.com.au/favicon.ico" type="image/x-icon"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,700,800|Roboto:300,400,700"/>
          {head.link.toComponent()}

          {styles.map(style => (<link key={style} rel="stylesheet" href={style}/>))}
          {head.style.toComponent()}

          {visualWebsiteOptimizer ? <script type="text/javascript" dangerouslySetInnerHTML={{__html: vwo1(vwoAccountId)}}></script> : null}
          {visualWebsiteOptimizer ? <script type="text/javascript" dangerouslySetInnerHTML={{__html: vwo2()}}></script> : null}
          {visualWebsiteOptimizer ? <script type="text/javascript" dangerouslySetInnerHTML={{__html: vwo3()}}></script> : null}

          {clippyChatTimeout ? <link key="clippy-chat" href="/shared/content/dist/clippy-chat.css" rel="stylesheet"/> : null}

        </head>
        <body>

          <div id="app" dangerouslySetInnerHTML={{__html: content}}/>

          {config
            ? <script dangerouslySetInnerHTML={{__html: `window.__CONFIG__=${JSON.stringify(config)}`}}/>
            : null
          }

          {state
            ? <script dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__=${JSON.stringify(state)}`}}/>
            : null
          }

          {head.script.toComponent()}
          {head.noscript.toComponent()}
          {scripts.map(script => (<script key={script} src={script}></script>))}

          {googleTagManagerId
            ? <GoogleTagManager id={googleTagManagerId}/>
            : null
          }

          {clippyChatTimeout
            ? <span id="js-chat-timeout" data-timeout={clippyChatTimeout}></span>
            : null
          }
          {clippyChatTimeout
            ? <script src="/shared/content/dist/clippy-chat.js" defer async></script>
            : null
          }

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
