import "dotenv/config";
import { app } from "@/app";
// import { connect as db } from "@/lib/db";

// Env
// import { env } from "@/config/env";

// db(env.DATABASE_URL);

const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  res.send("Por fin pude hacer deploy de esta API, todo con dockersito papa");
});

const server = app.listen(PORT, () =>
  console.log(`[server] Connected to port ${PORT}`),
);

process.on("unhandledRejection", (err: unknown) => {
  if (err instanceof Error) {
    console.error(`[server] An error occurred: ${err.message}`);
  } else {
    console.error(`[server] An error occurred: ${err}`);
  }
  server.close(() => process.exit(1));
});
