function money(n) {
  return `$${Number(n).toFixed(2).replace(/\.00$/, "")}`;
}

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const product = window.PRODUCTS.find((p) => p.id === productId);

if (!product) {
  document.body.innerHTML =
    "<p style='padding:40px;font-size:16px'>Product not found.</p>";
  throw new Error("Product not found");
}

const imgEl = document.getElementById("productImage");
const nameEl = document.getElementById("productName");
const priceEl = document.getElementById("productPrice");
const bestForEl = document.getElementById("productBestFor");
const descEl = document.getElementById("productDescription");
const variantSelect = document.getElementById("variantSelect");
const addToCartBtn = document.querySelector(".add-to-cart");

imgEl.src = product.image;
imgEl.alt = product.name;

nameEl.textContent = product.name;
descEl.textContent = product.description;

bestForEl.innerHTML = `<strong>Best for:</strong> ${[
  ...product.skinType,
  ...product.concerns
].join(", ")}`;

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
  const selectedVariant = product.variants[Number(variantSelect.value)];
  priceEl.textContent = money(selectedVariant.price);
});

addToCartBtn.addEventListener("click", () => {
  const selectedVariant = product.variants[Number(variantSelect.value)];
  window.addToCart(product, selectedVariant);
});