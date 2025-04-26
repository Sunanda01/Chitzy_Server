const express = require("express");
const cors = require("cors");
const connection = require("./utils/connection");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const PORT = require("./config/config").PORT;
const app = express();
app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);

app.use(errorHandler);
app.listen(PORT, async () => {
  console.log(`Connected @ PORT ${PORT}`);
  await connection();
});
