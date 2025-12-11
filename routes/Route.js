import express from "express";
import {    
    showUsernames,
    doLogin,
    doRegister, 
    getProducts,
    addProduct,
    editProduct,
    getProductById,
    deleteProduct
} from "../controllers/Controller.js";

// Import the middleware
import { verifyToken, requireRole } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// --- PUBLIC ROUTES (No Token Needed) ---
router.post("/register", doRegister);
router.post("/login", doLogin);

// --- PROTECTED ROUTES (Logged in Users) ---
// The 'verifyToken' middleware ensures the user is logged in.
// You can optionally add requireRole("user") if you want to be strict.
router.get("/products", verifyToken, getProducts);
router.get("/product/:id", verifyToken, getProductById);
router.get("/usernames", verifyToken, showUsernames);

// --- MANAGER/ADMIN ROUTES (Restricted) ---
// These routes require the 'manajer' role specifically.
// The order is important: 1. Verify Token -> 2. Check Role -> 3. Run Controller
router.post("/add-product", verifyToken, requireRole("manajer"), addProduct);
router.put("/edit-product/:id", verifyToken, requireRole("manajer"), editProduct);
router.delete("/delete-product/:id", verifyToken, requireRole("manajer"), deleteProduct);

export default router;