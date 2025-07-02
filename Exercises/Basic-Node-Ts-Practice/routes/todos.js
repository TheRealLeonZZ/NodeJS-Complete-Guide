"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const todos = [];
router.get('/', (req, res, next) => {
    res.status(200).json({ todos: todos });
});
router.post('/todo', (req, res, next) => {
    const newTodo = {
        id: Math.random().toString(),
        text: req.body.text,
    };
    todos.push(newTodo);
    res.status(201).json({ todo: newTodo });
});
exports.default = router;
