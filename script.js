const WA_NUMBER = "6283145634486";

let cart = JSON.parse(localStorage.getItem("kthSinarMakmurCart") || "[]");

const cartEl = document.getElementById("cart");
const overlay = document.getElementById("cartOverlay");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const nav = document.getElementById("mainNav");
const menuBtn = document.getElementById("menuBtn");

function saveCart(){
  localStorage.setItem("kthSinarMakmurCart", JSON.stringify(cart));
}

function openCart(){
  cartEl.classList.add("open");
  overlay.classList.add("open");
}

function closeCart(){
  cartEl.classList.remove("open");
  overlay.classList.remove("open");
}

function addToCart(name, price){
  const found = cart.find(item => item.name === name);
  if(found){
    found.qty += 1;
  }else{
    cart.push({name, price: Number(price) || 0, qty: 1});
  }
  saveCart();
  renderCart();
  openCart();
}

function changeQty(name, amount){
  const item = cart.find(x => x.name === name);
  if(!item) return;
  item.qty += amount;
  if(item.qty <= 0){
    cart = cart.filter(x => x.name !== name);
  }
  saveCart();
  renderCart();
}

function renderCart(){
  const totalQty = cart.reduce((sum,item) => sum + item.qty, 0);
  cartCountEl.textContent = totalQty;

  if(cart.length === 0){
    cartItemsEl.innerHTML = '<p class="empty">Keranjang masih kosong.</p>';
    return;
  }

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-top">
        <span>${escapeHtml(item.name)}</span>
        <span>${item.price ? "Rp " + item.price.toLocaleString("id-ID") : "Konfirmasi harga"}</span>
      </div>
      <small>Jumlah: ${item.qty}</small>
      <div class="qty">
        <button onclick="changeQty('${escapeAttr(item.name)}', -1)">−</button>
        <strong>${item.qty}</strong>
        <button onclick="changeQty('${escapeAttr(item.name)}', 1)">+</button>
        <button onclick="changeQty('${escapeAttr(item.name)}', -${item.qty})" style="margin-left:auto">Hapus</button>
      </div>
    </div>
  `).join("");
}

function checkout(){
  if(cart.length === 0){
    alert("Keranjang masih kosong.");
    return;
  }

  const lines = cart.map((item,index) =>
    `${index + 1}. ${item.name} — ${item.qty} pcs`
  );

  const message =
`Halo KTH Sinar Makmur, saya ingin memesan:

${lines.join("\n")}

Mohon info harga, ketersediaan, dan total pesanan.
Terima kasih.`;

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
}

function escapeHtml(text){
  return text.replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[ch]));
}

function escapeAttr(text){
  return text.replace(/'/g, "\\'");
}

document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    addToCart(btn.dataset.name, btn.dataset.price);
  });
});

document.getElementById("cartNavBtn").addEventListener("click", openCart);
document.getElementById("openCartBtn").addEventListener("click", openCart);
document.getElementById("closeCartBtn").addEventListener("click", closeCart);
document.getElementById("checkoutBtn").addEventListener("click", checkout);
overlay.addEventListener("click", closeCart);

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

renderCart();
