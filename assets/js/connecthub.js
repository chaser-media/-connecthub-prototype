(function(){
  'use strict';

  const CREDIT_KEY='connecthubDemoCredits';
  const UNLOCK_KEY='connecthubUnlockedProfiles';
  const UPDATE_KEY='connecthubMyUpdate';

  const profiles={
    amina:{name:'Amina',age:26,location:'5 km away · Dar es Salaam',intent:'Serious relationship / meaningful connections',photo:'../assets/images/liked/pic2.png',chatPhoto:'../assets/images/user/pic1.jpg'},
    neema:{name:'Neema',age:25,location:'2 km away · Dar es Salaam',intent:'Going out, friendship and new connections',photo:'../assets/images/liked/pic3.png',chatPhoto:'../assets/images/user/pic2.jpg'},
    zawadi:{name:'Zawadi',age:27,location:'Zanzibar, Tanzania',intent:'Friendship and new connections',photo:'../assets/images/liked/pic4.png',chatPhoto:'../assets/images/user/pic3.jpg'},
    baraka:{name:'Baraka',age:29,location:'Arusha, Tanzania',intent:'Open to meaningful new connections',photo:'../assets/images/liked/pic5.png',chatPhoto:'../assets/images/user/pic4.jpg'},
    rehema:{name:'Rehema',age:28,location:'Dodoma, Tanzania',intent:'Serious relationship',photo:'../assets/images/liked/pic1.png',chatPhoto:'../assets/images/user/pic5.jpg'},
    juma:{name:'Juma',age:29,location:'Dar es Salaam, Tanzania',intent:'Going out and new connections',photo:'../assets/images/liked/pic6.png',chatPhoto:'../assets/images/user/pic2.jpg'},
    asha:{name:'Asha',age:24,location:'Moshi, Tanzania',intent:'Friendship',photo:'../assets/images/liked/pic4.png',chatPhoto:'../assets/images/user/pic6.jpg'},
    kelvin:{name:'Kelvin',age:30,location:'Dar es Salaam, Tanzania',intent:'Serious relationship',photo:'../assets/images/liked/pic5.png',chatPhoto:'../assets/images/user/pic7.jpg'},
    nadia:{name:'Nadia',age:26,location:'Zanzibar, Tanzania',intent:'New connections',photo:'../assets/images/liked/pic2.png',chatPhoto:'../assets/images/user/pic5.jpg'},
    musa:{name:'Musa',age:31,location:'Mwanza, Tanzania',intent:'Friendship and hangouts',photo:'../assets/images/liked/pic1.png',chatPhoto:'../assets/images/user/pic4.jpg'}
  };

  const qs=()=>new URLSearchParams(location.search);
  const getCredits=()=>Number(localStorage.getItem(CREDIT_KEY)||0);
  const setCredits=(n)=>{localStorage.setItem(CREDIT_KEY,String(Math.max(0,n)));renderCredits();};

  function getUnlocked(){
    try{
      const value=JSON.parse(localStorage.getItem(UNLOCK_KEY)||'[]');
      return Array.isArray(value)?value:[];
    }catch(e){ return []; }
  }
  function isUnlocked(id){ return !!id && getUnlocked().includes(id); }
  function unlockProfile(id){
    const list=getUnlocked();
    if(!list.includes(id)){ list.push(id); localStorage.setItem(UNLOCK_KEY,JSON.stringify(list)); }
  }
  function normalizeProfileId(name){
    const first=String(name||'').trim().split(/[ ,]/)[0].toLowerCase();
    return profiles[first]?first:first.replace(/[^a-z0-9_-]/g,'');
  }
  function renderCredits(){
    document.querySelectorAll('[data-credit-balance]').forEach(el=>el.textContent=getCredits());
  }
  function renderProfile(){
    if(!location.pathname.endsWith('profile-detail.html')) return;
    const id=qs().get('profile')||'amina';
    const p=profiles[id]||profiles.amina;
    const name=document.querySelector('[data-profile-name]');
    const photo=document.querySelector('[data-profile-photo]');
    const loc=document.querySelector('[data-profile-location]');
    const intent=document.querySelector('[data-profile-intent]');
    const unlock=document.querySelector('[data-unlock-conversation]');
    const privateBtn=document.querySelector('[data-private-photos]');
    if(name) name.textContent=p.name+', '+p.age;
    if(photo) photo.src=p.photo;
    if(loc) loc.innerHTML='<i class="icon feather icon-map-pin"></i> '+p.location;
    if(intent) intent.textContent=p.intent;
    if(unlock){
      unlock.dataset.profileId=id;
      if(isUnlocked(id)){
        unlock.textContent='Open Conversation';
        unlock.href='chat.html?profile='+encodeURIComponent(id);
      }else{
        unlock.textContent='Unlock Conversation · 1 Credit';
        unlock.href='#';
      }
    }
    if(privateBtn){
      if(isUnlocked(id)){
        privateBtn.disabled=false;
        privateBtn.textContent='Request Private Photo Access';
        privateBtn.addEventListener('click',function(){
          alert('Private photo access request sent. The member decides whether to share access.');
        },{once:true});
      }else{
        privateBtn.disabled=true;
        privateBtn.textContent='Unlock the connection first';
      }
    }
    if(qs().get('locked')) setTimeout(()=>alert('This conversation is locked. Use 1 Connection Credit to unlock it.'),150);
    if(qs().get('credits')==='added') setTimeout(()=>alert('Connection Credits added. You can now unlock this conversation.'),150);
  }

  function setupUnlock(){
    const unlock=document.querySelector('[data-unlock-conversation]');
    if(!unlock) return;
    unlock.addEventListener('click',function(e){
      const id=unlock.dataset.profileId||qs().get('profile')||'amina';
      if(isUnlocked(id)){
        e.preventDefault();
        location.href='chat.html?profile='+encodeURIComponent(id);
        return;
      }
      e.preventDefault();
      if(getCredits()<1){
        location.href='credits.html?need=1&profile='+encodeURIComponent(id);
        return;
      }
      if(!confirm('Use 1 Connection Credit to unlock this conversation? You will not pay again for this profile.')) return;
      setCredits(getCredits()-1);
      unlockProfile(id);
      location.href='chat.html?profile='+encodeURIComponent(id);
    });
  }

  function guardChat(){
    if(!location.pathname.endsWith('chat.html')) return true;
    const id=qs().get('profile');
    if(!id){ location.replace('chat-list.html'); return false; }
    if(!isUnlocked(id)){
      location.replace('profile-detail.html?profile='+encodeURIComponent(id)+'&locked=1');
      return false;
    }
    const p=profiles[id]||profiles.amina;
    const name=document.querySelector('[data-chat-name]');
    const photo=document.querySelector('[data-chat-photo]');
    if(name) name.textContent=p.name+', '+p.age;
    if(photo) photo.src=p.chatPhoto;
    return true;
  }

  function setupChatList(){
    if(!location.pathname.endsWith('chat-list.html')) return;

    document.querySelectorAll('.chat-swiper a.recent').forEach(link=>{
      const label=link.querySelector('span');
      const id=normalizeProfileId(label?label.textContent:'');
      link.href=isUnlocked(id)?'chat.html?profile='+encodeURIComponent(id):'profile-detail.html?profile='+encodeURIComponent(id);
      if(!isUnlocked(id)) link.title='Unlock this connection with 1 Connection Credit';
    });

    let visible=0;
    document.querySelectorAll('[data-conversation-list] > li').forEach(item=>{
      const name=item.querySelector('.name');
      const link=item.querySelector('a');
      const id=normalizeProfileId(name?name.textContent:'');
      if(isUnlocked(id)){
        visible++;
        if(link) link.href='chat.html?profile='+encodeURIComponent(id);
      }else{
        item.style.display='none';
      }
    });
    const empty=document.querySelector('[data-chat-empty]');
    if(empty) empty.style.display=visible===0?'block':'none';
  }

  function renderMyUpdate(){
    const host=document.querySelector('[data-my-update]');
    if(!host) return;
    let item=null;
    try{ item=JSON.parse(localStorage.getItem(UPDATE_KEY)||'null'); }catch(e){}
    if(!item || !item.text || !item.created || Date.now()-item.created>86400000){
      localStorage.removeItem(UPDATE_KEY);
      host.innerHTML='';
      return;
    }
    host.innerHTML='<div class="card style-3 mb-3"><div class="card-body"><div class="d-flex align-items-center mb-2"><h6 class="title mb-0">Your Update</h6><span class="badge badge-primary ms-auto">Live · 24h</span></div><p class="mb-2"></p><small>Visible in Updates</small></div></div>';
    const p=host.querySelector('p');
    if(p) p.textContent=item.text;
  }

  function setupUpdates(){
    const btn=document.querySelector('[data-post-update]');
    const input=document.querySelector('[data-update-text]');
    if(!btn || !input) return;
    renderMyUpdate();
    btn.addEventListener('click',function(){
      const text=input.value.trim();
      if(!text){ alert('Write a short update first.'); return; }
      localStorage.setItem(UPDATE_KEY,JSON.stringify({text:text,created:Date.now()}));
      input.value='';
      renderMyUpdate();
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    renderCredits();

    const p=qs();
    document.querySelectorAll('[data-plan-name]').forEach(el=>el.textContent=p.get('plan')||'Connection Credits');
    document.querySelectorAll('[data-plan-price]').forEach(el=>el.textContent=p.get('price')||'0');
    document.querySelectorAll('[data-plan-credits]').forEach(el=>el.textContent=p.get('credits')||'0');

    if(location.pathname.endsWith('credits.html') && p.get('profile')){
      document.querySelectorAll('a[href^="payment.html"]').forEach(link=>{
        const url=new URL(link.getAttribute('href'),location.href);
        url.searchParams.set('profile',p.get('profile'));
        link.setAttribute('href',url.pathname.split('/').pop()+'?'+url.searchParams.toString());
      });
      const back=document.querySelector('.back-btn');
      if(back) back.href='profile-detail.html?profile='+encodeURIComponent(p.get('profile'));
    }

    document.querySelectorAll('[data-demo-payment]').forEach(btn=>btn.addEventListener('click',()=>{
      const add=Number(p.get('credits')||btn.dataset.credits||0);
      setCredits(getCredits()+add);
      const profile=p.get('profile');
      location.href=profile
        ? 'profile-detail.html?profile='+encodeURIComponent(profile)+'&credits=added'
        : 'credits.html?success=1';
    }));

    renderProfile();
    setupUnlock();
    if(!guardChat()) return;
    setupChatList();
    setupUpdates();

    document.querySelectorAll('[data-demo-report]').forEach(btn=>btn.addEventListener('click',()=>{
      localStorage.setItem('connecthubReportSubmitted','1');
      alert('Demo report submitted. In production this will go to the moderation team.');
    }));

    document.querySelectorAll('[data-demo-block]').forEach(btn=>btn.addEventListener('click',()=>{
      const blocked=localStorage.getItem('connecthubBlocked')==='1';
      localStorage.setItem('connecthubBlocked',blocked?'0':'1');
      btn.textContent=blocked?'Block profile':'Unblock profile';
    }));

    if(location.pathname.endsWith('credits.html')){
      if(p.get('success')) setTimeout(()=>alert('Demo credits added successfully.'),200);
      if(p.get('need')) setTimeout(()=>alert('You need 1 Connection Credit to unlock this conversation.'),200);
    }
  });
})();