import express from "express";
import { createBook,
    updateBookCover,
    getAllBooks, 
    getBookById, 
    updateBook, 
    deleteBook,} from "../controllers/bookController";
import upload from "../middleware/upload";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";


const router = express.Router();

router.post("/books",authenticateToken, authorizeRoles("root-admin", "admin"), createBook);

router.patch("/books/cover-image/:id", upload.single("coverImage"), updateBookCover);

router.get("/books", authenticateToken, getAllBooks);

router.get("/books/:id",authenticateToken, getBookById);

router.put("/books/:id",authenticateToken,authorizeRoles("root-admin", "admin"), updateBook)

router.delete("/books/:id",authenticateToken,authorizeRoles("root-admin", "admin"), deleteBook);

export default router;
