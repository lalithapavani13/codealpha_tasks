(function(){
  if (window.__ShopEaseUI) return; // prevent double-run
  window.__ShopEaseUI = true;

  const spinner = document.getElementById('global-spinner');
  function showSpinner(){ if (spinner) spinner.classList.remove('hidden'); }
  function hideSpinner(){ if (spinner) spinner.classList.add('hidden'); }

  // expose to window for manual control
  window.showSpinner = showSpinner;
  window.hideSpinner = hideSpinner;

  // hide spinner once page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(hideSpinner, 150); // small delay for perceived smoothness
  });

  // wrap fetch to show spinner during network activity
  try{
    const _fetch = window.fetch;
    window.fetch = async function(...args){
      showSpinner();
      try{ const res = await _fetch.apply(this, args); return res; }
      finally{ hideSpinner(); }
    };
  }catch(e){ /* ignore if fetch cannot be wrapped */ }

  // Also show spinner during form submissions triggered by JS
  document.addEventListener('submit', (e)=>{
    const target = e.target;
    if (target && target.tagName === 'FORM') showSpinner();
  }, true);
})();
