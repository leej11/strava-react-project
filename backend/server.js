require("dotenv").config();
const express = require("express");
// const db = require("./db");
const activityRoutes = require("./routes/activities");

// express app
const app = express();

// middleware
// this middleware function parses incoming request with JSON payloads
// and makes the parsed JSON available in `req.body`
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
// here we are defining in a separate file, the different API end points
// and what happens with each API call
app.use("/api/activities", activityRoutes);

// app.get("/", async (req, res) => {
//   try {
//     const result = await db.query(
//       "SELECT * FROM activity WHERE totaldistance > 10000"
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.listen(process.env.PORT, () => {
  console.log("Connected to DB and listening on port", process.env.PORT);
});
