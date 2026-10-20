const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());


const tasks = [
    {id: 1, title: "Pergatitja e diplomes", completed: false},
    {id: 2, title: "Mesimi i DevSecOps", completed: false}
];


app.get("/", (req, res)=>{
    res.send("Aplikacioni DevSecOps eshte duke funksionuar!");
});

app.get("/tasks", (req, res) =>{
    res.json(tasks);
});

app.listen(PORT, () => {
    console.log(`Serveri eshte duke punuar ne htpp://localhost:${PORT}`);
});