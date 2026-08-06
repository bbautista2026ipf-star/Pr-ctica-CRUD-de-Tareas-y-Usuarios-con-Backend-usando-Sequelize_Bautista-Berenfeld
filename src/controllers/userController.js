import User from "../models/User.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.length > 100)
      return res.status(400).json({ error: "Nombre inválido" });
    if (!email || email.length > 100)
      return res.status(400).json({ error: "Email inválido" });
    if (!password || password.length > 100)
      return res.status(400).json({ error: "Password inválido" });

    const emailExists = await User.findOne({ where: { email } });
    if (emailExists)
      return res.status(400).json({ error: "El email ya está registrado" });

    const newUser = await User.create({ name, email, password });
    res.status(201).json({ message: "Usuario creado", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar usuario" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await user.update(req.body);
    res.status(200).json({ message: "Usuario actualizado exitosamente", user });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await user.destroy();
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
