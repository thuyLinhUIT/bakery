const express = require("express");
const cakeRouter = require("./route/cakeRouter");
const userRouter = require("./route/userRouter");
const typeRouter = require("./route/typeRouter");
const groupRouter = require("./route/groupRouter");
const User = require("./models").users;
const jwt = require("jsonwebtoken");
const db = require("./models");
const { isExpression } = require("joi");

const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("Drop and re-sync db.");
  })
  .catch((err) => {
    console.log("Errorrr: ", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static("../client/public"));


app.use(cakeRouter);
app.use(userRouter);
app.use(typeRouter);
app.use("/group", groupRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
