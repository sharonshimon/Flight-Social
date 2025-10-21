import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Check server status
app.get("/api/v1/socialnet", (req, res) => {
    res.send("OK");
});

// Use routes
app.use("/", routes);

export default app;
