
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
