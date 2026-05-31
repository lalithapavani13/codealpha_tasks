// Navbar auth helper: updates nav links based on localStorage 'user' and 'token'
(function () {
  function getUser() {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch (e) { return null; }
  }

  function render() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    // Ensure there's an auth container
    let authEl = nav.querySelector('#nav-auth');
    if (!authEl) {
      authEl = document.createElement('div');
      authEl.id = 'nav-auth';
      authEl.style.marginLeft = 'auto';
      nav.appendChild(authEl);
    }

    const user = getUser();
    if (user && user.name) {
      authEl.innerHTML = `
        <span class="nav-user">Hello, ${user.name}</span>
        <a href="#" id="link-logout">Logout</a>
      `;
      const logout = document.getElementById('link-logout');
      if (logout) logout.addEventListener('click', (e) => { e.preventDefault(); localStorage.removeItem('token'); localStorage.removeItem('user'); window.location = '/'; });
    } else {
      authEl.innerHTML = `<a href="/login.html" id="link-login">Login</a>`;
      const login = document.getElementById('link-login');
      if (login) login.addEventListener('click', (e) => { /* no-op: normal link */ });
    }

    // Also update any existing elements with id 'link-login' or 'link-logout' elsewhere
    const existingLogin = document.getElementById('link-login');
    if (existingLogin && !(getUser() && getUser().name)) existingLogin.style.display = '';
    if (existingLogin && (getUser() && getUser().name)) existingLogin.style.display = 'none';
  }

  // Run on DOMContentLoaded
  function setActiveNav(){
    const nav = document.querySelector('nav');
    if (!nav) return;
    const pathname = window.location.pathname.replace(/\/index\.html$/,'/');
    const links = nav.querySelectorAll('a');
    links.forEach(a=>{
      try{
        const href = a.getAttribute('href') || '';
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return a.classList.remove('active');
        const url = new URL(href, window.location.origin);
        let lp = url.pathname.replace(/\/index\.html$/,'/');
        if (lp !== '/' && lp.endsWith('/')) lp = lp.slice(0,-1);
        let pn = pathname;
        if (pn !== '/' && pn.endsWith('/')) pn = pn.slice(0,-1);
        if (lp === pn) a.classList.add('active'); else a.classList.remove('active');
      }catch(e){ a.classList.remove('active'); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ()=>{ render(); setActiveNav(); }); else { render(); setActiveNav(); }
})();
