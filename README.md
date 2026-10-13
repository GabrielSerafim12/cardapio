📱 Cardápio Digital Dinâmico & Multi-Loja (QR Code)

Aplicação web responsiva e centralizada para gerenciamento de cardápios digitais interativos com envio de pedidos diretamente para o WhatsApp do estabelecimento. Desenvolvido para atender múltiplos estabelecimentos comerciais por meio de uma única estrutura de código, utilizando roteamento dinâmico via parâmetros de URL (?loja=...) e geração instantânea de QR Code.

🚀 Funcionalidades

Multi-Estabelecimento Dinâmico: Carregamento de dados (produtos, contatos, temas) com base no parâmetro loja na URL.

Temas Visuais Personalizados: Alternância automática de esquemas de cores e estilos CSS conforme a identidade visual do estabelecimento selecionado.

QR Code Dinâmico: Gerador integrado que cria um QR Code exclusivo apontando diretamente para a URL ativa do estabelecimento.

Integração com WhatsApp: Montagem automática da mensagem do pedido formatada para envio direto ao WhatsApp do comerciante.

Design Responsivo: Interface otimizada para dispositivos móveis (Mobile-First) e computadores.

Filtro por Categorias: Navegação fluida entre tipos de produtos (Lanches, Porções, Bebidas, Sobremesas).

🛠️ Tecnologias Utilizadas

HTML5: Estruturação semântica da aplicação.

CSS3: Estilização moderna, suporte a variáveis e temas (theme-emerald, theme-burger).

JavaScript (ES6+): Lógica do carrinho, manipulação da DOM e leitura dinâmica de URL (URLSearchParams).

QRCode.js: Biblioteca para geração de QR Code dinâmico no cliente.

Git & GitHub Pages: Controle de versão e hospedagem contínua.

📂 Estrutura do Projeto

cardapio-qr-starter/
├── index.html        # Estrutura principal da página
├── style.css         # Estilização global e temas visuais
├── script.js        # Regras de negócio, carrinho e modal de QR Code
├── data.js          # Banco de dados centralizado dos estabelecimentos
└── README.md        # Documentação do projeto


⚙️ Como Funciona o Roteamento por URL

O sistema utiliza os parâmetros da barra de endereços para identificar qual estabelecimento deve ser exibido:

Loja Padrão: https://seu-usuario.github.io/cardapio/

Loja Secundária: https://seu-usuario.github.io/cardapio/?loja=burguer-do-ze

O script data.js lê o parâmetro loja da URL e busca os dados correspondentes no objeto global stores. Caso o parâmetro não seja informado ou a loja não exista, o sistema exibe a loja padrão (Sabor da Casa).

➕ Como Adicionar uma Nova Loja

Para cadastrar um novo cliente/estabelecimento, basta adicionar um novo objeto dentro do arquivo data.js:

stores["nova-loja"] = {
  name: "Nome da Sua Loja",
  whatsapp: "5511999999999",
  themeClass: "theme-emerald", // Classe de tema CSS
  products: [
    {
      id: 1,
      name: "Produto Exemplo",
      description: "Descrição do produto...",
      price: 25.00,
      category: "Lanches",
      image: "https://link-da-imagem.com/foto.jpg",
      tag: "Destaque"
    }
  ]
};


Para acessar essa nova loja, basta utilzar a URL: .../?loja=nova-loja.

💻 Como Rodar o Projeto Localmente

Clone este repositório:

git clone https://github.com/seu-usuario/nome-do-repositorio.git


Navegue até o diretório do projeto:

cd nome-do-repositorio


Abra o arquivo index.html utilizando a extensão Live Server do VS Code (ou qualquer servidor local HTTP).

Altere a URL no navegador para testar os múltiplos estabelecimentos:

http://127.0.0.1:5500/?loja=sabor-da-casa

http://127.0.0.1:5500/?loja=burguer-do-ze

🎓 Contexto Acadêmico

Este projeto foi desenvolvido como aplicação prática no 1º Semestre do curso de Engenharia de Software, abordando conceitos primordiais de:

Manipulação da DOM em JavaScript puro.

Parâmetros e manipulação de estado na URL.

Arquitetura de dados centralizados (Data-driven UI).

Hospedagem e versionamento em nuvem com Git/GitHub Pages.

Desenvolvido por Gabriel Santos Serafim