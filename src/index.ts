import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

app.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});
