# Order tracker setup (10 minutes, free)
1. Signed in as the Google account that should own the orders (theturkeyhouse919@gmail.com), create a new Google Sheet named **Turkey House Orders**.
2. Extensions → **Apps Script**. Delete the sample code, paste all of `Code.gs`, and change `PIN` to a private password (6+ characters).
3. **Deploy → New deployment → type: Web app.** Execute as: **Me**. Who has access: **Anyone**. Deploy, and approve the permission prompts.
4. Copy the **Web app URL** (ends in `/exec`) into `config.js` → `orders.trackerUrl`.
5. Open `https://<site>/orders.html` on his phone, enter the PIN, and add it to his home screen.
Whenever you edit Code.gs later: Deploy → Manage deployments → edit → New version.
