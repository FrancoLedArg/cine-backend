import { Request, Response, NextFunction } from "express";

// Services
import { findAll, findById, insert, update, remove } from "../services";

// DTOs
import { CreateTicketDTO, UpdateTicketDTO } from "../lib/validation/schema";

export async function getAllTickets(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tickets = await findAll();
    res.json(tickets);
  } catch (error) {
    next(error);
  }
}

export async function getTicketById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const ticket = await findById(id);
    res.json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function createTicket(
  req: Request<{}, {}, CreateTicketDTO>,
  res: Response,
  next: NextFunction,
) {
  try {
    const ticket = await insert(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function updateTicket(
  req: Request<{ id: string }, {}, UpdateTicketDTO>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const ticket = await update(id, req.body);
    res.json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function deleteTicket(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const ticket = await remove(id);
    res.json(ticket);
  } catch (error) {
    next(error);
  }
}
