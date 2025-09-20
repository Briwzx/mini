const Task = require("./Task");
const jwt = require("jsonwebtoken");

function getUserIdFromToken(req) {
  let token = req.headers.authorization;
  if (!token) throw new Error("Token requerido");

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decodificado:", decoded); // 🟢 Log para ver el contenido del token
    return decoded.id;
  } catch (err) {
    console.error("❌ Error verificando token:", err.message);
    throw new Error("Token inválido o expirado");
  }
}

exports.createTask = async (req, res) => {
  try {
    console.log("📩 Body recibido en createTask:", req.body);

    const userId = getUserIdFromToken(req);
    console.log("👤 userId obtenido del token:", userId);

    const { title, description, startDate, endDate } = req.body;

    if (!title || !startDate || !endDate) {
      console.warn("⚠️ Faltan campos obligatorios:", {
        title,
        startDate,
        endDate,
      });
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error("❌ Fechas inválidas:", { startDate, endDate });
      return res.status(400).json({ error: "Formato de fecha inválido" });
    }

    const task = await Task.create({
      userId,
      title,
      description,
      startDate: start,
      endDate: end,
    });

    console.log("✅ Tarea creada en MongoDB:", task);
    res.status(201).json(task);
  } catch (err) {
    console.error("❌ Error en createTask:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    console.log("👤 Buscando tareas para userId:", userId);

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    console.log(`✅ ${tasks.length} tareas encontradas`);
    res.json(tasks);
  } catch (err) {
    console.error("❌ Error en getTasks:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { id } = req.params;

    console.log("✏️ Actualizando tarea:", id, "para userId:", userId);
    console.log("📩 Datos recibidos para update:", req.body);

    const task = await Task.findOneAndUpdate({ _id: id, userId }, req.body, {
      new: true,
    });

    if (!task) {
      console.warn("⚠️ Tarea no encontrada:", id);
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    console.log("✅ Tarea actualizada:", task);
    res.json(task);
  } catch (err) {
    console.error("❌ Error en updateTask:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { id } = req.params;

    console.log("🗑️ Eliminando tarea:", id, "para userId:", userId);

    const task = await Task.findOneAndDelete({ _id: id, userId });

    if (!task) {
      console.warn("⚠️ Tarea no encontrada al eliminar:", id);
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    console.log("✅ Tarea eliminada:", task);
    res.json({ message: "Tarea eliminada correctamente" });
  } catch (err) {
    console.error("❌ Error en deleteTask:", err.message);
    res.status(400).json({ error: err.message });
  }
};
