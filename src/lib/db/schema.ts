import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  serial,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

// Events
export const eventTypes = pgEnum("event_types", ["movie", "theater"]);

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  type: eventTypes("type").notNull().default("movie"),
  duration: integer("duration"),
  posterUrl: text("poster_url"),
  bannerUrl: text("banner_url"),
  trailerUrl: text("trailer_url"),
});

export const eventRelations = relations(events, ({ one, many }) => ({
  showtimes: many(showtimes),
}));

// Showtimes
export const showtimes = pgTable("showtimes", {
  id: serial("id").primaryKey(),
  event_id: integer("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  start_datetime: timestamp("start_datetime").notNull(),
});

export const showtimeRelations = relations(showtimes, ({ one, many }) => ({
  event: one(events, {
    fields: [showtimes.event_id],
    references: [events.id],
  }),
  seats: many(seats),
}));

// Seats
export const seatSections = pgEnum("seat_sections", [
  "main",
  "box",
  "lower_balcony",
  "upper_balcony",
]);

export const seatStatus = pgEnum("seat_status", [
  "available",
  "reserved",
  "sold",
]);

export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),
  showtime_id: integer("showtime_id")
    .notNull()
    .references(() => showtimes.id, { onDelete: "cascade" }),
  seat_section: seatSections("section").notNull().default("main"),
  seat_row: text("seat_row").notNull(),
  seat_number: integer("seat_number").notNull(),
  status: seatStatus("status").notNull().default("available"),
});

export const seatRelations = relations(seats, ({ one }) => ({
  showtime: one(showtimes, {
    fields: [seats.showtime_id],
    references: [showtimes.id],
  }),
}));

// Seat Categories
export const seatCategories = pgTable("seat_categories", {
  id: serial("id").primaryKey(),
  showtime_id: integer("showtime_id")
    .notNull()
    .references(() => showtimes.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
});

export const seatCategoryRelations = relations(
  seatCategories,
  ({ one, many }) => ({
    showtime: one(showtimes, {
      fields: [seatCategories.showtime_id],
      references: [showtimes.id],
    }),
    seats: many(seats),
  }),
);

// Tickets
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  showtime_id: integer("showtime_id")
    .notNull()
    .references(() => showtimes.id, { onDelete: "cascade" }),
  seat_number: integer("seat_number").notNull(),
});

export const ticketRelations = relations(tickets, ({ one }) => ({
  user: one(user, {
    fields: [tickets.user_id],
    references: [user.id],
  }),
  showtime: one(showtimes, {
    fields: [tickets.showtime_id],
    references: [showtimes.id],
  }),
}));

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  stock: integer("stock").notNull(),
  created_at: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updated_at: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Carts
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updated_at: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  expires_at: timestamp("expires_at"), // Optional: to manage seat reservation time
});

export const cartRelations = relations(carts, ({ one, many }) => ({
  user: one(user, {
    fields: [carts.user_id],
    references: [user.id],
  }),
  cartTickets: many(cartTickets),
  cartProducts: many(cartProducts),
}));

// Cart Tickets
export const cartTickets = pgTable("cart_tickets", {
  cart_id: integer("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  ticket_id: integer("ticket_id")
    .notNull()
    .references(() => tickets.id, { onDelete: "cascade" }),
});

// Cart Products
export const cartProducts = pgTable("cart_products", {
  cart_id: integer("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  product_id: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  total_amount: integer("total_amount").notNull(),
  created_at: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updated_at: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.user_id],
    references: [user.id],
  }),
  orderTickets: many(orderTickets),
  orderProducts: many(orderProducts),
}));

// Order Tickets
export const orderTickets = pgTable("order_tickets", {
  order_id: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  ticket_id: integer("ticket_id")
    .notNull()
    .references(() => tickets.id, { onDelete: "cascade" }),
});

// Order Products
export const orderProducts = pgTable("order_products", {
  order_id: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  product_id: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
});
