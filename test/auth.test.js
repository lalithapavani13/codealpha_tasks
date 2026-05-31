const axios = require('axios');
const { expect } = require('chai');
const app = require('../server');

let server, baseURL;

describe('Auth API', function () {
  this.timeout(20000);
  before(done => { server = app.listen(0, () => { const port = server.address().port; baseURL = `http://127.0.0.1:${port}`; done(); }); });
  after(done => { server.close(done); });

  it('register -> login flow', async () => {
    const email = `test${Date.now()}@example.com`;
    const registerRes = await axios.post(baseURL + '/api/auth/register', { name: 'Test User', email, password: 'password' });
    expect(registerRes.status).to.equal(200);
    expect(registerRes.data).to.have.property('token');

    const loginRes = await axios.post(baseURL + '/api/auth/login', { email, password: 'password' });
    expect(loginRes.status).to.equal(200);
    expect(loginRes.data).to.have.property('token');
  });
});
