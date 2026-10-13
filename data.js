// data.js - Banco de dados centralizado para múltiplos cardápios e temas

const stores = {
  "sabor-da-casa": {
    name: "Sabor da Casa",
    whatsapp: "5511945466384",
    themeClass: "theme-emerald", // Tema verde padrão
    products: [
      {
        id: 1,
        name: "X-Burger da Casa",
        description: "Hambúrguer artesanal, queijo derretido, alface e molho especial.",
        price: 18.00,
        category: "Lanches",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
        tag: "Favorito"
      },
      {
        id: 2,
        name: "X-Salada",
        description: "Hambúrguer, queijo, alface fresca, tomate e maionese da casa.",
        price: 22.00,
        category: "Lanches",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=900&q=85",
        tag: ""
      },
      {
        id: 3,
        name: "Batata crocante",
        description: "Porção de batatas douradas, crocantes por fora e macias por dentro.",
        price: 12.00,
        category: "Porções",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
        tag: ""
      },
      {
        id: 4,
        name: "Anéis de cebola",
        description: "Anéis empanados e crocantes para dividir com a galera.",
        price: 16.00,
        category: "Porções",
        image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=85",
        tag: ""
      },
      {
        id: 5,
        name: "Refrigerante gelado",
        description: "Lata de refrigerante bem gelada para acompanhar seu pedido.",
        price: 6.00,
        category: "Bebidas",
        image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=900&q=85",
        tag: ""
      },
      {
        id: 6,
        name: "Suco natural",
        description: "Suco refrescante feito para acompanhar sua refeição.",
        price: 8.00,
        category: "Bebidas",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=85",
        tag: ""
      },
      {
        id: 7,
        name: "Brownie com chocolate",
        description: "Brownie macio com sabor intenso de chocolate.",
        price: 10.00,
        category: "Sobremesas",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85",
        tag: ""
      },
      {
        id: 8,
        name: "Sorvete",
        description: "Uma sobremesa gelada para fechar a refeição.",
        price: 9.00,
        category: "Sobremesas",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=85",
        tag: ""
      }
    ]
  },
  "burguer-do-ze": {
    name: "Burguer do Zé",
    whatsapp: "5511999999999",
    themeClass: "theme-burger", // Tema vermelho clássico
    products: [
      {
        id: 1,
        name: "X-Tudo Monstro",
        description: "Dois hambúrgueres, muito bacon, ovo, queijo cheddar e salada.",
        price: 28.00,
        category: "Lanches",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=900&q=85",
        tag: "Mais Vendido"
      },
      {
        id: 2,
        name: "Refrigerante Lata",
        description: "Coca-Cola ou Guaraná bem gelado.",
        price: 6.00,
        category: "Bebidas",
        image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=900&q=85",
        tag: ""
      }
    ]
  }
};

// Pega o parâmetro 'loja' da URL (ex: ?loja=burguer-do-ze)
const urlParams = new URLSearchParams(window.location.search);
const storeKey = urlParams.get("loja") || "sabor-da-casa";

// Define a loja ativa e os produtos com base na URL
const RESTAURANT = stores[storeKey] || stores["sabor-da-casa"];
const products = RESTAURANT.products;