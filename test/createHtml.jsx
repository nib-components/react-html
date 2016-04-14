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