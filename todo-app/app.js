const express = require("express");
var csrf = require("tiny-csrf");
const app = express();
const { Todo } = require("./models");
var cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieparser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long",["POST", "PUT", "DELETE"]));

app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  const allTodos = await Todo.getTodos();
  const overdue = await Todo.overdue();
  const dueToday = await Todo.dueToday();
  const dueLater = await Todo.dueLater();
  const completed = await Todo.completed();
  if( request.accepts("html")) {
    response.render("index", {
      allTodos,
      overdue,
      dueToday,
      dueLater,
      completed,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      allTodos,
      overdue,
      dueToday,
      dueLater,
      completed
    })
  }
});

app.use(express.static(path.join(__dirname,'public')));

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  const allTodos = await Todo.getTodos();
  const overdue = await Todo.overdue();
  const dueToday = await Todo.dueToday();
  const dueLater = await Todo.dueLater();
  const completed = await Todo.completed();
  if( request.accepts("html")) {
    response.render("index", {
      allTodos,
      overdue,
      dueToday,
      dueLater,
      completed,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      allTodos,
      overdue,
      dueToday,
      dueLater,
      completed
    })
  }
  // FILL IN YOUR CODE HERE
  /*try {
    const todos = await Todo.findAll();
    return response.json(todos);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
  // response.send(todos)*/
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async (request, response) => {
  console.log("Creating a todo", request.body);
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async (request, response) => {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE
  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  } catch (error) {
    return response.status(422).json(error);
  }
  /*try {
    // Query the database to delete a Todo by ID
    const deletedTodo = await Todo.destroy({
      where: {
        id: request.params.id,
      },
    });
    // Respond with true if the Todo was deleted, false otherwise
    return response.json({ success: deletedTodo > 0 });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)*/
});

module.exports = app;
