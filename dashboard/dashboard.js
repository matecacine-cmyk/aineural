// ─── AiNeural Dashboard ───────────────────────────────────────────────────────

// ─── Auth ──────────────────────────────────────────────────────────────────────
const PASS_HASH = '7d6c3a2f9e1b4c8a'; // aineural@2025
const Auth = {
  _hash(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    }
    return Math.abs(h).toString(16).padStart(16, '0').slice(0, 16);
  },
  check() {
    return sessionStorage.getItem('an_auth') === '1';
  },
  login() {
    const pass = document.getElementById('login-pass').value;
    const err = document.getElementById('login-error');
    if (pass === 'aineural@2025') {
      sessionStorage.setItem('an_auth', '1');
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('sidebar').classList.remove('hidden');
      document.getElementById('main-wrap').classList.remove('hidden');
      Pages.overview();
    } else {
      err.textContent = 'Password incorreta';
      document.getElementById('login-pass').value = '';
      setTimeout(() => { err.textContent = ''; }, 3000);
    }
  },
};


const DATA = {
  period: 30,

  projects: [
    {
      id: 'emergent',
      name: 'Emergent',
      domain: 'emergent.fit',
      icon: '🎬',
      color: 'linear-gradient(135deg,#8B5CF6,#EC4899)',
      status: 'live',
      users: 0,
      sessions: 0,
      pageviews: 0,
      bounceRate: 0,
      avgSession: '—',
      revenue: { total: 0, ads: 0, kofi: 0, amazon: 0 },
      monthly: Array(30).fill(0),
      revenueMonthly: Array(30).fill(0),
      // Monetização disponível
      monetization: [
        { name: 'Google AdSense', status: 'pendente', icon: '📢', desc: 'Submete o site para aprovação em adsense.google.com' },
        { name: 'Amazon Associates', status: 'pendente', icon: '📦', desc: 'Adiciona links de afiliado (ID: emergent0de-20)' },
        { name: 'Ko-fi', status: 'ativo', icon: '☕', desc: 'ko-fi.com/emergent — já integrado no site' },
      ],
    },
    {
      id: 'roniai',
      name: 'Roniai',
      domain: 'roniai.online',
      icon: '🌐',
      color: 'linear-gradient(135deg,#6366F1,#06B6D4)',
      status: 'live',
      users: 0,
      sessions: 0,
      pageviews: 0,
      bounceRate: 0,
      avgSession: '—',
      revenue: { total: 0, ads: 0, namecheap: 0 },
      monthly: Array(30).fill(0),
      revenueMonthly: Array(30).fill(0),
      monetization: [
        { name: 'Namecheap Afiliado', status: 'pendente', icon: '🌐', desc: 'Aguarda aprovação Impact — substitui AFFILIATE_ID no código' },
        { name: 'Google AdSense', status: 'pendente', icon: '📢', desc: 'Submete roniai.online ao AdSense' },
      ],
    },
    {
      id: 'buildai',
      name: 'BuildAI',
      domain: 'buildai.fit',
      icon: '🏗️',
      color: 'linear-gradient(135deg,#16a34a,#eab308)',
      status: 'live',
      users: 0,
      sessions: 0,
      pageviews: 0,
      bounceRate: 0,
      avgSession: '—',
      revenue: { total: 0, subscriptions: 0, pro: 0, business: 0 },
      monthly: Array(30).fill(0),
      revenueMonthly: Array(30).fill(0),
      monetization: [
        { name: 'Subscrições Pro (€9,99/mês)', status: 'ativo', icon: '💳', desc: 'Sistema de planos já implementado' },
        { name: 'Subscrições Business (€24,99/mês)', status: 'ativo', icon: '💳', desc: 'Sistema de planos já implementado' },
        { name: 'Stripe / Pagamentos', status: 'pendente', icon: '💰', desc: 'Integra Stripe para aceitar pagamentos reais' },
      ],
    },
  ],

  affiliates: [
    { name: 'Namecheap', icon: '🌐', platform: 'Impact', earned: 0, clicks: 0, conversions: 0, rate: 0, color: '#06B6D4', status: 'pendente' },
    { name: 'Amazon', icon: '📦', platform: 'Associates', earned: 0, clicks: 0, conversions: 0, rate: 0, color: '#F59E0B', status: 'pendente' },
    { name: 'Ko-fi', icon: '☕', platform: 'Ko-fi', earned: 0, clicks: 0, conversions: 0, rate: 0, color: '#FF5E5B', status: 'ativo' },
  ],

  adNetworks: [
    { name: 'Google AdSense', icon: '📢', site: 'Emergent', rpm: 0, impressions: 0, earned: 0, status: 'pendente' },
    { name: 'Google AdSense', icon: '📢', site: 'Roniai', rpm: 0, impressions: 0, earned: 0, status: 'pendente' },
  ],

  // Objetivos mensais
  goals: {
    revenue: 100,      // €100/mês — primeiro objetivo
    users: 500,
    sessions: 2000,
  },
};

// ─── Totals ──────────────────────────────────────────────────────────────────
DATA.totals = {
  users: DATA.projects.reduce((s, p) => s + p.users, 0),
  sessions: DATA.projects.reduce((s, p) => s + p.sessions, 0),
  pageviews: DATA.projects.reduce((s, p) => s + p.pageviews, 0),
  revenue: DATA.projects.reduce((s, p) => s + p.revenue.total, 0),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = {
  currency: v => '€' + v.toFixed(2).replace('.', ','),
  num: v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(v),
  pct: v => v + '%',
};

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

// ─── Routing ──────────────────────────────────────────────────────────────────
function initDashboard() {
  document.getElementById('date-badge').textContent = new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const page = item.dataset.page;
      document.getElementById('page-title').textContent = {
        overview: 'Visão Geral', revenue: 'Receita', projects: 'Projetos',
        traffic: 'Tráfego', affiliate: 'Afiliados',
      }[page];
      Pages[page]();
      document.getElementById('sidebar').classList.remove('open');
    });
  });

  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      DATA.period = parseInt(btn.dataset.period);
      const activePage = document.querySelector('.nav-item.active').dataset.page;
      Pages[activePage]();
    });
  });

  Pages.overview();
}

// Update Auth.login to call initDashboard
Auth.login = function() {
  const pass = document.getElementById('login-pass').value;
  const err = document.getElementById('login-error');
  if (pass === 'aineural@2025') {
    sessionStorage.setItem('an_auth', '1');
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('sidebar').classList.remove('hidden');
    document.getElementById('main-wrap').classList.remove('hidden');
    initDashboard();
  } else {
    err.textContent = 'Password incorreta';
    document.getElementById('login-pass').value = '';
    setTimeout(() => { err.textContent = ''; }, 3000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (Auth.check()) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('sidebar').classList.remove('hidden');
    document.getElementById('main-wrap').classList.remove('hidden');
    initDashboard();
  }
});

// ─── Chart Helpers ───────────────────────────────────────────────────────────

function drawLineChart(canvas, datasets, labels, opts = {}) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = (opts.height || 200) * dpr;
  canvas.style.height = (opts.height || 200) + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const W = rect.width, H = opts.height || 200;
  const PAD = { top: 16, right: 16, bottom: 32, left: opts.noYAxis ? 8 : 48 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;

  const allVals = datasets.flatMap(d => d.data);
  const maxV = Math.max(...allVals) * 1.1 || 1;
  const minV = 0;

  const xStep = cW / (labels.length - 1);

  // Grid lines
  if (!opts.noGrid) {
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = PAD.top + cH - (i / 4) * cH;
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + cW, y); ctx.stroke();
      if (!opts.noYAxis) {
        ctx.fillStyle = 'rgba(148,163,184,0.5)';
        ctx.font = '10px Helvetica Neue, Arial';
        ctx.textAlign = 'right';
        const val = minV + (maxV / 4) * i;
        ctx.fillText(opts.currency ? '€' + val.toFixed(0) : Math.round(val), PAD.left - 6, y + 4);
      }
    }
  }

  datasets.forEach(dataset => {
    const points = dataset.data.map((v, i) => ({
      x: PAD.left + i * xStep,
      y: PAD.top + cH - ((v - minV) / (maxV - minV)) * cH,
    }));

    // Area fill
    const grd = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + cH);
    grd.addColorStop(0, dataset.color + '30');
    grd.addColorStop(1, dataset.color + '00');
    ctx.beginPath();
    ctx.moveTo(points[0].x, PAD.top + cH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, PAD.top + cH);
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();

    // Line
    ctx.beginPath();
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = dataset.color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Last dot
    const last = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = dataset.color;
    ctx.fill();
    ctx.strokeStyle = '#0a0a0f';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // X labels
  if (labels && !opts.noXLabels) {
    ctx.fillStyle = 'rgba(148,163,184,0.6)';
    ctx.font = '10px Helvetica Neue, Arial';
    ctx.textAlign = 'center';
    const step = Math.max(1, Math.floor(labels.length / 6));
    labels.forEach((l, i) => {
      if (i % step === 0 || i === labels.length - 1) {
        ctx.fillText(l, PAD.left + i * xStep, H - PAD.bottom + 16);
      }
    });
  }
}

function drawBarChart(canvas, data, labels, colors, opts = {}) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = (opts.height || 200) * dpr;
  canvas.style.height = (opts.height || 200) + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const W = rect.width, H = opts.height || 200;
  const PAD = { top: 16, right: 16, bottom: 32, left: 48 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;
  const maxV = Math.max(...data) * 1.1 || 1;
  const barW = (cW / data.length) * 0.6;
  const barGap = cW / data.length;

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  for (let i = 0; i <= 4; i++) {
    const y = PAD.top + cH - (i / 4) * cH;
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + cW, y); ctx.stroke();
    ctx.fillStyle = 'rgba(148,163,184,0.5)';
    ctx.font = '10px Helvetica Neue, Arial'; ctx.textAlign = 'right';
    const val = (maxV / 4) * i;
    ctx.fillText(opts.currency ? '€' + val.toFixed(0) : Math.round(val), PAD.left - 6, y + 4);
  }

  data.forEach((v, i) => {
    const x = PAD.left + i * barGap + (barGap - barW) / 2;
    const bH = (v / maxV) * cH;
    const y = PAD.top + cH - bH;
    const grd = ctx.createLinearGradient(x, y, x + barW, y + bH);
    const c = Array.isArray(colors) ? colors[i % colors.length] : colors;
    grd.addColorStop(0, c + 'ff');
    grd.addColorStop(1, c + '88');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, bH, [4, 4, 0, 0]);
    ctx.fill();
    if (labels) {
      ctx.fillStyle = 'rgba(148,163,184,0.6)';
      ctx.font = '10px Helvetica Neue, Arial'; ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barW / 2, H - PAD.bottom + 16);
    }
  });
}

function drawDonut(canvas, segments, opts = {}) {
  const dpr = window.devicePixelRatio || 1;
  const size = opts.size || 150;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const cx = size / 2, cy = size / 2, r = size / 2 - 8, inner = r * 0.6;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let angle = -Math.PI / 2;

  segments.forEach(seg => {
    const sweep = (seg.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    angle += sweep;
  });

  // Center hole
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = opts.bg || '#0f0f1a';
  ctx.fill();

  // Center text
  if (opts.centerText) {
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${opts.centerSize || 14}px Helvetica Neue`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(opts.centerText, cx, cy - 6);
    ctx.font = `400 10px Helvetica Neue`;
    ctx.fillStyle = 'rgba(148,163,184,0.7)';
    ctx.fillText(opts.centerSub || '', cx, cy + 10);
  }
}

// ─── Day labels ────────────────────────────────────────────────────────────────
function getDayLabels(n) {
  const labels = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.getDate() + '/' + (d.getMonth() + 1));
  }
  return labels;
}

function getMonthLabels(n) {
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const labels = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    labels.push(months[d.getMonth()]);
  }
  return labels;
}

function sliceData(arr, n) {
  return arr.slice(-n);
}

// ─── Pages ─────────────────────────────────────────────────────────────────────
const Pages = {};

// ─────────────────────────────────────────────────────────────────────────────
// OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────
Pages.overview = function() {
  const main = document.getElementById('dash-main');
  main.innerHTML = '';

  // ── Welcome banner ────────────────────────────────────────────────────────
  main.innerHTML += `
    <div class="welcome-banner">
      <div class="welcome-left">
        <div class="welcome-title">Bem-vindo ao teu ecossistema 👋</div>
        <div class="welcome-sub">3 projetos ativos. Os dados vão aparecer aqui assim que tiveres tráfego e monetização configurada.</div>
      </div>
      <div class="welcome-right">
        <div class="welcome-stat"><strong>3</strong><span>Projetos</span></div>
        <div class="welcome-stat"><strong>9</strong><span>Domínios</span></div>
        <div class="welcome-stat"><strong>2025</strong><span>Fundado</span></div>
      </div>
    </div>`;

  // ── KPI cards com objetivos ───────────────────────────────────────────────
  const kpiGrid = el('div', 'kpi-grid');
  const revPct = DATA.totals.revenue > 0 ? Math.min(100, Math.round((DATA.totals.revenue / DATA.goals.revenue) * 100)) : 0;
  const usersPct = DATA.totals.users > 0 ? Math.min(100, Math.round((DATA.totals.users / DATA.goals.users) * 100)) : 0;
  [
    { label: 'Receita Este Mês', value: fmt.currency(DATA.totals.revenue), sub: `Objetivo: ${fmt.currency(DATA.goals.revenue)}`, pct: revPct, icon: '💶' },
    { label: 'Utilizadores', value: fmt.num(DATA.totals.users), sub: `Objetivo: ${fmt.num(DATA.goals.users)}`, pct: usersPct, icon: '👥' },
    { label: 'Sessões', value: fmt.num(DATA.totals.sessions), sub: `Objetivo: ${fmt.num(DATA.goals.sessions)}`, pct: Math.min(100, Math.round((DATA.totals.sessions/DATA.goals.sessions)*100)), icon: '🖥️' },
    { label: 'Projetos Ativos', value: '3', sub: 'Emergent · Roniai · BuildAI', pct: null, icon: '🚀' },
  ].forEach(k => {
    kpiGrid.innerHTML += `
      <div class="kpi-card">
        <div class="kpi-icon">${k.icon}</div>
        <div class="kpi-label">${k.label}</div>
        <div class="kpi-value">${k.value}</div>
        ${k.pct !== null ? `
          <div style="margin:8px 0 4px">
            <div class="progress-bar"><div class="progress-fill" style="width:${k.pct}%"></div></div>
          </div>` : ''}
        <div class="kpi-sub">${k.sub}</div>
      </div>`;
  });
  main.appendChild(kpiGrid);

  // ── Próximos passos checklist ─────────────────────────────────────────────
  const checkCard = el('div', 'table-card');
  checkCard.innerHTML = `
    <div class="table-card-header">
      <h3>Próximos Passos para Monetizar</h3>
      <span class="table-tag">Checklist</span>
    </div>
    <div class="checklist">
      ${[
        { done: true,  icon: '✅', text: 'Emergent lançado', sub: 'emergent.fit está online' },
        { done: true,  icon: '✅', text: 'Roniai lançado', sub: 'roniai.online está online' },
        { done: true,  icon: '✅', text: 'BuildAI lançado', sub: 'buildai.fit está online com planos pagos' },
        { done: true,  icon: '✅', text: 'Ko-fi integrado', sub: 'ko-fi.com/emergent — botão no site' },
        { done: false, icon: '⬜', text: 'Submeter ao Google AdSense', sub: 'adsense.google.com → Adicionar site → emergent.fit', link: 'https://adsense.google.com' },
        { done: false, icon: '⬜', text: 'Aguardar aprovação Namecheap (Impact)', sub: 'Depois de aprovado, substitui AFFILIATE_ID no código do Roniai', link: null },
        { done: false, icon: '⬜', text: 'Integrar Stripe no BuildAI', sub: 'Para aceitar pagamentos reais dos planos Pro e Business', link: 'https://stripe.com' },
        { done: false, icon: '⬜', text: 'Adicionar Google Analytics', sub: 'Instala GA4 nos 3 sites para tracking real', link: 'https://analytics.google.com' },
        { done: false, icon: '⬜', text: 'Criar conteúdo para SEO', sub: 'Artigos sobre streaming, domínios e construção para atrair tráfego orgânico', link: null },
        { done: false, icon: '⬜', text: 'Partilhar os projetos nas redes sociais', sub: 'Twitter/X, Reddit (r/portugal, r/webdev), grupos de Facebook', link: null },
      ].map(item => `
        <div class="checklist-item ${item.done ? 'done' : ''}">
          <span class="checklist-icon">${item.icon}</span>
          <div class="checklist-body">
            <strong>${item.text}</strong>
            <span>${item.sub}</span>
          </div>
          ${item.link ? `<a href="${item.link}" target="_blank" class="checklist-link">Abrir →</a>` : ''}
        </div>`).join('')}
    </div>`;
  main.appendChild(checkCard);

  // ── Projetos com estado de monetização ───────────────────────────────────
  const row2 = el('div', 'charts-row2');
  DATA.projects.forEach(p => {
    const c = el('div', 'chart-card');
    const doneCount = p.monetization.filter(m => m.status === 'ativo').length;
    c.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <div style="width:36px;height:36px;border-radius:10px;background:${p.color};display:flex;align-items:center;justify-content:center;font-size:1.1rem">${p.icon}</div>
        <div style="flex:1">
          <strong style="display:block">${p.name}</strong>
          <span style="font-size:0.72rem;color:var(--text3)">${p.domain}</span>
        </div>
        <span style="font-size:0.75rem;color:var(--text2)">${doneCount}/${p.monetization.length} ativo</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${p.monetization.map(m => `
          <div style="display:flex;align-items:center;gap:8px;font-size:0.8rem">
            <span>${m.icon}</span>
            <div style="flex:1">
              <div style="font-weight:600">${m.name}</div>
              <div style="font-size:0.72rem;color:var(--text3)">${m.desc}</div>
            </div>
            <span class="badge ${m.status === 'ativo' ? 'badge-live' : 'badge-soon'}">${m.status === 'ativo' ? 'Ativo' : 'Pendente'}</span>
          </div>`).join('')}
      </div>`;
    row2.appendChild(c);
  });
  main.appendChild(row2);

  // ── Gráfico receita (vazio por agora) ─────────────────────────────────────
  const chartRow = el('div', 'charts-row');
  const lineCard = el('div', 'chart-card');
  lineCard.innerHTML = `<div class="chart-title">Receita — Histórico</div><div class="chart-subtitle">Dados reais aparecem aqui assim que configurares monetização</div>`;
  const lineCanvas = document.createElement('canvas');
  lineCanvas.className = 'chart';
  lineCard.appendChild(lineCanvas);
  chartRow.appendChild(lineCard);

  const tipCard = el('div', 'chart-card');
  tipCard.innerHTML = `
    <div class="chart-title">Potencial de Receita</div>
    <div class="chart-subtitle">Estimativa com 1.000 utilizadores/mês</div>
    <div style="display:flex;flex-direction:column;gap:12px;margin-top:12px">
      ${[
        { name: 'AdSense (Emergent)', est: '€15–€40/mês', icon: '📢', color: '#818CF8' },
        { name: 'Namecheap (Roniai)', est: '€20–€60/mês', icon: '🌐', color: '#06B6D4' },
        { name: 'BuildAI Pro subs', est: '€50–€200/mês', icon: '💳', color: '#10B981' },
        { name: 'Ko-fi (Emergent)', est: '€5–€30/mês', icon: '☕', color: '#FF5E5B' },
        { name: 'Amazon (Emergent)', est: '€10–€25/mês', icon: '📦', color: '#F59E0B' },
      ].map(r => `
        <div style="display:flex;align-items:center;gap:10px;font-size:0.82rem">
          <span>${r.icon}</span>
          <div style="flex:1;color:var(--text2)">${r.name}</div>
          <strong style="color:${r.color}">${r.est}</strong>
        </div>`).join('')}
      <div style="border-top:1px solid var(--border);padding-top:10px;display:flex;justify-content:space-between;font-size:0.85rem">
        <strong>Total estimado</strong>
        <strong style="background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">€100–€355/mês</strong>
      </div>
    </div>`;
  chartRow.appendChild(tipCard);
  main.appendChild(chartRow);

  setTimeout(() => {
    drawLineChart(lineCanvas, DATA.projects.map((p, i) => ({
      data: sliceData(p.revenueMonthly, DATA.period),
      color: ['#818CF8','#22D3EE','#10B981'][i],
    })), getDayLabels(DATA.period), { height: 220, currency: true });
  }, 60);
};

// ─────────────────────────────────────────────────────────────────────────────
// REVENUE
// ─────────────────────────────────────────────────────────────────────────────
Pages.revenue = function() {
  const main = document.getElementById('dash-main');
  main.innerHTML = '';
  const n = DATA.period;

  // KPI row
  const kpiGrid = el('div', 'kpi-grid');
  const totalRev = DATA.totals.revenue;
  const totalAds = DATA.projects.reduce((s, p) => s + (p.revenue.ads || 0), 0);
  const totalAff = DATA.affiliates.reduce((s, a) => s + a.earned, 0);
  const totalSubs = DATA.projects.reduce((s, p) => s + (p.revenue.subscriptions || 0), 0);
  [
    { label: 'Receita Total', value: fmt.currency(totalRev), sub: 'Objetivo: €100/mês', icon: '💶' },
    { label: 'Anúncios', value: fmt.currency(totalAds), sub: 'AdSense pendente', icon: '📢' },
    { label: 'Afiliados', value: fmt.currency(totalAff), sub: 'Namecheap pendente', icon: '🔗' },
    { label: 'Subscrições', value: fmt.currency(totalSubs), sub: 'BuildAI planos pagos', icon: '💳' },
  ].forEach(k => {
    kpiGrid.innerHTML += `<div class="kpi-card"><div class="kpi-icon">${k.icon}</div><div class="kpi-label">${k.label}</div><div class="kpi-value">${k.value}</div><div class="kpi-sub" style="margin-top:6px">${k.sub}</div></div>`;
  });
  main.appendChild(kpiGrid);

  // Revenue breakdown bar chart
  const row1 = el('div', 'charts-row');
  const barCard = el('div', 'chart-card');
  barCard.innerHTML = `<div class="chart-title">Receita Diária</div><div class="chart-subtitle">Total acumulado — últimos ${n} dias</div>`;
  const barCanvas = document.createElement('canvas');
  barCanvas.className = 'chart';
  barCard.appendChild(barCanvas);
  row1.appendChild(barCard);

  // Revenue by source donut
  const donutCard = el('div', 'chart-card');
  donutCard.innerHTML = `<div class="chart-title">Fontes de Receita</div><div class="chart-subtitle">Distribuição detalhada</div><div style="display:flex;justify-content:center;margin:12px 0"><canvas id="rev-donut"></canvas></div>`;
  const revSegs = [
    { label: 'AdSense', value: totalAds, color: '#818CF8' },
    { label: 'Namecheap', value: 58.80, color: '#06B6D4' },
    { label: 'Ko-fi', value: 47.00, color: '#FF5E5B' },
    { label: 'Amazon', value: 38.20, color: '#F59E0B' },
    { label: 'Subscrições', value: totalSubs, color: '#10B981' },
  ];
  donutCard.innerHTML += `<div class="donut-legend">${revSegs.map(s => `<div class="donut-legend-item"><div class="donut-legend-label"><div class="donut-dot" style="background:${s.color}"></div>${s.label}</div><div class="donut-legend-val">${fmt.currency(s.value)}</div></div>`).join('')}</div>`;
  row1.appendChild(donutCard);
  main.appendChild(row1);

  // Per-project revenue breakdown
  const row2 = el('div', 'charts-row2');
  DATA.projects.forEach(p => {
    const c = el('div', 'chart-card');
    const sources = Object.entries(p.revenue).filter(([k]) => k !== 'total');
    c.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
        <div style="width:28px;height:28px;border-radius:7px;background:${p.color};display:flex;align-items:center;justify-content:center">${p.icon}</div>
        <strong>${p.name}</strong>
        <span style="margin-left:auto;font-size:1.1rem;font-weight:900;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${fmt.currency(p.revenue.total)}</span>
      </div>
      ${sources.map(([k, v]) => {
        const labels = { ads: 'Anúncios', kofi: 'Ko-fi', amazon: 'Amazon', namecheap: 'Namecheap', subscriptions: 'Subscrições', pro: '  └ Plano Pro', business: '  └ Plano Business' };
        const pct = p.revenue.total > 0 ? Math.round((v / p.revenue.total) * 100) : 0;
        if (v === 0) return '';
        return `<div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:4px">
            <span style="color:var(--text2)">${labels[k] || k}</span>
            <span style="font-weight:700">${fmt.currency(v)} <span style="color:var(--text3);font-weight:400">${pct}%</span></span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        </div>`;
      }).join('')}`;
    row2.appendChild(c);
  });
  main.appendChild(row2);

  // Ad networks table
  const adCard = el('div', 'table-card');
  adCard.innerHTML = `
    <div class="table-card-header"><h3>Redes de Anúncios</h3><span class="table-tag">Ads</span></div>
    <table class="data-table">
      <thead><tr><th>Rede</th><th>Site</th><th>Impressões</th><th>RPM</th><th>Ganhos</th></tr></thead>
      <tbody>
        ${DATA.adNetworks.map(a => `<tr>
          <td><div class="project-cell"><div class="project-dot" style="background:var(--bg4)">${a.icon}</div><div><strong>${a.name}</strong></div></div></td>
          <td>${a.site}</td>
          <td>${fmt.num(a.impressions)}</td>
          <td>€${a.rpm.toFixed(2)}</td>
          <td><strong>${fmt.currency(a.earned)}</strong></td>
        </tr>`).join('')}
        <tr style="background:var(--bg3)">
          <td colspan="4"><strong>Total</strong></td>
          <td><strong>${fmt.currency(totalAds)}</strong></td>
        </tr>
      </tbody>
    </table>`;
  main.appendChild(adCard);

  setTimeout(() => {
    // Combine all project revenue for bar
    const combined = Array(n).fill(0);
    DATA.projects.forEach(p => {
      sliceData(p.revenueMonthly, n).forEach((v, i) => { combined[i] += v; });
    });
    drawBarChart(barCanvas, combined, getDayLabels(n), '#818CF8', { height: 220, currency: true });
    const dc = document.getElementById('rev-donut');
    if (dc) drawDonut(dc, revSegs, { size: 150, bg: '#0f0f1a', centerText: fmt.currency(totalRev), centerSub: 'total' });
  }, 60);
};

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────────────────────
Pages.projects = function() {
  const main = document.getElementById('dash-main');
  main.innerHTML = '';
  const n = DATA.period;

  DATA.projects.forEach(p => {
    const section = el('div', 'admin-section');

    // Project header
    section.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div style="width:44px;height:44px;border-radius:12px;background:${p.color};display:flex;align-items:center;justify-content:center;font-size:1.4rem">${p.icon}</div>
        <div>
          <h2 style="font-size:1.1rem;font-weight:800;color:var(--text);margin:0">${p.name}</h2>
          <span style="font-size:0.78rem;color:var(--text3)">${p.domain}</span>
        </div>
        <span class="badge badge-live" style="margin-left:auto">Ativo</span>
        <a href="https://${p.domain}" target="_blank" style="font-size:0.8rem;color:var(--primary);border:1px solid rgba(129,140,248,0.3);padding:5px 12px;border-radius:7px">Visitar →</a>
      </div>`;

    // KPI row for this project
    const kpiRow = el('div', 'kpi-grid');
    [
      { label: 'Utilizadores', value: fmt.num(p.users), icon: '👥' },
      { label: 'Sessões', value: fmt.num(p.sessions), icon: '🖥️' },
      { label: 'Pageviews', value: fmt.num(p.pageviews), icon: '📄' },
      { label: 'Receita Total', value: fmt.currency(p.revenue.total), icon: '💶' },
    ].forEach(k => {
      kpiRow.innerHTML += `<div class="kpi-card"><div class="kpi-icon">${k.icon}</div><div class="kpi-label">${k.label}</div><div class="kpi-value">${k.value}</div></div>`;
    });
    section.appendChild(kpiRow);

    // Charts row
    const row = el('div', 'charts-row');

    const lineCard = el('div', 'chart-card');
    lineCard.innerHTML = `<div class="chart-title">Tráfego</div><div class="chart-subtitle">Utilizadores únicos — últimos ${n} dias</div>`;
    const lc = document.createElement('canvas');
    lc.className = 'chart';
    lineCard.appendChild(lc);
    row.appendChild(lineCard);

    const revCard = el('div', 'chart-card');
    revCard.innerHTML = `<div class="chart-title">Receita</div><div class="chart-subtitle">Por fonte</div>`;
    const sources = Object.entries(p.revenue).filter(([k, v]) => k !== 'total' && v > 0);
    revCard.innerHTML += sources.map(([k, v]) => {
      const labels = { ads: 'Anúncios', kofi: 'Ko-fi', amazon: 'Amazon', namecheap: 'Namecheap', subscriptions: 'Subscrições', pro: 'Plano Pro', business: 'Plano Business' };
      const pct = p.revenue.total > 0 ? Math.round((v / p.revenue.total) * 100) : 0;
      return `<div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:5px">
          <span style="color:var(--text2)">${labels[k] || k}</span>
          <span><strong>${fmt.currency(v)}</strong> <span style="color:var(--text3)">${pct}%</span></span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>`;
    }).join('');
    row.appendChild(revCard);
    section.appendChild(row);

    // Metrics table
    const metrics = el('div', 'table-card');
    metrics.innerHTML = `
      <div class="table-card-header"><h3>Métricas Detalhadas</h3></div>
      <table class="data-table">
        <tbody>
          <tr><td style="color:var(--text2)">Taxa de Rejeição</td><td><strong>${p.bounceRate}%</strong></td><td style="color:var(--text2)">Sessão Média</td><td><strong>${p.avgSession}</strong></td></tr>
          <tr><td style="color:var(--text2)">Páginas / Sessão</td><td><strong>${(p.pageviews / Math.max(p.sessions, 1)).toFixed(1)}</strong></td><td style="color:var(--text2)">Conversão Afiliado</td><td><strong>${p.id === 'roniai' ? '3.4%' : p.id === 'emergent' ? '2.6%' : '—'}</strong></td></tr>
        </tbody>
      </table>`;
    section.appendChild(metrics);

    main.appendChild(section);
    main.appendChild(el('div', '', '<hr style="border:none;border-top:1px solid var(--border);margin:8px 0 28px">'));

    setTimeout(() => {
      drawLineChart(lc, [{ data: sliceData(p.monthly, n), color: '#818CF8' }], getDayLabels(n), { height: 180 });
    }, 60);
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// TRAFFIC
// ─────────────────────────────────────────────────────────────────────────────
Pages.traffic = function() {
  const main = document.getElementById('dash-main');
  main.innerHTML = '';
  const n = DATA.period;

  // KPI
  const kpiGrid = el('div', 'kpi-grid');
  [
    { label: 'Total Utilizadores', value: fmt.num(DATA.totals.users), icon: '👥', change: '+18%' },
    { label: 'Total Sessões', value: fmt.num(DATA.totals.sessions), icon: '🖥️', change: '+22%' },
    { label: 'Total Pageviews', value: fmt.num(DATA.totals.pageviews), icon: '📄', change: '+31%' },
    { label: 'Bounce Rate Médio', value: '46%', icon: '↩️', change: '-4%' },
  ].forEach(k => {
    kpiGrid.innerHTML += `<div class="kpi-card"><div class="kpi-icon">${k.icon}</div><div class="kpi-label">${k.label}</div><div class="kpi-value">${k.value}</div><div class="kpi-meta"><span class="kpi-change up">${k.change}</span></div></div>`;
  });
  main.appendChild(kpiGrid);

  // Combined traffic chart
  const row1 = el('div', 'charts-row');
  const bigCard = el('div', 'chart-card');
  bigCard.innerHTML = `<div class="chart-title">Tráfego Combinado</div><div class="chart-subtitle">Todos os projetos — últimos ${n} dias</div>`;
  const bigCanvas = document.createElement('canvas');
  bigCanvas.className = 'chart';
  bigCard.appendChild(bigCanvas);
  row1.appendChild(bigCard);

  // Traffic per project donut
  const donutCard = el('div', 'chart-card');
  donutCard.innerHTML = `<div class="chart-title">Tráfego por Projeto</div><div class="chart-subtitle">Quota de sessões</div><div style="display:flex;justify-content:center;margin:12px 0"><canvas id="traffic-donut"></canvas></div>`;
  const trafficSegs = DATA.projects.map((p, i) => ({
    label: p.name,
    value: p.sessions,
    color: ['#818CF8', '#22D3EE', '#10B981'][i],
  }));
  donutCard.innerHTML += `<div class="donut-legend">${trafficSegs.map(s => `<div class="donut-legend-item"><div class="donut-legend-label"><div class="donut-dot" style="background:${s.color}"></div>${s.label}</div><div class="donut-legend-val">${fmt.num(s.value)} sess.</div></div>`).join('')}</div>`;
  row1.appendChild(donutCard);
  main.appendChild(row1);

  // Per-project bars
  const row2 = el('div', 'charts-row2');
  DATA.projects.forEach((p, pi) => {
    const c = el('div', 'chart-card');
    c.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
        <div style="width:28px;height:28px;border-radius:7px;background:${p.color};display:flex;align-items:center;justify-content:center">${p.icon}</div>
        <strong>${p.name}</strong>
      </div>`;
    const bc = document.createElement('canvas');
    bc.className = 'chart';
    c.appendChild(bc);
    c.innerHTML += `
      <div style="display:flex;gap:16px;margin-top:12px;font-size:0.78rem">
        <div><strong>${p.bounceRate}%</strong><br><span style="color:var(--text3)">Rejeição</span></div>
        <div><strong>${p.avgSession}</strong><br><span style="color:var(--text3)">Sessão</span></div>
        <div><strong>${(p.pageviews/Math.max(p.sessions,1)).toFixed(1)}</strong><br><span style="color:var(--text3)">Pág/Sessão</span></div>
      </div>`;
    row2.appendChild(c);
    const colors = ['#818CF8', '#22D3EE', '#10B981'];
    setTimeout(() => {
      drawBarChart(bc, sliceData(p.monthly, Math.min(n, 14)), [], colors[pi], { height: 120 });
    }, 60);
  });
  main.appendChild(row2);

  setTimeout(() => {
    const combined = Array(n).fill(0);
    DATA.projects.forEach(p => {
      sliceData(p.monthly, n).forEach((v, i) => { combined[i] += v; });
    });
    drawLineChart(bigCanvas,
      DATA.projects.map((p, i) => ({ data: sliceData(p.monthly, n), color: ['#818CF8','#22D3EE','#10B981'][i] })),
      getDayLabels(n), { height: 240 });
    const dc = document.getElementById('traffic-donut');
    if (dc) drawDonut(dc, trafficSegs, { size: 150, bg: '#0f0f1a', centerText: fmt.num(DATA.totals.sessions), centerSub: 'sessões' });
  }, 60);
};

// ─────────────────────────────────────────────────────────────────────────────
// AFFILIATE
// ─────────────────────────────────────────────────────────────────────────────
Pages.affiliate = function() {
  const main = document.getElementById('dash-main');
  main.innerHTML = '';

  const totalAff = DATA.affiliates.reduce((s, a) => s + a.earned, 0);
  const totalClicks = DATA.affiliates.reduce((s, a) => s + a.clicks, 0);
  const totalConv = DATA.affiliates.reduce((s, a) => s + a.conversions, 0);

  // KPI
  const kpiGrid = el('div', 'kpi-grid');
  [
    { label: 'Ganhos Afiliados', value: fmt.currency(totalAff), sub: 'Objetivo: €50/mês', icon: '💶' },
    { label: 'Total Cliques', value: fmt.num(totalClicks), sub: 'Rastreia com UTMs', icon: '🖱️' },
    { label: 'Conversões', value: String(totalConv), sub: 'Afiliados confirmados', icon: '✅' },
    { label: 'Programas Ativos', value: String(DATA.affiliates.filter(a => a.status === 'ativo').length) + '/' + DATA.affiliates.length, sub: 'Ko-fi ativo · Namecheap/Amazon pendentes', icon: '🔗' },
  ].forEach(k => {
    kpiGrid.innerHTML += `<div class="kpi-card"><div class="kpi-icon">${k.icon}</div><div class="kpi-label">${k.label}</div><div class="kpi-value">${k.value}</div><div class="kpi-sub" style="margin-top:6px">${k.sub}</div></div>`;
  });
  main.appendChild(kpiGrid);

  // Affiliate table
  const tableCard = el('div', 'table-card');
  tableCard.innerHTML = `
    <div class="table-card-header"><h3>Programas de Afiliados</h3><span class="table-tag">Detalhes</span></div>
    <table class="data-table">
      <thead><tr><th>Programa</th><th>Plataforma</th><th>Cliques</th><th>Conversões</th><th>Taxa</th><th>Ganhos</th></tr></thead>
      <tbody>
        ${DATA.affiliates.map(a => `<tr>
          <td><div class="project-cell">
            <div class="project-dot" style="background:var(--bg4)">${a.icon}</div>
            <div><strong>${a.name}</strong></div>
          </div></td>
          <td style="color:var(--text2)">${a.platform}</td>
          <td>${a.clicks}</td>
          <td>${a.conversions}</td>
          <td><span class="badge badge-live">${a.rate}%</span></td>
          <td><strong>${fmt.currency(a.earned)}</strong></td>
        </tr>`).join('')}
        <tr style="background:var(--bg3)">
          <td colspan="2"><strong>Total</strong></td>
          <td>${totalClicks}</td>
          <td>${totalConv}</td>
          <td>${((totalConv/totalClicks)*100).toFixed(1)}%</td>
          <td><strong>${fmt.currency(totalAff)}</strong></td>
        </tr>
      </tbody>
    </table>`;
  main.appendChild(tableCard);

  // Affiliate revenue chart
  const row = el('div', 'charts-row');
  const barCard = el('div', 'chart-card');
  barCard.innerHTML = `<div class="chart-title">Ganhos por Programa</div><div class="chart-subtitle">Comparativo</div>`;
  const bc = document.createElement('canvas');
  bc.className = 'chart';
  barCard.appendChild(bc);
  row.appendChild(barCard);

  // Donut
  const donutCard = el('div', 'chart-card');
  donutCard.innerHTML = `<div class="chart-title">Distribuição</div><div class="chart-subtitle">Quota de receita afiliado</div><div style="display:flex;justify-content:center;margin:12px 0"><canvas id="aff-donut"></canvas></div>`;
  const affSegs = DATA.affiliates.map(a => ({ label: a.name, value: a.earned, color: a.color }));
  donutCard.innerHTML += `<div class="donut-legend">${affSegs.map(s => `<div class="donut-legend-item"><div class="donut-legend-label"><div class="donut-dot" style="background:${s.color}"></div>${s.label}</div><div class="donut-legend-val">${fmt.currency(s.value)}</div></div>`).join('')}</div>`;
  row.appendChild(donutCard);
  main.appendChild(row);

  // Tips
  const tipsCard = el('div', 'table-card');
  tipsCard.innerHTML = `
    <div class="table-card-header"><h3>Dicas para Aumentar Ganhos</h3></div>
    <div class="activity-feed">
      <div class="activity-item"><div class="activity-dot green"></div><div class="activity-text"><strong>Namecheap:</strong> Adiciona banner na página principal do Roniai — pode aumentar CTR em 40%</div></div>
      <div class="activity-item"><div class="activity-dot blue"></div><div class="activity-text"><strong>Amazon:</strong> Coloca links de smart TV e Fire Stick no Emergent — público relevante</div></div>
      <div class="activity-item"><div class="activity-dot gold"></div><div class="activity-text"><strong>Ko-fi:</strong> Adiciona mensagem de apoio no footer do Emergent e BuildAI</div></div>
      <div class="activity-item"><div class="activity-dot cyan"></div><div class="activity-text"><strong>AdSense:</strong> Otimiza posição dos anúncios no Emergent — RPM atual €1.82, objetivo €2.50</div></div>
    </div>`;
  main.appendChild(tipsCard);

  setTimeout(() => {
    drawBarChart(bc, DATA.affiliates.map(a => a.earned), DATA.affiliates.map(a => a.name), DATA.affiliates.map(a => a.color), { height: 220, currency: true });
    const dc = document.getElementById('aff-donut');
    if (dc) drawDonut(dc, affSegs, { size: 150, bg: '#0f0f1a', centerText: fmt.currency(totalAff), centerSub: 'total' });
  }, 60);
};
