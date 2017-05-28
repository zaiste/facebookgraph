const mockPosts = {
  data: [
    {
      message: '#node #express #postgresql #nunjucks #yarn',
      created_time: '2016-11-03T19:55:06+0000',
      id: '523008607856853_680652715425774'
    },
    {
      message: '#python #howto',
      created_time: '2016-10-31T16:49:19+0000',
      id: '523008607856853_678824485608597'
    },
    {
      message: '#systemd #devops',
      created_time: '2016-10-30T15:56:04+0000',
      id: '523008607856853_678216565669389'
    },
    {
      message: '#ansible #devops',
      created_time: '2016-10-27T11:06:09+0000',
      id: '523008607856853_676375612520151'
    }
  ]
};

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
};

const mockBatch = {
  data: [
    {
      code: 200,
      headers: [],
      body: '{"id":"111","first_name":"Mark","gender":"male","languages":[{"id":"113599388650247","name":"Klingon"}],"last_name":"Zuckerberg","link":"https:\\/\\/www.facebook.com\\/app_scoped_user_id\\/4\\/","locale":"en_US","name":"Mark Zuckerberg","timezone":9,"updated_time":"2013-05-03T14:23:45+0000","verified":true}'
    },
    {
      code: 200,
      headers: [],
      body: '{"data":[{"name":"John Doe","id":"1"},{"name":"Steve Appleseed","id":"2"}],"paging":{"cursors":{"before":"AAA","after":"ZZZ"},"next":"https:\\/\\/graph.facebook.com\\/v2.3\\/4\\/friends?access_token=XXX&limit=10&after=ZZZ"},"summary":{"total_count":101010101010}}'
    }
  ]
}

module.exports = {
  mockPosts,
  mockSearch,
  mockBatch,
};
