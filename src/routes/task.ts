import { Router } from "express";
import { createTask, deleteTask, getAllTasks, getTask, updateTask } from "../controllers/TaskController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware ,getAllTasks);
router.get("/:id", authMiddleware, getTask);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;