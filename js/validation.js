// Reusable checkout field validation. No sensitive details are stored.
function validateField(input){
 const value=input.value.trim();let message="";
 if(input.required&&!value)message="This field is required.";
 else if(input.id==="fullName"&&value.length<2)message="Please enter your full name.";
 else if(input.id==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))message="Enter a valid email address.";
 else if(input.id==="phone"&&!/^[6-9]\d{9}$/.test(value))message="Enter a valid 10-digit Indian mobile number.";
 else if(input.id==="pin"&&!/^\d{6}$/.test(value))message="PIN code must contain 6 digits.";
 else if(input.id==="address"&&value.length<8)message="Please enter a complete delivery address.";
 const error=input.parentElement.querySelector(".field-error");if(error)error.textContent=message;
 input.classList.toggle("invalid",Boolean(message));input.setAttribute("aria-invalid",String(Boolean(message)));
 return !message;
}
function validateCheckoutForm(){
 const fields=[$("#fullName"),$("#email"),$("#phone"),$("#pin"),$("#address")];
 const results=fields.map(validateField);const firstInvalid=fields[results.indexOf(false)];
 if(firstInvalid)firstInvalid.focus();
 return results.every(Boolean);
}
$("#checkoutForm").addEventListener("submit",event=>{event.preventDefault();if(!validateCheckoutForm())showToast("Please check the highlighted fields.");else placeDemoOrder();});
["fullName","email","phone","pin","address"].forEach(id=>{$(`#${id}`).addEventListener("blur",event=>validateField(event.target));$(`#${id}`).addEventListener("input",event=>{if(event.target.classList.contains("invalid"))validateField(event.target);});});
