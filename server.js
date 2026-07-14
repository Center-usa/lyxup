
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const Stripe = require("stripe");
const axios = require("axios");
const app = express();
const activeStripeWebhookSessions = new Set();
const activeStripeWebhookEvents = new Set();
app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  res.sendFile(path.join(__dirname, "public", "sitemap.xml"));
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/ar", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/favicon.png", (req, res) => {
  res.sendFile(__dirname + "/public/favicon.png");
});
app.get("/en", (req, res) => {

  const ua = req.headers["user-agent"] || "";

  if (ua.includes("facebookexternalhit") || ua.includes("WhatsApp")) {
    return res.sendFile(path.join(__dirname, "public", "en-preview.html"));
  }

  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/es", (req, res) => {

  const ua = req.headers["user-agent"] || "";

  if (ua.includes("facebookexternalhit") || ua.includes("WhatsApp")) {
    return res.sendFile(path.join(__dirname, "public", "es-preview.html"));
  }

  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/public/about.html");
});

app.get("/en/about", (req, res) => {
  res.sendFile(__dirname + "/public/en-about.html");
});

app.get("/es/about", (req, res) => {
  res.sendFile(__dirname + "/public/es-about.html");
});
// 🌍 CONTACT PAGES

// عربي
app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/public/contact.html");
});

// إنجليزي
app.get("/en/contact", (req, res) => {
  res.sendFile(__dirname + "/public/en-contact.html");
});

// إسباني
app.get("/es/contact", (req, res) => {
  res.sendFile(__dirname + "/public/es-contact.html");
});
// 🔒 PRIVACY POLICY PAGES

// عربي
app.get("/privacy-policy", (req, res) => {
  res.sendFile(__dirname + "/public/privacy-policy.html");
});

// إنجليزي
app.get("/en/privacy-policy", (req, res) => {
  res.sendFile(__dirname + "/public/en-privacy-policy.html");
});

// إسباني
app.get("/es/privacy-policy", (req, res) => {
  res.sendFile(__dirname + "/public/es-privacy-policy.html");
});
// 📄 TERMS & CONDITIONS PAGES

// عربي
app.get("/terms", (req, res) => {
  res.sendFile(__dirname + "/public/terms.html");
});

// إنجليزي
app.get("/en/terms", (req, res) => {
  res.sendFile(__dirname + "/public/en-terms.html");
});

// إسباني
app.get("/es/terms", (req, res) => {
  res.sendFile(__dirname + "/public/es-terms.html");
});
// 🇸🇦 عربي - cairo-airport-transfer.html
app.get("/cairo-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/cairo-airport-transfer.html");
});

// 🇺🇸 إنجليزي - en-cairo-airport-transfer.html
app.get("/en/cairo-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/en-cairo-airport-transfer.html");
});

// 🇪🇸 إسباني - es-cairo-airport-transfer.html
app.get("/es/cairo-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/es-cairo-airport-transfer.html");
});
// ==============================
// 🌴 Hurghada Airport Transfer
// ==============================

// 🇸🇦 عربي - hurghada-airport-transfer.html
app.get("/hurghada-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/hurghada-airport-transfer.html");
});

// 🇺🇸 إنجليزي - en-hurghada-airport-transfer.html
app.get("/en/hurghada-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/en-hurghada-airport-transfer.html");
});

// 🇪🇸 إسباني - es-hurghada-airport-transfer.html
app.get("/es/hurghada-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/es-hurghada-airport-transfer.html");
});
// ==============================
// 🏝️ Sharm Airport Transfer
// ==============================

// 🇸🇦 عربي - sharm-airport-transfer.html
app.get("/sharm-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/sharm-airport-transfer.html");
});

// 🇺🇸 إنجليزي - en-sharm-airport-transfer.html
app.get("/en/sharm-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/en-sharm-airport-transfer.html");
});

// 🇪🇸 إسباني - es-sharm-airport-transfer.html
app.get("/es/sharm-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/es-sharm-airport-transfer.html");
});
// ==============================
// 🌊 Alexandria Airport Transfer
// ==============================

// 🇸🇦 عربي - alexandria-airport-transfer.html
app.get("/alexandria-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/alexandria-airport-transfer.html");
});

// 🇺🇸 إنجليزي - en-alexandria-airport-transfer.html
app.get("/en/alexandria-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/en-alexandria-airport-transfer.html");
});

// 🇪🇸 إسباني - es-alexandria-airport-transfer.html
app.get("/es/alexandria-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/es-alexandria-airport-transfer.html");
});
// ==============================
// 🚗 Cairo to Hurghada Transfer
// ==============================

// 🇸🇦 عربي - cairo-to-hurghada-transfer.html
app.get("/cairo-to-hurghada-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/cairo-to-hurghada-transfer.html");
});

// 🇺🇸 إنجليزي - en-cairo-to-hurghada-transfer.html
app.get("/en/cairo-to-hurghada-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/en-cairo-to-hurghada-transfer.html");
});

// 🇪🇸 إسباني - es-cairo-to-hurghada-transfer.html
app.get("/es/cairo-to-hurghada-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/es-cairo-to-hurghada-transfer.html");
});
// ==============================
// 🚗 Hurghada to Cairo Transfer
// ==============================

// 🇸🇦 عربي - hurghada-to-cairo-transfer.html
app.get("/hurghada-to-cairo-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/hurghada-to-cairo-transfer.html");
});

// 🇺🇸 إنجليزي - en-hurghada-to-cairo-transfer.html
app.get("/en/hurghada-to-cairo-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/en-hurghada-to-cairo-transfer.html");
});

// 🇪🇸 إسباني - es-hurghada-to-cairo-transfer.html
app.get("/es/hurghada-to-cairo-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/es-hurghada-to-cairo-transfer.html");
});
// ==============================
// 🚗 Cairo to Sharm El Sheikh Transfer
// ==============================

// 🇸🇦 عربي - cairo-to-sharm-transfer.html
app.get("/cairo-to-sharm-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/cairo-to-sharm-transfer.html");
});

// 🇺🇸 إنجليزي - en-cairo-to-sharm-transfer.html
app.get("/en/cairo-to-sharm-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/en-cairo-to-sharm-transfer.html");
});

// 🇪🇸 إسباني - es-cairo-to-sharm-transfer.html
app.get("/es/cairo-to-sharm-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/es-cairo-to-sharm-transfer.html");
});
// ==============================
// 🚗 Sharm El Sheikh to Cairo Transfer
// ==============================

// 🇸🇦 عربي - sharm-to-cairo-transfer.html
app.get("/sharm-to-cairo-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/sharm-to-cairo-transfer.html");
});

// 🇺🇸 إنجليزي - en-sharm-to-cairo-transfer.html
app.get("/en/sharm-to-cairo-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/en-sharm-to-cairo-transfer.html");
});

// 🇪🇸 إسباني - es-sharm-to-cairo-transfer.html
app.get("/es/sharm-to-cairo-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/es-sharm-to-cairo-transfer.html");
});
// ==============================
// 🚖 Taxi Cairo Airport
// ==============================

// 🇸🇦 عربي - taxi-cairo-airport.html
app.get("/taxi-cairo-airport", (req, res) => {
  res.sendFile(__dirname + "/public/taxi-cairo-airport.html");
});

// 🇺🇸 إنجليزي - en-taxi-cairo-airport.html
app.get("/en/taxi-cairo-airport", (req, res) => {
  res.sendFile(__dirname + "/public/en-taxi-cairo-airport.html");
});

// 🇪🇸 إسباني - es-taxi-cairo-airport.html
app.get("/es/taxi-cairo-airport", (req, res) => {
  res.sendFile(__dirname + "/public/es-taxi-cairo-airport.html");
});
// ==============================
// 🚘 Private Driver Cairo
// ==============================

// 🇸🇦 عربي - private-driver-cairo.html
app.get("/private-driver-cairo", (req, res) => {
  res.sendFile(__dirname + "/public/private-driver-cairo.html");
});

// 🇺🇸 إنجليزي - en-private-driver-cairo.html
app.get("/en/private-driver-cairo", (req, res) => {
  res.sendFile(__dirname + "/public/en-private-driver-cairo.html");
});

// 🇪🇸 إسباني - es-private-driver-cairo.html
app.get("/es/private-driver-cairo", (req, res) => {
  res.sendFile(__dirname + "/public/es-private-driver-cairo.html");
});
// ==============================
// 💰 Cairo Airport Taxi Price
// ==============================

// 🇸🇦 عربي - cairo-airport-taxi-price.html
app.get("/cairo-airport-taxi-price", (req, res) => {
  res.sendFile(__dirname + "/public/cairo-airport-taxi-price.html");
});

// 🇺🇸 إنجليزي - en-cairo-airport-taxi-price.html
app.get("/en/cairo-airport-taxi-price", (req, res) => {
  res.sendFile(__dirname + "/public/en-cairo-airport-taxi-price.html");
});

// 🇪🇸 إسباني - es-cairo-airport-taxi-price.html
app.get("/es/cairo-airport-taxi-price", (req, res) => {
  res.sendFile(__dirname + "/public/es-cairo-airport-taxi-price.html");
});
// ==============================
// 🏆 Best Cairo Airport Transfer
// ==============================

// 🇸🇦 عربي - best-cairo-airport-transfer.html
app.get("/best-cairo-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/best-cairo-airport-transfer.html");
});

// 🇺🇸 إنجليزي - en-best-cairo-airport-transfer.html
app.get("/en/best-cairo-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/en-best-cairo-airport-transfer.html");
});

// 🇪🇸 إسباني - es-best-cairo-airport-transfer.html
app.get("/es/best-cairo-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/es-best-cairo-airport-transfer.html");
});
// ==============================
// 💸 Cheap Cairo Airport Transfer
// ==============================

// 🇸🇦 عربي - cheap-cairo-airport-transfer.html
app.get("/cheap-cairo-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/cheap-cairo-airport-transfer.html");
});

// 🇺🇸 إنجليزي - en-cheap-cairo-airport-transfer.html
app.get("/en/cheap-cairo-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/en-cheap-cairo-airport-transfer.html");
});

// 🇪🇸 إسباني - es-cheap-cairo-airport-transfer.html
app.get("/es/cheap-cairo-airport-transfer", (req, res) => {
  res.sendFile(__dirname + "/public/es-cheap-cairo-airport-transfer.html");
});
// ==============================
// 🚖 Cairo Airport Taxi Booking
// ==============================

// 🇸🇦 عربي
app.get("/cairo-airport-taxi-booking", (req, res) => {
  res.sendFile(__dirname + "/public/cairo-airport-taxi-booking.html");
});

// 🇺🇸 إنجليزي
app.get("/en/cairo-airport-taxi-booking", (req, res) => {
  res.sendFile(__dirname + "/public/en-cairo-airport-taxi-booking.html");
});

// 🇪🇸 إسباني
app.get("/es/cairo-airport-taxi-booking", (req, res) => {
  res.sendFile(__dirname + "/public/es-cairo-airport-taxi-booking.html");
});
// ======================================
// 🚖 Taxi Cairo Airport to Nasr City
// ======================================

// 🇸🇦 عربي
app.get("/taxi-cairo-airport-to-nasr-city", (req, res) => {
  res.sendFile(__dirname + "/public/taxi-cairo-airport-to-nasr-city.html");
});

// 🇺🇸 English
app.get("/en/taxi-cairo-airport-to-nasr-city", (req, res) => {
  res.sendFile(__dirname + "/public/en-taxi-cairo-airport-to-nasr-city.html");
});

// 🇪🇸 Español
app.get("/es/taxi-cairo-airport-to-nasr-city", (req, res) => {
  res.sendFile(__dirname + "/public/es-taxi-cairo-airport-to-nasr-city.html");
});
// ==============================
// 🚖 Taxi Cairo Airport to New Cairo
// ==============================

// 🇸🇦 عربي
app.get("/taxi-cairo-airport-to-new-cairo", (req, res) => {
  res.sendFile(__dirname + "/public/taxi-cairo-airport-to-new-cairo.html");
});

// 🇺🇸 English
app.get("/en/taxi-cairo-airport-to-new-cairo", (req, res) => {
  res.sendFile(__dirname + "/public/en-taxi-cairo-airport-to-new-cairo.html");
});

// 🇪🇸 Español
app.get("/es/taxi-cairo-airport-to-new-cairo", (req, res) => {
  res.sendFile(__dirname + "/public/es-taxi-cairo-airport-to-new-cairo.html");
});
// ==============================
// 🚖 Taxi Cairo Airport to 6 October
// ==============================

// 🇸🇦 عربي
app.get("/taxi-cairo-airport-to-6-october", (req, res) => {
  res.sendFile(__dirname + "/public/taxi-cairo-airport-to-6-october.html");
});

// 🇺🇸 English
app.get("/en/taxi-cairo-airport-to-6-october", (req, res) => {
  res.sendFile(__dirname + "/public/en-taxi-cairo-airport-to-6-october.html");
});

// 🇪🇸 Español
app.get("/es/taxi-cairo-airport-to-6-october", (req, res) => {
  res.sendFile(__dirname + "/public/es-taxi-cairo-airport-to-6-october.html");
});
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
  "https://maps.gstatic.com",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com"
],

"connect-src": [
  "'self'",
  "https://maps.googleapis.com",
  "https://maps.gstatic.com",
  "https://www.paypal.com",
  "https://www.sandbox.paypal.com",
  "https://www.google-analytics.com",
  "https://region1.google-analytics.com"
],

"img-src": [
  "'self'",
  "data:",
  "https://maps.googleapis.com",
  "https://maps.gstatic.com",
  "https://www.paypalobjects.com",
  "https://www.google-analytics.com"
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
let stripe = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = require("stripe")(
    process.env.STRIPE_SECRET_KEY.trim()
  );
}
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {

    const sig = req.headers["stripe-signature"];
    const endpointSecret =
      (process.env.STRIPE_WEBHOOK_SECRET || "").trim();

    let event;

    console.log("🔍 WEBHOOK DEBUG:", {
      hasSecret: Boolean(endpointSecret),
      secretPrefix: endpointSecret.substring(0, 6),
      hasSignature: Boolean(sig),
      bodyIsBuffer: Buffer.isBuffer(req.body),
      bodyType: typeof req.body,
      bodyLength: req.body?.length
    });

    try {
      if (!stripe) {
        throw new Error("Stripe is not initialized");
      }

      if (!endpointSecret) {
        throw new Error("STRIPE_WEBHOOK_SECRET is missing");
      }

      if (!sig) {
        throw new Error("Stripe signature header is missing");
      }

      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );

      console.log("✅ Webhook signature verified:", event.type);

    } catch (err) {
      console.error("❌ Webhook Error:", err.message);

      return res
        .status(400)
        .send(`Webhook Error: ${err.message}`);
    }

// ✅ لما الدفع ينجح
if (event.type === "checkout.session.completed") {

  const session = event.data.object;
  const sessionId = session.id;
  const eventId = event.id;

  // ✅ حماية: نتأكد إن الدفع تم فعلاً
  if (session.payment_status !== "paid") {
    return res.sendStatus(200);
  }

  if (
    activeStripeWebhookSessions.has(sessionId) ||
    activeStripeWebhookEvents.has(eventId)
  ) {
    console.log("Duplicate Stripe webhook skipped in-memory:", {
      sessionId,
      eventId
    });
    return res.sendStatus(200);
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  let paymentIntent = null;

  try {
    if (paymentIntentId) {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.metadata?.lyxup_webhook_completed === "true") {
        console.log("Duplicate Stripe webhook skipped from Stripe metadata:", {
          sessionId,
          paymentIntentId
        });
        return res.sendStatus(200);
      }
    }
  } catch (err) {
    console.log("Could not inspect Stripe payment intent metadata:", err.message);
  }

  activeStripeWebhookSessions.add(sessionId);
  activeStripeWebhookEvents.add(eventId);

  try {

  // ✅ البيانات
  const metadata = session.metadata || {};
  const from = metadata.from;
  const to = metadata.to;
  const carType = (metadata.carType || "").trim() || "UNKNOWN";

  console.log("🔥 METADATA:", metadata);

  const customerEmail =
  session.customer_details?.email || "no-email";

	// المبلغ الذي دفعه العميل فعليًا
	const amount = Number(
	  (session.amount_total / 100).toFixed(2)
	);
	
	// العملة الحقيقية التي تم الدفع بها
	const paidCurrency =
	  (session.currency || "egp").toUpperCase();
	
	// شكل المبلغ النهائي للشيت والإيميل
	let formattedPaidAmount;
	
	if (paidCurrency === "USD") {
	  formattedPaidAmount = `$${amount.toFixed(2)}`;
	} else if (paidCurrency === "EUR") {
	  formattedPaidAmount = `€${amount.toFixed(2)}`;
	} else if (paidCurrency === "EGP") {
	  formattedPaidAmount = `${amount.toFixed(2)} EGP`;
	} else {
	  formattedPaidAmount = `${amount.toFixed(2)} ${paidCurrency}`;
	}
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
    price: formattedPaidAmount,
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
Amount: ${formattedPaidAmount}`
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

      <p><b>Payment Received:</b> ${formattedPaidAmount}</p>
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
  } finally {
    activeStripeWebhookSessions.delete(sessionId);
    activeStripeWebhookEvents.delete(eventId);
  }
}

  // ❗ مهم جدًا
  res.sendStatus(200);
});


app.use(express.json());
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET;
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
console.log("KEY:", process.env.GOOGLE_MAPS_API_KEY);
const PRICING = {

  cairo: {
    sedan: 43.5,
    suv: 46.25,
    h1: 70.25,
    hiace: 80.75,
    coaster: 100.5
  },

  alex: {
    sedan: 15.75,
    suv: 17.625,
    h1: 22.625,
    hiace: 23.875,
    coaster: 34.25
  },

  travel: {
    sedan: 9.6,
    suv: 11,
    h1: 14.6,
    hiace: 15.2,
    coaster: 22
  }

};
async function geocodeAddress(address) {
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
    );
    const data = await response.json();

    if (!data.results.length) {
        throw new Error("Invalid address");
    }

    return data.results[0];
}

async function getDistanceInfo(from, to) {
    const fromGeo = await geocodeAddress(from);
	const toGeo = await geocodeAddress(to);
	const fromLoc = fromGeo.geometry.location;
	const toLoc = toGeo.geometry.location;
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
	    durationText: element.duration.text,
	
	    fromGeo,
	    toGeo
	};
}




function getZone(geo) {
    const components = geo.address_components || [];

    const text = components
        .map(c => c.long_name.toLowerCase())
        .join(" ");

    const cairoKeywords = [
        "cairo", "new cairo", "giza", "6th of october", "6 october",
        "october", "sheikh zayed", "zayed", "dokki", "mohandessin",
        "mohandeseen", "faisal", "haram", "maadi", "heliopolis",
        "masr el gedida", "nasr city", "mokattam", "muqattam", "zamalek",
        "downtown cairo", "new nozha", "ain shams", "shubra", "helwan",
        "obour", "el obour", "al obour", "shorouk", "el shorouk",
        "al shorouk", "badr", "rehab", "el rehab", "al rehab",
        "madinaty", "mostakbal city", "tagamoa", "tagamou", "tagamo3",
        "fifth settlement", "first settlement", "settlement",
        "new administrative capital", "administrative capital", "capital",
        "smart village", "garden city", "hadayek october",
        "october gardens", "sphinx", "grand egyptian museum", "gem",
        "cairo international airport", "airport road"
    ];

    const cairoArabicKeywords = [
        "القاهرة", "الجيزة", "القاهره", "الجيزه",
        "القاهرة الجديدة", "القاهره الجديدة",
        "التجمع", "التجمع الخامس", "التجمع الاول",
        "مدينة نصر", "مصر الجديدة", "المعادي",
        "المقطم", "الزمالك", "وسط البلد", "الدقي",
        "المهندسين", "فيصل", "الهرم",
        "السادس من أكتوبر", "6 أكتوبر", "اكتوبر",
        "الشيخ زايد", "العبور", "الشروق", "بدر",
        "الرحاب", "مدينتي", "مستقبل سيتي",
        "العاصمة الإدارية", "العاصمة الادارية",
        "سمارت فيليج", "حدائق أكتوبر", "حدائق اكتوبر",
        "مطار القاهرة", "مطار القاهره"
    ];

    if (
        cairoKeywords.some(keyword => text.includes(keyword)) ||
        cairoArabicKeywords.some(keyword => text.includes(keyword))
    ) {
        return "cairo";
    }

    if (
        text.includes("alexandria") ||
        text.includes("الإسكندرية") ||
        text.includes("الاسكندرية")
    ) {
        return "alex";
    }

    return "travel";
}
    function calculateRawPrice(distanceKm, carType, tripType, zone) {

    let price = distanceKm * PRICING[zone][carType];

    if (tripType === "round") {
        price *= 2;
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
        displayPrice: Number(displayPrice.toFixed(2)),
        symbol
    };
}

function getStripeDetails(rawPrice, currency, type) {
    let amount = type === "deposit"
        ? Math.max(rawPrice * 0.25, 300)
        : rawPrice;

    let stripeCurrency;

    if (currency === "EGP") {
        stripeCurrency = "egp";

    } else if (currency === "USD") {
        amount = amount / 45;
        stripeCurrency = "usd";

    } else if (currency === "EUR") {
        amount = amount / 50;
        stripeCurrency = "eur";

    } else {
        throw new Error("Unsupported currency");
    }

    return {
        amount: Math.round(amount * 100),
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

    const fromZone = getZone(distanceInfo.fromGeo);
    const toZone = getZone(distanceInfo.toGeo);

    let zone;

    if (fromZone === "cairo" && toZone === "cairo") {
        zone = "cairo";
    } else if (fromZone === "alex" && toZone === "alex") {
        zone = "alex";
    } else {
        zone = "travel";
    }

    const rawPrice = calculateRawPrice(
        distanceInfo.distanceKm,
        carType,
        tripType,
        zone
    );

    const formatted = formatDisplayPrice(rawPrice, currency);

    return {
        ...distanceInfo,
        rawPrice,
        displayPrice: formatted.displayPrice,
        symbol: formatted.symbol,
        zone,
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
	    rawPrice: ride.rawPrice,
	    displayPrice: ride.displayPrice,
	    symbol: ride.symbol
	});

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
const BASE_URL = "https://lyxup.app";

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
	    type,
	    lang
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
		const safeLang = ["ar", "en", "es"].includes(lang) ? lang : "en";
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
		
        success_url: `${BASE_URL}/success?lang=${safeLang}`,
		cancel_url: `${BASE_URL}/cancel?lang=${safeLang}`
        
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
        url: "https://api-m.paypal.com/v1/oauth2/token",
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
            "https://api-m.paypal.com/v2/checkout/orders",
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
	  tripType,
	  currency,
	  type
	} = req.body;
	const ride = await calculateRide({
	  from,
	  to,
	  carType,
	  tripType,
	  currency
	});
	
	const paypalDetails = getPaypalDetails(
	  ride.rawPrice,
	  currency,
	  type
	);
    const accessToken = await getAccessToken();

    const response = await axios.post(
	
      `https://api-m.paypal.com/v2/checkout/orders/${orderID}/capture`,
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
	 const capture =
	  response.data.purchase_units?.[0]?.payments?.captures?.[0];
	
	const paidAmount = capture?.amount?.value;
	const paidCurrency = capture?.amount?.currency_code;
	 if (!paidAmount) {
	return res.status(400).json({ error: "Invalid payment amount" });
	}
		let formattedPaidAmount;

	if (paidCurrency === "USD") {
	  formattedPaidAmount = `$${Number(paidAmount).toFixed(2)}`;
	} else if (paidCurrency === "EUR") {
	  formattedPaidAmount = `€${Number(paidAmount).toFixed(2)}`;
	} else if (paidCurrency === "EGP") {
	  formattedPaidAmount = `${Number(paidAmount).toFixed(2)} EGP`;
	} else {
	  formattedPaidAmount =
	    `${Number(paidAmount).toFixed(2)} ${paidCurrency}`;
	}

	const expectedAmount = paypalDetails.amount;

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
        price: formattedPaidAmount,
        payment: "PayPal",
        bags: bags || "",
        notes: notes || "",
        tripDate: tripDate || "",
        returnDate: returnDate || "",
        tripType: tripType || ""
      };

      console.log("📤 PAYPAL TO SHEET:", sheetData);

      // 📤 Google Sheet
      const sheetResponse = await fetch(
	  "https://script.google.com/macros/s/AKfycbyOfF5cqOKAoS7Az-ASrEeFUW0fPcMXN_d-sFLG49xbUXWRnQreE-uSXh5t5t5SNKrS4g/exec",
	  {
	    method: "POST",
	    headers: {
	      "Content-Type": "application/json"
	    },
	    body: JSON.stringify(sheetData)
	  }
	);
	
	const sheetResult = await sheetResponse.text();
	
	console.log("📄 SHEET STATUS:", sheetResponse.status);
	console.log("📄 SHEET RESPONSE:", sheetResult);
	
	if (!sheetResponse.ok) {
	  throw new Error(`Google Sheet failed: ${sheetResponse.status}`);
	}

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
		<p><b>Payment Received:</b> ${formattedPaidAmount}</p>
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



app.get("/success", (req, res) => {

  const lang = req.query.lang || "en";

  const texts = {

    ar: {
      title: "تم تأكيد حجزك بنجاح ✅",
      thanks: "شكرًا لاختيارك LYXUP 🚗",
      contact: "سيتم التواصل معك خلال دقائق لتأكيد التفاصيل",
      confirmed: "تم تأكيد الحجز",
      note: "اضغط لتأكيد الحجز على واتساب",
      whatsapp: "تأكيد عبر واتساب",
      home: "رجوع للصفحة الرئيسية"
    },

    en: {
      title: "Booking Confirmed ✅",
      thanks: "Thank you for choosing LYXUP 🚗",
      contact: "We will contact you shortly to confirm your ride",
      confirmed: "Your booking is confirmed",
      note: "Click to confirm via WhatsApp",
      whatsapp: "Confirm on WhatsApp",
      home: "Back to Home"
    },

    es: {
      title: "Reserva confirmada ✅",
      thanks: "Gracias por elegir LYXUP 🚗",
      contact: "Nos pondremos en contacto contigo en breve",
      confirmed: "Tu reserva está confirmada",
      note: "Haz clic para confirmar por WhatsApp",
      whatsapp: "Confirmar por WhatsApp",
      home: "Volver al inicio"
    }

  };

  const t = texts[lang] || texts.en;
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

      <h2>${t.title}</h2>

	  <p>${t.thanks}</p>
      <p>${t.contact}</p>

      <div class="divider"></div>

      <p><strong>${t.confirmed}</strong></p>
      <p>${t.contact}</p>

      <p>📩</p>

	  <p class="hint">👇 ${t.note}</p>

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
	  <button class="btn" onclick="openWhatsApp()">${t.whatsapp}</button>

	  <button class="btn" onclick="goHome()">${t.home}</button>

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

app.get('/get-user-country', async (req, res) => {
  try {

    // ✅ 1. المصدر الأساسي (Vercel - سريع ودقيق)
    const countryFromVercel = req.headers['x-vercel-ip-country'];

    if (countryFromVercel) {
      return res.json({ country: countryFromVercel });
    }

    // 🔁 2. fallback (لو مش على Vercel)
    const ip = (req.headers['x-forwarded-for'] || "")
      .split(",")[0]
      .trim() || req.socket.remoteAddress;

    const response = await fetch(`https://ipwho.is/${ip}`);
    const data = await response.json();

    const country = data.success ? data.country_code : "ES";

    return res.json({ country });

  } catch (err) {
    // 🔥 fallback نهائي
    return res.json({ country: "ES" });
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


// fallback
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;
