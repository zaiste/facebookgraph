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
