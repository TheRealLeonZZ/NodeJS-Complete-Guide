import { Router } from 'express';

import { Todo } from '../models/todo.js';

const router = Router();

let todos: Array<Todo> = [];

router.get('/', (req, res, next) => {
	res.status(200).json({ todos: todos });
});

router.post('/todo', (req, res, next) => {
	const newTodo: Todo = {
		id: Math.random().toString(),
		text: req.body.text,
	};
	todos.push(newTodo);
	res.status(201).json({ todo: newTodo });
});

router.put('/todo/:todoId', (req, res, next) => {
	const tid = req.params.todoId;
	const todoIndex = todos.findIndex((todo) => todo.id === tid);
	if (todoIndex >= 0) {
		todos[todoIndex].text = req.body.text;
		res.status(200).json({ todo: todos[todoIndex] });
	} else {
		res.status(404).json({ message: 'Todo not found' });
	}
});

router.delete('/todo/:todoId', (req, res, next) => {
	todos = todos.filter((todoItem) => {
		todoItem.id !== req.params.todoId;
	});
	res.status(200).json({ message: 'Todo deleted' });
});

export default router;
