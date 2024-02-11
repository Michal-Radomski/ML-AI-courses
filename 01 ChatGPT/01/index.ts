//! Not checked!: node, express, TS: auth OOP approach

//* npm install express bcrypt body-parser pg pg-pool jsonwebtoken @types/node @types/express @types/bcrypt

//* The main file
import express from "express";
import bodyParser from "body-parser";
import { UserController } from "./controllers/user.controller";
import { AuthService } from "./services/auth.service";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
const userController = new UserController(new AuthService());
app.post("/login", userController.authenticateUser);
app.get("/private", userController.authorizeUser, (req, res) => {
  res.json({ message: "You have access to the private route." });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

//* models/user.model.ts (User model):
export interface User {
  id: string;
  email: string;
  password: string;
}

// services/auth.service.ts (Authentication and Authorization service):
import bcrypt from "bcrypt";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const pool = new Pool({
  user: "your_database_user",
  host: "localhost",
  database: "your_database_name",
  password: "your_database_password",
  port: 5432,
});

const SECRET_KEY = "your_secret_key"; // Change this to a strong secret key

export class AuthService {
  async authenticateUser(email: string, password: string): Promise<string | null> {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      const user: User = result.rows[0];

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return null;
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
      return token;
    } catch (error) {
      console.error("Error authenticating user:", error);
      throw new Error("Internal Server Error");
    }
  }

  authorizeUser(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY, (err: any) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}

// controllers/user.controller.ts (User controller):
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class UserController {
  constructor(private authService: AuthService) {}

  authenticateUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const token = await this.authService.authenticateUser(email, password);

    if (token) {
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  };

  authorizeUser = async (req: Request, res: Response, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Unauthorized - Missing token" });
    }

    const authorized = await this.authService.authorizeUser(token);

    if (authorized) {
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized - Invalid token" });
    }
  };
}
