// ===== PERSONALIZE AQUI =====
// Troque o nome, os produtos e o telefone pelos dados do restaurante.
// O telefone deve conter código do país + DDD + número, só com dígitos.
// Exemplo Brasil: 5511999999999
const RESTAURANT = {
  name: "Sabor da Casa",
  whatsapp: "5511945466384" // TROQUE pelo WhatsApp real antes de publicar.
};

// Para adicionar ou editar produtos, altere esta lista.
// image aceita uma URL de imagem. Os exemplos usam fotos públicas do Unsplash.
const products = [
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
];

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const productGrid = document.querySelector("#productGrid");
const categoryList = document.querySelector("#categoryList");
const searchInput = document.querySelector("#searchInput");
const resultsCount = document.querySelector("#resultsCount");
const emptyState = document.querySelector("#emptyState");
const cartCount = document.querySelector("#cartCount");
const orderDialog = document.querySelector("#orderDialog");
const orderItems = document.querySelector("#orderItems");
const orderTotal = document.querySelector("#orderTotal");
const qrDialog = document.querySelector("#qrDialog");
const qrOutput = document.querySelector("#qrOutput");
const currentUrl = document.querySelector("#currentUrl");
const downloadQrButton = document.querySelector("#downloadQrButton");
const qrStatus = document.querySelector("#qrStatus");
const toast = document.querySelector("#toast");

let selectedCategory = "Todos";
const cart = new Map();

function renderProducts() {
  const term = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const filtered = products.filter(product => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const searchable = `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase("pt-BR");
    return matchesCategory && searchable.includes(term);
  });

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/700x450/ece8dc/173f35?text=Foto+do+produto';">
        <span class="product-category">${escapeHtml(product.tag || product.category)}</span>
      </div>
      <div class="product-info">
        <div class="product-title-row">
          <h3 class="product-title">${escapeHtml(product.name)}</h3>
          <span class="product-price">${currency.format(product.price)}</span>
        </div>
        <p class="product-description">${escapeHtml(product.description)}</p>
        <button class="add-button" type="button" data-add="${product.id}">
          <span aria-hidden="true">+</span> Adicionar ao pedido
        </button>
      </div>
    </article>
  `).join("");

  resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? "produto" : "produtos"}`;
  emptyState.classList.toggle("hidden", filtered.length !== 0);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function addToCart(productId) {
  const current = cart.get(productId) || 0;
  cart.set(productId, current + 1);
  updateCartCount();
  showToast("Adicionado ao seu pedido");
}

function updateCartCount() {
  const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  cartCount.textContent = count;
}

function renderOrder() {
  const items = [...cart.entries()]
    .map(([id, quantity]) => ({ product: products.find(product => product.id === id), quantity }))
    .filter(item => item.product);

  if (items.length === 0) {
    orderItems.innerHTML = '<p class="small-note">Seu pedido está vazio. Adicione algum produto do cardápio.</p>';
  } else {
    orderItems.innerHTML = items.map(({ product, quantity }) => `
      <div class="order-row">
        <div>
          <div class="order-product-name">${escapeHtml(product.name)}</div>
          <div class="order-product-price">${currency.format(product.price)} cada · ${currency.format(product.price * quantity)}</div>
        </div>
        <div class="quantity-controls" aria-label="Quantidade de ${escapeHtml(product.name)}">
          <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Diminuir">−</button>
          <span>${quantity}</span>
          <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Aumentar">+</button>
        </div>
      </div>
    `).join("");
  }

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  orderTotal.textContent = currency.format(total);
  document.querySelector("#whatsappButton").disabled = items.length === 0;
}

function changeQuantity(productId, change) {
  const next = (cart.get(productId) || 0) + change;
  if (next <= 0) cart.delete(productId);
  else cart.set(productId, next);
  updateCartCount();
  renderOrder();
}

function sendWhatsAppOrder() {
  const items = [...cart.entries()]
    .map(([id, quantity]) => ({ product: products.find(product => product.id === id), quantity }))
    .filter(item => item.product);

  if (!items.length) return;
  if (!/^\d{10,15}$/.test(RESTAURANT.whatsapp) || RESTAURANT.whatsapp === "5511999999999") {
    showToast("Configure o WhatsApp do restaurante no arquivo script.js");
    return;
  }

  const lines = items.map(({ product, quantity }) =>
    `${quantity}x ${product.name} - ${currency.format(product.price * quantity)}`
  );
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const message = `Olá! Gostaria de fazer este pedido:\n\n${lines.join("\n")}\n\nTotal estimado: ${currency.format(total)}\n\nAguardo a confirmação.`;
  window.open(`https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function openQrDialog() {
  qrDialog.showModal();
  
  // Definição correta do seu link do GitHub Pages (com apenas uma barra no final)
  const siteUrl = "https://gabrielserafim12.github.io/cardapio/";
  currentUrl.textContent = siteUrl;

  qrOutput.innerHTML = "";
  downloadQrButton.disabled = true;

  if (window.location.protocol === "file:") {
    qrStatus.textContent = "Você abriu o arquivo diretamente. O QR Code gerado usará o link público do GitHub.";
  } else if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    qrStatus.textContent = "Endereço local de teste: o QR Code gerado usará o link público do GitHub.";
  } else {
    qrStatus.textContent = "Este QR Code aponta para o cardápio online no GitHub. Teste-o com outro celular antes de imprimir.";
  }

  if (typeof QRCode === "undefined") {
    qrOutput.textContent = "Não foi possível carregar o gerador de QR Code. Verifique sua conexão com a internet.";
    return;
  }

  // Gerando o QR Code usando a variável siteUrl
  new QRCode(qrOutput, {
    text: siteUrl,
    width: 220,
    height: 220,
    colorDark: "#173f35",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  window.setTimeout(() => {
    const canvas = qrOutput.querySelector("canvas");
    const image = qrOutput.querySelector("img");
    if (canvas || image) downloadQrButton.disabled = false;
  }, 100);
}

function downloadQr() {
  const canvas = qrOutput.querySelector("canvas");
  const image = qrOutput.querySelector("img");
  let dataUrl = "";
  if (canvas) dataUrl = canvas.toDataURL("image/png");
  else if (image && image.src.startsWith("data:")) dataUrl = image.src;
  if (!dataUrl) {
    showToast("O QR Code ainda não está pronto.");
    return;
  }
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "qr-code-cardapio.png";
  link.click();
}

categoryList.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  categoryList.querySelectorAll(".category-button").forEach(item => item.classList.toggle("active", item === button));
  renderProducts();
});
searchInput.addEventListener("input", renderProducts);
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
document.querySelector("#viewOrderButton").addEventListener("click", () => {
  renderOrder();
  orderDialog.showModal();
});
orderItems.addEventListener("click", event => {
  const button = event.target.closest("[data-quantity]");
  if (button) changeQuantity(Number(button.dataset.quantity), Number(button.dataset.change));
});
document.querySelector("#whatsappButton").addEventListener("click", sendWhatsAppOrder);
document.querySelector("#openQrButton").addEventListener("click", openQrDialog);
downloadQrButton.addEventListener("click", downloadQr);
document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => document.getElementById(button.dataset.close).close());
});
[orderDialog, qrDialog].forEach(dialog => {
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
});
document.querySelector("#currentYear").textContent = new Date().getFullYear();

renderProducts();
