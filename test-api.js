const axios = require('axios');
axios.get('http://localhost:8080/profiles/getall')
  .then(res => console.log('Profiles returned:', res.data.length))
  .catch(err => console.error(err.message));
