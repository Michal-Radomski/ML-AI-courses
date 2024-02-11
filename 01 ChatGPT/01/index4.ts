//! Not checked!: node, express, TS: save express app setup, author: GPT-3.5 ;)

//* npm install express helmet compression cors

//* index.ts file
import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

const app = express();
const port = 3000;

// Middleware for enhanced security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "trusted-scripts.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

app.use(compression()); // Compression middleware to compress responses

// CORS middleware with custom settings
app.use(
  cors({
    origin: "https://your-trusted-origin.com", // Set to your trusted origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable credentials (cookies, authorization headers)
    optionsSuccessStatus: 204, // Respond with 204 No Content for OPTIONS requests
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Hello, this is a secure Express app!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
