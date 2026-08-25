import { Router } from "express";
import { current, login, logout, register } from "../controllers/session.controller.js";
const router = Router()
router.post("/register", register)
router.post("/login", login)
router.get("/current",current)
router.post("/logout",logout)
export default router