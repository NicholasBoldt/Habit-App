const mongoose = require('mongoose');

var habitSchema = new mongoose.Schema({
    name: String,
    amount: String,
    daily: String,
    completed: {type: Boolean, default: false}
});

var taskSchema = new mongoose.Schema({
    name: String,
});

var roleSchema = new mongoose.Schema({
    name: String,
    habits: [habitSchema],
    tasks:[taskSchema]
});

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    googleId: String,
    roles: [roleSchema]
});

module.exports = mongoose.model('User', userSchema);