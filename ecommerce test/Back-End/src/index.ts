import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { json } from "body-parser";
import authRoutes from "./routes/auth";
import productsRoutes from "./routes/products";
import categoriesRoutes from "./routes/categories";
import cartRoutes from "./routes/cart";
import checkoutRoutes from "./routes/checkout";
import webhooksRoutes from "./routes/webhooks";
import { prisma } from "./prismaClient";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(json());
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 200,
  })
);

app.get("/health", async (req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/products", productsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/webhooks", webhooksRoutes);

// basic error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ code: "INTERNAL_ERROR", message: err.message || "Internal error" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
