const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Configuración CORS
const allowedOrigins = [
  "http://localhost:3000", // frontend en local
  "http://localhost:5000", // backend local
  "https://mini-gamma-murex.vercel.app", // otro frontend en Vercel (si lo usas)
  "https://mini.vercel.app", // 👈 tu frontend actual en Vercel
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // permitir Postman / sin origin
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS no permitido para " + origin), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 👈 Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // 👈 Headers permitidos
    credentials: true,
  })
);

// ✅ Habilitar preflight global
app.options("*", cors());

app.use(express.json());

// ✅ Rutas
const authRoutes = require("./authRoutes");
const taskRoutes = require("./taskRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API funcionando. Usa /api/auth o /api/tasks");
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// ✅ Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todoapp";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => {
    console.error("❌ Error al conectar MongoDB:", err.message);
    process.exit(1);
  });

// ✅ Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
module.exports = app;
