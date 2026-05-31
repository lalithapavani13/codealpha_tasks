const api = '/api';

async function postJSON(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      const data = await postJSON(api + '/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      alert('Logged in');
      window.location = '/';
    } catch (err) { alert('Login failed'); }
  });
}

if (document.getElementById('register-form')) {
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      const data = await postJSON(api + '/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      alert('Registered');
      window.location = '/';
    } catch (err) { alert('Registration failed'); }
  });
}
