// ── AGROVERSE SHARED NAV + UTILS ──

const API_BASE = 'http://localhost:5000/api';

const TICKER_ITEMS = [
  '🍅 Tomato ₹42/kg ▲10%','🧅 Onion ₹28/kg ▼12%','🥔 Potato ₹22/kg ▲10%',
  '🌾 Wheat ₹2100/qtl ▲2%','🥭 Mango ₹280/dz ▲12%','🌽 Maize ₹1850/qtl ▼2%',
  '🌾 Jowar ₹2350/qtl ▲7%','🍇 Grapes ₹65/kg ▼7%','🌶️ Chilli ₹9500/qtl ▲6%',
  '🧄 Garlic ₹80/kg ▲7%','🟡 Turmeric ₹7200/qtl ▲6%','🍎 Pomegranate ₹90/kg ▲6%'
];

async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
}

function buildNav(activePage) {
  const user = JSON.parse(localStorage.getItem('av_user') || 'null');
  const navPages = [
    { id:'home', label:'Home', href:'index.html' },
    { id:'shop', label:'Shop', href:'shop.html' },
    { id:'weather', label:'Weather', href:'weather.html' },
    { id:'market', label:'Market Prices', href:'market.html' },
    { id:'sell', label:'Sell/Dashboard', href:'farmer-dashboard.html' },
  ];
  return `
  <nav class="navbar">
    <a class="nav-logo" href="index.html">
      <div class="logo-icon">🌾</div>
      <span class="nav-logo-text">Agro<em>verse</em></span>
    </a>
    <ul class="nav-links">
      ${navPages.map(p=>`<li><a href="${p.href}" class="${p.id===activePage?'active':''}">${p.label}</a></li>`).join('')}
    </ul>
    <div class="nav-right">
      <div class="nav-search">
        <span>🔍</span>
        <input type="text" placeholder="Search seeds, fertilizers…" onkeydown="if(event.key==='Enter')window.location.href='shop.html'"/>
      </div>
      <button class="btn btn-ghost" onclick="location.href='checkout.html'">🛒 Cart <span id="cartCount" style="background:var(--red);color:#fff;border-radius:9px;padding:1px 6px;font-size:10px;margin-left:2px">0</span></button>
      ${user
        ? `<a href="${user.role==='farmer'?'farmer-dashboard.html':'customer-dashboard.html'}" class="btn btn-primary">👤 ${user.name.split(' ')[0]}</a>
           <button class="btn btn-ghost" onclick="logout()">Logout</button>`
        : `<a href="login.html" class="btn btn-ghost">Login</a><a href="login.html?tab=register" class="btn btn-primary">Sign Up</a>`
      }
    </div>
  </nav>
  <div class="ticker">
    <div class="ticker-inner">${[...TICKER_ITEMS,...TICKER_ITEMS].map(t=>`<span class="ticker-item">${t}</span>`).join('')}</div>
  </div>`;
}

function logout() {
  localStorage.removeItem('av_user');
  location.href = 'index.html';
}

function injectNav(activePage) {
  const wrap = document.getElementById('nav-root');
  if(wrap) wrap.innerHTML = buildNav(activePage);
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('av_cart') || '[]');
  const el = document.getElementById('cartCount');
  if (el) el.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

// Toast notification
function toast(msg, type='info') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:28px;right:28px;background:${type==='success'?'#1A7A48':type==='error'?'#c0392b':'#1A3A2A'};color:#fff;padding:12px 22px;border-radius:12px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 8px 28px rgba(0,0,0,.3);transform:translateY(20px);opacity:0;transition:all .3s`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.transform='translateY(0)'; t.style.opacity='1'; },10);
  setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=>t.remove(),300); },3000);
}

// Format currency
function rupee(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
