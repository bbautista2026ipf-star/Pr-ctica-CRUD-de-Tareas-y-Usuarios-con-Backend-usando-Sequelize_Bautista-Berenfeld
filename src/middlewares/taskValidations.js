import { body, param } from "express-validator";
import Task from "../models/task.js";

export const idParamValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo.")
    .bail()
    .custom(async (id) => {
      const task = await Task.findByPk(id);
      if (!task) {
        throw new Error("No existe una tarea con ese id.");
      }
      return true;
    }),
];

export const createTaskValidation = [
  body("title")
    .notEmpty()
    .withMessage("El campo title es requerido.")
    .isLength({ max: 100 })
    .withMessage("El campo title no puede superar 100 caracteres.")
    .custom(async (title) => {
      const exists = await Task.findOne({ where: { title } });
      if (exists) {
        throw new Error("El título ya existe.");
      }
      return true;
    }),
  body("description")
    .notEmpty()
    .withMessage("El campo description es requerido.")
    .isLength({ max: 100 })
    .withMessage("El campo description no puede superar 100 caracteres.")
    .custom((description, { req }) => {
      if (description === req.body.title) {
        throw new Error("La descripción no puede ser igual al título.");
      }
      return true;
    }),
  body("isComplete")
    .optional()
    .isBoolean()
    .withMessage("El campo isComplete debe ser booleano."),
];

export const updateTaskValidation = [
  ...idParamValidation,
  body("title")
    .optional()
    .notEmpty()
    .withMessage("El campo title no puede estar vacío.")
    .isLength({ max: 100 })
    .withMessage("El campo title no puede superar 100 caracteres.")
    .custom(async (title, { req }) => {
      const exists = await Task.findOne({ where: { title } });
      if (exists && exists.id !== Number(req.params.id)) {
        throw new Error("El título ya está en uso por otra tarea.");
      }
      return true;
    }),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("El campo description no puede estar vacío.")
    .isLength({ max: 100 })
    .withMessage("El campo description no puede superar 100 caracteres."),
  body("isComplete")
    .optional()
    .isBoolean()
    .withMessage("El campo isComplete debe ser booleano."),
];
