const SQUARE_CHECKOUT_FUNCTION_URL =
  "https://wxfizlkphvgsmikhsosx.supabase.co/functions/v1/create-square-checkout";

const CART_KEY = "techniqCart";

const PRODUCTS = [
  {
    id: "barrier-balancing-moisturizer",
    name: "Barrier Balancing Moisturizer",
    description: "Nourishing prickly pear cactus and calming bisabolol pair with humectants to enhance moisture and support the skin's texture.",
    image: "images/barrier-balancing-moisturizer.png",
    skinType: ["Dry", "Sensitive"],
    concerns: ["Dehydration"],
    productType: ["Moisturizer"],
    variants: [{ name: "1.8 oz", price: 28.0 }]
  },
  {
    id: "blemish-spot-treatment",
    name: "Blemish Spot Treatment",
    description: "Our Blemish Spot Treatment is perfect to aid in alleviating active breakouts and treating cystic acne.",
    image: "images/blemish-spot-treatment.png",
    skinType: ["Acne-Prone", "Oily"],
    concerns: ["Acne"],
    productType: ["Other"],
    variants: [{ name: "Regular", price: 22.0 }]
  },
  {
    id: "charcoal-clay-cleanser",
    name: "Charcoal Clay Cleanser",
    description: "This cleanser is infused with charcoal and kaolin clay to absorb excess oil and help prevent clogged pores.",
    image: "images/charcoal-clay-cleanser.png",
    skinType: ["Acne-Prone", "Oily"],
    concerns: ["Acne"],
    productType: ["Cleanser"],
    variants: [
      { name: "2 oz", price: 12.47 },
      { name: "6.4 oz", price: 31.97 }
    ]
  },
  {
    id: "clarifying-toner-pads",
    name: "Clarifying Toner Pads",
    description: "These clarifying toner pads help refine the look of pores and support clearer-looking skin.",
    image: "images/clarifying-toner-pads.png",
    skinType: ["Acne-Prone", "Oily"],
    concerns: ["Acne"],
    productType: ["Toner"],
    variants: [{ name: "2 oz", price: 20.0 }]
  },
  {
    id: "cucumber-hydrating-tonerr",
    name: "Cucumber Hydrating Tonerr",
    description: "A hydrating toner that helps comfort and refresh the skin while supporting a balanced feel.",
    image: "images/cucumber-hydrating-toner.png",
    skinType: ["Dry", "Sensitive"],
    concerns: ["Dehydration"],
    productType: ["Toner"],
    variants: [
      { name: "2 oz", price: 14.0 },
      { name: "3.3 oz", price: 24.0 }
    ]
  },
  {
    id: "glycolic-and-retinol-pads",
    name: "Glycolic and Retinol Pads",
    description: "Exfoliating pads designed to help smooth texture and support a more refined, even-looking complexion.",
    image: "images/glycolic-and-retinol-pads.png",
    skinType: ["Mature"],
    concerns: ["Aging Skin", "Texture"],
    productType: ["Exfoliant", "Toner"],
    variants: [{ name: "2 oz", price: 28.0 }]
  },
  {
    id: "green-tea-citrus-cleanser",
    name: "Green Tea Citrus Cleanser",
    description: "A refreshing cleanser to help lift impurities while leaving skin feeling clean and comfortable.",
    image: "images/green-tea-cleanser.png",
    skinType: ["All"],
    concerns: ["Dullness"],
    productType: ["Cleanser"],
    variants: [
      { name: "2 oz", price: 14.0 },
      { name: "6.4 oz", price: 32.0 }
    ]
  },
  {
    id: "honey-brightening-cleanser",
    name: "Honey Brightening Cleanser",
    description: "A brightening cleanser that supports a clearer-looking, more radiant complexion.",
    image: "images/honey-brightening-cleanser.png",
    skinType: ["All"],
    concerns: ["Dullness", "Hyperpigmentation"],
    productType: ["Cleanser"],
    variants: [
      { name: "2 oz", price: 14.0 },
      { name: "6.4 oz", price: 32.0 }
    ]
  },
  {
    id: "hydrating-moisturizer",
    name: "Hydrating Moisturizer",
    description: "A daily moisturizer designed to support hydration and leave skin feeling smooth and balanced.",
    image: "images/Hydrating-toner-cleanser.png",
    skinType: ["Dry"],
    concerns: ["Dehydration"],
    productType: ["Moisturizer"],
    variants: [{ name: "1.7 oz", price: 30.0 }]
  },
  {
    id: "mandelic-brightening-serum",
    name: "Mandelic Brightening Serum",
    description: "A brightening serum formulated to support a more even-looking tone and improved radiance.",
    image: "images/mandelic-brightening-serum.png",
    skinType: ["All"],
    concerns: ["Dullness", "Hyperpigmentation"],
    productType: ["Serum"],
    variants: [{ name: "1 oz", price: 30.0 }]
  },
  {
    id: "mint-refining-toner",
    name: "Mint Refining Toner",
    description: "A refining toner designed to help balance the look of oil and support a refreshed finish.",
    image: "images/mint-refining-toner.png",
    skinType: ["Oily"],
    concerns: ["Acne"],
    productType: ["Toner"],
    variants: [
      { name: "2 oz", price: 14.0 },
      { name: "6.4 oz", price: 24.0 }
    ]
  },
  {
    id: "pomegranate-antioxidant-cleanser",
    name: "Pomegranate Antioxidant Cleanser",
    description: "An antioxidant cleanser designed to support a clean feel while helping maintain a bright-looking complexion.",
    image: "images/pomegranate-antioxidant-cleanser.png",
    skinType: ["All"],
    concerns: ["Dullness", "Hyperpigmentation"],
    productType: ["Cleanser"],
    variants: [
      { name: "2 oz", price: 12.47 },
      { name: "6.4 oz", price: 31.37 }
    ]
  },
  {
    id: "retinol-2-scrub",
    name: "Retinol 2% Scrub",
    description: "A smoothing scrub formulated to help refine the feel of texture and support a polished look.",
    image: "images/retinol-2-scrub.png",
    skinType: ["Mature"],
    concerns: ["Aging Skin", "Texture"],
    productType: ["Exfoliant"],
    variants: [{ name: "2 oz", price: 40.0 }]
  },
  {
    id: "revitalizing-cucumber-treatment",
    name: "Revitalizing Cucumber Treatment",
    description: "A soothing treatment designed to comfort and refresh the skin with a hydrated, calm finish.",
    image: "images/revitalizing-cucumber-treatment.png",
    skinType: ["Sensitive"],
    concerns: ["Dehydration"],
    productType: ["Mask"],
    variants: [{ name: "2 oz", price: 46.0 }]
  },
  {
    id: "vita-c-green-tea-serum",
    name: "Vita C Green Tea Serum",
    description: "A vitamin C serum designed to support brightness and a more even-looking skin tone.",
    image: "images/vita-c-green-tea-serum.png",
    skinType: ["All"],
    concerns: ["Dullness", "Hyperpigmentation"],
    productType: ["Serum"],
    variants: [{ name: "1 oz", price: 40.0 }]
  }
];

window.PRODUCTS = PRODUCTS;

function money(n) {
  return `$${Number(n).toFixed(2).replace(/\.00$/, "")}`;
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function cartTotal(cart = getCart()) {
  return cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
}

function cartCount(cart = getCart()) {
  return cart.reduce((sum, item) => sum + Number(item.quantity), 0);
}

function addToCart(product, variant) {
  const cart = getCart();
  const cartId = `${product.id}__${variant.name}`;

  const existing = cart.find((item) => item.cartId === cartId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      cartId,
      id: product.id,
      name: product.name,
      variant: variant.name,
      price: Number(variant.price),
      image: product.image || "",
      quantity: 1
    });
  }

  saveCart(cart);
  openCartDrawer();
}

function changeCartQuantity(cartId, change) {
  const cart = getCart();
  const item = cart.find((i) => i.cartId === cartId);
  if (!item) return;

  item.quantity += change;

  const cleaned = cart.filter((i) => i.quantity > 0);
  saveCart(cleaned);
}

function removeFromCart(cartId) {
  saveCart(getCart().filter((i) => i.cartId !== cartId));
}

async function checkoutCart() {
  const cart = getCart();

  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  const btn = document.getElementById("techniqCheckoutBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Starting checkout...";
  }

  try {
    const response = await fetch(SQUARE_CHECKOUT_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cart })
    });

    const data = await response.json();

    if (!response.ok || !data.checkoutUrl) {
      console.error("Square checkout error:", data);
      alert("Checkout could not be started. Check Supabase function logs.");
      return;
    }

    window.location.href = data.checkoutUrl;
  } catch (error) {
    console.error(error);
    alert("Checkout could not be started. Please try again.");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Checkout";
    }
  }
}

function injectCartStyles() {
  if (document.getElementById("techniqCartStyles")) return;

  const style = document.createElement("style");
  style.id = "techniqCartStyles";
  style.textContent = `
    .techniq-cart-fab{
      position:fixed;
      right:18px;
      bottom:18px;
      z-index:2000;
      border:none;
      background:#EBBBA8;
      color:#262626;
      border-radius:999px;
      padding:13px 18px;
      font-family:Inter,sans-serif;
      font-size:14px;
      box-shadow:0 14px 34px rgba(0,0,0,.18);
      cursor:pointer;
      display:flex;
      align-items:center;
      gap:8px;
    }
    .techniq-cart-count{
      min-width:22px;
      height:22px;
      border-radius:999px;
      background:#262626;
      color:#fff;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      font-size:12px;
      padding:0 6px;
    }
    .techniq-cart-panel{
      position:fixed;
      top:0;
      right:0;
      height:100vh;
      width:390px;
      max-width:94vw;
      background:rgba(255,255,255,.96);
      backdrop-filter:blur(14px);
      z-index:2200;
      transform:translateX(110%);
      transition:transform .24s ease;
      box-shadow:-20px 0 60px rgba(0,0,0,.16);
      display:flex;
      flex-direction:column;
      border-left:1px solid rgba(0,0,0,.08);
    }
    .techniq-cart-panel.open{transform:translateX(0);}
    .techniq-cart-head{
      padding:20px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      border-bottom:1px solid rgba(0,0,0,.08);
    }
    .techniq-cart-head h3{
      margin:0;
      font-family:"Playfair Display",serif;
      font-size:24px;
      font-weight:500;
    }
    .techniq-cart-close{
      border:1px solid rgba(0,0,0,.1);
      background:#fff;
      width:38px;
      height:38px;
      border-radius:12px;
      cursor:pointer;
    }
    .techniq-cart-items{
      padding:16px;
      overflow:auto;
      flex:1;
      display:flex;
      flex-direction:column;
      gap:12px;
    }
    .techniq-cart-empty{
      color:#777;
      font-size:14px;
      line-height:1.6;
      padding:12px;
    }
    .techniq-cart-item{
      display:grid;
      grid-template-columns:58px 1fr;
      gap:12px;
      padding:12px;
      border:1px solid rgba(0,0,0,.08);
      border-radius:18px;
      background:rgba(255,255,255,.72);
    }
    .techniq-cart-item img{
      width:58px;
      height:58px;
      object-fit:contain;
      border-radius:14px;
      background:#fff;
    }
    .techniq-cart-item h4{
      margin:0 0 4px;
      font-size:14px;
      line-height:1.25;
    }
    .techniq-cart-item p{
      margin:0 0 8px;
      font-size:12.5px;
      color:#666;
    }
    .techniq-cart-controls{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
    }
    .techniq-qty{
      display:flex;
      align-items:center;
      gap:8px;
    }
    .techniq-qty button,
    .techniq-remove{
      border:1px solid rgba(0,0,0,.1);
      background:#fff;
      border-radius:999px;
      cursor:pointer;
      font-size:13px;
    }
    .techniq-qty button{
      width:28px;
      height:28px;
    }
    .techniq-remove{
      padding:6px 10px;
      color:#8a4b3b;
    }
    .techniq-cart-foot{
      padding:18px 20px 20px;
      border-top:1px solid rgba(0,0,0,.08);
      background:#fff;
    }
    .techniq-total{
      display:flex;
      justify-content:space-between;
      margin-bottom:14px;
      font-weight:600;
    }
    .techniq-checkout{
      width:100%;
      border:none;
      background:#EBBBA8;
      color:#262626;
      border-radius:999px;
      padding:14px 18px;
      cursor:pointer;
      font-size:14px;
      font-weight:600;
    }
    .techniq-continue{
      width:100%;
      border:none;
      background:transparent;
      color:#777;
      margin-top:10px;
      cursor:pointer;
      font-size:13px;
    }
  `;
  document.head.appendChild(style);
}

function injectCartUI() {
  if (document.getElementById("techniqCartFab")) return;

  injectCartStyles();

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <button class="techniq-cart-fab" id="techniqCartFab" type="button">
      Cart <span class="techniq-cart-count" id="techniqCartCount">0</span>
    </button>

    <aside class="techniq-cart-panel" id="techniqCartPanel" aria-hidden="true">
      <div class="techniq-cart-head">
        <h3>Your Routine</h3>
        <button class="techniq-cart-close" id="techniqCartClose" type="button">✕</button>
      </div>
      <div class="techniq-cart-items" id="techniqCartItems"></div>
      <div class="techniq-cart-foot">
        <div class="techniq-total">
          <span>Total</span>
          <span id="techniqCartTotal">$0</span>
        </div>
        <button class="techniq-checkout" id="techniqCheckoutBtn" type="button">Checkout</button>
        <button class="techniq-continue" id="techniqContinueBtn" type="button">Continue shopping</button>
      </div>
    </aside>
    `
  );

  document.getElementById("techniqCartFab").addEventListener("click", openCartDrawer);
  document.getElementById("techniqCartClose").addEventListener("click", closeCartDrawer);
  document.getElementById("techniqContinueBtn").addEventListener("click", closeCartDrawer);
  document.getElementById("techniqCheckoutBtn").addEventListener("click", checkoutCart);

  updateCartUI();
}

function openCartDrawer() {
  injectCartUI();
  const panel = document.getElementById("techniqCartPanel");
  if (panel) {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
  }
}

function closeCartDrawer() {
  const panel = document.getElementById("techniqCartPanel");
  if (panel) {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
  }
}

function updateCartUI() {
  const cart = getCart();
  const countEl = document.getElementById("techniqCartCount");
  const totalEl = document.getElementById("techniqCartTotal");
  const itemsEl = document.getElementById("techniqCartItems");

  if (countEl) countEl.textContent = cartCount(cart);
  if (totalEl) totalEl.textContent = money(cartTotal(cart));

  if (!itemsEl) return;

  if (!cart.length) {
    itemsEl.innerHTML = `<div class="techniq-cart-empty">Your routine is empty. Add products before checkout.</div>`;
    return;
  }

  itemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="techniq-cart-item">
        <img src="${item.image || ""}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <p>${item.variant} · ${money(item.price)}</p>
          <div class="techniq-cart-controls">
            <div class="techniq-qty">
              <button type="button" onclick="changeCartQuantity('${item.cartId}', -1)">−</button>
              <span>${item.quantity}</span>
              <button type="button" onclick="changeCartQuantity('${item.cartId}', 1)">+</button>
            </div>
            <button class="techniq-remove" type="button" onclick="removeFromCart('${item.cartId}')">Remove</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

window.addToCart = addToCart;
window.changeCartQuantity = changeCartQuantity;
window.removeFromCart = removeFromCart;
window.checkoutCart = checkoutCart;

const FILTERS = {
  skinType: ["Dry", "Oily", "Sensitive", "Acne-Prone", "Mature", "All"],
  concerns: ["Acne", "Hyperpigmentation", "Dehydration", "Texture", "Aging Skin", "Dullness", "General"],
  productType: ["Cleanser", "Toner", "Serum", "Moisturizer", "Mask", "Exfoliant", "Other"]
};

const state = {
  selected: {
    skinType: new Set(),
    concerns: new Set(),
    productType: new Set()
  }
};

const ALT_TEXT = {
  "barrier-balancing-moisturizer": "Barrier Balancing Moisturizer Manchester CT",
  "blemish-spot-treatment": "Blemish Spot Treatment Vernon CT",
  "charcoal-clay-cleanser": "Charcoal Clay Cleanser Manchester CT",
  "clarifying-toner-pads": "Clarifying Toner Pads Vernon CT",
  "cucumber-hydrating-tonerr": "Cucumber Hydrating Toner Manchester CT",
  "glycolic-and-retinol-pads": "Glycolic and Retinol Pads Vernon CT",
  "green-tea-citrus-cleanser": "Green Tea Citrus Cleanser Manchester CT",
  "honey-brightening-cleanser": "Honey Brightening Cleanser Vernon CT",
  "hydrating-moisturizer": "Hydrating Moisturizer Manchester CT",
  "mandelic-brightening-serum": "Mandelic Brightening Serum Vernon CT",
  "mint-refining-toner": "Mint Refining Toner Manchester CT",
  "pomegranate-antioxidant-cleanser": "Pomegranate Antioxidant Cleanser Vernon CT",
  "retinol-2-scrub": "Retinol 2% Scrub Manchester CT",
  "revitalizing-cucumber-treatment": "Revitalizing Cucumber Treatment Vernon CT",
  "vita-c-green-tea-serum": "Vita C Green Tea Serum Manchester CT"
};

function getAltText(id) {
  return ALT_TEXT[id] || null;
}

function minPrice(product) {
  const prices = product.variants.map((v) => v.price).filter((p) => typeof p === "number");
  return prices.length ? Math.min(...prices) : null;
}

function bestForLine(product) {
  const s = product.skinType.filter((x) => x !== "All");
  const c = product.concerns.filter((x) => x !== "General");
  const parts = [];
  if (s.length) parts.push(s.join(", "));
  if (c.length) parts.push(c.join(", "));
  return parts.length ? parts.join(" • ") : "All skin types";
}

function buildCheckboxGroup(container, key, options) {
  if (!container) return;

  container.innerHTML = "";

  options.forEach((opt) => {
    const label = document.createElement("label");
    label.className = "check";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = opt;
    input.addEventListener("change", () => {
      if (input.checked) state.selected[key].add(opt);
      else state.selected[key].delete(opt);
      renderProductsPage();
    });

    const span = document.createElement("span");
    span.textContent = opt;

    label.appendChild(input);
    label.appendChild(span);
    container.appendChild(label);
  });
}

function matchesFilters(product) {
  const { skinType, concerns, productType } = state.selected;

  const skinOk =
    skinType.size === 0 ||
    product.skinType.some((t) => skinType.has(t)) ||
    (skinType.has("All") && product.skinType.includes("All"));

  const concernOk =
    concerns.size === 0 || product.concerns.some((c) => concerns.has(c));

  const typeOk =
    productType.size === 0 || product.productType.some((t) => productType.has(t));

  return skinOk && concernOk && typeOk;
}

function renderProductsPage() {
  const gridEl = document.getElementById("productsGrid");
  const countEl = document.getElementById("resultCount");

  if (!gridEl || !countEl) return;

  const filtered = PRODUCTS.filter(matchesFilters);
  countEl.textContent = `Showing ${filtered.length} product${filtered.length === 1 ? "" : "s"}`;

  gridEl.innerHTML = "";

  filtered.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;

    card.addEventListener("click", () => {
      window.location.href = `product.html?id=${encodeURIComponent(p.id)}`;
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.location.href = `product.html?id=${encodeURIComponent(p.id)}`;
      }
    });

    const imgArea = document.createElement("div");
    imgArea.className = "img-area";

    if (p.image) {
      const img = document.createElement("img");
      img.src = p.image;
      img.alt = getAltText(p.id) || p.name;
      img.loading = "lazy";
      imgArea.appendChild(img);
    } else {
      const ph = document.createElement("div");
      ph.className = "img-ph";
      imgArea.appendChild(ph);
    }

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.className = "title";
    title.textContent = p.name;

    const price = document.createElement("p");
    price.className = "price";
    const mp = minPrice(p);
    price.textContent = mp === null ? "" : p.variants.length > 1 ? `From ${money(mp)}` : money(mp);

    const best = document.createElement("p");
    best.className = "bestfor";
    best.innerHTML = `<strong>Best for:</strong> ${bestForLine(p)}`;

    const tags = document.createElement("div");
    tags.className = "tags";

    const tagList = [...new Set([...(p.productType || []).slice(0, 1), ...(p.concerns || []).slice(0, 1)])];
    tagList.forEach((t) => {
      const pill = document.createElement("span");
      pill.className = "tag";
      pill.textContent = t;
      tags.appendChild(pill);
    });

    body.appendChild(title);
    body.appendChild(price);
    body.appendChild(best);
    body.appendChild(tags);

    card.appendChild(imgArea);
    card.appendChild(body);
    gridEl.appendChild(card);
  });
}

function initProductsPage() {
  const gridEl = document.getElementById("productsGrid");
  if (!gridEl) return;

  const drawer = document.getElementById("filterDrawer");
  const overlay = document.getElementById("overlay");
  const filterToggleBtn = document.getElementById("filterToggle");
  const closeDrawerBtn = document.getElementById("closeDrawer");
  const clearBtn = document.getElementById("clearFilters");

  buildCheckboxGroup(document.getElementById("skinTypeFilters"), "skinType", FILTERS.skinType);
  buildCheckboxGroup(document.getElementById("concernFilters"), "concerns", FILTERS.concerns);
  buildCheckboxGroup(document.getElementById("productTypeFilters"), "productType", FILTERS.productType);

  function openDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.add("open");
    overlay.classList.add("show");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.remove("open");
    overlay.classList.remove("show");
    drawer.setAttribute("aria-hidden", "true");
  }

  if (filterToggleBtn) filterToggleBtn.addEventListener("click", openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      Object.values(state.selected).forEach((set) => set.clear());
      document.querySelectorAll("#filterDrawer input[type='checkbox']").forEach((cb) => {
        cb.checked = false;
      });
      renderProductsPage();
    });
  }

  renderProductsPage();
}

document.addEventListener("DOMContentLoaded", () => {
  injectCartUI();
  initProductsPage();
});