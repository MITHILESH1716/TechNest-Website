// Shared storefront state, catalogue rendering, product details, wishlist and theme.
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const money = amount => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(amount);
const readStore = (key, fallback) => { try { const value=localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch(error) { console.warn("Could not read saved data",error); return fallback; } };
const writeStore = (key,value) => { try { localStorage.setItem(key,JSON.stringify(value)); } catch(error) { console.warn("Could not save data",error); showToast("Your browser could not save this change."); } };
let cart = readStore("technest-cart", []);
let wishlist = readStore("technest-wishlist", []);
let activeCategory = "All";
let currentDetailId = null;
let detailQuantity = 1;
let couponApplied = readStore("technest-coupon", false);
let toastTimer;
const productGrid=$("#productGrid"), emptyState=$("#emptyState"), overlay=$("#overlay"), cartDrawer=$("#cartDrawer"), productModal=$("#productModal"), checkoutModal=$("#checkoutModal");

function showToast(message){const toast=$("#toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);}
function safeText(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));}
function productCard(product,index){
 const wished=wishlist.includes(product.id);
 return `<article class="product-card" style="animation-delay:${Math.min(index*35,280)}ms">
 <div class="product-image-wrap" data-detail="${product.id}" tabindex="0" role="button" aria-label="View ${safeText(product.name)}">
 <img class="product-image" src="${product.image}" alt="${safeText(product.name)}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x700/e9e8df/333333?text=TechNest'">
 <span class="product-tag">${safeText(product.tag)}</span>
 <button class="wishlist-button ${wished?"active":""}" data-wishlist="${product.id}" aria-label="${wished?"Remove from":"Add to"} wishlist" aria-pressed="${wished}">${wished?"♥":"♡"}</button>
 <button class="quick-add" data-add="${product.id}">Add to bag +</button></div>
 <div class="product-info"><div class="product-meta"><span>${safeText(product.category)}</span><span class="rating">★ ${product.rating} <span style="color:var(--muted)">(${product.reviews})</span></span></div>
 <h3 class="product-name" data-detail="${product.id}">${safeText(product.name)}</h3><p class="product-description">${safeText(product.description)}</p>
 <div class="product-price">${money(product.price)} <span class="old-price">${money(product.oldPrice)}</span></div></div></article>`;
}
function getFilteredProducts(){
 const query=$("#headerSearch").value.trim().toLowerCase();
 const category=$("#categoryFilter").value;
 const price=$("#priceFilter").value;
 const sort=$("#sortFilter").value;
 let result=products.filter(product=>{
  const matchesQuery=[product.name,product.category,product.description,product.tag].some(value=>value.toLowerCase().includes(query));
  const matchesCategory=category==="All"||product.category===category;
  const matchesPrice=price==="all"||(price==="under1000"&&product.price<1000)||(price==="1000-3000"&&product.price>=1000&&product.price<=3000)||(price==="over3000"&&product.price>3000);
  return matchesQuery&&matchesCategory&&matchesPrice;
 });
 if(sort==="price-low") result.sort((a,b)=>a.price-b.price);
 if(sort==="price-high") result.sort((a,b)=>b.price-a.price);
 if(sort==="rating") result.sort((a,b)=>b.rating-a.rating);
 if(sort==="popular") result.sort((a,b)=>b.popularity-a.popularity);
 if(sort==="featured") result.sort((a,b)=>Number(b.featured)-Number(a.featured)||a.id-b.id);
 return result;
}
function renderProducts(){
 const result=getFilteredProducts();
 productGrid.innerHTML=result.map(productCard).join("");
 $("#resultsCount").textContent=`${result.length} product${result.length===1?"":"s"}`;
 emptyState.hidden=result.length>0;productGrid.hidden=result.length===0;
 const filtersOn=$("#headerSearch").value.trim()||$("#categoryFilter").value!=="All"||$("#priceFilter").value!=="all";
 $("#activeFilters").hidden=!filtersOn;
 $("#filterSummary").textContent=filtersOn?`Showing ${result.length} matching product${result.length===1?"":"s"}`:"";
 $$(".category-tile").forEach(tile=>tile.classList.toggle("selected",tile.dataset.category===activeCategory));
}
function setCategory(category){activeCategory=category;$("#categoryFilter").value=category;renderProducts();if(location.hash!=="#products")location.hash="products";}
function openProductDetails(id){
 const product=products.find(item=>item.id===Number(id));if(!product)return;
 currentDetailId=product.id;detailQuantity=1;
 $("#modalContent").innerHTML=`<div class="product-detail-layout"><img class="detail-image" src="${product.image}" alt="${safeText(product.name)}" onerror="this.onerror=null;this.src='https://placehold.co/600x700/e9e8df/333333?text=TechNest'"><div class="detail-copy"><p class="eyebrow">${safeText(product.category)} / ${safeText(product.tag)}</p><h2 id="modalName">${safeText(product.name)}</h2><div class="rating">★ ${product.rating} <span style="color:var(--muted)">(${product.reviews} reviews)</span></div><div class="detail-price">${money(product.price)} <span class="old-price">${money(product.oldPrice)}</span></div><p>${safeText(product.description)}</p><p class="availability">● ${safeText(product.availability)}</p><div class="detail-quantity"><span style="font-size:10px;color:var(--muted);margin-right:5px">QUANTITY</span><button id="detailMinus" aria-label="Decrease quantity">−</button><span id="detailQty">1</span><button id="detailPlus" aria-label="Increase quantity">+</button></div><button class="button button-dark detail-add" id="detailAdd">Add to bag — ${money(product.price)} <span>→</span></button></div></div>`;
 productModal.hidden=false;syncOverlay();document.body.classList.add("modal-open");
 $("#detailMinus").addEventListener("click",()=>{detailQuantity=Math.max(1,detailQuantity-1);updateDetailQty(product);});
 $("#detailPlus").addEventListener("click",()=>{detailQuantity=Math.min(20,detailQuantity+1);updateDetailQty(product);});
 $("#detailAdd").addEventListener("click",()=>{addToCart(product.id,detailQuantity);closeModal(productModal);});
}
function updateDetailQty(product){$("#detailQty").textContent=detailQuantity;$("#detailAdd").innerHTML=`Add to bag — ${money(product.price*detailQuantity)} <span>→</span>`;}
function toggleWishlist(id){
 id=Number(id);if(wishlist.includes(id)){wishlist=wishlist.filter(item=>item!==id);showToast("Removed from your wishlist.");}else{wishlist.push(id);showToast("Saved to your wishlist ♡");}
 writeStore("technest-wishlist",wishlist);renderProducts();
}
function renderWishlist(){if(!wishlist.length){showToast("Your wishlist is waiting for a favourite.");return;}const names=wishlist.map(id=>products.find(p=>p.id===id)?.name).filter(Boolean);showToast(`Wishlist: ${names.slice(0,2).join(", ")}${names.length>2?` and ${names.length-2} more`:""}`);}
function syncOverlay(){const anyOpen=cartDrawer.classList.contains("open")||!productModal.hidden||!checkoutModal.hidden;overlay.classList.toggle("visible",anyOpen);document.body.classList.toggle("modal-open",anyOpen);}
function openCart(){cartDrawer.classList.add("open");cartDrawer.setAttribute("aria-hidden","false");syncOverlay();}
function closeCart(){cartDrawer.classList.remove("open");cartDrawer.setAttribute("aria-hidden","true");syncOverlay();}
function closeModal(modal){modal.hidden=true;if(modal===checkoutModal){$("#checkoutView").hidden=false;$("#orderSuccess").hidden=true;}syncOverlay();}
function closeAll(){closeCart();if(!productModal.hidden)closeModal(productModal);if(!checkoutModal.hidden)closeModal(checkoutModal);}
function resetFilters(){ $("#headerSearch").value="";$("#categoryFilter").value="All";$("#priceFilter").value="all";$("#sortFilter").value="featured";activeCategory="All";renderProducts();}
productGrid.addEventListener("click",event=>{
 const wishlistButton=event.target.closest("[data-wishlist]");if(wishlistButton){event.stopPropagation();toggleWishlist(wishlistButton.dataset.wishlist);return;}
 const addButton=event.target.closest("[data-add]");if(addButton){event.stopPropagation();addToCart(Number(addButton.dataset.add),1);return;}
 const detail=event.target.closest("[data-detail]");if(detail)openProductDetails(detail.dataset.detail);
});
productGrid.addEventListener("keydown",event=>{if((event.key==="Enter"||event.key===" ")&&event.target.matches("[data-detail]")){event.preventDefault();openProductDetails(event.target.dataset.detail);}});
$("#headerSearch").addEventListener("input",renderProducts);
$("#categoryFilter").addEventListener("change",()=>{activeCategory=$("#categoryFilter").value;renderProducts();});
$("#priceFilter").addEventListener("change",renderProducts);$("#sortFilter").addEventListener("change",renderProducts);
$$(".category-tile").forEach(tile=>tile.addEventListener("click",()=>setCategory(tile.dataset.category)));
$$("[data-category-link]").forEach(link=>link.addEventListener("click",()=>setCategory(link.dataset.categoryLink)));
$("#clearFilters").addEventListener("click",resetFilters);$("#resetSearch").addEventListener("click",resetFilters);
$("#openCart").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeAll);$$("[data-close-modal]").forEach(button=>button.addEventListener("click",()=>closeModal(button.closest(".modal"))));
$("#themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark-theme");const isDark=document.body.classList.contains("dark-theme");writeStore("technest-dark-theme",isDark);$("#themeToggle").textContent=isDark?"☾":"☼";showToast(isDark?"Dark mode enabled":"Light mode enabled");});
$("#wishlistJump").addEventListener("click",renderWishlist);
$("#mobileMenu").addEventListener("click",()=>{const open=$("#mainNav").classList.toggle("open");$("#mobileMenu").setAttribute("aria-expanded",String(open));$("#mobileMenu").textContent=open?"×":"☰";});
$$(".main-nav a").forEach(link=>link.addEventListener("click",()=>{$("#mainNav").classList.remove("open");$("#mobileMenu").setAttribute("aria-expanded","false");$("#mobileMenu").textContent="☰";}));
$("#backToTop").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
window.addEventListener("scroll",()=>$("#backToTop").classList.toggle("visible",window.scrollY>450));
$("#newsletterForm").addEventListener("submit",event=>{event.preventDefault();if($("#newsletterEmail").checkValidity()){showToast("Thanks! This demo does not send emails.");event.target.reset();}});
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeAll();});
if(readStore("technest-dark-theme",false)){document.body.classList.add("dark-theme");$("#themeToggle").textContent="☾";}
renderProducts();
