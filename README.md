# leilaalcantara.com.br

Site da Leila Alcântara Fotografia, focado no **Ensaio de Natal 2026** (campanha Meta Ads).
HTML/CSS/JS puro, publicado no GitHub Pages com domínio próprio via Cloudflare.

## Editar valores, vagas e lotes

Tudo fica em [`js/config.js`](js/config.js):

- `pacotes` — fotos e preço de cada pacote (hoje 10 fotos R$ 450 e 20 fotos R$ 650).
- `ensaio.duracao`, `ensaio.parcelas` — aparecem no bloco "Valores" quando preenchidos.
- `ensaio.vagasRestantes` — mostra "Restam X horários" no topo e no agendamento. Atualize a cada ensaio fechado.
- `lotes` — prazos da agenda: entrega antes do Natal (até 13/12) e encaixe expresso (14–22/12). O valor é o mesmo nos dois; `preco` só se algum prazo mudar de valor.
  O site troca de prazo sozinho pela data e faz a contagem regressiva.
- `metaPixelId` — ID do Pixel da Meta. Com ele preenchido, o site registra `Contact` (clique no WhatsApp) e `Lead` (pedido enviado pelo agendamento).
- `mensagens.anuncio` — mensagem do WhatsApp para quem chega por anúncio (link com `utm_source` ou `fbclid`).

## Link para os anúncios

Use no anúncio: `https://leilaalcantara.com.br/?utm_source=meta&utm_medium=paid&utm_campaign=natal2026`

Assim a mensagem que chega no WhatsApp começa com "Vi o anúncio do Ensaio de Natal", e dá para contar quantos agendamentos vieram do tráfego.
