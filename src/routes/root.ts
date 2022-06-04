import express from "express";

const rootRouter = express.Router();

rootRouter.get("/", (_req, res) => {
  res.send("Hello from root");
});


export default rootRouter;