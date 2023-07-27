const mongoose = require("mongoose");
const { Schema } = mongoose;

const TaskSchema = new Schema({
    text: String,
    completed: Boolean,
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
