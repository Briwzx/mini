const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

function getUserIdFromToken(req) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("Token requerido");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
}

exports.createTask = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { title, description, startDate, endDate } = req.body;
    const task = await Task.create({
      userId,
      title,
      description,
      startDate,
      endDate,
    });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { id } = req.params;
    const task = await Task.findOneAndUpdate({ _id: id, userId }, req.body, {
      new: true,
    });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { id } = req.params;
    await Task.findOneAndDelete({ _id: id, userId });
    res.json({ message: "Tarea eliminada" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
