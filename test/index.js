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

const expect = chai.expect;

describe('baseRoute', () => {
  let graph;

  const mockPosts = {
    data: [
      { message: '#node #express #postgresql #nunjucks #yarn',
        created_time: '2016-11-03T19:55:06+0000',
        id: '523008607856853_680652715425774' },
      { message: '#python #howto',
        created_time: '2016-10-31T16:49:19+0000',
        id: '523008607856853_678824485608597' },
      { message: '#systemd #devops',
        created_time: '2016-10-30T15:56:04+0000',
        id: '523008607856853_678216565669389' },
      { message: '#ansible #devops',
        created_time: '2016-10-27T11:06:09+0000',
        id: '523008607856853_676375612520151' }
    ]
  }

  const mockSearch = {
    data: [
      { name: 'Geek.com', id: '45041537375' },
      { name: 'BuzzFeed Geeky', id: '383188141797933' },
      { name: 'Geek Central', id: '509652639116732' },
      { name: 'GeekHub', id: '162996930884780' },
      { name: 'Taverna Geek', id: '529842137144988' },
      { name: 'Turbo Geek', id: '353933684989269' },
      { name: 'Passe Moi Le Geek', id: '308609542511282' },
      { name: 'Le Journal du Geek', id: '255370230787' },
      { name: 'Studio Geek', id: '392784847448787' },
      { name: 'Cultura Geek', id: '179589055445286' },
      { name: 'Geek', id: '960224360671515' },
      { name: 'The Geek Strikes Back', id: '534088003301758' },
      { name: 'Geek Club', id: '513732662029827' },
      { name: 'How-To Geek', id: '65878196434' },
      { name: 'Geek Girls', id: '188800427797025' },
      { name: 'Programming Geeks', id: '662720053867254' },
      { name: 'Garotas Geeks', id: '129068560470751' },
      { name: 'GeekQc', id: '154016318123550' },
      { name: 'Séries Geek', id: '211937885493862' },
      { name: 'Geek Publicitário', id: '408738192556840' },
      { name: 'Geek & Sundry', id: '226367660749035' },
      { name: 'Joke Geek', id: '560659753957721' },
      { name: 'Music geeks', id: '478322352314900' },
      { name: 'GeekTube', id: '1497437303888560' },
      { name: 'Geekly', id: '516379151731842' }
    ]
  }

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
});
