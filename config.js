/* ------------------------------------------------------------------
   THE TURKEY HOUSE — the ONE file to edit for everyday changes.
   Prices, hours, phone, what's on the menu, and how orders/payments work.
   Save it, commit it, and the live site updates in about a minute.
------------------------------------------------------------------- */
window.TH = {
  business: {
    name: "The Turkey House",
    tagline: "Lean, mean, Southern street cuisine.",
    phoneDisplay: "(984) 314-6485",
    phoneDial: "+19843146485",
    street: "506 Burlington Ave",
    city: "Durham, NC 27707",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=506+Burlington+Ave+Durham+NC+27707",
    // Open days: 0 = Sunday ... 6 = Saturday. Times are 24h, Durham local time.
    hours: { 4: [11, 19], 5: [11, 19], 6: [11, 19] },
    hoursText: "Thursday – Saturday, 11 AM – 7 PM",
    healthScore: 97,               // set to null to hide the badge
    healthNote: "Durham County inspection score",
    // Add real customer quotes here ONLY when you have permission to use them.
    // They show up on the home page automatically. Example:
    // { quote: "Best okra in Durham.", by: "Marcus, NCCU student" }
    testimonials: [],
    reviewUrl: "",                 // paste your Google review link here when you have one
    facebookUrl: "",
    instagramUrl: ""
  },

  orders: {
    /* HOW ORDERS ARRIVE
       1) Get a free key at https://web3forms.com (enter the email that should get orders).
       2) Paste the key below. Orders + job applications then land in that inbox.
       Until a key is set, the site falls back to a pre-filled TEXT MESSAGE to the truck's
       phone, so ordering never breaks. */
    web3formsKey: "a6cd33dc-2fae-4506-b5e6-0298f81a3529",

    /* HOW PEOPLE PAY ONLINE
       Paste a Square or Stripe payment link (both free to create, you pay only per-card fees).
       Leave "" to accept payment at pickup / by phone only. */
    payLink: "",
    payLinkLabel: "Pay securely with card",
    allowPayAtPickup: true,        // set false once payLink is live to require prepayment
    taxRate: 0.075,               // Durham County (ZIP 27707): 4.75% NC + 2.00% county + 0.50% transit = 7.5%. Prices above are pre-tax.
    prepMinutes: 15,               // shown as the estimated wait
    leadTimeMinutes: 20            // earliest scheduled pickup from "now"
  },

  jobs: {
    // Show/hide the openings on the Join page.
    openings: [
      { title: "Line Cook / Prep", type: "Part-time or full-time", blurb: "Grill, fryer, and prep. Clean hands, steady pace, and pride in the plate. Experience helps; willingness to learn matters more." },
      { title: "Window & Order Help", type: "Part-time · Thu–Sat", blurb: "Greet folks, take and call out orders, keep the line moving with a smile. Great fit for students." },
      { title: "Weekend Crew (Students Welcome)", type: "Flexible", blurb: "Central, Duke, UNC, or State? Pick up weekend hours around your class schedule." }
    ]
  },

  /* THE MENU — change a price or wording here and it updates everywhere. */
  menu: {
    categories: [
      { id: "mains", title: "Mains" },
      { id: "sides", title: "Sides" },
      { id: "combos", title: "Combos" },
      { id: "drinks", title: "Drinks" },
      { id: "sweet", title: "Something Sweet" }
    ],
    sideChoices: ["Crispy French Fries", "Golden Onion Rings", "Southern Fried Okra"],
    drinkChoices: ["Sweet Tea", "Lemonade", "Soda", "Bottled Water"],
    items: [
      { id: "burger", cat: "mains", name: "Classic Turkey Burger", price: 8, star: true,
        desc: "A thick quarter-pound turkey patty with lettuce, tomato, onion and mayo." },
      { id: "bbq", cat: "mains", name: "Smoked Turkey BBQ Sandwich", price: 8, star: true,
        desc: "Slow-smoked turkey, BBQ sauce and slaw on a toasted bun." },
      { id: "hotdog", cat: "mains", name: "Hot Dog", price: 6,
        desc: "All-turkey hot dog, classic style." },

      { id: "fries", cat: "sides", name: "Crispy French Fries", price: 3, desc: "Golden and crispy." },
      { id: "rings", cat: "sides", name: "Golden Onion Rings", price: 4, desc: "Crispy, golden and full of flavor." },
      { id: "okra", cat: "sides", name: "Southern Fried Okra", price: 5, star: true,
        desc: "Lightly breaded, fried fresh. The one people come back for." },

      { id: "gobbler", cat: "combos", name: "The Gobbler", price: 11, combo: true,
        desc: "Turkey burger + side + drink." },
      { id: "bbqbash", cat: "combos", name: "BBQ Bash", price: 12, combo: true,
        desc: "BBQ sandwich + side + drink." },
      { id: "dogdays", cat: "combos", name: "Dog Days", price: 10, combo: true,
        desc: "Hot dog + side + drink." },

      { id: "punch", cat: "drinks", name: "The Turkey House Asiatic Punch", price: 10, star: true,
        desc: "Our house punch, made with all-natural fruit. Ask for a sample." },
      { id: "tea", cat: "drinks", name: "Sweet Tea", price: null },
      { id: "lemonade", cat: "drinks", name: "Lemonade", price: null },
      { id: "soda", cat: "drinks", name: "Sodas & Bottled Water", price: null },

      { id: "beanpie", cat: "sweet", name: "Bean Pie", price: 5, desc: "Sweet, savory, and unforgettable." }
    ],
    // Featured on the "coming soon" banner. Set to null to hide.
    comingSoon: { title: "Smoked Turkey Legs & Wings", text: "Coming to the window soon. Ask us how you like your wings — cut into nuggets or whole?" }
  }
};
