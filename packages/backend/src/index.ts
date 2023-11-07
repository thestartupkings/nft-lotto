import path from "node:path";
import express from "express";
import { config } from "dotenv";

config({ path: "../../.env" });

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../../frontend/dist")));

app.get("/api", (req, res) => {
  res.send("Hello");
});

const PORT = parseInt(process.env.PORT || "3000");

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
