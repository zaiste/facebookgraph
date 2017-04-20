// Copyright 2016 Zaiste & contributors. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const mocha = require('mocha');
const chai = require('chai');

const FacebookGraph = require('../lib');
const config = require('./config');

const expect = chai.expect;

describe('baseRoute', () => {
  let graph;

  before(() => {
    graph = new FacebookGraph(config.accessToken);
  })

  it('should return 4 posts from /zaiste.net', async () => {
    const posts = await graph.fetch(config.pages.zaistenet, 'posts', 4)
    expect(posts).to.be.a('array');
    expect(posts).to.have.lengthOf(4);
  });

  it('should return 25 search results by default', async () => {
    const pages = await graph.search({ q: 'geek', type: 'page', fields: 'name' })
    expect(pages).to.be.a('array');
    expect(pages).to.have.lengthOf(25);
  });

  it('should return specified number of search results', async () => {
    const pages = await graph.search({ q: 'geek', type: 'page', fields: 'name' }, 33)
    expect(pages).to.be.a('array');
    expect(pages).to.have.lengthOf(33);
  }).timeout(10500);
});
