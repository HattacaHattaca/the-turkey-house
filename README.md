# The Turkey House website

Static site (plain HTML/CSS/JS, no build step, no dependencies) hosted free on GitHub Pages.
Nothing here can "break" from a software update because there is no software to update.

## Everyday edits — only touch `config.js`
Prices, menu items, hours, phone, testimonials, job openings, order/payment settings.
Edit on github.com (pencil icon → Commit). The live site updates in ~1 minute.

## One-time setup checklist
1. **Orders & applications by email (free):** get an access key at https://web3forms.com → paste into `orders.web3formsKey` in `config.js`. Until then the site opens a pre-filled text message to the truck's phone, so ordering still works.
2. **Online card payment (free to create):** in Square (or Stripe) create a Payment Link → paste it into `orders.payLink`. Customers are told the exact total and their order code to enter. Set `allowPayAtPickup:false` to require prepayment.
3. **Reviews:** paste your Google review link into `business.reviewUrl`. Add real customer quotes (with permission) to `business.testimonials`.
4. **Sanitation certificate:** when earned, add it to the About page and the trust strip.
5. **Custom domain (optional):** GitHub → Settings → Pages → Custom domain (e.g. theturkeyhouse.com), enable "Enforce HTTPS".

## Deploy
GitHub repo → Settings → Pages → Source: "Deploy from a branch" → `main` / root.

## Files
`index.html` `menu.html` (menu + ordering) `about.html` `join.html` (jobs) · `config.js` · `site.js` · `styles.css` · `assets/`
