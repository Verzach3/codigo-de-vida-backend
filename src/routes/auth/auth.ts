import express from "express";
import { nanoid } from "nanoid";
import Validator from "validatorjs";
import { User } from "../../Schemas/User.js";
import { User as UserInterface } from "../../Interfaces/User.js";
import { UserLoginValidationRules, UserRegistrationValidationRules } from "../../Validation/User.js";
import bcrypt from "bcrypt";
import nodejwt from "jsonwebtoken";
const authRouter = express.Router();

authRouter.get("/", (_req, res) => {
  res.send("Hello from auth");
});

authRouter.post("/login", (_req, res) => {
  const validation = new Validator(_req.body, UserLoginValidationRules);
  if (validation.fails()) {
    res.status(400).json({
      errors: validation.errors.all()
    });
  }
  User.findOne({ email: _req.body.email }, (err, user) => {
    if (err) {
      res.status(500).json({
        message: "Error while trying to login"
      });
    }
    if (!user) {
      res.status(401).json({
        message: "Wrong credentials"
      });
    }
    bcrypt.compare(_req.body.password, user.password, (err, result) => {
      if (err) {
        res.status(500).json({
          message: "Error while trying to login"
        });
      }
      if (!result) {
        res.status(401).json({
          message: "Wrong credentials"
        });
      }
      res.json({
        token: nodejwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "5h" })
      });
    });
  }
  );
});

authRouter.post("/register", async (_req, res) => {
  let user: UserInterface = {
    id: nanoid(),
    name: _req.body.name,
    email: _req.body.email,
    password: _req.body.password,
  };
  console.log(user);
  const validation = new Validator(user, UserRegistrationValidationRules);
  if (validation.fails()) {
    res.status(400).json({
      errors: validation.errors.all(),
    });
    console.log("Validation failed", validation.errors.all());
    return;
  }
  try {
    user.password = await bcrypt.hash(user.password, 10);
  } catch (error) {
    res.status(500).json({
      errors: [{ msg: "Error hashing password" }],
    });
    return;
  }
  console.log(user);
  const duplicatedUsers = await User.find({ email: user.email });
  if (duplicatedUsers.length > 0) {
    res.status(400).json({
      errors: [{ msg: "User already exists" }],
    });
    return;
  }
  const newUser = new User(user);
  try {
    await newUser.save();

  }
  catch (error) {
    res.status(500).json({
      errors: [{ msg: "Error saving user" }],
    });
    return;
  }
  res.status(201).json({
    msg: "User created",
  });
});


export default authRouter;
