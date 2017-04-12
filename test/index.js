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
});