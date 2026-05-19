import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";
const TASKS_URL = `${API_URL}/api/tasks`;
const USERS_URL = `${API_URL}/api/users`;

const emptyTaskForm = {
  title: "",
  description: "",
  notes: ""
};

const emptyUserForm = {
  username: "",
  email: ""
};

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("taskflowUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyTaskForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // After a user is picked, every request uses that user's id to keep tasks separate.
  useEffect(() => {
    if (user?._id) {
      fetchTasks(user._id);
    }
  }, [user]);

  const fetchTasks = async (userId) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${TASKS_URL}?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load tasks.");
      }

      setTasks(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserForm((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(USERS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userForm)
      });

      const savedUser = await response.json();

      if (!response.ok) {
        throw new Error(savedUser.message || "Could not save user.");
      }

      localStorage.setItem("taskflowUser", JSON.stringify(savedUser));
      setUser(savedUser);
      setUserForm(emptyUserForm);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleTaskChange = (event) => {
    const { name, value } = event.target;
    setTaskForm((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const createTask = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!taskForm.title.trim()) {
      setMessage("A task title is required.");
      return;
    }

    try {
      const response = await fetch(TASKS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...taskForm, userId: user._id })
      });

      const savedTask = await response.json();

      if (!response.ok) {
        throw new Error(savedTask.message || "Could not save task.");
      }

      setTasks((currentTasks) => [savedTask, ...currentTasks]);
      setTaskForm(emptyTaskForm);
      setMessage("Task created.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditForm({
      title: task.title,
      description: task.description || "",
      notes: task.notes || ""
    });
    setMessage("");
  };

  const saveEdit = async (event, taskId) => {
    event.preventDefault();
    setMessage("");

    if (!editForm.title.trim()) {
      setMessage("A task title is required.");
      return;
    }

    try {
      const response = await fetch(`${TASKS_URL}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...editForm, userId: user._id })
      });

      const savedTask = await response.json();

      if (!response.ok) {
        throw new Error(savedTask.message || "Could not update task.");
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task._id === taskId ? savedTask : task))
      );
      setEditingId(null);
      setEditForm(emptyTaskForm);
      setMessage("Task updated.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${TASKS_URL}/${taskId}?userId=${user._id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete task.");
      }

      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId));

      if (editingId === taskId) {
        setEditingId(null);
        setEditForm(emptyTaskForm);
      }

      setMessage("Task deleted.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const switchUser = () => {
    localStorage.removeItem("taskflowUser");
    setUser(null);
    setTasks([]);
    setMessage("");
  };

  const formatDate = (dateValue) => {
    return new Date(dateValue).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (!user) {
    return (
      <main className="app-shell auth-shell">
        <form className="task-form auth-card" onSubmit={handleUserSubmit}>
          <p className="eyebrow">TaskFlow Access</p>
          <h1>TaskFlow</h1>

          <label>
            Username
            <input
              type="text"
              name="username"
              value={userForm.username}
              onChange={handleUserChange}
              placeholder="John Doe"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={userForm.email}
              onChange={handleUserChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <button type="submit" className="primary-button">
            Continue
          </button>

          {message && <p className="status-message">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="dashboard">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">TaskFlow Control Center</p>
            <h1>TaskFlow</h1>
          </div>
          <div className="user-panel">
            <div>
              <span>{user.username}</span>
              <p>{user.email}</p>
            </div>
            <button type="button" className="ghost-button" onClick={switchUser}>
              Switch
            </button>
          </div>
          <div className="task-count">
            <span>{tasks.length}</span>
            <p>{tasks.length === 1 ? "Task" : "Tasks"}</p>
          </div>
        </header>

        <section className="content-grid">
          <form className="task-form" onSubmit={createTask}>
            <div className="form-heading">
              <h2>Create Task</h2>
            </div>

            <label>
              Title
              <input
                type="text"
                name="title"
                value={taskForm.title}
                onChange={handleTaskChange}
                placeholder="Finish project wireframe"
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={taskForm.description}
                onChange={handleTaskChange}
                placeholder="Short summary of what needs to be done"
                rows="4"
              />
            </label>

            <label>
              Notes / Comments
              <textarea
                name="notes"
                value={taskForm.notes}
                onChange={handleTaskChange}
                placeholder="Extra details, reminders, or comments"
                rows="4"
              />
            </label>

            <button type="submit" className="primary-button">
              Add Task
            </button>

            {message && <p className="status-message">{message}</p>}
          </form>

          <section className="task-board">
            <div className="board-heading">
              <h2>Task Cards</h2>
            </div>

            {loading ? (
              <p className="empty-state">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="empty-state">No tasks yet. Create your first TaskFlow card.</p>
            ) : (
              <div className="task-list">
                {tasks.map((task) => (
                  <article className="task-card" key={task._id}>
                    {editingId === task._id ? (
                      <form className="card-edit-form" onSubmit={(event) => saveEdit(event, task._id)}>
                        <div className="card-topline">
                          <span>Editing card</span>
                        </div>
                        <label>
                          Title
                          <input
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                            required
                          />
                        </label>
                        <label>
                          Description
                          <textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            rows="3"
                          />
                        </label>
                        <label>
                          Notes / Comments
                          <textarea
                            name="notes"
                            value={editForm.notes}
                            onChange={handleEditChange}
                            rows="3"
                          />
                        </label>
                        <div className="card-actions">
                          <button type="submit">Save</button>
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="card-topline">
                          <span>Created {formatDate(task.createdAt)}</span>
                        </div>
                        <h3>{task.title}</h3>
                        <p className="description">
                          {task.description || "No description added yet."}
                        </p>
                        <div className="notes-box">
                          <p className="notes-label">Notes / Comments</p>
                          <p>{task.notes || "No extra notes yet."}</p>
                        </div>
                        <div className="card-actions">
                          <button type="button" onClick={() => startEdit(task)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="danger-button"
                            onClick={() => deleteTask(task._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}

export default App;
