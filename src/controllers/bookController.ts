import { Request, Response } from "express";
import Book from "../models/bookModel";
import mongoose from "mongoose";
import { bookSchema, idSchema } from "../utils/bookValidator";
import {uploadToS3} from "../middleware/s3Uploader";


export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, publishedDate, ISBN } = req.body;
    const { error } = bookSchema.validate(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message || "All fields are required" });
      return 
    }

    const book = await Book.create({ title, author, publishedDate, ISBN });
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateBookCover = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const { error } = idSchema.validate(req.params);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return 
      }
  
      // Find the book by ID
      const book = await Book.findById(id);
      if (!book) {
        res.status(404).json({ error: "Book not found" });
        return;
      }

       // Check if a file was uploaded
       if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }
      
      const fileUrl = await uploadToS3(req.file);

      // Update the cover image
      book.coverImage = fileUrl;
      await book.save();
  
      res.status(200).json({ success: true, data: book });
    } catch (error: any) {
      if (error.message === "Only image files are allowed!") {
        res.status(500).json({ error: "Only image files are allowed!" });
      } else {
        res.status(500).json({ error: error.message||"Server error" });
      }
    }
  };

export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const books = await Book.find().skip((+page - 1)* +limit).limit(+limit); // Fetch all books from the database
      res.status(200).json({
        success: true,
        data: books,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

export const getBookById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "id not valid" }); // Return 400 for invalid IDs
        return;
      }
  
      // Find book by ID
      const book = await Book.findById(id);
  
      // Handle case where book is not existent
      if (!book) {
        res.status(404).json({ error: "Book not found" });
        return;
      }
  
      res.status(200).json({
        success: true,
        data: book,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

export const updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, author, publishedDate, ISBN } = req.body;

      const { error } = bookSchema.validate(req.body);

      if (error) {
        res.status(400).json({ error: "Validation failed" });
        return;
     }
  
      // Find the book by ID and update
      const updatedBook = await Book.findByIdAndUpdate(
        id,
        { title, author, publishedDate, ISBN },
        { new: true, runValidators: true }
      );
  
      // Handle case where book is not found
      if (!updatedBook) {
        res.status(404).json({ error: "Book not found" });
        return;
      }
  
      res.status(200).json({
        success: true,
        data: updatedBook,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "id not valid" }); // Return 400 for invalid IDs
        return;
      }
  
      // Find and delete the book by ID
      const deletedBook = await Book.findByIdAndDelete(id);
  
      // Handle case where book is not found
      if (!deletedBook) {
        res.status(404).json({ error: "Book not found" });
        return;
      }
  
      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: deletedBook,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  
  