import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { validate } from "../middlewares/validate.js";
import {
  createUserValidation,
  updateUserValidation,
  idParamValidation,
} from "../middlewares/userValidations.js";

const router = Router();

router.post("/", createUserValidation, validate, createUser);
router.get("/", getUsers);
router.get("/:id", idParamValidation, validate, getUserById);
router.put("/:id", updateUserValidation, validate, updateUser);
router.delete("/:id", idParamValidation, validate, deleteUser);

export default router;
