# TaskFlow

TaskFlow is a simple full-stack task manager I built with React, Express, and MongoDB Atlas. The goal is to keep tasks organized in a clean dashboard where each task can also have extra notes or comments.

## What It Does

TaskFlow lets you enter a username and email, then create, view, edit, and delete only your own tasks. Each task has a title, description, notes/comments, and a created date. The frontend uses a futuristic metallic dashboard style with dark colors, ash gray panels, rounded cards, and smooth hover effects.

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
- View saved tasks for the current user
- Edit task title, description, and notes inside the task card
- Delete your own tasks
- Save a simple username and email profile
- Store data in MongoDB Atlas
- Responsive dashboard layout
- Beginner-friendly code structure

## Project Structure

```text
server/
  server.js
  models/
    Task.js
    User.js
  routes/
    tasks.js
    users.js
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
http://localhost:5050
```

## Install and Run the Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The frontend API URL is stored in `client/.env`:

```env
VITE_API_URL=http://localhost:5050
```

For production, replace that value with your deployed backend URL.

The frontend usually runs on:

```text
http://localhost:5173
```

## API Routes

| Method | Route | What it does |
| --- | --- | --- |
| POST | `/api/users` | Creates or reuses a user by email |
| GET | `/api/tasks?userId=USER_ID` | Gets tasks for one user |
| POST | `/api/tasks` | Creates a new task for one user |
| PUT | `/api/tasks/:id` | Updates one of that user's tasks |
| DELETE | `/api/tasks/:id?userId=USER_ID` | Deletes one of that user's tasks |

## Task Data

Each task uses this basic schema:

```js
{
  title: String,
  description: String,
  notes: String,
  user: ObjectId,
  createdAt: Date
}
```

## Future Improvements

- Add a completed/not completed status
- Add due dates and priority levels
- Add real password-based login
- Add search and filtering
- Add better form validation
- Deploy the backend and frontend online
