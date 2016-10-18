import React from 'react';
import {expect} from 'chai';
import render from 'react-testutils-render';
import $ from 'react-testutils-query';
import Helmet from 'react-helmet';
import createHtml from './createHtml';

describe('createHtml()', () => {

  describe('<title/>', () => {

    it('should be empty when undefined', () => {

      const Html = createHtml();
      const html = $(render(<Html/>).element);

      expect(html.find('title').first().hasText('')).to.be.true;

    });

    it('should not be empty when defined', () => {

      const Html = createHtml({title: 'Homepage | nib'});
      const html = $(render(<Html/>).element);

      expect(html.find('title').first().hasText('Homepage | nib')).to.be.true;

    });

  });

  describe('VWO', () => {

    const defaultVwoAccountId = 215379;
    const vwoLine2Part = 'd5phz18u4wuww.cloudfront.net/vis_opt.js';
    const vwoLine3Part = 'vwo_$(document).ready';

    it('should not have VWO when VWO is falsey', () => {

      const Html = createHtml({visualWebsiteOptimizer: false});
      const html = $(render(<Html/>).element);

      expect(html.find('script').first().hasProp('dangerouslySetInnerHTML'))
        .to.be.false
      ;

    });

    it('should use the default VWO account ID when VWO is true', () => {
      const Html = createHtml({visualWebsiteOptimizer: true});
      const html = $(render(<Html/>).element);

      expect(html.find('script').first().prop('dangerouslySetInnerHTML').__html)
        .to.contain(defaultVwoAccountId)
      ;

      expect(html.find('script').at(1).prop('dangerouslySetInnerHTML').__html)
        .to.contain(vwoLine2Part)
      ;

      expect(html.find('script').at(2).prop('dangerouslySetInnerHTML').__html)
        .to.contain(vwoLine3Part)
      ;
    });

    it('should use the default VWO account ID when VWO is an object without custom ID', () => {

      const Html = createHtml({visualWebsiteOptimizer: {}});
      const html = $(render(<Html/>).element);

      expect(html.find('script').first().prop('dangerouslySetInnerHTML').__html)
        .to.contain(defaultVwoAccountId)
      ;

      expect(html.find('script').at(1).prop('dangerouslySetInnerHTML').__html)
        .to.contain(vwoLine2Part)
      ;

      expect(html.find('script').at(2).prop('dangerouslySetInnerHTML').__html)
        .to.contain(vwoLine3Part)
      ;
    });

    it('should use a custom VWO account ID when VWO is an object with a custom ID', () => {
      const customAccountId = 111111111;

      const Html = createHtml({visualWebsiteOptimizer: {accountId: customAccountId}});
      const html = $(render(<Html/>).element);

      expect(html.find('script').first().prop('dangerouslySetInnerHTML').__html)
        .to.contain(customAccountId)
      ;

      expect(html.find('script').at(1).prop('dangerouslySetInnerHTML').__html)
        .to.contain(vwoLine2Part)
      ;

      expect(html.find('script').at(2).prop('dangerouslySetInnerHTML').__html)
        .to.contain(vwoLine3Part)
      ;
    });

  });
  describe('Clippy-chat', () => {

    it('should display clippy-chat when clippyChatTimeout is included in options', () => {
      const clippyChatTimeout = 100;

      const Html = createHtml({clippyChatTimeout});
      const html = $(render(<Html/>).element);

      expect(html.find('link').at(3).prop('href')).to.contain('/shared/content/dist/clippy-chat.css');
      expect(html.find('span[id=js-chat-timeout]').first().prop('data-timeout')).to.equal(clippyChatTimeout);
    });

    it('should not display clippy-chat when clippyChatTimeout is not included in options', () => {
      const Html = createHtml();
      const html = $(render(<Html/>).element);

      expect(html.find('span[id=js-chat-timeout]').length).to.equal(0);
    });

  });

  describe('<meta name="description"/>', () => {

    it('should not exist when not defined', () => {
      const Html = createHtml();
      const html = $(render(<Html/>).element);

      const desc = Array.prototype.slice.call(html.find('meta'), 0).find(
        element => element.hasProp('name', 'description')
      );

      expect(desc).to.be.undefined;

    });

    it('should not be empty when defined', () => {
      const Html = createHtml({description: 'Another great page about health insurance'});
      const html = $(render(<Html/>).element);

      const desc = Array.prototype.slice.call(html.find('meta'), 0).find(
        element => element.hasProp('name', 'description')
      );

      expect(desc.prop('content')).to.equal('Another great page about health insurance');

    });

  });

  describe('<link rel="canonical"/>', () => {

    it('should not exist when not defined', () => {
      const Html = createHtml();
      const html = $(render(<Html/>).element);

      const canonical = Array.prototype.slice.call(html.find('link'), 0).find(
        element => element.hasProp('rel', 'canonical')
      );

      expect(canonical).to.be.undefined;

    });

    it('should not be empty when defined', () => {
      const Html = createHtml({canonical: 'https://www.nib.com.au'});
      const html = $(render(<Html/>).element);

      const canonical = Array.prototype.slice.call(html.find('link'), 0).find(
        element => element.hasProp('rel', 'canonical')
      );

      expect(canonical.prop('href')).to.equal('https://www.nib.com.au');

    });

  });

  describe('<Helmet/>', () => {

    it('should render meta tags', () => {
      const Html = createHtml();
      const html = $(render(
        <Html>
          <Helmet
            meta={[{name: 'robots', content: 'noindex, nofollow'}]}
          />
        </Html>
      ).element);

      const metaTag = html.find('meta[name=robots][content="noindex, nofollow"]');
      expect(metaTag).to.have.length(1);

    });

    it('should render title', () => {
      const Html = createHtml();
      const html = $(render(
        <Html>
          <Helmet
            title="Hello!"
          />
        </Html>
      ).element);

      expect(html.find('title').first().hasText('Hello!')).to.be.true;

    });

  });

});
