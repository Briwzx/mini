const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Rutas
const authRoutes = require("./authRoutes");
app.use("/api/auth", authRoutes);

// Si tienes rutas de tareas, descomenta esto:
// const taskRoutes = require("./taskRoutes");
// app.use("/api/tasks", taskRoutes);

// ✅ Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todoapp";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => {
    console.error("❌ Error al conectar MongoDB:", err.message);
    process.exit(1); // Si falla, cerramos el server
  });

// ✅ Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
