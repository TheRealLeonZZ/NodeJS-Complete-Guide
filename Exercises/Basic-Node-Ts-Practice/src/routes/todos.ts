import { Router } from 'express';

import { Todo } from '../models/todo.js';

const router = Router();

let todos: Array<Todo> = [];

type RequestBody = {
	text: string;
};

type RequestParams = {
	todoId: string;
};

router.get('/', (req, res, next) => {
	res.status(200).json({ todos: todos });
});

router.post('/todo', (req, res, next) => {
	const body: RequestBody = req.body;
	const newTodo: Todo = {
		id: Math.random().toString(),
		text: body.text,
	};
	todos.push(newTodo);
	res.status(201).json({ todo: newTodo });
});

router.put('/todo/:todoId', (req, res, next) => {
	const body: RequestBody = req.body;
	const params: RequestParams = req.params;
	const tid = params.todoId;
	const todoIndex = todos.findIndex((todo) => todo.id === tid);
	if (todoIndex >= 0) {
		todos[todoIndex].text = body.text;
		res.status(200).json({ todo: todos[todoIndex] });
	} else {
		res.status(404).json({ message: 'Todo not found' });
	}
});

router.delete('/todo/:todoId', (req, res, next) => {
	const params: RequestParams = req.params;
	todos = todos.filter((todoItem) => {
		return todoItem.id !== params.todoId;
	});
	res.status(200).json({ message: 'Todo deleted' });
});

export default router;
