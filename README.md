# TechNest — E-Commerce Website Mini-Project

**Technology:** HTML5, CSS3, Vanilla JavaScript  
**Project type:** Functional front-end demo store  
**Backend / real payment:** Not required; checkout is simulated.

## 1. Project objective
TechNest is a responsive sample electronics store built to demonstrate web technology lab concepts through a working shopping experience: browsing products, searching and filtering, product details, wishlist, cart, coupons, validated checkout and simulated order confirmation.

## 2. Reference website and originality
Reference inspiration: common product discovery and cart patterns found on electronics e-commerce stores such as Croma and Amazon. TechNest uses its own name, visual identity, layout, text and sample catalogue; it is not a downloaded template or a copy of a particular store.

## 3. Features
- Responsive homepage, navigation, category shortcuts, promotional area and footer.
- 12 sample products generated from JavaScript objects.
- Search by product name, category, description or tag.
- Category and price filters; sort by featured, price, rating and popularity.
- Product detail modal with description, rating, availability and quantity selection.
- Add to cart, quantity changes, removal, live subtotal and total.
- `TECH10` coupon for 10% off.
- Cart, wishlist, coupon and theme preferences saved using `localStorage`.
- Light/dark theme, wishlist, toast notifications, mobile navigation and back-to-top button.
- Checkout form validation for required fields, email, Indian mobile number, six-digit PIN and address.
- Simulated order number and confirmation; cart cleared after success.
- No real payment is collected and customer checkout form values are not saved.

## 4. Folder structure
```text
technest_ecommerce/
├── index.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── products.js
│   ├── app.js
│   ├── cart.js
│   ├── validation.js
│   └── checkout.js
├── images/
└── README.md
```

## 5. How to run
1. Extract the ZIP file.
2. Open `index.html` in a modern browser, or open the folder in VS Code and use the Live Server extension.
3. Internet access is needed for Google Fonts and the sample product images. The storefront code itself has no framework dependency.
4. Add items to the bag, try coupon `TECH10`, and complete checkout with valid demo details.

## 6. Checkout validation
- Name: at least 2 characters.
- Email: standard email pattern.
- Phone: 10-digit Indian mobile number starting with 6–9.
- PIN: exactly 6 digits.
- Address: at least 8 characters.
- Invalid fields show inline feedback and prevent simulated order submission.

## 7. HTML, CSS and JavaScript concepts demonstrated
**HTML5:** semantic header/nav/main/section/article/footer, accessible labels, forms, buttons, images with alt text, metadata and responsive viewport.  
**CSS3:** custom properties, selectors, pseudo-classes, box model, Flexbox, Grid, sticky positioning, transitions, transforms, keyframe animation and media queries.  
**JavaScript:** `const`/`let`, objects and arrays, functions, arrow functions, loops and conditions, `map`, `filter`, `find`, `reduce`, DOM manipulation, event listeners, template literals, regular expressions, JSON, `localStorage`, `Intl.NumberFormat`, date/time-based order number and error handling.

## 8. Manual test checklist
- [ ] All 12 products render.
- [ ] Search finds matching products and shows an empty state for no matches.
- [ ] Category and price filters work together.
- [ ] Each sort mode changes product order.
- [ ] Product detail modal opens and quantity changes.
- [ ] Add-to-bag count updates and persists after refresh.
- [ ] Quantity changes and remove actions update totals.
- [ ] `TECH10` applies a 10% discount; invalid coupon is rejected.
- [ ] Wishlist state persists after refresh.
- [ ] Dark/light theme persists after refresh.
- [ ] Checkout rejects empty/invalid fields and accepts valid demo details.
- [ ] Order confirmation shows a generated order number and clears the cart.
- [ ] Mobile navigation and layout work at narrow widths.

## 9. Limitations
- Products, prices, stock status and reviews are sample data.
- Product images and fonts are loaded from third-party URLs.
- No authentication, backend, inventory service, real email, order storage or real payment gateway is implemented, as these are outside this front-end assignment.
- The newsletter is a local demo interaction and does not send email.

## 10. Team contribution
Update this section with actual group members and their work before submission:
- Member 1: HTML structure and accessibility — [name]
- Member 2: CSS styling and responsive design — [name]
- Member 3: product rendering and search/filter logic — [name]
- Member 4: cart, checkout validation and testing — [name]

## 11. Submission preparation
Before submitting, add your group details, take screenshots of the homepage/product grid/cart/checkout/order confirmation, test in your target browser, and prepare a short demonstration. Make sure your group understands the code and can explain the concepts during evaluation.
