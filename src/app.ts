import express from "express";


if(3>6){
  console.log("hello")
}

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

const PORT = process.env.PORT || 3000;

export default app
