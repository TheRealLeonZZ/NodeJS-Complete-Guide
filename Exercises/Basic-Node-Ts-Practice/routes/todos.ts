import { Router } from 'express';

import { Todo } from '../models/todo.js';

const router = Router();

const todos: Array<Todo> = [];

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

export default router;
