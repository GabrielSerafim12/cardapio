// ===== PERSONALIZE AQUI =====
// Troque o nome, os produtos e o telefone pelos dados do restaurante.
// O telefone deve conter código do país + DDD + número, só com dígitos.
// Exemplo Brasil: 5511999999999


// Para adicionar ou editar produtos, altere esta lista.
// image aceita uma URL de imagem. Os exemplos usam fotos públicas do Unsplash.

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
  
  // MUDANÇA AQUI: Pegamos a URL atual do navegador dinamicamente
  // Se estiver no GitHub Pages ou em teste, isso garante que o ?loja=... seja incluído
  let siteUrl = window.location.href;

  // Opcional: Se você estiver testando localmente (Live Server) mas quiser que o QR Code 
  // já aponte para o link do GitHub com a loja certa caso ela exista na URL:
  const urlParams = new URLSearchParams(window.location.search);
  const lojaAtual = urlParams.get("loja");

  if (window.location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    // Se estiver testando no PC, montamos o link do GitHub simulando a loja atual
    const baseGithub = "https://gabrielserafim12.github.io/cardapio/";
    siteUrl = lojaAtual ? `${baseGithub}?loja=${lojaAtual}` : baseGithub;
  }

  currentUrl.textContent = siteUrl;

  qrOutput.innerHTML = "";
  downloadQrButton.disabled = true;

  if (window.location.protocol === "file:") {
    qrStatus.textContent = "Você abriu o arquivo diretamente. O QR Code gerado usará o link público do GitHub.";
  } else if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    qrStatus.textContent = "Endereço local de teste: o QR Code gerado usará o link público do GitHub com a loja atual.";
  } else {
    qrStatus.textContent = "Este QR Code aponta para o cardápio online no GitHub com esta loja ativa. Teste-o com outro celular antes de imprimir.";
  }

  if (typeof QRCode === "undefined") {
    qrOutput.textContent = "Não foi possível carregar o gerador de QR Code. Verifique sua conexão com a internet.";
    return;
  }

  // Gerando o QR Code usando a variável siteUrl dinâmica
  new QRCode(qrOutput, {
    text: siteUrl,
    width: 220,
    height: 220,
    colorDark: "#173f35",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}


  window.setTimeout(() => {
    const canvas = qrOutput.querySelector("canvas");
    const image = qrOutput.querySelector("img");
    if (canvas || image) downloadQrButton.disabled = false;
  }, 100);


function downloadQr() {
  const canvas = qrOutput.querySelector("canvas");
  const image = qrOutput.querySelector("img");
  let dataUrl = "";

  if (canvas) {
    dataUrl = canvas.toDataURL("image/png");
  } else if (image && image.src) {
    // Pegamos qualquer src válido que a biblioteca tenha inserido na imagem
    dataUrl = image.src;
  }

  if (!dataUrl) {
    showToast("O QR Code ainda não está pronto.");
    return;
  }

  // Tenta extrair o nome da loja ativa para dar um nome personalizado ao arquivo
  const urlParams = new URLSearchParams(window.location.search);
  const lojaAtual = urlParams.get("loja") || "cardapio";

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `qrcode-${lojaAtual}.png`; // Baixa como "qrcode-burguer-do-ze.png"
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
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

if (RESTAURANT.themeClass) {
    document.body.className = RESTAURANT.themeClass;
    }
    document.title = RESTAURANT.name;

renderProducts();
