// SAME product data structure as products.js
// In production, this could be shared via an import or API
/*************************************************
 * PRODUCT DATA — FULL LIST
 *************************************************/
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
    productType: ["Treatment"],
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
      { name: "6.4 oz", price: 31.97, checkoutUrl: "https://square.link/u/50gq7WLb" }
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
      { name: "3.3 oz", price: 24.0, checkoutUrl: "https://square.link/u/LAFP39R2" }
    ],
  },
  {
    id: "glycolic-and-retinol-pads",
    name: "Glycolic and Retinol Pads",
    description:
      "Exfoliating pads designed to help smooth texture and support a more refined, even-looking complexion.",
    image: "images/glycolic-and-retinol-pads.png",
    skinType: ["Mature"],
    concerns: ["Aging Skin", "Texture", "Hyperpigmentation"],
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
      { name: "6.4 oz", price: 32.0, checkoutUrl: "https://square.link/u/vCWaYz4F" }
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
      { name: "6.4 oz", price: 32.0, checkoutUrl: "https://square.link/u/Ge2jvI0U" }
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
      { name: "1 oz", price: 30.0, checkoutUrl: "https://square.link/u/aGTwxVuW" },
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
      { name: "6.4 oz", price: 24.0, checkoutUrl: "https://square.link/u/cY8EERQ0" }
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
      { name: "6.4 oz", price: 31.37, checkoutUrl: "https://square.link/u/hSHQO6yv" }
    ],
  },
  {
    id: "retinol-2-scrub",
    name: "Retinol 2% Scrub",
    description:
      "A smoothing scrub formulated to help refine the feel of texture and support a polished look.",
    image: "images/retionol-2%-scrub.png",
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

/*************************************************
 * HELPERS
 *************************************************/
function money(n) {
  return `$${Number(n).toFixed(2).replace(/\.00$/, "")}`;
}

/*************************************************
 * LOAD PRODUCT
 *************************************************/
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const product = PRODUCTS.find(p => p.id === productId);

if (!product) {
  document.body.innerHTML =
    "<p style='padding:40px;font-size:16px'>Product not found.</p>";
  throw new Error("Product not found");
}

/*************************************************
 * DOM ELEMENTS
 *************************************************/
const imgEl = document.getElementById("productImage");
const nameEl = document.getElementById("productName");
const priceEl = document.getElementById("productPrice");
const bestForEl = document.getElementById("productBestFor");
const descEl = document.getElementById("productDescription");
const variantSelect = document.getElementById("variantSelect");
const addToCartBtn = document.querySelector(".add-to-cart");

/*************************************************
 * POPULATE PAGE
 *************************************************/
imgEl.src = product.image;
imgEl.alt = product.name;

nameEl.textContent = product.name;
descEl.textContent = product.description;

bestForEl.innerHTML = `<strong>Best for:</strong> ${[
  ...product.skinType,
  ...product.concerns
].join(", ")}`;

/*************************************************
 * VARIANTS
 *************************************************/
variantSelect.innerHTML = "";

product.variants.forEach((variant, index) => {
  const option = document.createElement("option");
  option.value = index;
  option.textContent = `${variant.name} — ${money(variant.price)}`;
  if (index === 0) option.selected = true;
  variantSelect.appendChild(option);
});

priceEl.textContent = money(product.variants[0].price);

variantSelect.addEventListener("change", () => {
  const selectedVariant = product.variants[variantSelect.value];
  priceEl.textContent = money(selectedVariant.price);
});

/*************************************************
 * ADD TO CART → SQUARE
 *************************************************/
addToCartBtn.addEventListener("click", () => {
  const selectedVariant = product.variants[variantSelect.value];

  if (!selectedVariant.checkoutUrl) {
    alert("Checkout link not set yet for this size.");
    return;
  }

  window.location.href = selectedVariant.checkoutUrl;
});

