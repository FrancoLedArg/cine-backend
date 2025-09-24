import { Request, Response, NextFunction } from "express";

// Services
import { findAll, findById, insert, update, createFromCart } from "../services";

// DTOs
import {
  CreateOrderDTO,
  UpdateOrderDTO,
  CreateOrderFromCartDTO,
} from "../lib/validation/schema";

export async function getAllOrders(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const orders = await findAll();
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const order = await findById(id);
    res.json(order);
  } catch (error) {
    next(error);
  }
}

export async function createOrder(
  req: Request<{}, {}, CreateOrderDTO>,
  res: Response,
  next: NextFunction,
) {
  try {
    const order = await insert(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

export async function createOrderFromCart(
  req: Request<{}, {}, CreateOrderFromCartDTO>,
  res: Response,
  next: NextFunction,
) {
  try {
    const order = await createFromCart(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

export async function updateOrder(
  req: Request<{ id: string }, {}, UpdateOrderDTO>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const order = await update(id, req.body);
    res.json(order);
  } catch (error) {
    next(error);
  }
}
