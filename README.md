# facebookgraph 

`facebookgraph` is a Node.js client/interface for the [Facebook Graph API][3].

* it uses [axios][1] instead of [requests][2]
* it uses `async/await` syntax
* it works only with Node.js 7.6+

## Install

```
yarn add facebookgraph
```

or 

```
npm install facebookgraph
```

## Usage  

In order to use Facebook Graph API you need to have an access token which is being used to initialize `FacebookGraph` object. Here's an example how to fetch 5 posts of the page with the id `523008607856853`.

```js
const FacebookGraph = require('facebookgraph');

const graph = new FacebookGraph('<Your Facebook Access Token>')
const posts = await graph.fetch('523008607856853', 'posts', 5)
console.log(posts);
```

### Request object using ID

```js
const zuck = await graph.get('4');
```

```
{ id: '4',
  first_name: 'Mark',
  last_name: 'Zuckerberg',
  link: 'https://www.facebook.com/app_scoped_user_id/4/',
  name: 'Mark Zuckerberg',
  updated_time: '2017-01-26T08:32:59+0000' }
```

### Search API

Search API endpoint is: `https://graph.facebook.com/v2.8/search`. You can search through objects of type `user`, `page`, `event`, `group`, `place`, `placetopic`.

The payload object has three properties: a search term (`q`), a search type (`type`) property and `fields` of each object. Check out the docs to see which fields can be requested for each object.

```js
const pages = await graph.search({ q: 'geek', type: 'page', fields: 'name, link' })
```

The code above requests the `name` and `link` fields to be returned which are the part of the page public profile and do not require additional permissions. The Facebook Graph API's `/search` end point only returns publicly available information.

The syntax for requesting the field of a field is `field{nestedField}`; to request more than one nested field, separate them by commas: `field{nestedField1, nestedField2, nestedField3}`; e.g. specify `photos.limit(2)` to return only 2 photos, or `photos.limit(2){link, comments.limit(3)}` to return only 2 photos but `link` and up to 3 comments for each one.


```js
const users = await graph.search({ q: 'geek', type: 'user', fields: 'photos.limit(2){link, comments.limit(2)}' }
```

### Posting text messages, photos or videos

```js
const post = await graph.post('me', { message: 'This is a test message.', link: 'https://zaiste.net' });
```

Set `no_story` to hide the post from showing up in the user feed.


[1]: https://github.com/mzabriskie/axios
[2]: https://github.com/request/request
[3]: https://developers.facebook.com/docs/graph-api
