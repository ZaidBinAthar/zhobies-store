import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  preview: {
    functions: {
      contact: { name: "contact", source: "./functions/contact.ts" },
      submissions: { name: "submissions", source: "./functions/submissions.ts" },
      updatestatus: { name: "updatestatus", source: "./functions/submissions-patch.ts" },
      setupdb: { name: "setupdb", source: "./functions/setup-db.ts" },
      products: { name: "products", source: "./functions/products.ts" },
    },
  },
});
