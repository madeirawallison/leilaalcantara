/*
 * ============================================================
 *  CONFIGURAÇÃO DO SITE — edite só este arquivo
 * ============================================================
 *  Tudo que estiver como null aparece no site como
 *  "consulte no WhatsApp". Quando a Leila definir valores,
 *  é só preencher aqui e publicar de novo.
 */
window.SITE_CONFIG = {
  whatsapp: "5531987371019",            // DDI + DDD + número, só dígitos
  instagram: "leilaalcantarafotografia",

  // Meta Pixel (Gerenciador de Eventos). Deixe "" para desligar.
  metaPixelId: "",

  // Mensagens pré-preenchidas no WhatsApp.
  // "anuncio" é usada quando a pessoa chega por link de anúncio (utm_source / fbclid),
  // assim dá para saber quais agendamentos vieram do tráfego.
  mensagens: {
    anuncio: "Oi Leila! Vi o anúncio do Ensaio de Natal e quero saber os horários",
    site: "Oi Leila! Vim pelo seu site e quero saber os horários do Ensaio de Natal"
  },

  // Detalhes do ensaio (null = não mostra o número)
  ensaio: {
    duracao: "50 min",     // tempo médio do ensaio
    parcelas: null,        // ex.: 3  (mostra "em até 3x")
    vagasRestantes: null   // ex.: 8  (mostra "Restam 8 horários" — atualize a cada ensaio fechado)
  },

  // Pacotes do Ensaio de Natal (preço em reais, só o número)
  pacotes: [
    { fotos: 10, preco: 450 },
    { fotos: 20, preco: 650, destaque: "Mais escolhido" }
  ],

  // Prazos da agenda (AAAA-MM-DD, valem até 23:59 do dia "ate").
  // O valor é o mesmo o mês todo; a urgência é o prazo de entrega antes do Natal.
  // "preco" é opcional: só preencha se algum prazo tiver valor diferente.
  lotes: [
    {
      id: "natal",
      nome: "Entrega antes do Natal",
      ate: "2026-12-13",
      preco: null,
      chamada: "Agende até 13/12 e receba as fotos editadas antes do dia 24.",
      contagem: "Para receber antes do Natal, agende em até",
      topo: "Para receber as fotos antes do Natal, agende em até"
    },
    {
      id: "expresso",
      nome: "Encaixe expresso",
      de: "2026-12-14",
      ate: "2026-12-22",
      preco: null,
      chamada: "Última chance: ensaio + entrega expressa antes da ceia.",
      contagem: "O encaixe expresso termina em",
      topo: "Últimos encaixes com entrega antes da ceia: faltam"
    }
  ],

  // Último dia que aparece no seletor de datas do agendamento
  ultimoDiaAgenda: "2026-12-22",

  // Períodos oferecidos no agendamento
  periodos: ["Manhã", "Tarde", "Fim de tarde"]
};
