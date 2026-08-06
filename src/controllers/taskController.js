import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, isComplete } = req.body;

    if (!title || title.length > 100)
      return res.status(400).json({ error: "Título inválido" });
    if (!description || description.length > 100)
      return res.status(400).json({ error: "Descripción inválida" });
    if (isComplete !== undefined && typeof isComplete !== "boolean") {
      return res.status(400).json({ error: "isComplete debe ser booleano" });
    }

    const titleExists = await Task.findOne({ where: { title } });
    if (titleExists)
      return res.status(400).json({ error: "El título de la tarea ya existe" });

    const newTask = await Task.create({ title, description, isComplete });
    res.status(201).json({ message: "Tarea creada", task: newTask });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tareas" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Tarea no encontrada" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar tarea" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

    await task.update(req.body);
    res.status(200).json({ message: "Tarea actualizada exitosamente", task });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar tarea" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

    await task.destroy();
    res.status(200).json({ message: "Tarea eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar tarea" });
  }
};
