const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
// eslint-disable-next-line no-unused-vars
const dotenv = require("dotenv").config(); // for .env file
const app = express();
const { errorHandler } = require("./middleware/errorMiddleware");

const port = process.env.PORT;

connectDB();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/libraries", require("./routes/libraryRoutes"));
app.use("/api/testlab", require("./routes/testingRoutes"));

app.use(errorHandler);

app.listen(port, () =>
  console.log("API is running on http://localhost:" + port + "/api ")
);
