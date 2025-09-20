const express = require("express");
const router = express.Router();
const { register, login, resetPassword } = require("./authController");
const verifyToken = require("./middleware/verifyToken"); // middleware JWT
const User = require("./models/User");

// Rutas existentes
router.post("/register", register);
router.post("/login", login);
router.post("/reset", resetPassword);

// ===== NUEVAS RUTAS PARA PERFIL =====
// Obtener perfil
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
});

// Actualizar perfil
router.put("/me", verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el perfil" });
  }
});

module.exports = router;
