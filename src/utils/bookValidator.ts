import Joi from "joi";

export const bookSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  author: Joi.string().min(3).max(100).required(),
  publishedDate: Joi.date().required(),
  ISBN: Joi.string().pattern(/^\d{3}-\d{3}-\d{3}$/).required(),
});

export const idSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), // Validate MongoDB ObjectId
});