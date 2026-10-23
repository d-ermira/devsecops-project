const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("./index");
const { resolve } = require("node:dns");
const { title } = require("node:process");


test("GET /tasks duhet te shfaqe listen e detyrave", async () => {
    const server = app.listen(0);

    try {
        const port = server.address().port;
        const response = await fetch(`http://localhost:${port}/tasks`);

        assert.equal(response.status, 200);

        const tasks = await response.json();
        assert.ok(Array.isArray(tasks));
    } finally {
        await new Promise( resolve => server.close(resolve));
    }
});

test("POST /tasks duhet te shtoje nje detyre", async () =>{
    const server =app.listen(0);

    try{
        const port = server.address().port;

        const response = await fetch(`http://localhost:${port}/tasks`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "Test automatik"
        })
            
        });
        assert.equal(response.status, 201);

        const task = await response.json();

        assert.equal(task.title, "Test automatik");
        assert.equal(task.completed, false);
        assert.ok(Number.isInteger(task.id));
    } finally {
        await new Promise(resolve => server.close(resolve));
    }
});

test("PUT /tasks duhet te ndryshoje nje detyre", async()=>{
    const server = app.listen(0);

    try{
        const port = server.address().port;
        const url = `http://localhost:${port}/tasks`;

        const createResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "Detyra fillestare"
            })
        });
        assert.equal(createResponse.status, 201);
        const createdTask = await createResponse.json();

        const response = await fetch(`${url}/${createdTask.id}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "Detyra e ndryshuar",
                completed: true
            })
        });

        assert.equal(response.status, 200);

        const task = await response.json();

        assert.equal(task.title, "Detyra e ndryshuar");
        assert.equal(task.completed, true);
    } finally {
        await new Promise(resolve => server.close(resolve));
    }
});


test("DELETE /tasks duhet te fshije nje detyre", async () => {
    const server = app.listen(0);

    try {
        const port = server.address().port;
        const url = `http://localhost:${port}/tasks`;

        
        const createResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "Detyra per fshirje"
            })
        });

        assert.equal(createResponse.status, 201);
        const createdTask = await createResponse.json();


        const deleteResponse = await fetch(
            `${url}/${createdTask.id}`,
            { method: "DELETE" }
        );

        assert.equal(deleteResponse.status, 200);

        
        const response = await fetch(url);
        const tasks = await response.json();

        assert.equal(
            tasks.some(task => task.id === createdTask.id),
            false
        );
    } finally {
        await new Promise(resolve => server.close(resolve));
    }
});
