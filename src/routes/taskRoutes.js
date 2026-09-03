import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { validate } from "../middlewares/validate.js";
import {
  createTaskValidation,
  updateTaskValidation,
  idParamValidation,
} from "../middlewares/taskValidations.js";

const router = Router();

router.post("/", createTaskValidation, validate, createTask);
router.get("/", getTasks);
router.get("/:id", idParamValidation, validate, getTaskById);
router.put("/:id", updateTaskValidation, validate, updateTask);
router.delete("/:id", idParamValidation, validate, deleteTask);

export default router;
