/* products.js
   - Renders product grid
   - Right-side collapsible filter drawer
   - Click product card => product.html?id=<productId>
*/

/** ====== DATA (pulled from your uploaded Square catalog export) ======
 *  NOTE: Image paths are optional. Add later like:
 *  image: "Images/mandelic-brightening-serum.png"
 */
const PRODUCTS = [
  {
    id: "barrier-balancing-moisturizer",
    name: "Barrier Balancing Moisturizer",
    description:
      "Nourishing prickly pear cactus and calming bisabolol pair with humectants to enhance moisture and support the skin's texture.",
    image: "images/barrier-balancing-moisturizer.png",
    skinType: ["Dry", "Sensitive"],
    concerns: ["Dehydration"],
    productType: ["Moisturizer"],
    variants: [
      { name: "1.8 oz", price: 28.0, checkoutUrl: "https://square.link/u/2VaQCcGC" }
    ],
  },
  {
    id: "blemish-spot-treatment",
    name: "Blemish Spot Treatment",
    description:
      "Our Blemish Spot Treatment is perfect to aid in alleviating active breakouts and treating cystic acne.",
    image: "images/blemish-spot-treatment.png",
    skinType: ["Acne-Prone", "Oily"],
    concerns: ["Acne"],
    productType: ["Other"],
    variants: [
      { name: "Regular", price: 22.0, checkoutUrl: "https://square.link/u/wupKbNmv" }
    ],
  },
  {
    id: "charcoal-clay-cleanser",
    name: "Charcoal Clay Cleanser",
    description:
      "This cleanser is infused with charcoal and kaolin clay to absorb excess oil and help prevent clogged pores.\n\nBest for normal to oily skin types",
    image: "images/charcoal-clay-cleanser.png",
    skinType: ["Acne-Prone", "Oily"],
    concerns: ["Acne"],
    productType: ["Cleanser"],
    variants: [
      { name: "2 oz", price: 12.47, checkoutUrl: "https://square.link/u/50gq7WLb" },
      { name: "6.4 oz", price: 31.97, checkoutUrl: "https://square.link/u/50gq7WLb" },
    ],
  },
  {
    id: "clarifying-toner-pads",
    name: "Clarifying Toner Pads",
    description:
      "These clarifying toner pads help refine the look of pores and support clearer-looking skin.",
    image: "images/clarifying-toner-pads.png",
    skinType: ["Acne-Prone", "Oily"],
    concerns: ["Acne"],
    productType: ["Toner"],
    variants: [
      { name: "2 oz", price: 20.0, checkoutUrl: "https://square.link/u/LvvbLIty" }
    ],
  },
  {
    id: "cucumber-hydrating-tonerr",
    name: "Cucumber Hydrating Tonerr",
    description:
      "A hydrating toner that helps comfort and refresh the skin while supporting a balanced feel.",
    image: "images/cucumber-hydrating-toner.png",
    skinType: ["Dry", "Sensitive"],
    concerns: ["Dehydration"],
    productType: ["Toner"],
    variants: [
      { name: "2 oz", price: 14.0, checkoutUrl: "https://square.link/u/LAFP39R2" },
      { name: "3.3 oz", price: 24.0, checkoutUrl: "https://square.link/u/LAFP39R2" },
    ],
  },
  {
    id: "glycolic-and-retinol-pads",
    name: "Glycolic and Retinol Pads",
    description:
      "Exfoliating pads designed to help smooth texture and support a more refined, even-looking complexion.",
    image: "images/glycolic-and-retinol-pads.png",
    skinType: ["Mature"],
    concerns: ["Aging Skin", "Texture"],
    productType: ["Exfoliant", "Toner"],
    variants: [
      { name: "2 oz", price: 28.0, checkoutUrl: "https://square.link/u/JgnzSkRS" }
    ],
  },
  {
    id: "green-tea-citrus-cleanser",
    name: "Green Tea Citrus Cleanser",
    description:
      "A refreshing cleanser to help lift impurities while leaving skin feeling clean and comfortable.",
    image: "images/green-tea-cleanser.png",
    skinType: ["All"],
    concerns: ["Dullness"],
    productType: ["Cleanser"],
    variants: [
      { name: "2 oz", price: 14.0, checkoutUrl: "https://square.link/u/vCWaYz4F" },
      { name: "6.4 oz", price: 32.0, checkoutUrl: "https://square.link/u/vCWaYz4F" },
    ],
  },
  {
    id: "honey-brightening-cleanser",
    name: "Honey Brightening Cleanser",
    description:
      "A brightening cleanser that supports a clearer-looking, more radiant complexion.",
    image: "images/honey-brightening-cleanser.png",
    skinType: ["All"],
    concerns: ["Dullness", "Hyperpigmentation"],
    productType: ["Cleanser"],
    variants: [
      { name: "2 oz", price: 14.0, checkoutUrl: "https://square.link/u/Ge2jvI0U" },
      { name: "6.4 oz", price: 32.0, checkoutUrl: "https://square.link/u/Ge2jvI0U" },
    ],
  },
  {
    id: "hydrating-moisturizer",
    name: "Hydrating Moisturizer",
    description:
      "A daily moisturizer designed to support hydration and leave skin feeling smooth and balanced.",
    image: "images/Hydrating-toner-cleanser.png",
    skinType: ["Dry"],
    concerns: ["Dehydration"],
    productType: ["Moisturizer"],
    variants: [
      { name: "1.7 oz", price: 30.0, checkoutUrl: "https://square.link/u/xxjQUZxM" }
    ],
  },
  {
    id: "mandelic-brightening-serum",
    name: "Mandelic Brightening Serum",
    description:
      "A brightening serum formulated to support a more even-looking tone and improved radiance.",
    image: "images/mandelic-brightening-serum.png",
    skinType: ["All"],
    concerns: ["Dullness", "Hyperpigmentation"],
    productType: ["Serum"],
    variants: [
      { name: "1 oz", price: 30.0, checkoutUrl: "https://square.link/u/aGTwxVuW" }
    ],
  },
  {
    id: "mint-refining-toner",
    name: "Mint Refining Toner",
    description:
      "A refining toner designed to help balance the look of oil and support a refreshed finish.",
    image: "images/mint-refining-toner.png",
    skinType: ["Oily"],
    concerns: ["Acne"],
    productType: ["Toner"],
    variants: [
      { name: "2 oz", price: 14.0, checkoutUrl: "https://square.link/u/cY8EERQ0" },
      { name: "6.4 oz", price: 24.0, checkoutUrl: "https://square.link/u/cY8EERQ0" },
    ],
  },
  {
    id: "pomegranate-antioxidant-cleanser",
    name: "Pomegranate Antioxidant Cleanser",
    description:
      "An antioxidant cleanser designed to support a clean feel while helping maintain a bright-looking complexion.",
    image: "images/pomegranate-antioxidant-cleanser.png",
    skinType: ["All"],
    concerns: ["Dullness", "Hyperpigmentation"],
    productType: ["Cleanser"],
    variants: [
      { name: "2 oz", price: 12.47, checkoutUrl: "https://square.link/u/hSHQO6yv" },
      { name: "6.4 oz", price: 31.37, checkoutUrl: "https://square.link/u/hSHQO6yv" },
    ],
  },
  {
    id: "retinol-2-scrub",
    name: "Retinol 2% Scrub",
    description:
      "A smoothing scrub formulated to help refine the feel of texture and support a polished look.",
    image: "images/retinol-2-scrub.png",
    skinType: ["Mature"],
    concerns: ["Aging Skin", "Texture"],
    productType: ["Exfoliant"],
    variants: [
      { name: "2 oz", price: 40.0, checkoutUrl: "https://square.link/u/8pGdoI8Z" }
    ],
  },
  {
    id: "revitalizing-cucumber-treatment",
    name: "Revitalizing Cucumber Treatment",
    description:
      "A soothing treatment designed to comfort and refresh the skin with a hydrated, calm finish.",
    image: "images/revitalizing-cucumber-treatment.png",
    skinType: ["Sensitive"],
    concerns: ["Dehydration"],
    productType: ["Mask"],
    variants: [
      { name: "2 oz", price: 46.0, checkoutUrl: "https://square.link/u/MaT8BT92" }
    ],
  },
  {
    id: "vita-c-green-tea-serum",
    name: "Vita C Green Tea Serum",
    description:
      "A vitamin C serum designed to support brightness and a more even-looking skin tone.",
    image: "images/vita-c-green-tea-serum.png",
    skinType: ["All"],
    concerns: ["Dullness", "Hyperpigmentation"],
    productType: ["Serum"],
    variants: [
      { name: "1 oz", price: 40.0, checkoutUrl: "https://square.link/u/oKQCjlG4" }
    ],
  },
];

/** ====== FILTER OPTIONS ====== */
const FILTERS = {
  skinType: ["Dry", "Oily", "Sensitive", "Acne-Prone", "Mature", "All"],
  concerns: ["Acne", "Hyperpigmentation", "Dehydration", "Texture", "Aging Skin", "Dullness", "General"],
  productType: ["Cleanser", "Toner", "Serum", "Moisturizer", "Mask", "Exfoliant", "Other"],
};

const state = {
  selected: {
    skinType: new Set(),
    concerns: new Set(),
    productType: new Set(),
  },
};

/** ====== ALT TEXT (descriptive + locally relevant to Manchester/Vernon, CT) ====== */
const ALT_TEXT = {
  "barrier-balancing-moisturizer":   "Barrier Balancing Moisturizer Manchester CT",
  "blemish-spot-treatment":          "Blemish Spot Treatment Vernon CT",
  "charcoal-clay-cleanser":          "Charcoal Clay Cleanser Manchester CT",
  "clarifying-toner-pads":           "Clarifying Toner Pads Vernon CT",
  "cucumber-hydrating-tonerr":       "Cucumber Hydrating Toner Manchester CT",
  "glycolic-and-retinol-pads":       "Glycolic and Retinol Pads Vernon CT",
  "green-tea-citrus-cleanser":       "Green Tea Citrus Cleanser Manchester CT",
  "honey-brightening-cleanser":      "Honey Brightening Cleanser Vernon CT",
  "hydrating-moisturizer":           "Hydrating Moisturizer Manchester CT",
  "mandelic-brightening-serum":      "Mandelic Brightening Serum Vernon CT",
  "mint-refining-toner":             "Mint Refining Toner Manchester CT",
  "pomegranate-antioxidant-cleanser":"Pomegranate Antioxidant Cleanser Vernon CT",
  "retinol-2-scrub":                 "Retinol 2% Scrub Manchester CT",
  "revitalizing-cucumber-treatment": "Revitalizing Cucumber Treatment Vernon CT",
  "vita-c-green-tea-serum":          "Vita C Green Tea Serum Manchester CT",
};

function getAltText(id) {
  return ALT_TEXT[id] || null;
}

/** ====== DOM ====== */
const gridEl = document.getElementById("productsGrid");
const countEl = document.getElementById("resultCount");

const drawer = document.getElementById("filterDrawer");
const overlay = document.getElementById("overlay");

const filterToggleBtn = document.getElementById("filterToggle");
const closeDrawerBtn = document.getElementById("closeDrawer");
const clearBtn = document.getElementById("clearFilters");

const skinWrap = document.getElementById("skinTypeFilters");
const concernWrap = document.getElementById("concernFilters");
const typeWrap = document.getElementById("productTypeFilters");

/** ====== HELPERS ====== */
function money(n) {
  return `$${Number(n).toFixed(2).replace(/\.00$/, "")}`;
}

function minPrice(product) {
  const prices = product.variants.map(v => v.price).filter(p => typeof p === "number");
  if (!prices.length) return null;
  return Math.min(...prices);
}

function bestForLine(product) {
  // simple readable line; you can adjust
  const s = product.skinType.filter(x => x !== "All");
  const c = product.concerns.filter(x => x !== "General");
  const parts = [];
  if (s.length) parts.push(s.join(", "));
  if (c.length) parts.push(c.join(", "));
  return parts.length ? parts.join(" • ") : "All skin types";
}

function buildCheckboxGroup(container, key, options) {
  container.innerHTML = "";
  options.forEach(opt => {
    const label = document.createElement("label");
    label.className = "check";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = opt;
    input.addEventListener("change", () => {
      if (input.checked) state.selected[key].add(opt);
      else state.selected[key].delete(opt);
      render();
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
    product.skinType.some(t => skinType.has(t)) ||
    (skinType.has("All") && product.skinType.includes("All"));

  const concernOk =
    concerns.size === 0 ||
    product.concerns.some(c => concerns.has(c));

  const typeOk =
    productType.size === 0 ||
    product.productType.some(t => productType.has(t));

  return skinOk && concernOk && typeOk;
}

/** ====== RENDER ====== */
function render() {
  const filtered = PRODUCTS.filter(matchesFilters);

  countEl.textContent = `Showing ${filtered.length} product${filtered.length === 1 ? "" : "s"}`;

  gridEl.innerHTML = "";
  filtered.forEach(p => {
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
    price.textContent = mp === null ? "" : (p.variants.length > 1 ? `From ${money(mp)}` : money(mp));

    const best = document.createElement("p");
    best.className = "bestfor";
    best.innerHTML = `<strong>Best for:</strong> ${bestForLine(p)}`;

    const tags = document.createElement("div");
    tags.className = "tags";

    // light tags (not too many)
    const tagList = [...new Set([...(p.productType || []).slice(0,1), ...(p.concerns || []).slice(0,1)])];
    tagList.forEach(t => {
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

/** ====== DRAWER TOGGLE ====== */
function openDrawer() {
  drawer.classList.add("open");
  overlay.classList.add("show");
  drawer.setAttribute("aria-hidden", "false");
}
function closeDrawer() {
  drawer.classList.remove("open");
  overlay.classList.remove("show");
  drawer.setAttribute("aria-hidden", "true");
}

filterToggleBtn.addEventListener("click", openDrawer);
closeDrawerBtn.addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

// ESC closes drawer
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

clearBtn.addEventListener("click", () => {
  Object.values(state.selected).forEach(set => set.clear());

  // uncheck all inputs
  document.querySelectorAll("#filterDrawer input[type='checkbox']").forEach(cb => {
    cb.checked = false;
  });

  render();
});

/** ====== INIT ====== */
buildCheckboxGroup(skinWrap, "skinType", FILTERS.skinType);
buildCheckboxGroup(concernWrap, "concerns", FILTERS.concerns);
buildCheckboxGroup(typeWrap, "productType", FILTERS.productType);

render();

