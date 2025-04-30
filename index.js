const express = require("express");
const cors = require("cors");
const connection = require("./utils/connection");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const errorHandler = require("./middleware/errorHandler");
const HealthCheckController = require("./controllers/health-check");
const FRONTEND_URL = require("./config/config").FRONTEND_URL;
const PORT = require("./config/config").PORT;
const { app, server } = require("./services/socket");
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/message", messageRoutes);
app.get("/health-check", HealthCheckController.HealthCheck);

app.use(errorHandler);
server.listen(PORT, async () => {
  console.log(`Connected @ PORT ${PORT}`);
  await connection();
});
