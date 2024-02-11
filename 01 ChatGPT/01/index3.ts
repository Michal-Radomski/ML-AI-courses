//! Not checked!: node, express, TS: login with GraphQL

//* npm install express-graphql graphql @types/graphql

//* index.ts (main application file):
import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { createUser } from "./users";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// GraphQL schema
const schema = buildSchema(`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!, password: String!): User
  }
`);

// Root resolver
const root = {
  createUser: createUser,
};

// Routes
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable GraphiQL for testing
  })
);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

//* users.ts (user-related functions):
import bcrypt from "bcrypt";
import { Pool } from "pg";

const pool = new Pool({
  user: "your_database_user",
  host: "localhost",
  database: "your_database_name",
  password: "your_database_password",
  port: 5432,
});

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const createUser = async (args: any): Promise<User> => {
  const { firstName, lastName, email, password } = args;

  // Hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into the database
  try {
    const result = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [firstName, lastName, email, hashedPassword]
    );

    const newUser = result.rows[0];
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Internal Server Error");
  }
};
