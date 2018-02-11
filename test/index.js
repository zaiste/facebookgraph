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
const nock = require('nock');

const FacebookGraph = require('../lib');
const config = require('./config');
const { mockPosts, mockSearch, mockBatch } = require('./mocks');

const expect = chai.expect;

describe('baseRoute', () => {
  let graph;

  beforeEach(() => {
    graph = new FacebookGraph('XXX');
    nock('https://graph.facebook.com')
      .get('/523008607856853/posts')
      .query({ access_token: 'XXX', limit: 25 })
      .reply(200, mockPosts);

    nock('https://graph.facebook.com')
      .get('/search')
      .query({ access_token: 'XXX', limit: 25, q: 'geek', type: 'page', fields: 'name' })
      .reply(200, mockSearch);

    nock('https://graph.facebook.com')
      .get('/')
      .query({
        access_token: 'XXX',
        batch: [
          { method: "GET", relative_url: "me"},
          { method: "GET", relative_url: "me/friends?limit=2" }
        ]
      })
      .reply(200, mockBatch)

    nock('https://graph.facebook.com')
      .post('/me/feed')
      .query({ access_token: 'XXX', message: 'Testing', link: 'https://zaiste.net' })
      .reply(200, { data: { id: '596959271_10154776798369272' }});
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
    const pages = await graph.search({ q: 'geek', type: 'page', fields: 'name' }, 7)
    expect(pages).to.be.a('array');
    expect(pages).to.have.lengthOf(7);
  })

  it('should post a message with link', async () => {
    const post = await graph.post('me', { message: 'Testing', link: 'https://zaiste.net' });
    expect(post).to.be.a('Object')
  })
/*
  it('should return 2 responses for batch request', async () => {
    const result = await graph.batch([
      { method: "GET", relative_url: "me" },
      { method: "GET", relative_url: "me/friends?limit=2" }
    ]);
    expect(result.data).to.be.a('array');
    expect(result.data).to.have.lengthOf(2);
  });
*/
});
