const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./authRoutes");
const taskRoutes = require("./taskRoutes"); // 👈 Importamos las rutas de tareas

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API funcionando. Usa /api/auth o /api/tasks");
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todoapp";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => {
    console.error("❌ Error al conectar MongoDB:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
