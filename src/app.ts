import express from "express";
import cors from "cors";

// Better Auth
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth";

// Uploadthing
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "@/modules/uploadthing/routers";

// Middlewares
import { errorHandler } from "@/middlewares/error-handler";

// Routers
import eventsRouter from "@/modules/events/routers";
import showtimesRouter from "@/modules/showtimes/routers";
import ticketsRouter from "@/modules/tickets/routers";
import productsRouter from "@/modules/products/routers";
import cartsRouter from "@/modules/carts/routers";
import ordersRouter from "@/modules/orders/routers";

export const app = express();

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Better Auth
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

// Uploadthing
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
  }),
);

// Mounted Routers
app.use("/api/v1/events", eventsRouter);
app.use("/api/v1/showtimes", showtimesRouter);
// app.use("/api/v1/tickets", ticketsRouter);
// app.use("/api/v1/products", productsRouter);
// app.use("/api/v1/carts", cartsRouter);
// app.use("/api/v1/orders", ordersRouter);

// Error handler middleware
app.use(errorHandler);
