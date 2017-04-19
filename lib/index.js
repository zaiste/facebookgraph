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

const url = require('url');
const path = require('path');
const request = require('axios');

class FacebookGraph {
  constructor(accessToken, version = '2.8') {
    this.accessToken = accessToken;
    this.version = version;

    this.baseURL = `https://graph.facebook.com`;
    this.searchURL = `${this.baseURL}/v${version}/search`;
  }

  async get(requestPath, parameters) {
    let params = Object.assign({ access_token: this.accessToken }, parameters);

    const options = {
      url: `${this.baseURL}/${requestPath}`,
      params,
      headers: { 'User-Agent': 'Facebook Graph Client' }
    }

    let result;
    try {
      const response = await request(options);
      result = response.data;

      if (result.paging.next) {
        result.next = url.parse(result.paging.next);
      }
      if (result.paging.previous) {
        result.previous = url.parse(result.paging.previous);
      }
    } catch (error) {
      console.log(error.message);
    }

    return result;
  }

  async paginate(path, params, size) {
    let result = await this.get(path, params)
    let entities = result.data;
    let counter = entities.length;

    const { limit } = params;

    while (result.next && counter < size) {
      result = await this.get(result.next.path, { limit })
      entities.push(...result.data);
    }

    return entities.slice(0, size);
  }

  async fetch(id, type, size = 10) {
    const requestPath = `v${this.version}/${id}/${type}`;
    return await this.paginate(requestPath, { limit: 25 }, size);
  }

  async search({ q, type, fields }, size = 25) {
    return await this.paginate('search', { q, type, fields, limit: 25 }, size)
  }

  async postImage(id, { caption, url }) {
    let params = Object.assign({ access_token: this.accessToken }, { caption, url });

    const options = {
      url: `${this.baseURL}/${id}/photos`,
      method: 'POST',
      params,
      headers: { 'User-Agent': 'Facebook Graph Client' }
    }

    const response = await request(options);
    return response.data;
  }

  async postVideo(id, { description, file_url }) {
    let params = Object.assign({ access_token: this.accessToken }, { description, file_url });

    const options = {
      url: `${this.baseURL}/${id}/videos`,
      method: 'POST',
      params,
      headers: { 'User-Agent': 'Facebook Graph Client' }
    }

    const response = await request(options);
    return response.data;
  }

  async post(id, { message, link, no_story }) {
    let params = Object.assign({ access_token: this.accessToken }, { message, link, no_story });

    const options = {
      url: `${this.baseURL}/${id}/feed`,
      method: 'POST',
      params,
      headers: { 'User-Agent': 'Facebook Graph Client' }
    }

    const response = await request(options);
    return response.data;
  }
}

module.exports = FacebookGraph;
