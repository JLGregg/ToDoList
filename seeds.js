// This file is used to seed database

const mongoose = require("mongoose");
// Get from todoList.js
const TodoList = require("./models/todoList");

mongoose
  .connect("mongodb://localhost:27017/ToDoList")
  .then(() => {
    console.log("Mongo Connection Open!!!");
  })
  .catch((err) => {
    console.log("Mongo Connection Error!!!");
    console.log(err);
  });

// Create one entry to make sure db is connected

// const n = new TodoList({
//   title: "Get Groceries",
//   isCompleted: true,
//   createdDate: Date.now()
// })

// n.save()
//   .then((n) => {
//     console.log(n);
//   })
//   .catch((e) => {
//     console.log(e);
//   })

const seedLists = [
  {
    title: "Clean sink",
    isCompleted: true,
    createdDate: Date.now(),
  },
  {
    title: "Go to gym",
    isCompleted: false,
    createdDate: Date.now(),
  },
  {
    title: "Wash car",
    isCompleted: true,
    createdDate: Date.now(),
  },
  {
    title: "Buy Socks",
    isCompleted: false,
    createdDate: Date.now(),
  },
];

TodoList.insertMany(seedLists)
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e);
  })
