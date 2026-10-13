
(function(){
  'use strict';
  const KEY='connecthubDemoCredits';
  const getCredits=()=>Number(localStorage.getItem(KEY)||0);
  const setCredits=(n)=>{localStorage.setItem(KEY,String(Math.max(0,n)));renderCredits();};
  function renderCredits(){document.querySelectorAll('[data-credit-balance]').forEach(el=>el.textContent=getCredits());}
  function qs(){return new URLSearchParams(location.search)}
  document.addEventListener('DOMContentLoaded',()=>{
    renderCredits();
    const p=qs();
    document.querySelectorAll('[data-plan-name]').forEach(el=>el.textContent=p.get('plan')||'Connection Credits');
    document.querySelectorAll('[data-plan-price]').forEach(el=>el.textContent=p.get('price')||'0');
    document.querySelectorAll('[data-plan-credits]').forEach(el=>el.textContent=p.get('credits')||'0');
    document.querySelectorAll('[data-demo-payment]').forEach(btn=>btn.addEventListener('click',()=>{
      const add=Number(p.get('credits')||btn.dataset.credits||0); setCredits(getCredits()+add); location.href='credits.html?success=1';
    }));
    const unlock=document.querySelector('[data-unlock-conversation]');
    if(unlock) unlock.addEventListener('click',(e)=>{
      e.preventDefault();
      if(getCredits()<1){location.href='credits.html?need=1';return;}
      setCredits(getCredits()-1); localStorage.setItem('connecthubUnlocked','1'); location.href='chat.html';
    });
    document.querySelectorAll('[data-demo-report]').forEach(btn=>btn.addEventListener('click',()=>{
      localStorage.setItem('connecthubReportSubmitted','1'); alert('Demo report submitted. In production this will go to the moderation team.');
    }));
    document.querySelectorAll('[data-demo-block]').forEach(btn=>btn.addEventListener('click',()=>{
      const blocked=localStorage.getItem('connecthubBlocked')==='1'; localStorage.setItem('connecthubBlocked',blocked?'0':'1'); btn.textContent=blocked?'Block profile':'Unblock profile';
    }));
    if(location.pathname.endsWith('credits.html')){
      const p=qs();
      if(p.get('success')) setTimeout(()=>alert('Demo credits added successfully.'),200);
      if(p.get('need')) setTimeout(()=>alert('You need 1 Connection Credit to unlock this conversation.'),200);
    }
  });
})();


(function(){
  'use strict';
  const VIEW_KEY='connecthubDiscoverView';
  const THEME_KEY='connecthubThemeColor';
  const DARK_KEY='connecthubDarkMode';
  const allowedViews=['swipe','grid','list'];
  const allowedThemes=['color-primary','color-pink','color-purple','color-red'];

  function savedView(){
    const v=localStorage.getItem(VIEW_KEY);
    return allowedViews.includes(v)?v:'swipe';
  }
  function savedTheme(){
    const v=localStorage.getItem(THEME_KEY);
    return allowedThemes.includes(v)?v:'color-primary';
  }
  function applyPreferences(){
    if(document.body){
      document.body.setAttribute('data-theme-color',savedTheme());
      const dark=localStorage.getItem(DARK_KEY)==='1';
      document.body.classList.toggle('theme-dark',dark);
    }
  }
  function renderDiscoverView(view){
    const v=allowedViews.includes(view)?view:'swipe';
    document.querySelectorAll('[data-discover-view]').forEach(section=>{
      section.hidden=section.getAttribute('data-discover-view')!==v;
    });
    document.querySelectorAll('[data-discover-view-btn]').forEach(btn=>{
      const active=btn.getAttribute('data-discover-view-btn')===v;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',active?'true':'false');
    });
    document.querySelectorAll('[data-discover-pref]').forEach(btn=>{
      btn.classList.toggle('active',btn.getAttribute('data-discover-pref')===v);
    });
  }
  function renderThemeSettings(){
    const theme=savedTheme();
    document.querySelectorAll('[data-theme-pref]').forEach(btn=>{
      btn.classList.toggle('active',btn.getAttribute('data-theme-pref')===theme);
    });
    document.querySelectorAll('[data-dark-pref]').forEach(input=>{
      input.checked=localStorage.getItem(DARK_KEY)==='1';
    });
  }

  applyPreferences();

  document.addEventListener('DOMContentLoaded',()=>{
    renderDiscoverView(savedView());
    renderThemeSettings();

    document.querySelectorAll('[data-discover-view-btn],[data-discover-pref]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const view=btn.getAttribute('data-discover-view-btn')||btn.getAttribute('data-discover-pref');
        if(!allowedViews.includes(view)) return;
        localStorage.setItem(VIEW_KEY,view);
        renderDiscoverView(view);
      });
    });

    document.querySelectorAll('[data-theme-pref]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const theme=btn.getAttribute('data-theme-pref');
        if(!allowedThemes.includes(theme)) return;
        localStorage.setItem(THEME_KEY,theme);
        document.body.setAttribute('data-theme-color',theme);
        renderThemeSettings();
      });
    });

    document.querySelectorAll('[data-dark-pref]').forEach(input=>{
      input.addEventListener('change',()=>{
        localStorage.setItem(DARK_KEY,input.checked?'1':'0');
        document.body.classList.toggle('theme-dark',input.checked);
        document.querySelectorAll('.theme-btn').forEach(t=>{t.checked=input.checked;t.classList.toggle('active',input.checked);});
      });
    });

    document.querySelectorAll('.theme-btn').forEach(toggle=>{
      toggle.addEventListener('click',()=>{
        setTimeout(()=>{
          const dark=document.body.classList.contains('theme-dark');
          localStorage.setItem(DARK_KEY,dark?'1':'0');
          renderThemeSettings();
        },0);
      });
    });
  });
})();
