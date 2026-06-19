import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

let clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
if (clientUrl.endsWith("/")) {
  clientUrl = clientUrl.slice(0, -1);
}

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

app.use("/webhooks/stripe", express.raw({ type: "application/json" }));
app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ status: "success", message: "Fable API is running!" });
});

app.use(routes);
app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Fable server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
