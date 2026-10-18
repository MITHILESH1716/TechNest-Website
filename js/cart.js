// Cart persistence, quantity changes, coupon discount and totals.
function getCartProduct(id){return products.find(product=>product.id===Number(id));}
function addToCart(id,quantity=1){
 const product=getCartProduct(id);if(!product){showToast("Sorry, this product is unavailable.");return;}
 const existing=cart.find(item=>item.id===product.id);
 if(existing)existing.quantity=Math.min(20,existing.quantity+quantity);else cart.push({id:product.id,quantity:Math.min(20,quantity)});
 writeStore("technest-cart",cart);renderCart();showToast(`${product.name} added to your bag.`);
}
function changeCartQuantity(id,delta){
 const item=cart.find(row=>row.id===Number(id));if(!item)return;
 item.quantity+=delta;if(item.quantity<1)cart=cart.filter(row=>row.id!==Number(id));if(item.quantity>20)item.quantity=20;
 writeStore("technest-cart",cart);renderCart();
}
function removeCartItem(id){cart=cart.filter(item=>item.id!==Number(id));writeStore("technest-cart",cart);renderCart();showToast("Item removed from your bag.");}
function getSubtotal(){return cart.reduce((sum,item)=>{const product=getCartProduct(item.id);return sum+(product?product.price*item.quantity:0);},0);}
function getDiscount(){return couponApplied?Math.round(getSubtotal()*.10):0;}
function getTotal(){return Math.max(0,getSubtotal()-getDiscount());}
function renderCart(){
 cart=cart.filter(item=>getCartProduct(item.id)&&item.quantity>0);
 const count=cart.reduce((sum,item)=>sum+item.quantity,0);
 $("#cartCount").textContent=count;$("#drawerCount").textContent=`(${count})`;
 if(!cart.length){$("#cartItems").innerHTML=`<div class="cart-empty"><span>♡</span><h3>Your bag is taking a breather.</h3><p>Find something useful for your everyday.</p><button class="button button-dark" id="emptyCartShop">Explore products <span>→</span></button></div>`;$("#emptyCartShop").addEventListener("click",()=>{closeCart();location.hash="products";});}
 else{$("#cartItems").innerHTML=cart.map(item=>{const product=getCartProduct(item.id);return `<article class="cart-item"><img src="${product.image}" alt="${safeText(product.name)}" onerror="this.onerror=null;this.src='https://placehold.co/150x170/e9e8df/333333?text=TechNest'"><div><h3 class="cart-item-name">${safeText(product.name)}</h3><div class="cart-item-category">${safeText(product.category)}</div><div class="cart-item-price">${money(product.price*item.quantity)}</div><div class="quantity-control"><button data-quantity="${product.id}" data-delta="-1" aria-label="Decrease ${safeText(product.name)} quantity">−</button><span>${item.quantity}</span><button data-quantity="${product.id}" data-delta="1" aria-label="Increase ${safeText(product.name)} quantity">+</button></div></div><button class="remove-item" data-remove="${product.id}" aria-label="Remove ${safeText(product.name)}">×</button></article>`;}).join("");}
 $("#cartSubtotal").textContent=money(getSubtotal());$("#cartDiscount").textContent=`−${money(getDiscount())}`;$("#cartTotal").textContent=money(getTotal());
 $("#couponMessage").innerHTML=couponApplied?`<strong>TECH10 applied!</strong> 10% discount added.`:'Try <strong>TECH10</strong> for 10% off.';
 $("#applyCoupon").textContent=couponApplied?"Applied ✓":"Apply";
 writeStore("technest-cart",cart);
}
$("#cartItems").addEventListener("click",event=>{
 const qty=event.target.closest("[data-quantity]");if(qty){changeCartQuantity(qty.dataset.quantity,Number(qty.dataset.delta));return;}
 const remove=event.target.closest("[data-remove]");if(remove)removeCartItem(remove.dataset.remove);
});
$("#applyCoupon").addEventListener("click",()=>{
 const code=$("#couponInput").value.trim().toUpperCase();
 if(couponApplied){showToast("TECH10 is already applied.");return;}
 if(code==="TECH10"){couponApplied=true;writeStore("technest-coupon",true);renderCart();showToast("Nice! 10% discount applied.");}
 else{ $("#couponMessage").textContent="That code didn't work. Try TECH10.";showToast("Invalid coupon code.");}
});
$("#startCheckout").addEventListener("click",()=>{
 if(!cart.length){showToast("Add a product before checking out.");return;}
 closeCart();$("#checkoutTotal").textContent=money(getTotal());$("#checkoutView").hidden=false;$("#orderSuccess").hidden=true;$("#checkoutModal").hidden=false;syncOverlay();
});
renderCart();
