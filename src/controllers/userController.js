import User from '../models/user.js';

// ─── POST /api/users ──────────────────────────────────────────────────────────
export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validaciones manuales de campos requeridos y longitud máxima
        if (!name || typeof name !== 'string' || name.trim() === '' || name.length > 100) {
            return res.status(400).json({ error: 'El campo "name" es requerido y no puede superar 100 caracteres.' });
        }
        if (!email || typeof email !== 'string' || email.trim() === '' || email.length > 100) {
            return res.status(400).json({ error: 'El campo "email" es requerido y no puede superar 100 caracteres.' });
        }
        if (!password || typeof password !== 'string' || password.trim() === '' || password.length > 100) {
            return res.status(400).json({ error: 'El campo "password" es requerido y no puede superar 100 caracteres.' });
        }

        // Verificación de unicidad de email antes de crear
        const emailExists = await User.findOne({ where: { email: email.trim() } });
        if (emailExists) {
            return res.status(400).json({ error: 'El email ya está registrado. Debe ser único.' });
        }

        const newUser = await User.create({
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
        });

        return res.status(201).json({ message: 'Usuario creado exitosamente.', user: newUser });
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor.', detalle: error.message });
    }
};

// ─── GET /api/users ───────────────────────────────────────────────────────────
export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener la lista de usuarios.', detalle: error.message });
    }
};

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
export const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: `No se encontró un usuario con id ${req.params.id}.` });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Error al buscar el usuario.', detalle: error.message });
    }
};

// ─── PUT /api/users/:id ───────────────────────────────────────────────────────
export const updateUser = async (req, res) => {
    try {
        // Verificar existencia previa por ID (404 si no existe)
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: `No se encontró un usuario con id ${req.params.id}.` });
        }

        const { name, email, password } = req.body;

        // Validaciones de campos si son enviados
        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim() === '' || name.length > 100) {
                return res.status(400).json({ error: 'El campo "name" no puede estar vacío ni superar 100 caracteres.' });
            }
        }
        if (email !== undefined) {
            if (typeof email !== 'string' || email.trim() === '' || email.length > 100) {
                return res.status(400).json({ error: 'El campo "email" no puede estar vacío ni superar 100 caracteres.' });
            }
            // Verificar unicidad del email (excluyendo el propio usuario)
            const emailExists = await User.findOne({ where: { email: email.trim() } });
            if (emailExists && emailExists.id !== user.id) {
                return res.status(400).json({ error: 'El email ya está en uso por otro usuario.' });
            }
        }
        if (password !== undefined) {
            if (typeof password !== 'string' || password.trim() === '' || password.length > 100) {
                return res.status(400).json({ error: 'El campo "password" no puede estar vacío ni superar 100 caracteres.' });
            }
        }

        await user.update({
            name: name ? name.trim() : user.name,
            email: email ? email.trim() : user.email,
            password: password ? password.trim() : user.password,
        });

        return res.status(200).json({ message: 'Usuario actualizado exitosamente.', user });
    } catch (error) {
        return res.status(500).json({ error: 'Error al actualizar el usuario.', detalle: error.message });
    }
};

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
export const deleteUser = async (req, res) => {
    try {
        // Verificar existencia previa por ID (404 si no existe)
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: `No se encontró un usuario con id ${req.params.id}.` });
        }

        await user.destroy();
        return res.status(200).json({ message: `Usuario con id ${req.params.id} eliminado exitosamente.` });
    } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar el usuario.', detalle: error.message });
    }
};
