import { Request, Response, NextFunction } from "express";

// Services
import {
  findAll,
  findById,
  insert,
  update,
  remove,
  addProduct,
  addTicket,
} from "../services";

// DTOs
import {
  CreateCartDTO,
  UpdateCartDTO,
  AddCartProductDTO,
  AddCartTicketDTO,
} from "../lib/validation/schema";

export async function getAllCarts(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const carts = await findAll();
    res.json(carts);
  } catch (error) {
    next(error);
  }
}

export async function getCartById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const cart = await findById(id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

export async function createCart(
  req: Request<{}, {}, CreateCartDTO>,
  res: Response,
  next: NextFunction,
) {
  try {
    const cart = await insert(req.body);
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function updateCart(
  req: Request<{ id: string }, {}, UpdateCartDTO>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const cart = await update(id, req.body);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

export async function deleteCart(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const cart = await remove(id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

export async function addProductToCart(
  req: Request<{ id: string }, {}, AddCartProductDTO>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const cart = await addProduct(id, req.body);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

export async function addTicketToCart(
  req: Request<{ id: string }, {}, AddCartTicketDTO>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const cart = await addTicket(id, req.body);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}
