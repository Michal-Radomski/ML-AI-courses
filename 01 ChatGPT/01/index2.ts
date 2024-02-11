//! Not checked!: node, express, TS: auth functional approach

//* Secret Key
const crypto = require("crypto");

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  console.log("Generated Secret Key:", secretKey);
  return secretKey;
};

generateSecretKey();

//* npm install express bcrypt body-parser pg pg-pool jsonwebtoken @types/node @types/express @types/bcrypt

//* index.ts (main application file):
import express from "express";
import bodyParser from "body-parser";
import { authenticateUser, authorizeUser } from "./auth";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.post("/login", authenticateUser);
app.get("/private", authorizeUser, (req, res) => {
  res.json({ message: "You have access to the private route." });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

//* auth.ts (authentication and authorization functions):
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import jwt from "jsonwebtoken";

const pool = new Pool({
  user: "your_database_user",
  host: "localhost",
  database: "your_database_name",
  password: "your_database_password",
  port: 5432,
});

const SECRET_KEY = "your_secret_key"; // Change this to a strong secret key

export const authenticateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const authorizeUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Unauthorized - Missing token" });
  }

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized - Invalid token" });
    }

    // You can use the decoded information to perform additional authorization checks if needed
    // For example: check user roles or permissions

    next();
  });
};
