# TaskFlow

TaskFlow is a simple full-stack task manager I built with React, Express, and MongoDB Atlas. The goal is to keep tasks organized in a clean dashboard where each task can also have extra notes or comments.

## What It Does

TaskFlow lets you create, view, edit, and delete tasks. Each task has a title, description, notes/comments, and a created date. The frontend uses a futuristic metallic dashboard style with dark colors, ash gray panels, rounded cards, and smooth hover effects.

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- React
- Vite
- CSS
- dotenv
- cors

## Features

- Add new tasks
- View all saved tasks
- Edit task title, description, and notes
- Delete tasks
- Store data in MongoDB Atlas
- Responsive dashboard layout
- Beginner-friendly code structure

## Project Structure

```text
server/
  server.js
  models/
    Task.js
  routes/
    tasks.js
  .env
  .gitignore
  package.json

client/
  index.html
  src/
    App.jsx
    App.css
    main.jsx
  package.json
```

## How to Connect MongoDB Atlas

1. Create a MongoDB Atlas account.
2. Create a cluster and database user.
3. Allow your IP address in Network Access.
4. Copy your MongoDB connection string.
5. Open `server/.env`.
6. Paste your connection string after `MONGO_URI=`.

Example:

```env
MONGO_URI=mongodb+srv://yourUsername:yourPassword@yourCluster.mongodb.net/taskflow
PORT=5000
```

Do not hardcode the MongoDB URI in the JavaScript files. Keeping it in `.env` helps protect the username and password.

## Install and Run the Backend

```bash
cd server
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

## Install and Run the Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## API Routes

| Method | Route | What it does |
| --- | --- | --- |
| GET | `/api/tasks` | Gets all tasks |
| POST | `/api/tasks` | Creates a new task |
| PUT | `/api/tasks/:id` | Updates a task |
| DELETE | `/api/tasks/:id` | Deletes a task |

## Task Data

Each task uses this basic schema:

```js
{
  title: String,
  description: String,
  notes: String,
  createdAt: Date
}
```

## Future Improvements

- Add a completed/not completed status
- Add due dates and priority levels
- Add login so each user has their own tasks
- Add search and filtering
- Add better form validation
- Deploy the backend and frontend online
