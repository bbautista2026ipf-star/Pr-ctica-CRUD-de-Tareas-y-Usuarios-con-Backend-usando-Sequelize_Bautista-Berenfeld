import User from "../models/user.js";
import { matchedData } from "express-validator";

// ─── POST /api/users ──────────────────────────────────────────────────────────
export const createUser = async (req, res) => {
  try {
    const data = matchedData(req);
    const newUser = await User.create(data);
    return res
      .status(201)
      .json({ message: "Usuario creado exitosamente.", user: newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error interno del servidor.", detalle: error.message });
  }
};

// ─── GET /api/users ───────────────────────────────────────────────────────────
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({
        error: "Error al obtener la lista de usuarios.",
        detalle: error.message,
      });
  }
};

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ error: `No se encontró un usuario con id ${req.params.id}.` });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al buscar el usuario.", detalle: error.message });
  }
};

// ─── PUT /api/users/:id ───────────────────────────────────────────────────────
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ error: `No se encontró un usuario con id ${req.params.id}.` });
    }

    const data = matchedData(req, { locations: ["body"] });
    await user.update(data);

    return res
      .status(200)
      .json({ message: "Usuario actualizado exitosamente.", user });
  } catch (error) {
    return res
      .status(500)
      .json({
        error: "Error al actualizar el usuario.",
        detalle: error.message,
      });
  }
};

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ error: `No se encontró un usuario con id ${req.params.id}.` });
    }

    await user.destroy();
    return res
      .status(200)
      .json({
        message: `Usuario con id ${req.params.id} eliminado exitosamente.`,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al eliminar el usuario.", detalle: error.message });
  }
};
