import React from 'react';

/**
 * Script for Google Tag Manager
 * @param {object} props
 * @param {string} props.id
 * @returns {React.Component}
 */
export default function GoogleTagManager(props) {
  const {id} = props;
  return (
    <div>
      <noscript>
        <iframe
          src={`//www.googletagmanager.com/ns.html?id=${id}`}
          height="0" width="0" style={{display: 'none', visibility: 'hidden'}}
        ></iframe>
      </noscript>
      <script dangerouslySetInnerHTML={{__html: `!function(e,t,a,g,n){e[g]=e[g]||[],e[g].push({"gtm.start":(new Date).getTime(),event:"gtm.js"});var m=t.getElementsByTagName(a)[0],r=t.createElement(a),s="dataLayer"!=g?"&l="+g:"";r.async=!0,r.src="//www.googletagmanager.com/gtm.js?id="+n+s,m.parentNode.insertBefore(r,m)}(window,document,"script","dataLayer","${id}")`}}></script>
    </div>
  );
}

GoogleTagManager.propTypes = {
  id: React.PropTypes.string.isRequired
};
