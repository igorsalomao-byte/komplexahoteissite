/* ============================================================
   Komplexa Hotéis — main.js
   Base Template 6 · Lenis + GSAP + componentes do blueprint
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

/* Todo caminho de conversão do site aponta para o formulário externo */
const FORM_URL = 'https://komplexa-pricing.vercel.app/f/komplexaconsultoria' +
  '?utm_source=komplexahoteis&utm_medium=site&utm_content=home-boutique-concierge';

/* ---------- Lenis ---------- */
const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));

/* ---------- Lazy media ---------- */
document.querySelectorAll('.ph img, .ph video').forEach(m => {
  const done = () => m.classList.add('loaded');
  if (m.tagName === 'VIDEO') { m.addEventListener('loadeddata', done, { once: true }); }
  else if (m.complete && m.naturalWidth > 0) done();
  else m.addEventListener('load', done, { once: true });
  m.addEventListener('error', () => m.style.display = 'none', { once: true });
});

/* ---------- Entrada da página ---------- */
window.addEventListener('load', () => {
  const heroCenter = document.querySelector('.hero-center, .hero-int-body');
  const tl = gsap.timeline();
  if (document.querySelector('.hero-media, .hero-int .media')) {
    tl.fromTo('.hero-media, .hero-int .media', { scale: 1.12 },
      { scale: 1.03, duration: 2.4, ease: 'power3.out' }, 0);
  }
  if (heroCenter) tl.to(heroCenter, { opacity: 1, scale: 1, duration: 1.6, ease: 'power3.out' }, .25);
  if (document.getElementById('concBubble')) {
    tl.add(() => gsap.fromTo('#concBubble', { opacity: 0, scale: .6, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: .5, ease: 'back.out(1.6)' }), 1.2);
  }
});

/* Hero parallax de saída */
if (document.querySelector('.hero')) {
  gsap.to('.hero-media', { yPercent: 16, scale: 1.1, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
}

/* ---------- Logo fixa: branca no hero, escura depois ---------- */
const logoFix = document.getElementById('logoFix');
const heroEl = document.querySelector('.hero, .hero-int');
if (logoFix && heroEl) {
  ScrollTrigger.create({
    trigger: heroEl, start: 'bottom 90px',
    onEnter: () => logoFix.classList.add('dark'),
    onLeaveBack: () => logoFix.classList.remove('dark')
  });
}

/* ---------- Reveals genéricos ---------- */
gsap.utils.toArray('.rv').forEach(el => {
  gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%' } });
});
/* Stagger interno das linhas de quarto (texto sobe em cascata) */
gsap.utils.toArray('.room-txt').forEach(txt => {
  gsap.fromTo(txt.children, { opacity: 0, y: 44 },
    { opacity: 1, y: 0, duration: .85, stagger: .09, ease: 'power3.out',
      scrollTrigger: { trigger: txt.closest('.room'), start: 'top 74%' } });
});

/* ---------- Parallax interno dos cards A ---------- */
gsap.utils.toArray('.compA .media > *').forEach(m => {
  gsap.fromTo(m, { yPercent: -6 }, { yPercent: 6, ease: 'none',
    scrollTrigger: { trigger: m.closest('.compA'), start: 'top bottom', end: 'bottom top', scrub: true } });
});

/* ---------- Componente B: par convergente ---------- */
gsap.utils.toArray('.compB').forEach(pair => {
  const right = pair.children[1];
  if (!right) return;
  gsap.fromTo(right, { y: 150 }, { y: 0, ease: 'none',
    scrollTrigger: { trigger: pair, start: 'top 92%', end: 'top 22%', scrub: .7 } });
});

/* ---------- Menu overlay ---------- */
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menuBtn');
let menuOpen = false;
if (menu && menuBtn) {
  const links = menu.querySelectorAll('.menu-list a');
  const menuTl = gsap.timeline({ paused: true })
    .to(menu, { clipPath: 'inset(0 0 0% 0)', duration: .85, ease: 'power4.inOut' })
    .to(links, { opacity: 1, y: 0, duration: .65, stagger: .045, ease: 'power3.out' }, '-=.35')
    .to('.menu-foot', { opacity: 1, duration: .5 }, '-=.35');

  menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menu.classList.toggle('open', menuOpen);
    document.body.classList.toggle('menu-open', menuOpen);
    logoFix?.classList.toggle('dark', menuOpen || logoFix.classList.contains('dark'));
    if (menuOpen) { menuTl.timeScale(1).play(); lenis.stop(); }
    else {
      menuTl.timeScale(1.7).reverse(); lenis.start();
      /* devolve a cor correta da logo */
      if (heroEl && window.scrollY < heroEl.offsetHeight - 90) logoFix?.classList.remove('dark');
    }
  });

  /* hover troca a imagem da esquerda com crossfade */
  const phs = menu.querySelectorAll('.menu-img .ph');
  links.forEach(a => {
    a.addEventListener('mouseenter', () => {
      const key = a.dataset.img;
      phs.forEach(p => p.classList.toggle('on', p.dataset.ph === key));
    });
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const t = document.querySelector(href);
        menuOpen = false;
        menu.classList.remove('open');
        document.body.classList.remove('menu-open');
        lenis.start();
        menuTl.timeScale(1.7).reverse();
        if (t) setTimeout(() => {
          lenis.start();
          lenis.scrollTo(t, { duration: 1.5, force: true });
          setTimeout(() => {
            if (Math.abs(t.getBoundingClientRect().top) > innerHeight)
              t.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }, 480);
      }
    });
  });

  /* ESC fecha o menu */
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) {
      menuOpen = false;
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
      lenis.start();
      menuTl.timeScale(1.7).reverse();
      if (heroEl && window.scrollY < heroEl.offsetHeight - 90) logoFix?.classList.remove('dark');
    }
  });
}

/* ---------- Selo de avaliação ---------- */
function toggleRating() {
  const r = document.getElementById('rating');
  r.classList.toggle('open');
  r.querySelector('.rating-head').setAttribute('aria-expanded', r.classList.contains('open'));
}

/* ---------- Concierge ---------- */
function closeConcierge(e) {
  e.stopPropagation();
  gsap.to('#concBubble', { opacity: 0, scale: .6, y: 10, duration: .3, ease: 'power2.in',
    onComplete: () => document.getElementById('concBubble').style.display = 'none' });
}
function openConcierge() {
  const b = document.getElementById('concBubble');
  if (b.style.display === 'none') {
    b.style.display = 'block';
    gsap.fromTo(b, { opacity: 0, scale: .6, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: .45, ease: 'back.out(1.6)' });
  } else {
    window.open(FORM_URL, '_blank');
  }
}

/* ---------- Carrossel de fotos (C + galerias de quarto) ---------- */
document.querySelectorAll('.carousel').forEach(car => {
  const slides = car.querySelectorAll('.slide');
  if (!slides.length) return;
  const dotsBox = car.querySelector('.car-dots');
  let cur = 0;
  slides[0].classList.add('on');
  if (dotsBox) {
    slides.forEach((_, i) => {
      const d = document.createElement('i');
      if (i === 0) d.classList.add('on');
      d.addEventListener('click', () => go(i));
      dotsBox.appendChild(d);
    });
  }
  function go(i) {
    slides[cur].classList.remove('on');
    dotsBox?.children[cur]?.classList.remove('on');
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add('on');
    dotsBox?.children[cur]?.classList.add('on');
  }
  car.querySelector('.car-arrow.prev')?.addEventListener('click', () => go(cur - 1));
  car.querySelector('.car-arrow.next')?.addEventListener('click', () => go(cur + 1));
});

/* ---------- Componente D: trilho de cards ---------- */
document.querySelectorAll('.compD').forEach(comp => {
  const view = comp.querySelector('.compD-view');
  const track = comp.querySelector('.compD-track');
  const prev = comp.querySelector('.d-arrow.prev');
  const next = comp.querySelector('.d-arrow.next');
  const cards = track.children;
  let idx = 0;
  function step() {
    return cards[0].getBoundingClientRect().width +
      parseFloat(getComputedStyle(track).gap || 0);
  }
  function maxIdx() {
    const visible = Math.max(1, Math.floor(view.getBoundingClientRect().width / step()));
    return Math.max(0, cards.length - visible);
  }
  function update() {
    idx = Math.min(idx, maxIdx());
    track.style.transform = `translateX(${-idx * step()}px)`;
    prev.disabled = idx === 0;
    next.disabled = idx >= maxIdx();
  }
  prev.addEventListener('click', () => { idx--; update(); });
  next.addEventListener('click', () => { idx++; update(); });
  /* drag */
  let startX = 0, dragging = false;
  track.addEventListener('pointerdown', e => { dragging = true; startX = e.clientX; });
  addEventListener('pointerup', e => {
    if (!dragging) return; dragging = false;
    const dx = e.clientX - startX;
    if (dx < -50) idx++; else if (dx > 50) idx--;
    idx = Math.max(0, idx); update();
  });
  addEventListener('resize', update);
  update();
});

/* ---------- Cases: carrossel com snap nativo ----------
   O scroll é do próprio navegador (arrasta no dedo); as setas e os
   pontos só empurram. As barras de antes/depois crescem quando o card
   entra na tela. */
const csTrack = document.getElementById('csTrack');
if (csTrack) {
  const cards = Array.from(csTrack.children);
  const dots = document.getElementById('csDots');
  const step = () => cards[0].getBoundingClientRect().width +
    parseFloat(getComputedStyle(csTrack).gap || 0);

  document.querySelectorAll('[data-cs]').forEach(btn => {
    btn.addEventListener('click', () =>
      csTrack.scrollBy({ left: step() * Number(btn.dataset.cs), behavior: 'smooth' }));
  });

  if (dots) {
    cards.forEach((_, i) => {
      const d = document.createElement('i');
      d.addEventListener('click', () =>
        csTrack.scrollTo({ left: step() * i, behavior: 'smooth' }));
      dots.appendChild(d);
    });
    const marcaAtivo = () => {
      const i = Math.round(csTrack.scrollLeft / step());
      Array.from(dots.children).forEach((d, k) => d.classList.toggle('on', k === i));
    };
    csTrack.addEventListener('scroll', marcaAtivo, { passive: true });
    marcaAtivo();
  }

  cards.forEach(card => {
    ScrollTrigger.create({
      trigger: card, start: 'top 88%', once: true,
      onEnter: () => card.classList.add('on')
    });
    const r = card.getBoundingClientRect();
    if (r.top < innerHeight * .95 && r.bottom > 0) card.classList.add('on');
  });
}

/* ---------- Sistema em entregáveis: artefatos só animam na tela ---------- */
gsap.utils.toArray('.sis-card').forEach(card => {
  ScrollTrigger.create({
    trigger: card, start: 'top 88%', end: 'bottom 8%',
    onToggle: self => card.classList.toggle('on', self.isActive)
  });
  /* se já está na tela no carregamento, anima sem esperar o gatilho */
  const r = card.getBoundingClientRect();
  if (r.top < innerHeight * .95 && r.bottom > 0) card.classList.add('on');

  /* as partículas SMIL da rede neural não obedecem ao CSS de pausa:
     pausam pela API quando o card sai da tela */
  const nn = card.querySelector('svg.nn');
  if (nn) {
    ScrollTrigger.create({
      trigger: card, start: 'top 95%', end: 'bottom 5%',
      onToggle: self => self.isActive ? nn.unpauseAnimations() : nn.pauseAnimations()
    });
    const rr = card.getBoundingClientRect();
    if (!(rr.top < innerHeight * .95 && rr.bottom > 0)) nn.pauseAnimations();
  }

  /* vídeo pesado: só toca enquanto o card está visível */
  const vid = card.querySelector('.kap-video');
  if (vid) {
    ScrollTrigger.create({
      trigger: card, start: 'top 92%', end: 'bottom 5%',
      onToggle: self => {
        if (self.isActive) { vid.preload = 'auto'; vid.play().catch(() => {}); }
        else vid.pause();
      }
    });
  }
});

/* ---------- Site de cliente: abre navegável no lightbox ----------
   O iframe grande só é criado ao abrir e é destruído ao fechar, para não
   deixar um site de terceiros carregado em segundo plano. */
const webPop = document.getElementById('webPop');
if (webPop) {
  const frameBox = document.getElementById('webPopFrame');
  const urlLabel = document.getElementById('webPopUrl');
  const openLink = document.getElementById('webPopOpen');
  let webOpener = null;

  const closeWeb = () => {
    if (webPop.hidden) return;
    webPop.hidden = true;
    frameBox.innerHTML = '';
    if (typeof lenis !== 'undefined') lenis.start();
    webOpener?.focus();
  };

  document.querySelectorAll('[data-web]').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.web;
      webOpener = btn;
      urlLabel.textContent = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      openLink.href = url;
      frameBox.innerHTML =
        `<iframe src="${url}" title="Site do cliente" referrerpolicy="no-referrer"></iframe>`;
      webPop.hidden = false;
      if (typeof lenis !== 'undefined') lenis.stop();
      document.getElementById('webPopX').focus();
    });
  });

  document.getElementById('webPopX').addEventListener('click', closeWeb);
  webPop.addEventListener('click', e => { if (e.target === webPop) closeWeb(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeWeb(); });
}

/* ---------- Âncoras ---------- */
document.querySelectorAll('a[href^="#"]:not(.menu-list a)').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); lenis.scrollTo(t, { duration: 1.5 }); }
  });
});

/* ============================================================
   O FUNIL — nós ilustrados, fluxo bifurcado, pop-up por etapa.
   Mesma lógica do money slide do deck (d/aquisicao, slide 03),
   adaptada: o funil aqui não tem contorno — os widgets sobem em
   cascata quando a seção entra na tela e o pop-up para o Lenis.
   Nenhum número de volume é inventado — as demos mostram a
   mecânica; os números reais ficam na seção de cases.
   ============================================================ */
const fn = document.getElementById('fn');
const fnPop = document.getElementById('fnPop');
if (fn && fnPop) {
  const POPS = {
    criativos: {
      tag: 'Etapa 01 · Ponto de partida',
      title: 'Criativos validados',
      desc: 'Anúncios com modelos <strong>testados em dezenas de operações de hotelaria</strong> — não começamos do zero no seu hotel.',
      list: [
        'Vídeo, motion e estático adaptados à identidade do hotel',
        'Mensagem específica para cada etapa do funil',
        'Teste contínuo até achar o criativo vencedor'
      ],
      demo: '<div class="dm-media">' +
        '<span class="md vid"><video src="assets/img/criativo-video.mp4" autoplay muted loop playsinline></video><span class="tag">▶ Vídeo</span></span>' +
        '<span class="md"><img src="assets/img/criativo-01.webp" alt="Criativo de campanha para hotel"><span class="tag">Estático</span></span>' +
        '<span class="md"><img src="assets/img/criativo-02.webp" alt="Criativo de oferta para hotel"><span class="tag">Estático</span></span>' +
        '</div>'
    },
    google: {
      tag: 'Etapa 02 · Alta intenção',
      title: 'Google Ads',
      desc: 'Capturamos quem <strong>já está procurando hospedagem no seu destino</strong> — a demanda mais quente que existe.',
      list: [
        'Campanhas de venda direcionadas ao motor de reservas',
        'Search e Performance Max no nível técnico máximo',
        'Quem pesquisa e não reserva entra no remarketing'
      ],
      demo: '<div class="dm-gg"><div class="gsr">🔍 pousada em Búzios</div>' +
        '<div class="gres ad"><span class="tagad">Patrocinado</span>' +
        '<b>Seu hotel · Reserve direto com a melhor tarifa</b><small>seuhotel.com.br</small></div>' +
        '<div class="gres oth"><b>OTAs e concorrentes…</b><small>resultado orgânico</small></div></div>'
    },
    meta: {
      tag: 'Etapa 02 · Desejo',
      title: 'Meta Ads',
      desc: 'Instagram e Facebook <strong>despertam a vontade de viajar</strong> em quem tem o perfil dos seus melhores hóspedes.',
      list: [
        'Segmentação pelo perfil real de quem já reservou',
        'Remarketing cross-canal: viu no Google, é impactado no Instagram',
        'Dados do hóspede alimentam a segmentação continuamente'
      ],
      demo: '<div class="dm-ig"><div class="igc">' +
        '<div class="igh"><span class="av"></span>seuhotel<em>Patrocinado</em></div>' +
        '<div class="igi"></div>' +
        '<div class="igf"><span class="hrt">♥</span><span class="cta">Reservar agora →</span></div>' +
        '</div><div class="note"><b>Quem tem o perfil dos seus melhores hóspedes</b> vê o hotel no feed — e quem visitou o site sem reservar é reimpactado aqui.</div></div>'
    },
    site: {
      tag: 'Etapa 03 · Conversão',
      title: 'Site + motor integrado',
      desc: 'Site do hotel <strong>integrado ao motor de reservas e com rastreamento completo</strong> — cada visita, clique e reserva vira dado.',
      list: [
        'Caminho curto: da home ao checkout sem etapa desnecessária',
        'Pixel do Meta e tag do Google configurados de ponta a ponta',
        'É o registro de dados que faz o anúncio ficar mais barato com o tempo'
      ],
      demo: '<div class="dm-ev">' +
        '<span class="ev e1"><i></i>PageView <small>· visitou o site</small></span>' +
        '<span class="ev e2"><i></i>ViewContent <small>· viu a suíte master</small></span>' +
        '<span class="ev e3"><i></i>InitiateCheckout <small>· escolheu as datas</small></span>' +
        '<span class="ev e4 win"><i></i>Purchase <small>· reserva confirmada</small></span></div>'
    },
    checkout: {
      tag: 'Etapa 04 · Autoatendimento',
      title: 'Checkout no motor',
      desc: 'Quem prefere resolver sozinho <strong>reserva direto no motor</strong> — e quem abandona o checkout não é perdido.',
      list: [
        'Reserva self-service 24 horas por dia, sem depender de atendimento',
        'Abandonou com as datas escolhidas? Recebe o criativo com a oferta certa',
        'Cada reserva rastreada até a campanha de origem'
      ],
      demo: '<div class="dm-chk">' +
        '<span class="cs c1">Escolheu as datas</span><span class="arr a1">→</span>' +
        '<span class="cs bad c2">Abandonou o checkout</span><span class="arr a2">→</span>' +
        '<span class="cs off c3">Criativo com a oferta</span><span class="arr a3">→</span>' +
        '<span class="cs win c4">✓ Reserva concluída</span></div>'
    },
    whatsapp: {
      tag: 'Etapa 04 · Conversão assistida',
      title: 'WhatsApp + comercial treinado',
      desc: 'Quem prefere conversar encontra <strong>gente treinada do outro lado</strong> — com CRM, script e rotina acompanhada.',
      list: [
        'CRM incluso na verba, com o funil do hotel montado',
        'Script e processo de atendimento, não improviso',
        'Treinamento contínuo de rotina com o time do hotel'
      ],
      demo: '<div class="dm-crm">' +
        '<div class="col"><b>Novo lead</b></div>' +
        '<div class="col"><b>Em negociação</b></div>' +
        '<div class="col win"><b>Reserva ganha</b></div>' +
        '<div class="lead">Família · 4 pessoas<b>15 a 17 de maio</b><small>veio do Instagram</small></div>' +
        '</div>'
    },
    reserva: {
      tag: 'Resultado · No PMS',
      title: 'Reserva efetuada',
      desc: 'A conta fecha <strong>dentro do sistema do hotel</strong>, não no painel de anúncio. É a única métrica que a Komplexa aceita como resultado.',
      list: [
        'Receita conferida no PMS, reserva por reserva',
        'Cada reserva rastreada até a campanha que a originou',
        'Quem reservou vira audiência para a próxima temporada'
      ],
      demo: '<div class="dm-ficha">' +
        '<div><span>Origem</span><b>Meta Ads · remarketing</b></div>' +
        '<div><span>Caminho</span><b>anúncio → site → motor</b></div>' +
        '<div><span>Registro</span><b>PMS do hotel</b></div>' +
        '<div class="win"><span>Status</span><b>Reserva confirmada</b></div></div>'
    }
  };

  /* ícone de reserva quando o nó clicado é o mockup do site */
  const SITE_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>' +
    '<path d="M8 14h8M8 17h5"/></svg>';

  const nodes = Array.from(fn.querySelectorAll('.fw'));
  const popIco = fnPop.querySelector('.fnpop-ico');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opener = null;

  function openPop(key, btn) {
    const p = POPS[key];
    if (!p) return;
    const src = btn.querySelector('.fw-ico svg');
    popIco.innerHTML = src ? src.outerHTML : SITE_ICO;
    popIco.classList.toggle('raw', !!btn.querySelector('.fw-ico.raw'));
    fnPop.querySelector('.fnpop-tag').textContent = p.tag;
    fnPop.querySelector('.fnpop-title').textContent = p.title;
    fnPop.querySelector('.fnpop-desc').innerHTML = p.desc;
    fnPop.querySelector('.fnpop-list').innerHTML = p.list.map(i => `<li>${i}</li>`).join('');
    fnPop.querySelector('.fnpop-demo').innerHTML = p.demo || '';
    opener = btn;
    fnPop.hidden = false;
    if (typeof lenis !== 'undefined') lenis.stop();
    fnPop.querySelector('.fnpop-x').focus();
  }

  function closePop() {
    if (fnPop.hidden) return;
    fnPop.hidden = true;
    fnPop.querySelector('.fnpop-demo').innerHTML = '';   /* para o vídeo da demo */
    if (typeof lenis !== 'undefined') lenis.start();
    opener?.focus();
  }

  nodes.forEach(b => b.addEventListener('click', () => openPop(b.dataset.pop, b)));
  fnPop.querySelector('.fnpop-x').addEventListener('click', closePop);
  fnPop.addEventListener('click', e => { if (e.target === fnPop) closePop(); });
  fnPop.querySelector('.fnpop-cta').addEventListener('click', closePop);
  addEventListener('keydown', e => { if (e.key === 'Escape') closePop(); });

  /* ---- conectores ----
     Como o layout é em fluxo (não por coordenada), os caminhos são
     medidos a partir da posição real de cada widget e redesenhados no
     resize. Ligam a base de um nível ao topo do seguinte, com um ponto
     correndo por dentro — o mesmo vocabulário do money slide. */
  const flow = document.getElementById('fnFlow');
  const linksG = fn.querySelector('.fn-links-g');
  const svgLinks = fn.querySelector('.fn-links');
  const byPop = k => fn.querySelector(`[data-pop="${k}"]`);
  const LIGA = [
    ['criativos', 'google'], ['criativos', 'meta'],
    ['google', 'site'],      ['meta', 'site'],
    ['site', 'checkout'],    ['site', 'whatsapp'],
    ['checkout', 'reserva'], ['whatsapp', 'reserva']
  ];

  function drawLinks() {
    if (!flow || !linksG) return;
    const R = flow.getBoundingClientRect();
    if (!R.width) return;
    svgLinks.setAttribute('viewBox', `0 0 ${R.width} ${R.height}`);
    const box = el => {
      const r = el.getBoundingClientRect();
      return { cx: r.left - R.left + r.width / 2,
               cy: r.top - R.top + r.height / 2,
               right: r.right - R.left, left: r.left - R.left,
               top: r.top - R.top, bot: r.bottom - R.top };
    };
    let d = '';
    LIGA.forEach(([a, b], i) => {
      const A = byPop(a), B = byPop(b);
      if (!A || !B) return;
      const p1 = box(A), p2 = box(B);
      const y1 = p1.bot, y2 = p2.top, dy = (y2 - y1) * .5;
      const path = `M ${p1.cx} ${y1} C ${p1.cx} ${y1 + dy}, ${p2.cx} ${y2 - dy}, ${p2.cx} ${y2}`;
      d += `<path d="${path}"/>` +
           `<circle r="3.4"><animateMotion dur="${(2.6 + i % 3 * .5).toFixed(1)}s" ` +
           `begin="${(i * .45).toFixed(2)}s" repeatCount="indefinite" path="${path}"/></circle>`;
    });
    /* volta do remarketing: sai do site e retorna ao anúncio, por fora */
    const S = byPop('site'), M = byPop('meta');
    if (S && M) {
      const a = box(S), b = box(M);
      const xo = Math.max(a.right, b.right) + Math.min(96, R.width * .09);
      const loop = `M ${a.right} ${a.cy} C ${xo} ${a.cy}, ${xo} ${b.cy}, ${b.right + 10} ${b.cy}`;
      d += `<path class="lk-loop" d="${loop}"/>` +
           `<path class="lk-arrow" d="M ${b.right + 17} ${b.cy - 5} L ${b.right + 9} ${b.cy} ` +
           `L ${b.right + 17} ${b.cy + 5}"/>` +
           `<circle class="lk-loopdot" r="3"><animateMotion dur="3.4s" ` +
           `repeatCount="indefinite" path="${loop}"/></circle>`;
    }
    linksG.innerHTML = d;
  }

  let raf;
  const redraw = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(drawLinks); };
  addEventListener('resize', redraw);
  addEventListener('load', redraw);
  if (document.fonts?.ready) document.fonts.ready.then(redraw);
  fn.querySelectorAll('img').forEach(im => {
    if (!im.complete) im.addEventListener('load', redraw, { once: true });
  });

  /* ---- o bloco escuro vira full-bleed ao entrar na dobra ----
     Sai das laterais do .wrap e perde o raio, colado no scroll. Como o
     conteúdo interno tem max-width próprio, ele não se mexe: só o fundo
     abre. Respeita quem pediu menos movimento. */
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    /* O bloco já nasce full-bleed e é "recortado" para a largura da
       coluna; abrir = reduzir o recorte. clip-path é composto pela GPU,
       então o scroll não recalcula layout a cada quadro (animar width
       fazia exatamente isso e engasgava). */
    const corte = () => {
      const w = document.querySelector('.wrap');
      if (!w) return 4;
      const cs = getComputedStyle(w);
      /* o recorte tem de bater com a COLUNA DE CONTEÚDO, não com a caixa
         do container — senão o bloco já nasce quase aberto */
      const conteudo = w.getBoundingClientRect().width
        - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const livre = (innerWidth - conteudo) / 2;
      return Math.max(0, livre / innerWidth * 100);
    };
    gsap.set(fn, { width: '100vw', marginLeft: 'calc(50% - 50vw)', borderRadius: 0 });
    gsap.fromTo(fn,
      { clipPath: `inset(0 ${corte().toFixed(2)}% round 22px)` },
      { clipPath: 'inset(0 0% round 0px)', ease: 'none', overwrite: 'auto',
        scrollTrigger: { trigger: fn, start: 'top 92%', end: 'top 38%', scrub: .6 } });
  }

  /* ---- entrada ----
     Os widgets sobem em cascata quando a seção entra na tela. Se já
     estiverem visíveis no carregamento (deep link, reload no meio), ou
     se o gatilho de scroll nunca disparar, aparecem prontos: a animação
     é ganho, nunca condição para enxergar. */
  const paint = () => {
    gsap.set(nodes, { clearProps: 'opacity,transform' });
    gsap.set(svgLinks, { opacity: 1 });
    redraw();
  };

  if (reduced || fn.getBoundingClientRect().top < innerHeight * .78) {
    paint();
  } else {
    gsap.set(nodes, { opacity: 0, y: 26 });
    gsap.set(svgLinks, { opacity: 0 });   /* as linhas entram com os widgets */

    ScrollTrigger.create({
      trigger: fn, start: 'top 80%', once: true,
      onEnter: () => {
        gsap.to(nodes, { opacity: 1, y: 0, duration: .8, stagger: .11,
          ease: 'power3.out', onComplete: paint });
        gsap.to(svgLinks, { opacity: 1, duration: .9, delay: .5 });
      }
    });

    setTimeout(() => {
      if (parseFloat(getComputedStyle(nodes[0]).opacity) < .05) paint();
    }, 5000);
  }
}

/* ---------- Só anima o que está na tela ----------
   Havia mais de 60 animações em loop rodando ao mesmo tempo, boa parte
   delas em seções fora de vista. Cada seção pesada ganha .viz enquanto
   está visível; o CSS pausa tudo que estiver fora. */
document.querySelectorAll('#metodo, #cases, #site, #sistema, #criativos, #frentes')
  .forEach(sec => {
    ScrollTrigger.create({
      trigger: sec, start: 'top bottom', end: 'bottom top',
      onToggle: self => sec.classList.toggle('viz', self.isActive)
    });
    const r = sec.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) sec.classList.add('viz');
  });

addEventListener('resize', () => ScrollTrigger.refresh());
