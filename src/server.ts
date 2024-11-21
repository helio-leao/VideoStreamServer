import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.sendStatus(204);
});

app.listen(3000, () => console.log("Server running..."));
