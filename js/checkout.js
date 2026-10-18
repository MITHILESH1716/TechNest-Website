// Simulated checkout: generates a demo order number and clears the saved cart.
// Customer form values are intentionally not persisted.
function placeDemoOrder(){
 if(!cart.length){showToast("Your bag is empty.");closeModal(checkoutModal);return;}
 const orderNumber="TN"+Date.now().toString().slice(-8)+Math.floor(Math.random()*90+10);
 const customerName=$("#fullName").value.trim().split(/\s+/)[0];
 const total=money(getTotal());
 $("#orderMessage").textContent=`Thanks, ${customerName}! Your demo order ${orderNumber} has been created. Order total: ${total}. This is a front-end simulation only.`;
 cart=[];couponApplied=false;writeStore("technest-cart",cart);writeStore("technest-coupon",false);renderCart();
 $("#checkoutForm").reset();$$(".field-error").forEach(error=>error.textContent="");$$(".invalid").forEach(field=>field.classList.remove("invalid"));
 $("#checkoutView").hidden=true;$("#orderSuccess").hidden=false;showToast("Demo order created successfully!");
}
$("#continueShopping").addEventListener("click",()=>{closeModal(checkoutModal);location.hash="products";});
