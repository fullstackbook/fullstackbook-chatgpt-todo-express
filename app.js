const express = require("express");
const app = express();
const { Client } = require("pg");

app.use(express.json());

const client = new Client({
  user: "postgres",
  password: "",
  host: "localhost",
  port: 5432,
  database: "fullstackbook-chatgpt-todo-express",
});

client.connect();

app.get("/todos", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM todos");
    res.send(result.rows);
  } catch (err) {
    throw err;
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.query("SELECT * FROM todos WHERE id = $1", [
      id,
    ]);
    res.send(result.rows[0]);
  } catch (err) {
    throw err;
  }
});

app.post("/todos", async (req, res) => {
  try {
    const { name, completed } = req.body;
    const result = await client.query(
      "INSERT INTO todos(name, completed) VALUES($1, $2) RETURNING *",
      [name, completed]
    );
    res.send(`Todo added with ID: ${result.rows[0].id}`);
  } catch (err) {
    throw err;
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, completed } = req.body;
    const result = await client.query(
      "UPDATE todos SET name = $1, completed = $2 WHERE id = $3",
      [name, completed, id]
    );
    res.send(`Todo with ID: ${id} updated successfully!`);
  } catch (err) {
    throw err;
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.query("DELETE FROM todos WHERE id = $1", [id]);
    res.send(`Todo with ID: ${id} deleted successfully!`);
  } catch (err) {
    throw err;
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
