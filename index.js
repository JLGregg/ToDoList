const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const app = express();
const port = 3000;

// Get Todo List
const ToDoList = require('./models/todoList');

mongoose
  .connect("mongodb://localhost:27017/ToDoList")
  .then(() => {
    console.log("Mongo Connection Open!!!");
  })
  .catch((err) => {
    console.log("Mongo Connection Error!!!");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}))


// Get todos and render index.ejs
app.get('/todos', async (req, res) => {
  const todos = await ToDoList.find({});
  res.render('todos/index', { todos });
});

app.get('/todos/new', async (req, res) => {
  res.render("todos/new");
})

// Post todo and save title, isCompleted, date to database
app.post('/todos', async(req, res) => {
  const newTodo = new ToDoList({
    title: req.body.title,
    isCompleted: false,
    date: Date.now()
  });
  await newTodo.save();
  res.redirect('/todos');
})

app.get('/todos/edit/:id', async(req, res) => {
  const {id} = req.params;
  const todo = await ToDoList.findById(id);
  res.render("todos/edit", { todo });
})

// Toggle isCompleted
app.patch('/todos/complete/:id', async(req, res) => {
  const { id } = req.params;
  const todo = await ToDoList.findById(id);
  if (todo) {
    todo.isCompleted = !todo.isCompleted;
    await todo.save();
  }
  res.redirect('/todos');
})

// Update todo
app.patch('/todos/:id', async(req, res) => {
  const {id} = req.params;
  const todo = await ToDoList.findByIdAndUpdate(id, req.body, {runValidators: true});
  res.redirect('/todos');
})

// Delete all completed.
app.delete('/todos/delete-all-completed', async (req, res) => {
  try {
    // Delete all todos where `isCompleted` is true
    await ToDoList.deleteMany({ isCompleted: true });
    res.redirect('/todos'); 
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting completed todos.");
  }
});

// Delete single entry
app.delete('/todos/:id', async(req, res) => {
  const{ id } = req.params;
  await ToDoList.findByIdAndDelete(id);
  res.redirect('/todos');
})

app.get('/todos/delete-all', async (req, res) => {
  const todos = await ToDoList.find({});
  res.render("todos/deleteall", { todos });
})

app.listen(port, ()=>{
  console.log(`Listening on port ${port}`); 
});

