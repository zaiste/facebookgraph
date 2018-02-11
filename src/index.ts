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

import { parse } from 'url';
import make from 'axios';

type FacebookResponse = {
  data?: Array<{}>,
  next?: { path?: string },
  previous?: { path?: string },
  paging?: { next: string, previous: string },
  access_token?: string
}

type Response = {
  data?: FacebookResponse,
  status?: number,
  statusText?: string,
  headers?: {
    [key:string]: string
  }
};


class FacebookGraph {
  accessToken: string;
  version: string;
  baseURL: string;
  searchURL: string;

  constructor(accessToken: string, version: string = '2.9', debug: string) {
    this.accessToken = accessToken;
    this.version = version;

    this.baseURL = `https://graph.facebook.com`;
    this.searchURL = `${this.baseURL}/v${version}/search`;
  }

  async request(path: string, params, method = 'GET'): Promise<Response> {
    try {
      const response = await make({
        headers: { 'User-Agent': 'Facebook Graph Client' },
        method,
        params: Object.assign({ access_token: this.accessToken }, params),
        url: `${this.baseURL}/${path}`
      })

      return response;
    } catch (error) {
      console.log(error.response.status);
      console.log(`  ${error.message}`);
      console.log(`  ${error.response.headers['www-authenticate']}`);
    }
  }


  async get(requestPath: string, params: {}): Promise<FacebookResponse> {
    const response = await this.request(requestPath, params);

    if (response) {
      let result: FacebookResponse = response.data;

      if (result.paging && result.paging.next) {
        result.next = parse(result.paging.next);
      }
      if (result.paging && result.paging.previous) {
        result.previous = parse(result.paging.previous);
      }

      return result;
    }
  }

  async extend(client_id: string, client_secret: string): Promise<FacebookResponse> {
    let result: FacebookResponse = await this.get("/oauth/access_token", { client_id, client_secret, fb_exchange_token: this.accessToken, grant_type: 'fb_exchange_token' });
    this.accessToken = result.access_token;

    return result;
  }

  async paginate(path: string, params: { q?: string, type?: string, fields?: {}, limit: number }, size: number): Promise<Array<{}>> {
    let result: FacebookResponse = await this.get(path, params);
    let entities = result.data;
    let counter = entities.length;

    const { limit }: { limit: number } = params;

    while (result.next && counter < size) {
      result = await this.get(result.next.path, { limit });
      entities.push(...result.data);
    }

    return entities.slice(0, size);
  }

  async fetch(id: string, type: string, size: number = 10): Promise<Array<{}>> {
    const requestPath = `${id}/${type}`;
    return await this.paginate(requestPath, { limit: 25 }, size);
  }

  async search({ q, type, fields }: { q: string, type: string, fields: {} }, size: number = 25): Promise<Array<{}>> {
    return await this.paginate('search', { q, type, fields, limit: 25 }, size);
  }

  async postImage(id: string, { caption, url }: { caption: string, url: string }): Promise<{}> {
    const response = await this.request(
      `${id}/photos`,
      { caption, url },
      'POST'
    );

    if (response.data) {
      return response.data;
    }
  }

  async postVideo(id: string, { description, file_url }: { description: string, file_url: string }): Promise<{}> {
    const response = await this.request(
      `${id}/videos`,
      { description, file_url },
      'POST'
    );

    if (response) {
      return response.data;
    }
  }

  async post(id: string, { message, link, no_story = false }: { message: string, link: string, no_story: boolean }): Promise<{}> {
    const response = await this.request(
      `${id}/feed`,
      { message, link },
      'POST'
    );

    if (response) {
      return response.data;
    }
  }

  async batch(batch: {}): Promise<Response> {
    const response = this.request(``, { batch: JSON.stringify(batch) }, 'POST');

    return response;
  }

  async del(id: string): Promise<Response> {
    const response = this.request(`${id}`, {}, 'DELETE');

    return response;
  }
}

module.exports = FacebookGraph;
