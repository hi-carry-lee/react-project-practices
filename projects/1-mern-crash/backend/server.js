import express from "express";
import connectDB from "./utils/connect-db.js";
import productRoutes from "./routes/product.route.js";
import path from "path";

const app = express();

// used for health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// config json parser
app.use(express.json());
// use routes
app.use("/api/products", productRoutes);
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  // make the frontend build folder as the static folder
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("/*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
}

const dbURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB(dbURI);
  console.log(`Server running on ${PORT}`);
});
