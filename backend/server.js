import express from "express";
import { nanoid } from "nanoid";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ CORS (make sure this is before routes)
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "https://kamsiexp.netlify.app", "file:///C:/Users/Akasintech/Desktop/bootcamp/tracking/frontend/admin.html", "http://localhost:3000", "*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// ✅ MongoDB URI
const uri =
  "mongodb+srv://charlesakachi476:xKuVtUzPnt3nCmoR@cluster0.peyi6fq.mongodb.net/?appName=Cluster0";

// ✅ Create client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// ✅ Database + collection names
const dbName = "cargoTracking";
const collectionName = "trackingRecords";

// 📧 Email transporter (configure via environment variables)
// Supports either service-based config (e.g., Gmail) OR explicit host/port.
const useService = Boolean(process.env.EMAIL_SERVICE);
const mailTransporter = useService
  ? nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // e.g. 'gmail'
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // e.g. 'smtp.gmail.com'
      port: Number(process.env.EMAIL_PORT || 587),
      secure: Boolean(process.env.EMAIL_SECURE === "true"),
      auth: process.env.EMAIL_USER && process.env.EMAIL_PASS
        ? { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        : undefined,
    });

// Verify transporter on startup
mailTransporter
  .verify()
  .then(() => console.log("Email transporter is ready"))
  .catch((err) => {
    console.error("Email transporter verification failed:", err?.message || err);
    const summary = {
      EMAIL_SERVICE: process.env.EMAIL_SERVICE || undefined,
      EMAIL_HOST: process.env.EMAIL_HOST || undefined,
      EMAIL_PORT: process.env.EMAIL_PORT || undefined,
      EMAIL_SECURE: process.env.EMAIL_SECURE || undefined,
      EMAIL_USER: process.env.EMAIL_USER ? "[set]" : "[missing]",
    };
    console.error("Email config summary:", summary);
  });

// 📧 Send ready-to-ship email to both sender and receiver
async function sendReadyToShipEmail({ trackingId, senderName, senderEmail, receiverName, receiverEmail, packageDesc, dispatchLocation, dispatchDate, estimatedArrivalDate }) {
  const subject = `Package Ready to Ship - Tracking ID: ${trackingId.toUpperCase()}`;
  const baseHtml = `
    <div style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;color:#0f172a;max-width:600px;margin:0 auto">
      <div style="background:#1e40af;color:white;padding:20px;border-radius:8px 8px 0 0">
        <h2 style="margin:0;color:white">📦 Package Ready to Ship</h2>
      </div>
      <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
        <p style="margin:0 0 16px;font-size:16px;color:#111827">Your package is ready to be shipped!</p>
        <div style="background:white;padding:16px;border-radius:6px;margin:16px 0;border:1px solid #e5e7eb">
          <p style="margin:0 0 8px"><strong>Tracking ID:</strong> <span style="font-family:monospace;font-size:18px;color:#1e40af;font-weight:bold">${trackingId.toUpperCase()}</span></p>
          ${packageDesc ? `<p style="margin:8px 0"><strong>Package Description:</strong> ${packageDesc}</p>` : ''}
          ${dispatchLocation ? `<p style="margin:8px 0"><strong>Dispatch Location:</strong> ${dispatchLocation}</p>` : ''}
          ${dispatchDate ? `<p style="margin:8px 0"><strong>Dispatch Date:</strong> ${new Date(dispatchDate).toLocaleDateString()}</p>` : ''}
          ${estimatedArrivalDate ? `<p style="margin:8px 0"><strong>Estimated Arrival:</strong> ${new Date(estimatedArrivalDate).toLocaleDateString()}</p>` : ''}
        </div>
        <p style="margin:16px 0;color:#374151">You can track your package using the tracking ID above on our website.</p>
        <p style="margin:16px 0 0;color:#6b7280;font-size:12px">This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  `;

  // Send to sender
  if (senderEmail) {
    try {
      await mailTransporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: senderEmail,
        subject: subject,
        html: baseHtml.replace('Your package', `Hi ${senderName || 'there'},<br/><br/>Your package`),
      });
      console.log(`✅ Ready-to-ship email sent to sender ${senderEmail} for ${trackingId}`);
    } catch (err) {
      console.error(`❌ Failed to send ready-to-ship email to sender:`, err.message);
    }
  }

  // Send to receiver
  if (receiverEmail && receiverEmail !== senderEmail) {
    try {
      await mailTransporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: receiverEmail,
        subject: subject,
        html: baseHtml.replace('Your package', `Hi ${receiverName || 'there'},<br/><br/>Your package`),
      });
      console.log(`✅ Ready-to-ship email sent to receiver ${receiverEmail} for ${trackingId}`);
    } catch (err) {
      console.error(`❌ Failed to send ready-to-ship email to receiver:`, err.message);
    }
  }
}

// 📧 Send status change email to both sender and receiver
async function sendStatusEmail({ trackingId, oldStatus, newStatus, senderName, senderEmail, receiverName, receiverEmail, packageDesc }) {
  const subject = `Package Status Update - ${trackingId.toUpperCase()}`;
  const baseHtml = `
    <div style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;color:#0f172a;max-width:600px;margin:0 auto">
      <div style="background:#1e40af;color:white;padding:20px;border-radius:8px 8px 0 0">
        <h2 style="margin:0;color:white">📦 Package Status Update</h2>
      </div>
      <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
        <p style="margin:0 0 16px;font-size:16px;color:#111827">The status of your package has been updated.</p>
        <div style="background:white;padding:16px;border-radius:6px;margin:16px 0;border:1px solid #e5e7eb">
          <p style="margin:0 0 8px"><strong>Tracking ID:</strong> <span style="font-family:monospace;font-size:18px;color:#1e40af;font-weight:bold">${trackingId.toUpperCase()}</span></p>
          ${packageDesc ? `<p style="margin:8px 0"><strong>Package:</strong> ${packageDesc}</p>` : ''}
          <div style="margin:16px 0;padding:12px;background:#fef3c7;border-left:4px solid #f59e0b;border-radius:4px">
            <p style="margin:0 0 4px"><strong>Previous Status:</strong> <span style="color:#6b7280">${oldStatus || "N/A"}</span></p>
            <p style="margin:4px 0 0"><strong>Current Status:</strong> <span style="color:#059669;font-weight:bold">${newStatus}</span></p>
          </div>
        </div>
        <p style="margin:16px 0;color:#374151">We'll keep you updated on further progress.</p>
        <p style="margin:16px 0 0;color:#6b7280;font-size:12px">This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  `;

  // Send to sender
  if (senderEmail) {
    try {
      await mailTransporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: senderEmail,
        subject: subject,
        html: baseHtml.replace('The status of your package', `Hi ${senderName || 'there'},<br/><br/>The status of your package`),
      });
      console.log(`✅ Status email sent to sender ${senderEmail} for ${trackingId}`);
    } catch (err) {
      console.error(`❌ Failed to send status email to sender:`, err.message);
    }
  }

  // Send to receiver
  if (receiverEmail && receiverEmail !== senderEmail) {
    try {
      await mailTransporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: receiverEmail,
        subject: subject,
        html: baseHtml.replace('The status of your package', `Hi ${receiverName || 'there'},<br/><br/>The status of your package`),
      });
      console.log(`✅ Status email sent to receiver ${receiverEmail} for ${trackingId}`);
    } catch (err) {
      console.error(`❌ Failed to send status email to receiver:`, err.message);
    }
  }
}

// ✅ Connect once and reuse the connection
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect:", err);
  }
}
connectDB();

// 🔐 Auth helpers
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// 🔐 Login
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body || {};
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res.status(500).json({ success: false, message: "Admin credentials not configured" });
  }
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "24h" });
    return res.json({ success: true, token });
  }
  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

// 📦 Save tracking data
app.post("/api/add-tracking-id", authMiddleware, async (req, res) => {
  try {
    const {
      senderName,
      senderEmail,
      senderContact,
      senderAddress,
      receiverAddress,
      receiverName,
      receiverEmail,
      receiverContact,
      packageDesc,
      dispatchLocation,
      status,
      dispatchDate,
      estimatedArrivalDate,
    } = req.body;

    const trackingId = nanoid(10).toLowerCase();

    const record = {
      trackingId,
      senderName,
      senderEmail,
      senderContact,
      senderAddress,
      receiverAddress,
      receiverName,
      receiverEmail,
      receiverContact,
      packageDesc,
      dispatchLocation,
      status,
      dispatchDate,
      estimatedArrivalDate,
      createdAt: new Date(),
    };

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.insertOne(record);

    console.log("✅ Data saved with tracking ID:", trackingId);

    // Send ready-to-ship email to both sender and receiver
    await sendReadyToShipEmail({
      trackingId,
      senderName,
      senderEmail,
      receiverName,
      receiverEmail,
      packageDesc,
      dispatchLocation,
      dispatchDate,
      estimatedArrivalDate,
    });

    res.json({
      success: true,
      trackingId,
      message: "Tracking data saved successfully!",
    });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.get("/api/track/:trackingId", async (req, res) => {
  try {
    const { trackingId } = req.params;

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Find one record by trackingId
    const record = await collection.findOne({ trackingId: trackingId.toLowerCase() });

    if (!record) {
      return res.status(404).json({ success: false, message: "Tracking ID not found." });
    }

    res.json({ success: true, data: record });
  } catch (error) {
    console.error(" Error fetching data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 📋 Get all tracking records
app.get("/api/tracking-records", authMiddleware, async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const records = await collection.find({}).sort({ createdAt: -1 }).toArray();

    res.json({ success: true, data: records });
  } catch (error) {
    console.error("❌ Error fetching records:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✏️ Update cargo details
app.put("/api/update/:trackingId", authMiddleware, async (req, res) => {
  try {
    const { trackingId } = req.params;
    const updateData = req.body; // all new fields from frontend

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Read current record to detect status changes
    const existing = await collection.findOne({ trackingId });

    const result = await collection.updateOne(
      { trackingId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Tracking ID not found." });
    }

    // Fetch updated doc to get latest email/status
    const updated = await collection.findOne({ trackingId });

    // If status changed, send email to both sender and receiver
    if (existing && updated && updateData.status && existing.status !== updated.status) {
      await sendStatusEmail({
        trackingId,
        oldStatus: existing.status,
        newStatus: updated.status,
        senderName: updated.senderName,
        senderEmail: updated.senderEmail,
        receiverName: updated.receiverName,
        receiverEmail: updated.receiverEmail,
        packageDesc: updated.packageDesc,
      });
    }

    res.json({ success: true, message: "Cargo record updated successfully!" });
  } catch (error) {
    console.error("❌ Error updating data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🗑️ Delete cargo record
app.delete("/api/delete/:trackingId", authMiddleware, async (req, res) => {
  try {
    const { trackingId } = req.params;

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.deleteOne({ trackingId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Tracking ID not found." });
    }

    res.json({ success: true, message: "Cargo record deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// ✅ Start server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
