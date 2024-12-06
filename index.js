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
const { todoSchema } = require('./schemas');

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

// Validate ToDo
const validateTodo = (req, res, next) => {
  const {error} = todoSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Get todos and render index.ejs
app.get('/todos', catchAsync(async (req, res) => {
  const todos = await ToDoList.find({});
  res.render('todos/index', { todos });
}));

app.get('/todos/new', catchAsync(async (req, res) => {
  res.render("todos/new");
}));

// Post todo and save title, isCompleted, date to database
app.post('/todos', catchAsync(async(req, res) => {
  const newTodo = new ToDoList({
    title: req.body.title,
    isCompleted: false,
    date: Date.now()
  });
  await newTodo.save();
  res.redirect('/todos');
}));

app.get('/todos/edit/:id', catchAsync(async(req, res) => {
  const {id} = req.params;
  const todo = await ToDoList.findById(id);
  res.render("todos/edit", { todo });
}));

// Toggle isCompleted
app.patch('/todos/complete/:id', catchAsync(async(req, res) => {
  const { id } = req.params;
  const todo = await ToDoList.findById(id);
  if (todo) {
    todo.isCompleted = !todo.isCompleted;
    await todo.save();
  }
  res.redirect('/todos');
}));

// Update todo
app.patch('/todos/:id', catchAsync(async(req, res) => {
  const {id} = req.params;
  const todo = await ToDoList.findByIdAndUpdate(id, req.body, {runValidators: true});
  res.redirect('/todos');
}));

// Delete all completed.
app.delete('/todos/delete-all-completed', catchAsync(async(req, res) => {
  try {
    // Delete all todos where `isCompleted` is true
    await ToDoList.deleteMany({ isCompleted: true });
    res.redirect('/todos'); 
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting completed todos.");
  }
}));

// Delete single entry
app.delete('/todos/:id', catchAsync(async(req, res) => {
  const{ id } = req.params;
  await ToDoList.findByIdAndDelete(id);
  res.redirect('/todos');
}));

app.get('/todos/delete-all', catchAsync(async (req, res) => {
  const todos = await ToDoList.find({});
  res.render("todos/deleteall", { todos });
}));

// If no routes are hit
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const {statusCode = 500} = err;
  if(!err.message) err.message = "Something Went Wrong";
  res.status(statusCode).render('error', { err });
});

app.listen(port, ()=>{
  console.log(`Listening on port ${port}`); 
});

