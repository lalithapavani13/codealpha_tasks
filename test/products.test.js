const axios = require('axios');
const { expect } = require('chai');
const app = require('../server');

let server, baseURL;

describe('Products API', function () {
  this.timeout(20000);
  before(done => { server = app.listen(0, () => { const port = server.address().port; baseURL = `http://127.0.0.1:${port}`; done(); }); });
  after(done => { server.close(done); });

  it('GET /api/products should return list', async () => {
    const res = await axios.get(baseURL + '/api/products');
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });
});
