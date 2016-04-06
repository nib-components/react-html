import React from 'react';
import {expect} from 'chai';
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

});