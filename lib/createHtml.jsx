import React from 'react';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';
import Helmet from 'react-helmet';
import rev from 'rev-manifest-path';

import Modernizr from './Modernizr';
import NewRelic from './NewRelic';
import GoogleTagManager from './GoogleTagManager';

const vwo1 = `
var _vis_opt_account_id = 215379;
var _vis_opt_protocol = (('https:' == document.location.protocol) ? 'https://' : 'http://');
document.write('<s' + 'cript src="' + _vis_opt_protocol +
'dev.visualwebsiteoptimizer.com/deploy/js_visitor_settings.php?v=1&a='+_vis_opt_account_id+'&url='
+encodeURIComponent(document.URL)+'&random='+Math.random()+'" type="text/javascript">' + '<\/s' + 'cript>');
`;

const vwo2 = `
if(typeof(_vis_opt_settings_loaded) == "boolean") { document.write('<s' + 'cript src="' + _vis_opt_protocol +
'd5phz18u4wuww.cloudfront.net/vis_opt.js" type="text/javascript">' + '<\/s' + 'cript>'); }
// if your site already has jQuery 1.4.2, replace vis_opt.js with vis_opt_no_jquery.js above
`;

const vwo3 = `
if(typeof(_vis_opt_settings_loaded) == "boolean" && typeof(_vis_opt_top_initialize) == "function") {
_vis_opt_top_initialize(); vwo_$(document).ready(function() { _vis_opt_bottom_initialize(); });
}
`;

/**
 * Create a react component for rendering the <html>
 * @param   {object}                [options]
 *
 * @param   {string}                [options.title]
 * @param   {string|Array<script>}  [options.script]
 * @param   {string|Array<script>}  [options.style]
 * @param   {boolean}               [options.static=false]
 *
 * @param   {object}                [options.newRelic]
 * @param   {string}                [options.newRelic.licenseKey]
 * @param   {string}                [options.newRelic.applicationId]
 *
 * @param   {boolean}               [options.visualWebsiteOptimizer]
 * @param   {string}                [options.googleTagManagerId]
 *
 * @returns {Html}
 */
export default function(options) {
  const head = Helmet.rewind();

  const config = options && options.config || null;

  const title = options && options.title || head && head.title && head.title.toComponent().toString() || 'nib';
  let scripts = options && options.script && [].concat(options.script) || ['index.js'];
  let styles = options && options.style && [].concat(options.style) || ['index.css'];

  const staticMarkup = options && options.static || false;

  const newRelic = options && options.newRelic || null;
  const googleTagManagerId = options && options.googleTagManagerId || null;
  const visualWebsiteOptimizer = options && options.visualWebsiteOptimizer || false;

  const revManifestPath = options && options.revManifestPath || null;
  if (revManifestPath) {
    const assetPath = rev(revManifestPath);
    styles = styles.map(style => assetPath(style));
    scripts = scripts.map(script => assetPath(script));
  }

  return function Html(props) {
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

    return (
      <html>
        <head>

          <meta charSet="utf-8"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>{title}</title>

          {newRelic
            ? <NewRelic licenseKey={newRelic.licenseKey} applicationId={newRelic.applicationId}/>
            : null
          }

          <Modernizr/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Roboto:300,400,700"/>
          {styles.map(style => (<link key={style} rel="stylesheet" href={style}/>))}

          {visualWebsiteOptimizer ? <script type='text/javascript' dangerouslySetInnerHTML={{__html: vwo1}}></script> : null}
          {visualWebsiteOptimizer ? <script type='text/javascript' dangerouslySetInnerHTML={{__html: vwo2}}></script> : null}
          {visualWebsiteOptimizer ? <script type='text/javascript' dangerouslySetInnerHTML={{__html: vwo3}}></script> : null}

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

          {scripts.map(script => (<script key={script} src={script}></script>))}

          {googleTagManagerId
            ? <GoogleTagManager id={googleTagManagerId}/>
            : null
          }

        </body>
      </html>
    );
  };

}