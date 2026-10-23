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

app.post("/tasks", (req, res)=>{
    const {title} = req.body;

    if (typeof title !== "string" || !title.trim()){
        return res.status(400).json({
            message: "Titulli i detyres eshte i detyrueshem"
        });
    }

    const newTask = {
        id: Math.max(0, ...tasks.map(tasks => tasks.id)) +1,
        title: title.trim(),
        completed: false
    };
    tasks.push(newTask);

    res.status(201).json(newTask);

});

app.put("/tasks/:id" , (req, res)=>{
    const id = Number(req.params.id);
    const task = tasks.find(task => task.id === id);

    if(!task){
        return res.status(404).json({
            message: "Detyra nuk u gjet"
        });
    }
    const {title, completed } = req.body;

    if (typeof title !== "string" || !title.trim() ||
        typeof completed !== "boolean"){
            return res.status(400).json({
                message: "Te dhenat e detyres nuk jane te vlefshme"
            });
        }

        task.title = title.trim();
        task.completed = completed;

        res.json(task);
});


app.delete("/tasks/:id", (req, res) =>{
    const id = Number(req.params.id);

    if(!Number.isSafeInteger(id) || id <= 0){
        return res.status(400).json({
            message: "Id e detyres nuk eshte e vlefshme"
        });
    }

    const index = tasks.findIndex(task => task.id === id);

    if(index === -1){
        return res.status(404).json({
            message: "Detyra nuk u gjet"
        });
}

tasks.splice(index, 1);

res.json({
    message: "Detyra u fshi me sukses"
});
});

if (require.main === module){
    app.listen(PORT, () =>{
        console.log(`Serveri po punon ne http://localhost:${PORT}`);
    });
}
module.exports = app;