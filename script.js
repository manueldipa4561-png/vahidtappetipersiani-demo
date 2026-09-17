const PRODUCTS={
  'kars-d192':{id:'kars-d192',name:'Kars Sewan anatolico vecchia manifattura cod. D 192',short:'Kars Sewan anatolico',price:1700,code:'D 192',size:'190 × 141 cm',origin:'Anatolia',category:'Anatolici',image:'https://vahidtappetirari.it/wp-content/uploads/2020/12/whatsapp-image-2020-05-28-at-11.03.13-1_li-600x450.jpg',description:'Tappeto prodotto in Anatolia (Asia Minore), a pelo intrecciato, con fondo Bordeaux. Può essere utilizzato anche come rivestimento murale.'},
  'shirvan-d159':{id:'shirvan-d159',name:'Shirvan antico caucasico cod. D 159',short:'Shirvan antico caucasico',price:4500,code:'D 159',size:'Misure nella scheda originale',origin:'Caucaso',category:'Caucasici',image:'https://vahidtappetirari.it/wp-content/uploads/2020/12/inkedimg_20181018_092746_li-scaled-600x450.jpg',description:'Shirvan antico caucasico con fondo blu scuro, decorato con simbologie e tre medaglioni rossi e bianchi.'},
  'kilim-g017':{id:'kilim-g017',name:'Kilim Bakhtiari persiano antico cod. G017',short:'Kilim Bakhtiari persiano antico',price:1900,code:'G017',size:'Misure nella scheda originale',origin:'Persia',category:'Kilim',image:'https://vahidtappetirari.it/wp-content/uploads/2020/12/Progetto-senza-titolo-20-600x450.jpg',description:'Kilim Bakhtiari persiano antico: una tipologia di tappeto persiano selezionata dalla collezione Vahid.'},
  'kashkuli-d069':{id:'kashkuli-d069',name:'Kashkuli persiano vecchia manifattura cod. D069',short:'Kashkuli persiano',price:1950,code:'D069',size:'Misure nella scheda originale',origin:'Persia',category:'Persiani',image:'https://vahidtappetirari.it/wp-content/uploads/2020/12/dsc00812_li-scaled-600x450.jpg',description:'Kashkuli persiano di vecchia manifattura, fine e compatto, con fondo Bordeaux.'}
};

const CART_KEY='vahid-demo-cart-v3';
const RECENT_KEY='vahid-demo-recent-v1';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n||0);

function loadState(){
  try{
    const saved=JSON.parse(localStorage.getItem(CART_KEY)||'null');
    if(saved&&Array.isArray(saved.items)) return {...saved,shippingMethod:saved.shippingMethod||'italy',specialHandling:Boolean(saved.specialHandling)};
  }catch(e){}
  return {items:[],shippingMethod:'italy',specialHandling:false};
}
let state=loadState();
function persist(){localStorage.setItem(CART_KEY,JSON.stringify(state));}
function cartQty(){return state.items.reduce((n,i)=>n+i.qty,0);}
function subtotal(){return state.items.reduce((n,i)=>n+(PRODUCTS[i.id]?.price||0)*i.qty,0);}
function shippingCost(){
  if(!state.items.length)return 0;
  if(state.shippingMethod==='local')return 0;
  if(state.shippingMethod==='whiteglove')return 42;
  return 24+(state.specialHandling?18:0);
}
function shippingName(){
  if(state.shippingMethod==='local')return 'Ritiro / consegna area Pescara';
  if(state.shippingMethod==='whiteglove')return 'Consegna con cura speciale';
  return state.specialHandling?'Spedizione Italia + movimentazione speciale':'Spedizione Italia';
}
function total(){return subtotal()+shippingCost();}
function addItem(id){
  if(!PRODUCTS[id])return;
  const found=state.items.find(i=>i.id===id);
  if(found)found.qty+=1;else state.items.push({id,qty:1});
  persist();renderCart();openCart();rememberRecent(id);
}
function setQty(id,qty){
  const found=state.items.find(i=>i.id===id);if(!found)return;
  found.qty=Math.max(0,qty);state.items=state.items.filter(i=>i.qty>0);persist();renderCart();
}
function removeItem(id){state.items=state.items.filter(i=>i.id!==id);persist();renderCart();}

const cartDrawer=$('#cartDrawer'),backdrop=$('#backdrop'),cartCount=$('#cartCount'),cartEmpty=$('#cartEmpty'),cartContent=$('#cartContent'),cartItems=$('#cartItems'),cartSubtotal=$('#cartSubtotal'),cartShipping=$('#cartShipping'),cartTotal=$('#cartTotal'),checkoutModal=$('#checkoutModal'),payButton=$('#payButton');
function renderCart(){
  if(cartCount)cartCount.textContent=cartQty();
  const has=state.items.length>0;
  if(cartEmpty)cartEmpty.hidden=has;
  if(cartContent)cartContent.hidden=!has;
  if(!cartItems)return;
  if(!has){cartItems.innerHTML='';return;}
  cartItems.innerHTML=state.items.map(item=>{const p=PRODUCTS[item.id];if(!p)return'';return `<div class="cart-item" data-id="${p.id}"><img src="${p.image}" alt=""><div><h4>${p.short}</h4><small>Cod. ${p.code} · ${p.size}</small><div class="qty"><button data-action="decrease" aria-label="Diminuisci quantità">−</button><strong>${item.qty}</strong><button data-action="increase" aria-label="Aumenta quantità">+</button><button class="remove-item" data-action="remove">Rimuovi</button></div></div><strong>${money(p.price*item.qty)}</strong></div>`}).join('');
  if(cartSubtotal)cartSubtotal.textContent=money(subtotal());
  if(cartShipping)cartShipping.textContent=shippingCost()?money(shippingCost()):'Gratis';
  if(cartTotal)cartTotal.textContent=money(total());
  if(payButton)payButton.textContent=`Paga ${money(total())} · Simulazione`;
  const shippingSelect=$('#shippingMethod');if(shippingSelect)shippingSelect.value=state.shippingMethod;
  const special=$('#specialHandling');if(special)special.checked=state.specialHandling;
  const checkoutShipping=$('#checkoutShipping');if(checkoutShipping)checkoutShipping.value=state.shippingMethod;
  const checkoutSpecial=$('#checkoutSpecialHandling');if(checkoutSpecial)checkoutSpecial.checked=state.specialHandling;
  const checkoutTotal=$('#checkoutTotal');if(checkoutTotal)checkoutTotal.textContent=money(total());
  const checkoutShippingLabel=$('#checkoutShippingLabel');if(checkoutShippingLabel)checkoutShippingLabel.textContent=`${shippingName()} · ${shippingCost()?money(shippingCost()):'Gratis'}`;
}
function openCart(){if(!cartDrawer)return;renderCart();cartDrawer.classList.add('open');backdrop?.classList.add('show');cartDrawer.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
function closeCart(){cartDrawer?.classList.remove('open');backdrop?.classList.remove('show');cartDrawer?.setAttribute('aria-hidden','true');document.body.style.overflow='';}

$$('.add-to-cart').forEach(btn=>btn.addEventListener('click',()=>addItem(btn.dataset.productId||btn.closest('[data-product-id]')?.dataset.productId)));
$('#cartTrigger')?.addEventListener('click',openCart);
$('#closeCart')?.addEventListener('click',closeCart);
backdrop?.addEventListener('click',closeCart);
$('#continueShopping')?.addEventListener('click',closeCart);
cartItems?.addEventListener('click',e=>{const action=e.target.dataset.action;if(!action)return;const row=e.target.closest('.cart-item');if(!row)return;const id=row.dataset.id;const item=state.items.find(i=>i.id===id);if(!item)return;if(action==='increase')setQty(id,item.qty+1);if(action==='decrease')setQty(id,item.qty-1);if(action==='remove')removeItem(id);});
$('#shippingMethod')?.addEventListener('change',e=>{state.shippingMethod=e.target.value;persist();renderCart();});
$('#specialHandling')?.addEventListener('change',e=>{state.specialHandling=e.target.checked;persist();renderCart();});
$('#checkoutShipping')?.addEventListener('change',e=>{state.shippingMethod=e.target.value;persist();renderCart();});
$('#checkoutSpecialHandling')?.addEventListener('change',e=>{state.specialHandling=e.target.checked;persist();renderCart();});

$('#checkoutTrigger')?.addEventListener('click',()=>{if(!state.items.length)return;closeCart();renderCart();checkoutModal?.showModal();});
$('#closeCheckout')?.addEventListener('click',()=>checkoutModal?.close());
checkoutModal?.addEventListener('click',e=>{const r=checkoutModal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)checkoutModal.close();});
$('#checkoutForm')?.addEventListener('submit',e=>{e.preventDefault();$('#checkoutForm').parentElement.hidden=true;$('.checkout-summary-pane').hidden=true;$('#successState').hidden=false;state.items=[];persist();renderCart();});
$('#resetDemo')?.addEventListener('click',()=>{checkoutModal?.close();location.reload();});
$('#cardNumber')?.addEventListener('input',e=>{let v=e.target.value.replace(/\D/g,'').slice(0,16);e.target.value=v.replace(/(.{4})/g,'$1 ').trim();});

function rememberRecent(id){
  let recent=[];try{recent=JSON.parse(localStorage.getItem(RECENT_KEY)||'[]')}catch(e){}
  recent=[id,...recent.filter(x=>x!==id)].slice(0,4);localStorage.setItem(RECENT_KEY,JSON.stringify(recent));renderRecent();
}
function renderRecent(){
  const wrap=$('#recentProducts');if(!wrap)return;
  let ids=[];try{ids=JSON.parse(localStorage.getItem(RECENT_KEY)||'[]')}catch(e){}
  if(!ids.length)ids=['kars-d192','shirvan-d159'];
  wrap.innerHTML=ids.filter(id=>PRODUCTS[id]).map(id=>{const p=PRODUCTS[id];return `<article class="recent-card"><img src="${p.image}" alt="${p.short}" loading="lazy"><div><span>${p.category}</span><h3>${p.short}</h3><strong>${money(p.price)}</strong><button class="text-button quick-view" data-product-id="${p.id}">Vista rapida</button></div></article>`}).join('');
  $$('#recentProducts .quick-view').forEach(b=>b.addEventListener('click',()=>openQuickView(b.dataset.productId)));
}

const quickModal=$('#quickViewModal');
function openQuickView(id){
  const p=PRODUCTS[id];if(!p||!quickModal)return;rememberRecent(id);
  $('#quickImage').src=p.image;$('#quickImage').alt=p.short;$('#quickCategory').textContent=`${p.category} · ${p.origin}`;$('#quickTitle').textContent=p.name;$('#quickMeta').textContent=`Cod. ${p.code} · ${p.size}`;$('#quickDescription').textContent=p.description;$('#quickPrice').textContent=money(p.price);const add=$('#quickAdd');add.dataset.productId=id;quickModal.showModal();
}
$$('.quick-view').forEach(btn=>btn.addEventListener('click',()=>openQuickView(btn.dataset.productId)));
$('#quickClose')?.addEventListener('click',()=>quickModal?.close());
$('#quickAdd')?.addEventListener('click',e=>{quickModal?.close();addItem(e.currentTarget.dataset.productId);});
quickModal?.addEventListener('click',e=>{const r=quickModal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)quickModal.close();});

function setupShopFilters(){
  const grid=$('#productGrid');if(!grid)return;
  const search=$('#shopSearch'),origin=$('#originFilter'),sort=$('#sortSelect');let category='all';
  function apply(){
    const q=(search?.value||'').trim().toLowerCase();const ori=origin?.value||'all';
    let cards=$$('#productGrid .shop-card');
    cards.forEach(card=>{const text=card.textContent.toLowerCase();const cat=card.dataset.category;const org=card.dataset.origin;card.hidden=!( (!q||text.includes(q)) && (category==='all'||cat===category) && (ori==='all'||org===ori) );});
    const visible=cards.filter(c=>!c.hidden);const mode=sort?.value||'featured';
    if(mode==='price-asc')visible.sort((a,b)=>+a.dataset.price-+b.dataset.price);
    if(mode==='price-desc')visible.sort((a,b)=>+b.dataset.price-+a.dataset.price);
    if(mode==='name')visible.sort((a,b)=>a.dataset.name.localeCompare(b.dataset.name,'it'));
    visible.forEach(c=>grid.appendChild(c));
    const count=$('#resultCount');if(count)count.textContent=`${visible.length} pezzi in selezione`;
  }
  $$('.category-chip').forEach(chip=>chip.addEventListener('click',()=>{$$('.category-chip').forEach(c=>c.classList.remove('active'));chip.classList.add('active');category=chip.dataset.category;apply();}));
  search?.addEventListener('input',apply);origin?.addEventListener('change',apply);sort?.addEventListener('change',apply);apply();
}

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.1});
$$('.reveal').forEach(el=>observer.observe(el));
$('#menuTrigger')?.addEventListener('click',()=>$('.site-header')?.classList.toggle('menu-open'));
$$('.nav a').forEach(a=>a.addEventListener('click',()=>$('.site-header')?.classList.remove('menu-open')));

renderCart();renderRecent();setupShopFilters();