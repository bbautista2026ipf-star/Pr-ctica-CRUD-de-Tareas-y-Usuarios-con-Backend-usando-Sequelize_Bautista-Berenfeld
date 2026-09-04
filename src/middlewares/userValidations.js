import { body, param } from "express-validator";
import User from "../models/user.js";

export const idParamValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo.")
    .bail()
    .custom(async (id) => {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("No existe un usuario con ese id.");
      }
      return true;
    }),
];

export const createUserValidation = [
  body("name")
    .notEmpty()
    .withMessage("El campo name es requerido.")
    .isLength({ max: 100 })
    .withMessage("El campo name no puede superar 100 caracteres."),
  body("email")
    .notEmpty()
    .withMessage("El campo email es requerido.")
    .isEmail()
    .withMessage("El campo email debe ser un correo válido.")
    .isLength({ max: 100 })
    .withMessage("El campo email no puede superar 100 caracteres.")
    .custom(async (email) => {
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        throw new Error("El email ya está registrado.");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("El campo password es requerido.")
    .isLength({ min: 6, max: 100 })
    .withMessage("El password debe tener entre 6 y 100 caracteres.")
    .custom((password, { req }) => {
      if (password === req.body.email) {
        throw new Error("El password no puede ser igual al email.");
      }
      return true;
    }),
];

export const updateUserValidation = [
  ...idParamValidation,
  body("name")
    .optional()
    .notEmpty()
    .withMessage("El campo name no puede estar vacío.")
    .isLength({ max: 100 })
    .withMessage("El campo name no puede superar 100 caracteres."),
  body("email")
    .optional()
    .notEmpty()
    .withMessage("El campo email no puede estar vacío.")
    .isEmail()
    .withMessage("El campo email debe ser un correo válido.")
    .isLength({ max: 100 })
    .withMessage("El campo email no puede superar 100 caracteres.")
    .custom(async (email, { req }) => {
      const exists = await User.findOne({ where: { email } });
      if (exists && exists.id !== Number(req.params.id)) {
        throw new Error("El email ya está en uso por otro usuario.");
      }
      return true;
    }),
  body("password")
    .optional()
    .notEmpty()
    .withMessage("El campo password no puede estar vacío.")
    .isLength({ min: 6, max: 100 })
    .withMessage("El password debe tener entre 6 y 100 caracteres."),
];
