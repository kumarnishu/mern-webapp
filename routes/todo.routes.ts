import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { } from "../controllers/greeting.controller";
import { CreateTodo, DeleteTodo, GetMyTodos, GetTodos, StartAllTodos, StartTodo, StopAllTodos, StopTodo, ToogleHideTodo, UpdateStatus, UpdateTodo } from "../controllers/todo.controller";

const router = express.Router()
router.route("/todos").post(isAuthenticatedUser, CreateTodo)
router.route("/todos/:id").put(isAuthenticatedUser, UpdateTodo)
router.route("/todos").get(isAuthenticatedUser, GetTodos)
router.route("/todos/me").get(isAuthenticatedUser, GetMyTodos)
router.route("/todos/:id").delete(isAuthenticatedUser, DeleteTodo)
router.route("/todos/start/:id").patch(isAuthenticatedUser, StartTodo)
router.route("/todos/stop/:id").patch(isAuthenticatedUser, StopTodo)
router.route("/todos/hide/:id").patch(isAuthenticatedUser, ToogleHideTodo)
router.route("/todos/bulk/stop").patch(isAuthenticatedUser, StopAllTodos)
router.route("/todos/bulk/start").patch(isAuthenticatedUser, StartAllTodos)
router.route("/todos/status/:id").patch(isAuthenticatedUser, UpdateStatus)

export default router