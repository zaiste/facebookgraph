# facebookgraph 

`async/await` library to simplify the integration with Facebook Graph API. It only works with Node 7.6+.

## Usage  

Fetch 5 posts of the page with the id `523008607856853`

```
const graph = new Graph('<Your Facebook Access Token>')
const posts = await graph.fetch('523008607856853', 'posts', 5)
console.log(posts);
```
