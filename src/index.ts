import express from "express";
import morgan from "morgan";
import "dotenv/config";
import { env } from "process";
import { expressjwt } from "express-jwt";
import { routes } from "./routes/index.js";
import mongoose from "mongoose";

mongoose.connect(env.MONGO_URL);
const app = express();
app.use(morgan("dev"));
app.use(express.json());
// Enable JWT authentication on all routes except auth/login
app.use("/", expressjwt({ secret: env.JWT_SECRET, algorithms: ["HS256"] }).unless({ path: ["/auth/login", "/auth/register"] }));
// Send 401 if token is not provided
app.use(function (err, _req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  } else
    next(err);
});
routes.map(route => {
    app.use(route.path, route.router);
})


app.listen(env.PORT, () => console.log(`Listening on port ${env.PORT}`));

