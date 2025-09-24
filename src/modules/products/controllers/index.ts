import { Request, Response, NextFunction } from "express";

// Services
import { findAll, findById, insert, update, remove } from "../services";

// DTOs
import { CreateProductDTO, UpdateProductDTO } from "../lib/validation/schema";

export async function getAllProducts(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const products = await findAll();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProductById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const product = await findById(id);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(
  req: Request<{}, {}, CreateProductDTO>,
  res: Response,
  next: NextFunction,
) {
  try {
    const product = await insert(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(
  req: Request<{ id: string }, {}, UpdateProductDTO>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const product = await update(id, req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const product = await remove(id);
    res.json(product);
  } catch (error) {
    next(error);
  }
}
