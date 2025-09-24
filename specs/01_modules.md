## Project Rules for Express + TypeScript REST API

---

### 1. **The Database Schema**

- The Drizzle schema (`src/lib/db/schema.ts`) is the source of truth for entities.
- Each entity in the schena should map to a dedicated module

---

### 2. **Reference Module**

- This project has one module created as a reference implementation. In this case is the "movies" module.
- Any new module (e.g. screenings, products, whatever) must replicate exactly the reference module, this means:
  - Folder structure
  - File naming
  - Import style
  - Error handling
  - Everything
  - The only changes should be some names specific to the modules, such as entity names, or the entity in the schema used to perform the database operations.

---
