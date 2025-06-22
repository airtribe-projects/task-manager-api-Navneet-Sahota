const express = require('express');
const { StatusCodes } = require('http-status-codes');
const data = require('../task.json');
const fs = require('node:fs').promises;
const chalk = require('chalk');
const path = require('path');

const taskRouter = express.Router();

const validate = (req, res, next) => {
    const { title, description, completed } = req.body;

    if (!title || !description) {
        res.status(StatusCodes.BAD_REQUEST).json("Missing title or description!");
        return;
    }

    if (typeof completed !== 'boolean') {
        res.status(StatusCodes.BAD_REQUEST).json("'completed' should be typeof boolean");
        return;
    }

    next();
}

taskRouter.get('/', (req, res) => {
    res.status(StatusCodes.OK).json(data.tasks);
})

taskRouter.post('/', validate, async (req, res) => {
    const { title, description, completed } = req.body;

    const tasks = [...data.tasks]

    tasks.push({
        "id": tasks.length + 1,
        "title": title,
        "description": description,
        "completed": completed,
    })
    
    const jsonData = {
        "tasks": tasks,
    }

    try {
        await fs.writeFile(path.join(__dirname, '../task.json'), JSON.stringify(jsonData));
        res.status(StatusCodes.OK).json(tasks[tasks.length - 1]);
    } catch (err) {
        console.error(chalk.bgRed.bold("Error: ", err))
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
    }
})

taskRouter.get('/:id', validRoute, (req, res) => {
    const taskId = req.params.id;

    const task = data.tasks.find(t => t.id === parseInt(taskId))

    if (!task) {
        res.sendStatus(StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json(task);
})

taskRouter.put('/:id', validate, async (req, res) => {
    const { title, description, completed } = req.body;
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
    }
    
    const jsonData = {
        "tasks": tasks,
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

    const task = data.tasks.find(t => t.id === parseInt(taskId))

    if (!task) {
        res.sendStatus(StatusCodes.NOT_FOUND);
    }
    
    const jsonData = {
        "tasks": tasks,
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
