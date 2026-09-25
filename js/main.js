// BioTravessias | Luciana
// Destaca na linha do tempo o capítulo que está sendo lido.

(function () {
  const links = Array.from(document.querySelectorAll('.linha__lista a'));
  const capitulos = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!capitulos.length) return;

  const celular = window.matchMedia('(max-width: 900px)');
  let atual = null;

  function ativar(id) {
    if (id === atual) return;
    atual = id;
    links.forEach(link => {
      const eAtivo = link.getAttribute('href') === '#' + id;
      link.classList.toggle('ativo', eAtivo);
      if (eAtivo) {
        link.setAttribute('aria-current', 'true');
        // No celular, mantém o chip ativo visível na faixa rolável
        if (celular.matches) {
          const lista = link.closest('.linha__lista');
          const alvo = link.offsetLeft - (lista.clientWidth - link.offsetWidth) / 2;
          lista.scrollTo({ left: alvo, behavior: 'smooth' });
        }
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // O capítulo ativo é o último cujo topo já passou de 35% da altura da tela
  function verificar() {
    const linhaDeLeitura = window.innerHeight * 0.35;
    let escolhido = capitulos[0].id;
    for (const cap of capitulos) {
      if (cap.getBoundingClientRect().top <= linhaDeLeitura) escolhido = cap.id;
    }
    ativar(escolhido);
  }

  let agendado = false;
  window.addEventListener('scroll', () => {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(() => { verificar(); agendado = false; });
  }, { passive: true });
  window.addEventListener('resize', verificar);

  verificar();
})();
