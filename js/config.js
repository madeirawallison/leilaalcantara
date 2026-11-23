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

  // Degraus de urgência (datas no formato AAAA-MM-DD, valem até 23:59 do dia "ate")
  lotes: [
    {
      id: "lote1",
      nome: "1º lote",
      ate: "2026-11-30",
      preco: null,                    // ex.: 390  (número, sem R$)
      chamada: "Agenda aberta com mais opções de horário. Agende essa semana."
    },
    {
      id: "lote2",
      nome: "2º lote",
      de: "2026-12-01",
      ate: "2026-12-13",
      preco: null,
      chamada: "Ainda dá tempo de receber antes do Natal."
    },
    {
      id: "expresso",
      nome: "Encaixe expresso",
      de: "2026-12-14",
      ate: "2026-12-22",
      preco: null,
      chamada: "Última chance: ensaio + entrega expressa antes da ceia."
    }
  ],

  // Último dia que aparece no seletor de datas do agendamento
  ultimoDiaAgenda: "2026-12-22",

  // Períodos oferecidos no agendamento
  periodos: ["Manhã", "Tarde", "Fim de tarde"]
};
