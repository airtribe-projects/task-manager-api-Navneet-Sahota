# Task Manager API

A simple RESTful API for managing tasks, built with Express.js. This project is designed for learning and assignment purposes, supporting CRUD operations, filtering, sorting, and priority management for tasks.

## Features
- Create, read, update, and delete tasks
- Filter tasks by completion status
- Sort tasks by creation date
- Assign and filter tasks by priority (low, medium, high)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd task-manager-api-Navneet-Sahota
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3000` by default.

## API Endpoints

### Create a Task
- **POST** `/tasks`
- **Body:**
  ```json
  {
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "priority": "low" // optional, default: "low"
  }
  ```
- **Response:** Created task object

### Get All Tasks
- **GET** `/tasks`
- **Query Params:**
  - `completed` (optional): `true` or `false`
  - `sort` (optional): `asc` or `desc` (by creation date)
- **Response:** Array of tasks

### Get Tasks by Priority
- **GET** `/tasks/priority/:level`
- **Params:**
  - `level`: `low`, `medium`, or `high`
- **Response:** Array of tasks with the specified priority

### Get Task by ID
- **GET** `/tasks/:id`
- **Response:** Task object or 404 if not found

### Update a Task
- **PUT** `/tasks/:id`
- **Body:**
  ```json
  {
    "title": "New title", // optional
    "description": "New description", // optional
    "completed": true, // optional
    "priority": "medium" // optional
  }
  ```
- **Response:** Updated task object

### Delete a Task
- **DELETE** `/tasks/:id`
- **Response:** Success message or 404 if not found

## Testing the API

You can use tools like [Postman](https://www.postman.com/) or [curl](https://curl.se/) to test the endpoints. Example using curl:

```bash
# Create a new task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Try API","completed":false,"priority":"high"}'

# Get all tasks
curl http://localhost:3000/tasks

# Get tasks sorted by creation date (descending)
curl http://localhost:3000/tasks?sort=desc

# Get tasks by priority
curl http://localhost:3000/tasks/priority/high

# Get a task by ID
curl http://localhost:3000/tasks/1

# Update a task
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a task
curl -X DELETE http://localhost:3000/tasks/1
```

---

**Author:** Navneet Sahota
