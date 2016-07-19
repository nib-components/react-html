import 'source-map-support/register';

import {expect} from 'chai';
import render from 'react-testutils-render';
import query from 'react-testutils-query';

global.expect = expect;
global.render = render;
global.$ = query;
