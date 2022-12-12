let express = require("express");

let TodoRouter = express.Router();

let todoModel = require("../models/Todo.model");

TodoRouter.get("/", async function (req, res) {
  try {
    let userID = req.body.userID;
    let queries = req.query;
    queries = { ...queries, userID };
    let todos = await todoModel.find(queries);
    console.log("TODOS found");
    res.status(200).send(todos);
  } catch (err) {
    console.log(err);
    res.status(400).send({ err: "Something went wrong" });
  }
});

TodoRouter.post("/create", async (req, res) => {
  try {
    let payload = req.body;
    let todo = new todoModel(payload);
    await todo.save();
    res.status(201).send({ msg: "Todo created" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ err: "Something went wrong" });
  }
});

TodoRouter.patch("/:todoID", async (req, res) => {
  try {
    let todoID = req.params.todoID;
    let payload = req.body;
    let todo = await todoModel.findOne({ _id: todoID });
    if (userID !== todo.userID) {
      return res.status(400).send({ err: "You are not authorized to do this" });
    } else {
      await todo.update(payload);
      res.status(200).send({ msg: "Todo updated" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ err: "Something went wrong" });
  }
});

TodoRouter.delete("/:todoID", async (req, res) => {
  try {
    let todoID = req.params.todoID;
    let todo = await todoModel.findOne({ _id: todoID });
    if (userID !== todo.userID) {
      return res.status(400).send({ err: "You are not authorized to do this" });
    } else {
      await todo.delete(todoID);
      res.status(200).send({ msg: "Todo deleted successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ err: "Something went wrong" });
  }
});

module.exports = { TodoRouter };
