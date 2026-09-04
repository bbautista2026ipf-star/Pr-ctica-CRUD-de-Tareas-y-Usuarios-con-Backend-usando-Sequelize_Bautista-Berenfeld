import Task from "../models/task.js";

// ─── POST /api/tasks ──────────────────────────────────────────────────────────
export const createTask = async (req, res) => {
  try {
    const { title, description, isComplete } = req.body;

    // Validaciones manuales de campos requeridos y longitud máxima
    if (
      !title ||
      typeof title !== "string" ||
      title.trim() === "" ||
      title.length > 100
    ) {
      return res
        .status(400)
        .json({
          error:
            'El campo "title" es requerido y no puede superar 100 caracteres.',
        });
    }
    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === "" ||
      description.length > 100
    ) {
      return res
        .status(400)
        .json({
          error:
            'El campo "description" es requerido y no puede superar 100 caracteres.',
        });
    }

    // Comprobación estricta: isComplete debe ser booleano si se envía
    if (isComplete !== undefined && typeof isComplete !== "boolean") {
      return res
        .status(400)
        .json({
          error:
            'El campo "isComplete" debe ser un valor booleano (true o false).',
        });
    }

    // Verificación de unicidad del title antes de crear
    const titleExists = await Task.findOne({ where: { title: title.trim() } });
    if (titleExists) {
      return res
        .status(400)
        .json({ error: "El título de la tarea ya existe. Debe ser único." });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description.trim(),
      isComplete: isComplete !== undefined ? isComplete : false,
    });

    return res
      .status(201)
      .json({ message: "Tarea creada exitosamente.", task: newTask });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error interno del servidor.", detalle: error.message });
  }
};

// ─── GET /api/tasks ───────────────────────────────────────────────────────────
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    return res.status(200).json(tasks);
  } catch (error) {
    return res
      .status(500)
      .json({
        error: "Error al obtener la lista de tareas.",
        detalle: error.message,
      });
  }
};

// ─── GET /api/tasks/:id ───────────────────────────────────────────────────────
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ error: `No se encontró una tarea con id ${req.params.id}.` });
    }
    return res.status(200).json(task);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al buscar la tarea.", detalle: error.message });
  }
};

// ─── PUT /api/tasks/:id ───────────────────────────────────────────────────────
export const updateTask = async (req, res) => {
  try {
    // Verificar existencia previa por ID (404 si no existe)
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ error: `No se encontró una tarea con id ${req.params.id}.` });
    }

    const { title, description, isComplete } = req.body;

    // Validaciones de campos si son enviados
    if (title !== undefined) {
      if (
        typeof title !== "string" ||
        title.trim() === "" ||
        title.length > 100
      ) {
        return res
          .status(400)
          .json({
            error:
              'El campo "title" no puede estar vacío ni superar 100 caracteres.',
          });
      }
      // Verificar unicidad del title (excluyendo la propia tarea)
      const titleExists = await Task.findOne({
        where: { title: title.trim() },
      });
      if (titleExists && titleExists.id !== task.id) {
        return res
          .status(400)
          .json({ error: "El título ya está en uso por otra tarea." });
      }
    }
    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        description.trim() === "" ||
        description.length > 100
      ) {
        return res
          .status(400)
          .json({
            error:
              'El campo "description" no puede estar vacío ni superar 100 caracteres.',
          });
      }
    }
    // Comprobación estricta: isComplete debe ser booleano si se envía
    if (isComplete !== undefined && typeof isComplete !== "boolean") {
      return res
        .status(400)
        .json({
          error:
            'El campo "isComplete" debe ser un valor booleano (true o false).',
        });
    }

    await task.update({
      title: title ? title.trim() : task.title,
      description: description ? description.trim() : task.description,
      isComplete: isComplete !== undefined ? isComplete : task.isComplete,
    });

    return res
      .status(200)
      .json({ message: "Tarea actualizada exitosamente.", task });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al actualizar la tarea.", detalle: error.message });
  }
};

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
export const deleteTask = async (req, res) => {
  try {
    // Verificar existencia previa por ID (404 si no existe)
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ error: `No se encontró una tarea con id ${req.params.id}.` });
    }

    await task.destroy();
    return res
      .status(200)
      .json({
        message: `Tarea con id ${req.params.id} eliminada exitosamente.`,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al eliminar la tarea.", detalle: error.message });
  }
};
