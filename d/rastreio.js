/* Rastreio das apresentações em /d/ (ferramenta Komplexa, migração 0162).
   O link do lead é komplexahoteis.com/d/<deck>/<nome-do-hotel>; o 404 do site leva para
   /d/<deck>/?l=<nome-do-hotel>. Aqui: volta o endereço bonito na barra, registra a visita
   (slide mais avançado, tempo com a aba visível, aparelho) e personaliza a capa.
   ?preview=1 não registra (é o "Abrir" da ferramenta). Sem o parâmetro l, não faz nada. */
(function () {
  var q = new URLSearchParams(location.search);
  var mDeck = location.pathname.match(/\/d\/([a-z0-9-]+)\/?/i);
  var mSlug = location.pathname.match(/\/d\/[a-z0-9-]+\/([a-z0-9-]+)\/?$/i);
  var slug = (q.get('l') || (mSlug ? mSlug[1] : '') || '').toLowerCase();
  if (!mDeck || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug === 'index') return;
  var deck = mDeck[1].toLowerCase();

  // endereço com o nome do hotel na barra, sem recarregar
  if (q.has('l')) {
    q.delete('l');
    var resto = q.toString();
    try { history.replaceState(null, '', '/d/' + deck + '/' + slug + (resto ? '?' + resto : '') + location.hash); } catch (e) {}
  }
  if (q.has('preview')) return;

  var RPC = 'https://fmvgbyrqoojqugvtkqad.supabase.co/rest/v1/rpc/apresentacao_registrar';
  var KEY = 'sb_publishable_23TiVcDnYLyR_LT8_xfu5A_BUUjThOo';

  var chave = 'kx-ap-' + deck + '-' + slug, sessao;
  function novaSessao() {
    return ((window.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2))
      .replace(/-/g, '').slice(0, 32);
  }
  try { sessao = sessionStorage.getItem(chave); if (!sessao) { sessao = novaSessao(); sessionStorage.setItem(chave, sessao); } }
  catch (e) { sessao = novaSessao(); }

  var slides = [].slice.call(document.querySelectorAll('.slide'));
  var maxIdx = 0, ultimaAssinatura = '', acumulado = 0, personalizado = false;
  var visivelDesde = document.visibilityState === 'visible' ? Date.now() : 0;

  function nomeSlide(i) {
    var s = slides[i];
    if (!s) return null;
    var e = s.querySelector('.eyebrow, .cover-eye, h1, h2');
    var t = e ? e.textContent.replace(/\s+/g, ' ').trim() : '';
    return (t || 'Slide ' + (i + 1)).slice(0, 80);
  }
  function segundos() { return Math.round((acumulado + (visivelDesde ? Date.now() - visivelDesde : 0)) / 1000); }
  function aparelho() {
    var toque = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    return toque || window.innerWidth < 768 ? 'celular' : 'computador';
  }
  function envia(final) {
    var corpo = {
      p_deck: deck, p_slug: slug, p_sessao: sessao, p_slide: maxIdx + 1, p_slide_nome: nomeSlide(maxIdx),
      p_total: slides.length || null, p_segundos: segundos(), p_aparelho: aparelho()
    };
    var assinatura = corpo.p_slide + ':' + Math.floor(corpo.p_segundos / 15);
    if (!final && assinatura === ultimaAssinatura) return;
    ultimaAssinatura = assinatura;
    try {
      fetch(RPC, {
        method: 'POST', keepalive: !!final,
        headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: 'Bearer ' + KEY },
        body: JSON.stringify(corpo)
      }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
        if (d && d.nome && !personalizado) {
          personalizado = true;
          var el = document.querySelector('[data-lead-nome]');
          if (el) el.textContent = (el.getAttribute('data-lead-nome') || 'Apresentação · ') + d.nome;
        }
      }).catch(function () {});
    } catch (e) {}
  }

  // slide mais avançado: no modo leitura, o que ocupa metade da tela; no modo apresentar, o ativo
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { var i = slides.indexOf(e.target); if (i > maxIdx) maxIdx = i; }
      });
    }, { threshold: 0.5 });
    slides.forEach(function (s) { io.observe(s); });
  }
  setInterval(function () {
    var ativo = document.querySelector('.present .slide.active');
    if (ativo) { var i = slides.indexOf(ativo); if (i > maxIdx) maxIdx = i; }
    if (document.visibilityState === 'visible') envia(false);
  }, 5000);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      if (visivelDesde) { acumulado += Date.now() - visivelDesde; visivelDesde = 0; }
      envia(true);
    } else {
      visivelDesde = Date.now();
    }
  });
  window.addEventListener('pagehide', function () { envia(true); });
  envia(false);
})();
