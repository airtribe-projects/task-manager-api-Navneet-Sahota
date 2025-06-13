const express = require('express');
const { StatusCodes } = require('http-status-codes');

const taskRouter = express.Router();

taskRouter.get('/tasks', (req, res) => {
    req.sendStatus(StatusCodes.NOT_IMPLEMENTED);
})

taskRouter.get('/tasks/:id', (req, res) => {
    req.sendStatus(StatusCodes.NOT_IMPLEMENTED);
})

taskRouter.post('/tasks/:id', (req, res) => {
    req.sendStatus(StatusCodes.NOT_IMPLEMENTED);
})

taskRouter.put('/tasks/:id', (req, res) => {
    req.sendStatus(StatusCodes.NOT_IMPLEMENTED);
})

taskRouter.delete('/tasks/:id', (req, res) => {
    req.sendStatus(StatusCodes.NOT_IMPLEMENTED);
})

module.exports = taskRouter;
