if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Task = require("./models/task");

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/todos";
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error: "));
db.once("open", () => {
    console.log("Database Connected!");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
    const tasks = await Task.find({});
    res.render("home", { tasks });
});

app.post("/new", async (req, res) => {
    const { task } = req.body;

    const newTask = await new Task({ ...task, completed: false });
    await newTask.save();
    res.redirect("/");
});

app.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    if (task.completed) {
        task.completed = true;
    } else {
        task.completed = false;
    }
    const editedTask = await Task.findByIdAndUpdate(id, { ...task });
    await editedTask.save();

    res.redirect("/");
});
app.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
