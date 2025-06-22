const express = require('express');
const { StatusCodes } = require('http-status-codes');
const data = require('../task.json');
const fs = require('node:fs').promises;
const chalk = require('chalk');
const path = require('path');

const VALID_PRIORITIES = ['low', 'medium', 'high'];

const taskRouter = express.Router();

const validate = (req, res, next) => {
    const { title, description, completed, priority } = req.body;

    if (!title || !description) {
        res.status(StatusCodes.BAD_REQUEST).json("Missing title or description!");
        return;
    }

    if (typeof completed !== 'boolean') {
        res.status(StatusCodes.BAD_REQUEST).json("'completed' should be typeof boolean");
        return;
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
        res.status(StatusCodes.BAD_REQUEST).json(`Priority must be one of: ${VALID_PRIORITIES.join(", ")}`);
        return;
    }

    next();
}

taskRouter.get('/', (req, res) => {
    const completed = req.query.completed;
    const sort = req.query.sort;
    let tasks = [...data.tasks];

    if (completed) {
        tasks = tasks.filter(task => String(task.completed) === completed.toLowerCase());
    }

    if (sort === 'asc' || sort === 'desc') {
        tasks = tasks.slice().sort((a, b) => {
            const aDate = new Date(a.createdAt || 0);
            const bDate = new Date(b.createdAt || 0);
            return sort === 'asc' ? aDate - bDate : bDate - aDate;
        });
    }

    res.status(StatusCodes.OK).json(tasks);
});

taskRouter.get('/priority/:level', (req, res) => {
    const level = req.params.level?.toLowerCase();

    if (!VALID_PRIORITIES.includes(level)) {
        return res.status(StatusCodes.BAD_REQUEST).json("Invalid priority level");
    }
    const tasks = [...data.tasks]
    const filtered = tasks.filter(task => (task.priority || 'low') === level);
    res.status(StatusCodes.OK).json(filtered);
});

taskRouter.post('/', validate, async (req, res) => {
    const { title, description, completed, priority } = req.body;
    const tasks = [...data.tasks]

    const newTask = {
        "id": tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        "title": title,
        "description": description,
        "completed": completed,
        "priority": VALID_PRIORITIES.includes(priority) ? priority : 'low',
        "createdAt": new Date().toISOString()
    };

    tasks.push(newTask);

    const jsonData = {
        "tasks": tasks
    }

    try {
        await fs.writeFile(path.join(__dirname, '../task.json'), JSON.stringify(jsonData));
        res.status(StatusCodes.CREATED).json(tasks[tasks.length - 1]);
    } catch (err) {
        console.error(chalk.bgRed.bold("Error: ", err))
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
    }
})

taskRouter.get('/:id', (req, res) => {
    const taskId = req.params.id;
    const tasks = [...data.tasks]
    const task = tasks.find(t => t.id === parseInt(taskId));
    if (!task) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(task);
});

taskRouter.put('/:id', validate, async (req, res) => {
    const { title, description, completed, priority } = req.body;

    const taskId = req.params.id;

    const tasks = [...data.tasks]
    const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId))
    const task = tasks.find(t => t.id === parseInt(taskId))

    if (!task) {
        res.sendStatus(StatusCodes.NOT_FOUND);
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        "title": title === undefined ? tasks[taskIndex].title : title,
        "description": description === undefined ? tasks[taskIndex].description : description,
        "completed": completed === undefined ? tasks[taskIndex].completed : completed,
        "priority": VALID_PRIORITIES.includes(priority) ? priority : (tasks[taskIndex].priority || 'low'),
    };

    const jsonData = {
        "tasks": tasks
    }

    try {
        await fs.writeFile(path.join(__dirname, '../task.json'), JSON.stringify(jsonData));
        res.status(StatusCodes.OK).json(tasks[taskIndex]);
    } catch (err) {
        console.error(chalk.bgRed.bold("Error: ", err))
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
    }
})

taskRouter.delete('/:id', async (req, res) => {
    const taskId = req.params.id;
    const tasks = [...data.tasks]
    const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId));
    if (taskIndex === -1) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }
    tasks.splice(taskIndex, 1);

    const jsonData = {
        "tasks": tasks
    }

    try {
        await fs.writeFile(path.join(__dirname, '../task.json'), JSON.stringify(jsonData));
        res.status(StatusCodes.OK).json("Task deleted successfully");
    } catch (err) {
        console.error(chalk.bgRed.bold("Error: ", err))
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
    }
})

module.exports = taskRouter;
