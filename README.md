# Cardápio QR — projeto inicial

Cardápio digital responsivo feito com HTML, CSS e JavaScript puro.

## Como abrir

1. Extraia o ZIP.
2. Abra a pasta no VS Code.
3. Abra `index.html` no navegador ou use a extensão Live Server.
4. Teste as categorias, busca, adicionar produtos e o resumo do pedido.

## Personalização

Abra `script.js`:
- Edite `RESTAURANT.name` se quiser mudar o nome.
- Troque `RESTAURANT.whatsapp` pelo número real, incluindo país e DDD, somente dígitos (ex.: `5511999999999`).
- Edite o array `products` para mudar nomes, descrições, preços, categorias e fotos.

As fotos de demonstração usam URLs públicas do Unsplash. Para um projeto comercial, use fotos autorizadas pelo restaurante ou imagens com licença adequada.

## QR Code

O botão **QR Code** gera um QR Code apontando para o endereço atual da página e permite baixá-lo como PNG.

- Ao abrir `index.html` diretamente ou pelo `localhost`, o QR Code aponta para um endereço local. Ele não será acessível por clientes em outros celulares.
- Para um QR Code que funcione para os clientes, publique a pasta em uma hospedagem de site estático (por exemplo, Cloudflare Pages ou GitHub Pages), abra o endereço público e gere o QR Code por lá.
- Depois de publicar, teste o QR Code em outro celular antes de imprimir.
- O gerador carrega uma biblioteca por CDN, portanto precisa de internet para gerar o código.

## Limitações da versão inicial

- Os produtos estão definidos no JavaScript. Para alterar o cardápio, edite `script.js` e publique novamente.
- O carrinho existe apenas na memória do navegador; não há processamento real de pedidos no servidor.
- O botão de WhatsApp só funciona depois que você configurar o número real.
- Não há pagamentos online, banco de dados nem painel administrativo.

## Estrutura

- `index.html` — conteúdo e estrutura
- `style.css` — visual responsivo
- `script.js` — produtos, filtros, carrinho, WhatsApp e QR Code
