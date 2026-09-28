import "dotenv/config";
import express from "express";
import cors from "cors";

import passport from "./src/config/passport.js";
import errorHandler from "./src/middleware/errorhandler.js";
import authRouter from "./src/routes/auth.route.js";
import conversationRouter from "./src/routes/converation.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/conversations", conversationRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "working" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});