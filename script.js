const WA_NUMBER="6283145634486";
let cart=[];
const $=id=>document.getElementById(id);
function rupiah(n){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n)}
function addToCart(name,price){const item=cart.find(x=>x.name===name);if(item)item.qty++;else cart.push({name,price,qty:1});renderCart();openCart()}
function renderCart(){
 $("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
 $("items").innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-item"><span><b>${x.name}</b><br><small>${rupiah(x.price)} × ${x.qty}</small></span><span><button onclick="changeQty(${i},-1)">−</button> <button onclick="changeQty(${i},1)">+</button></span></div>`).join(""):'<div class="empty">Keranjang masih kosong.</div>';
 $("total").textContent=rupiah(cart.reduce((s,x)=>s+x.price*x.qty,0));
}
function changeQty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);renderCart()}
function openCart(){$("cart").classList.add("show")}
function closeCart(){$("cart").classList.remove("show")}
function checkout(){
 if(!cart.length){alert("Keranjang masih kosong.");return}
 const lines=cart.map(x=>`- ${x.name} x${x.qty} = ${rupiah(x.price*x.qty)}`).join("\n");
 const total=rupiah(cart.reduce((s,x)=>s+x.price*x.qty,0));
 const text=`Halo KTH Sinar Makmur, saya ingin memesan:\n\n${lines}\n\nTotal: ${total}\n\nNama:\nAlamat:\nCatatan:`;
 window.open("https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(text),"_blank");
}
$("menuBtn").addEventListener("click",()=>$("navMenu").classList.toggle("open"));
document.querySelectorAll("#navMenu a").forEach(a=>a.addEventListener("click",()=>$("navMenu").classList.remove("open")));
renderCart();