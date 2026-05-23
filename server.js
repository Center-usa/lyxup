require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const Stripe = require("stripe");
const axios = require("axios");
const app = express();

app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],

        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "https://www.paypal.com",
          "https://www.paypalobjects.com",
          "https://maps.googleapis.com",
          "https://maps.gstatic.com"
        ],

        "connect-src": [
          "'self'",
          "https://maps.googleapis.com",
          "https://maps.gstatic.com",
          "https://www.paypal.com",
          "https://www.sandbox.paypal.com"
        ],

        "img-src": [
          "'self'",
          "data:",
          "https://maps.googleapis.com",
          "https://maps.gstatic.com",
          "https://www.paypalobjects.com" // 🔥 ده الجديد
        ],

        "frame-src": [
          "'self'",
          "https://www.paypal.com",
          "https://www.sandbox.paypal.com" // 🔥 ده الجديد
        ],

        "script-src-attr": ["'unsafe-inline'"]
      }
    }
  })
);
app.use(cors({
  origin: [
    "https://occupancy-affair-catfight.ngrok-free.dev",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ]
}));

// 👇 بعده مباشرة
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
}app.post("/webhook", bodyParser.raw({ type: "application/json" }), async (req, res) => {

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );

  } catch (err) {
    console.log("❌ Webhook Error:", err.message);
    return res.sendStatus(400);
  }

// ✅ لما الدفع ينجح
if (event.type === "checkout.session.completed") {

  const session = event.data.object;

  // ✅ حماية: نتأكد إن الدفع تم فعلاً
  if (session.payment_status !== "paid") {
    return res.sendStatus(200);
  }

  // ✅ البيانات
  const metadata = session.metadata || {};
  const from = metadata.from;
  const to = metadata.to;
  const carType = (metadata.carType || "").trim() || "UNKNOWN";

  console.log("🔥 METADATA:", metadata);

  const customerEmail = session.customer_details?.email || "no-email";
  const amount = session.amount_total / 100;

  // ✅ تجهيز البيانات للشيت
  const sheetData = {
    type: new Date().toISOString(),
    sessionId: session.id, // 🔥 مهم للتتبع
    name: metadata.name || "No Name",
    phone: metadata.phone || "",
    email: customerEmail !== "no-email" ? customerEmail : (metadata.email || ""),
    from: from || "",
    to: to || "",
    car: carType,
    price: metadata.price || amount,
    payment: "Stripe",
    bags: metadata.bags || "",
    notes: metadata.notes || "",
    tripDate: metadata.tripDate || "",
    returnDate: metadata.returnDate || "",
    tripType: metadata.tripType || ""
  };

  console.log("📤 SENDING TO SHEET:", sheetData);

  // ✅ إرسال للشيت (محمي)
  try {
    await fetch("https://script.google.com/macros/s/AKfycbyOfF5cqOKAoS7Az-ASrEeFUW0fPcMXN_d-sFLG49xbUXWRnQreE-uSXh5t5t5SNKrS4g/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sheetData)
    });
  } catch (err) {
    console.log("❌ Sheet error:", err);
  }

  console.log("💰 Payment Success!");
  console.log("📧 Email:", customerEmail);

  // ✅ واتساب
  const phone = "201202712711";

  const message = encodeURIComponent(
`Hello 👋
New booking received 🚗

From: ${from}
To: ${to}
Car: ${carType}

Customer Email: ${customerEmail}
Amount: €${amount}`
  );

  const whatsappLink = `https://wa.me/${phone}?text=${message}`;

  console.log("📲 WhatsApp:", whatsappLink);

  // ✅ الإيميل
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: `LYXUP <${process.env.EMAIL_USER}>`,
    to: customerEmail !== "no-email" ? customerEmail : process.env.EMAIL_USER,
    bcc: "nabilkamalfahmy@gmail.com",
    subject: "Booking Confirmation - LYXUP",
    html: `
      <h2>🎉 Booking Confirmed</h2>

      <p>تم تأكيد حجزك بنجاح ✅</p>
      <p>شكراً لاختيارك <b>LYXUP 🚗</b></p>

      <hr/>

      <p><b>From:</b> ${from}</p>
      <p><b>To:</b> ${to}</p>
      <p><b>Car:</b> ${carType}</p>

      <hr/>

      <p><b>Amount Paid:</b> €${amount}</p>
      <p><b>Email:</b> ${customerEmail}</p>

      <br/>
      <p>سيتم التواصل معك خلال دقائق لتأكيد التفاصيل</p>

      <hr/>

      <p><b>Your booking is confirmed</b></p>
      <p>We will contact you shortly to confirm your ride details</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📩 Email sent");
  } catch (error) {
    console.log("❌ Email error:", error);
  }
}

  // ❗ مهم جدًا
  res.sendStatus(200);
});


app.use(express.json());
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET;
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const PRICE_MULTIPLIERS = { sedan: 1, suv: 1.15, h1: 1.25, hiace: 1.4, coaster: 1.6 };

async function geocodeAddress(address) {
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
    );
    const data = await response.json();

    if (!data.results.length) {
        throw new Error("Invalid address");
    }

    return data.results[0].geometry.location;
}

async function getDistanceInfo(from, to) {
    const fromLoc = await geocodeAddress(from);
    const toLoc = await geocodeAddress(to);

    const distanceRes = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${fromLoc.lat},${fromLoc.lng}&destinations=${toLoc.lat},${toLoc.lng}&key=${API_KEY}`
    );

    const distanceData = await distanceRes.json();
    const element = distanceData.rows?.[0]?.elements?.[0];

    if (!element || element.status !== "OK") {
        throw new Error("Distance error");
    }

    return {
        distanceKm: element.distance.value / 1000,
        distanceText: element.distance.text,
        durationText: element.duration.text
    };
}

function calculateRawPrice(distanceKm, carType, tripType, from, to) {
    const multiplier = PRICE_MULTIPLIERS[carType] || 1;
    let price;

    if (distanceKm <= 50) {
        price = distanceKm <= 15 ? 250 : 250 + (distanceKm - 15) * 11.4;
        if (price > 750) price = 750;
        price *= multiplier;
    } else {
        price = tripType === "round"
            ? distanceKm * 8 * 2 * multiplier
            : distanceKm * 8.5 * multiplier;
    }

    if ((from.includes("مطار") || to.includes("مطار")) && price < 750) {
        price = 750;
    }

    return price;
}

function formatDisplayPrice(price, currency) {
    let displayPrice = price;
    let symbol = "جنيه";

    if (currency === "EUR") {
        displayPrice = price / 50;
        symbol = "€";
    } else if (currency === "USD") {
        displayPrice = price / 45;
        symbol = "$";
    }

    return {
        displayPrice: Math.round(displayPrice),
        symbol
    };
}

function getStripeDetails(rawPrice, currency, type) {
    let amount = type === "deposit"
        ? Math.max(rawPrice * 0.25, 300)
        : rawPrice;

    let stripeCurrency = "usd";

    if (currency === "EUR") {
        amount = amount / 50;
        stripeCurrency = "eur";
    }

    if (currency === "EGP") {
        amount = amount / 45;
        stripeCurrency = "usd";
    }

    return {
        amount: Math.max(100, Math.round(amount * 100)),
        stripeCurrency
    };
}

function getPaypalDetails(rawPrice, currency, type) {
    let amount = type === "deposit"
        ? Math.max(rawPrice * 0.25, 300)
        : rawPrice;

    if (currency === "EGP") amount = amount / 45;
    if (currency === "EUR") amount = amount / 50;

    return {
        amount: Math.max(1, amount).toFixed(2),
        currencyCode: currency === "USD" ? "USD" : currency === "EUR" ? "EUR" : "USD"
    };
}

async function calculateRide({ from, to, carType, tripType, currency }) {
    const distanceInfo = await getDistanceInfo(from, to);
    const rawPrice = calculateRawPrice(distanceInfo.distanceKm, carType, tripType, from, to);
    const formatted = formatDisplayPrice(rawPrice, currency);

    return {
        ...distanceInfo,
        rawPrice,
        displayPrice: formatted.displayPrice,
        symbol: formatted.symbol,
        text: `السعر: ${formatted.displayPrice} ${formatted.symbol} (${distanceInfo.distanceText})`
    };
}

// 🔥 Endpoint المسافة
app.get("/distance", async (req, res) => {

    const { from, to } = req.query;

    if (
  !from || !to ||
  typeof from !== "string" ||
  typeof to !== "string" ||
  from.length > 200 ||
  to.length > 200
) {
  return res.status(400).json({ error: "Invalid input" });
}

    try {
        const distanceInfo = await getDistanceInfo(from, to);

        res.json({
            distance: distanceInfo.distanceKm,
            text: distanceInfo.distanceText,
            duration: distanceInfo.durationText
        });

    } catch (err) {
        console.error("🔥 Distance Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});


// 🔥 حساب السعر
app.post("/calculate-price", async (req, res) => {

    try {
        const { from, to, carType, tripType, currency } = req.body;

        if (
  !from || !to ||
  typeof from !== "string" ||
  typeof to !== "string" ||
  from.length > 200 ||
  to.length > 200
) {
  return res.status(400).json({ error: "Invalid input" });
}
        if (!["sedan","suv","h1","hiace","coaster"].includes(carType)) {
        return res.status(400).json({ error: "Invalid car type" });
        }

        const ride = await calculateRide({ from, to, carType, tripType, currency });

        res.json({
            text: ride.text,
            rawPrice: ride.rawPrice
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
const BASE_URL = "https://lyxup-iuai.vercel.app";

// 💳 Stripe (🔥 تم إصلاحه بالكامل)
app.post("/create-checkout-session", async (req, res) => {

    try {

        const { 
		name,
		phone,
		email,
		from,
		to,
		carType,
		price,
		bags,
		notes,
		tripDate,
		returnDate,
		tripType,
		currency,
		type
		} = req.body;
		const carTypeFixed = String(carType);
		console.log("🚗 carType FROM FRONT:", carType);
        if (
  !from || !to ||
  typeof from !== "string" ||
  typeof to !== "string" ||
  from.length > 200 ||
  to.length > 200 ||
  !carType || !tripType || !currency
) {
  return res.status(400).json({ error: "Invalid input" });
}
        if (!["sedan","suv","h1","hiace","coaster"].includes(carType)) {
        return res.status(400).json({ error: "Invalid car type" });
        }

        const ride = await calculateRide({ from, to, carType, tripType, currency });
        const { amount: finalAmount, stripeCurrency } = getStripeDetails(ride.rawPrice, currency, type);

        const label = type === "deposit" ? "Deposit Payment 💳" : "Full Payment 💰";

        const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",

        metadata: {
		name,
		phone,
		email,
		from,
		to,
		carType: carTypeFixed,
		price: ride.rawPrice, // 🔥 مهم جدا
		bags,
		notes,
		tripDate,
		returnDate,
		tripType,
		currency
		},

        line_items: [{
        price_data: {
        currency: stripeCurrency,
        product_data: {
        name: `LYXUP Ride Booking - ${label}`
        },
        unit_amount: finalAmount
        },
        quantity: 1
        }],
		
        success_url: `${BASE_URL}/success`,
		cancel_url: `${BASE_URL}/cancel`
        
        });
        res.json({ url: session.url });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Stripe error" });
    }
});
// 💰 PayPal

async function getAccessToken() {
    const res = await axios({
        url: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
        method: "post",
        auth: {
            username: CLIENT_ID,
            password: SECRET
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: "grant_type=client_credentials"
    });

    return res.data.access_token;
}
app.get("/cancel", (req, res) => {
  res.send("❌ Payment cancelled");
});
app.post("/create-paypal-order", async (req, res) => {
    try {

        const { from, to, carType, tripType, currency, type } = req.body;

        if (
  !from || !to ||
  typeof from !== "string" ||
  typeof to !== "string" ||
  from.length > 200 ||
  to.length > 200 ||
  !carType || !tripType || !currency
) {
  return res.status(400).json({ error: "Invalid input" });
}
        if (!["sedan","suv","h1","hiace","coaster"].includes(carType)) {
        return res.status(400).json({ error: "Invalid car type" });
        }

        const ride = await calculateRide({ from, to, carType, tripType, currency });
        const { amount, currencyCode } = getPaypalDetails(ride.rawPrice, currency, type);

        const accessToken = await getAccessToken();

        const response = await axios.post(
            "https://api-m.sandbox.paypal.com/v2/checkout/orders",
            {
                intent: "CAPTURE",
                purchase_units: [{
                    amount: {
                        currency_code: currencyCode,
                        value: amount
                    }
                }]
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ id: response.data.id });

    } catch (err) {
        console.log("🔥 PAYPAL ERROR:", err.response?.data || err);
        res.status(500).json({ error: "paypal error" });
    }
});
app.post("/capture-paypal-order", async (req, res) => {
  try {

    const {
      orderID,
      name,
      phone,
      email,
      from,
      to,
      carType,
      price,
      bags,
      notes,
      tripDate,
      returnDate,
      tripType
    } = req.body;
	const ride = await calculateRide({
	from,
	to,
	carType,
	tripType,
	currency: "EUR"
	});
    const accessToken = await getAccessToken();

    const response = await axios.post(
	
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );
	const payerEmail = response.data.payer?.email_address || "";

    if (response.data.status === "COMPLETED") {
	  const paidAmount = response.data.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value;
	 if (!paidAmount) {
	return res.status(400).json({ error: "Invalid payment amount" });
	}

	const expectedAmount = (ride.rawPrice / 50).toFixed(2); // EUR

	if (Math.abs(parseFloat(paidAmount) - parseFloat(expectedAmount)) > 0.01) {
	console.log("🚨 PRICE MISMATCH!", { paidAmount, expectedAmount });
	return res.status(400).json({ error: "Price mismatch detected" });
	}
      // 🔥 نفس Stripe
      const sheetData = {
        type: new Date().toISOString(),
        name: name || "",
        phone: phone || "",
        email: payerEmail || email || "",
        from: from || "",
        to: to || "",
        car: carType || "",
        price: paidAmount,
        payment: "PayPal",
        bags: bags || "",
        notes: notes || "",
        tripDate: tripDate || "",
        returnDate: returnDate || "",
        tripType: tripType || ""
      };

      console.log("📤 PAYPAL TO SHEET:", sheetData);

      // 📤 Google Sheet
      await fetch("https://script.google.com/macros/s/AKfycbyOfF5cqOKAoS7Az-ASrEeFUW0fPcMXN_d-sFLG49xbUXWRnQreE-uSXh5t5t5SNKrS4g/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(sheetData)
      });

      // 📩 Email (نفس Stripe)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const adminEmail = "nabilkamalfahmy@gmail.com";
	  const finalEmail = payerEmail || email || "";

	  await transporter.sendMail({
		from: `LYXUP <${process.env.EMAIL_USER}>`,
		to: finalEmail,
		bcc: finalEmail === adminEmail ? "" : adminEmail,
		subject: "Booking Confirmation - LYXUP",
		html: `
		<h2>🎉 Booking Confirmed</h2>
		<p>From: ${from}</p>
		<p>To: ${to}</p>
		<p>Car: ${carType}</p>
		<p>Amount: €${paidAmount}</p>
  `
		});

      console.log("📩 PayPal Email sent");
    }

    res.json({ status: response.data.status });

  } catch (err) {
    console.log(err.response?.data || err);
    res.status(500).json({ error: "Server error" });
  }
});
// instapay
app.get("/instapay-info", (req, res) => {
    res.json({
        number: "01224423214"
    });
});

// 🔥 Health
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/success", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Booking Confirmed | LYXUP</title>

    <style>
      body {
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #f5f7fa, #e4ebf5);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .box {
        background: #fff;
        padding: 40px 30px;
        border-radius: 16px;
        max-width: 420px;
        width: 90%;
        text-align: center;
        box-shadow: 0 15px 40px rgba(0,0,0,0.1);
        animation: fadeIn 0.6s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .icon {
        font-size: 40px;
        margin-bottom: 10px;
      }

      h2 {
        color: #28a745;
        margin-bottom: 15px;
      }

      p {
        margin: 6px 0;
        color: #333;
        font-size: 15px;
      }

      .divider {
        margin: 20px 0;
        height: 1px;
        background: #eee;
      }

      .btn {
        margin-top: 20px;
        padding: 12px 25px;
        border: none;
        background: #0074d4;
        color: white;
        border-radius: 10px;
        font-size: 14px;
        cursor: pointer;
        transition: 0.3s;
      }

      .btn:hover {
        background: #005bb5;
      }

      .brand {
        margin-top: 15px;
        font-weight: bold;
        color: #0074d4;
      }
    </style>
  </head>

  <body>
    <div class="box">
      <div class="icon">🎉</div>

      <h2>Booking Confirmed</h2>

      <p>تم تأكيد حجزك بنجاح ✅</p>
      <p>شكراً لاختيارك <strong>LYXUP 🚗</strong></p>
      <p>سيتم التواصل معك خلال دقائق لتأكيد التفاصيل</p>

      <div class="divider"></div>

      <p><strong>Your booking is confirmed</strong></p>
      <p>We will contact you shortly to confirm your ride details</p>
      <p>📩 Your request has been received</p>
	  <p class="hint">👇 اضغط لتأكيد الحجز على واتساب</p>

	  <style>
	  .hint {
	  font-size: 20px;
	  font-weight: bold;
	  color: #25D366;
	  text-align: center;
	  animation: bounce 1s infinite;
	   }

	 @keyframes bounce {
	 0%, 100% { transform: translateY(0); }
	 50% { transform: translateY(8px); }
	 }
</style>
	  <button class="btn" onclick="openWhatsApp()">Confirm on WhatsApp</button>

	  <button class="btn" onclick="goHome()">رجوع للصفحة الرئيسية</button>

	  <script>
	  function goHome() {
	  window.location.href = "/";
      }

	 function openWhatsApp() {
	 const message = encodeURIComponent("Hello, I just completed my booking with LYXUP RIDE. Please confirm my ride details.");

	window.location.href = "https://wa.me/201202712711?text=" + message;
	}

	
  </script>
  </body>
  </html>
  `);
});
app.get('/favicon.ico', (req, res) => res.sendStatus(204));
app.get("/get-user-country", async (req, res) => {
    try {
        const response = await fetch("https://ipwho.is/");
        const data = await response.json();
        res.json({ country: data.country_code || "ES" });
    } catch {
        res.json({ country: "ES" });
    }
});

app.get("/geocode", async (req, res) => {
    const { lat, lng } = req.query;
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
    );
    const data = await response.json();
    res.json(data);
});


app.get("/airport-transfer-cairo", (req, res) => {
  res.sendFile(__dirname + "/public/airport.html");
});
app.get("/north-coast-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/north-coast-transfer.html");
});
app.get("/corporate-transport", (req, res) => {
  res.sendFile(__dirname + "/public/corporate.html");
});
app.get("/private-trips", (req, res) => {
  res.sendFile(__dirname + "/public/trips.html");
});
app.get("/vip-service", (req, res) => {
  res.sendFile(__dirname + "/public/vip.html");
});
app.get("/sitemap.xml", (req, res) => {
  res.sendFile(__dirname + "/sitemap.xml");
});
module.exports = app;
app.use((req, res) => {
  res.sendFile(__dirname + "/index.html");
});
