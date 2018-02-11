"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const axios_1 = require("axios");
class FacebookGraph {
    constructor(accessToken, version = '2.9', debug) {
        this.accessToken = accessToken;
        this.version = version;
        this.baseURL = `https://graph.facebook.com`;
        this.searchURL = `${this.baseURL}/v${version}/search`;
    }
    async request(path, params, method = 'GET') {
        try {
            const response = await axios_1.default({
                headers: { 'User-Agent': 'Facebook Graph Client' },
                method,
                params: Object.assign({ access_token: this.accessToken }, params),
                url: `${this.baseURL}/${path}`
            });
            return response;
        }
        catch (error) {
            console.log(error.response.status);
            console.log(`  ${error.message}`);
            console.log(`  ${error.response.headers['www-authenticate']}`);
        }
    }
    async get(requestPath, params) {
        const response = await this.request(requestPath, params);
        if (response) {
            let result = response.data;
            if (result.paging && result.paging.next) {
                result.next = url_1.parse(result.paging.next);
            }
            if (result.paging && result.paging.previous) {
                result.previous = url_1.parse(result.paging.previous);
            }
            return result;
        }
    }
    async extend(client_id, client_secret) {
        let result = await this.get("/oauth/access_token", { client_id, client_secret, fb_exchange_token: this.accessToken, grant_type: 'fb_exchange_token' });
        this.accessToken = result.access_token;
        return result;
    }
    async paginate(path, params, size) {
        let result = await this.get(path, params);
        let entities = result.data;
        let counter = entities.length;
        const { limit } = params;
        while (result.next && counter < size) {
            result = await this.get(result.next.path, { limit });
            entities.push(...result.data);
        }
        return entities.slice(0, size);
    }
    async fetch(id, type, size = 10) {
        const requestPath = `${id}/${type}`;
        return await this.paginate(requestPath, { limit: 25 }, size);
    }
    async search({ q, type, fields }, size = 25) {
        return await this.paginate('search', { q, type, fields, limit: 25 }, size);
    }
    async postImage(id, { caption, url }) {
        const response = await this.request(`${id}/photos`, { caption, url }, 'POST');
        if (response.data) {
            return response.data;
        }
    }
    async postVideo(id, { description, file_url }) {
        const response = await this.request(`${id}/videos`, { description, file_url }, 'POST');
        if (response) {
            return response.data;
        }
    }
    async post(id, { message, link, no_story = false }) {
        const response = await this.request(`${id}/feed`, { message, link }, 'POST');
        if (response) {
            return response.data;
        }
    }
    async batch(batch) {
        const response = this.request(``, { batch: JSON.stringify(batch) }, 'POST');
        return response;
    }
    async del(id) {
        const response = this.request(`${id}`, {}, 'DELETE');
        return response;
    }
}
module.exports = FacebookGraph;
