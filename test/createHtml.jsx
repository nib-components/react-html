import React from 'react';
import {expect} from 'chai';
import Helmet from 'react-helmet';
import render from 'react-testutils-render';
import $ from 'react-testutils-query';
import createHtml from '../lib/createHtml';

describe('createHtml()', () => {

  describe('<title/>', () => {

    it('should be empty when undefined', () => {

      const Html = createHtml();
      const html = $(render(<Html/>).element);

      expect(html.find('title').hasText('')).to.be.true;

    });

    it('should not be empty when defined', () => {

      const Html = createHtml({title: 'Homepage | nib'});
      const html = $(render(<Html/>).element);

      expect(html.find('title').hasText('Homepage | nib')).to.be.true;

    });

  });

  describe('<head/> vwo', () => {
    it('should use vwo default account id when vwo boolean', () => {

      const Html = createHtml({visualWebsiteOptimizer: true});
      const html = $(render(<Html/>).element);

      const defaultVwoAccountId = 215379;

      const scriptElements = Array.prototype.slice.call(html.find('script'));
      const vwoLineOne = scriptElements[0].prop('dangerouslySetInnerHTML').__html;

      const vwoLinkDefaultAccount = `dev.visualwebsiteoptimizer.com/deploy/js_visitor_settings.php?v=1&a=${defaultVwoAccountId}&url=`;

      expect(vwoLineOne.indexOf(defaultVwoAccountId) > -1).to.be.true;
    });

    it('should use vwo default account id when vwo object without custom id', () => {

      const Html = createHtml({visualWebsiteOptimizer: {}});
      const html = $(render(<Html/>).element);

      const defaultVwoAccountId = 215379;

      const scriptElements = Array.prototype.slice.call(html.find('script'));
      const vwoLineOne = scriptElements[0].prop('dangerouslySetInnerHTML').__html;

      const vwoLinkDefaultAccount = `dev.visualwebsiteoptimizer.com/deploy/js_visitor_settings.php?v=1&a=${defaultVwoAccountId}&url=`;

      expect(vwoLineOne.indexOf(defaultVwoAccountId) > -1).to.be.true;
    });

    it('should use custom vwo account id when set', () => {
      const accountId = 111111111;
      const Html = createHtml({visualWebsiteOptimizer: {accountId}});
      const html = $(render(<Html/>).element);

      const defaultVwoAccountId = 215379;

      const scriptElements = Array.prototype.slice.call(html.find('script'));
      const vwoLineOne = scriptElements[0].prop('dangerouslySetInnerHTML').__html;
      expect(vwoLineOne.indexOf(accountId) > -1).to.be.true;
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

});
