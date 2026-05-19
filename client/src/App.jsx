import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/tasks";

const emptyForm = {
  title: "",
  description: "",
  notes: ""
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load tasks once when the dashboard opens.
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!formData.title.trim()) {
      setMessage("A task title is required.");
      return;
    }

    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const savedTask = await response.json();

      if (!response.ok) {
        throw new Error(savedTask.message || "Could not save task.");
      }

      if (editingId) {
        setTasks((currentTasks) =>
          currentTasks.map((task) => (task._id === editingId ? savedTask : task))
        );
        setMessage("Task updated.");
      } else {
        setTasks((currentTasks) => [savedTask, ...currentTasks]);
        setMessage("Task created.");
      }

      resetForm();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setFormData({
      title: task.title,
      description: task.description || "",
      notes: task.notes || ""
    });
    setMessage("");
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete task.");
      }

      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId));

      if (editingId === taskId) {
        resetForm();
      }

      setMessage("Task deleted.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const formatDate = (dateValue) => {
    return new Date(dateValue).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <main className="app-shell">
      <section className="dashboard">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">TaskFlow Control Center</p>
            <h1>TaskFlow</h1>
            <p className="subtitle">A clean CRUD dashboard for tracking tasks and extra notes.</p>
          </div>
          <div className="task-count">
            <span>{tasks.length}</span>
            <p>{tasks.length === 1 ? "Task" : "Tasks"}</p>
          </div>
        </header>

        <section className="content-grid">
          <form className="task-form" onSubmit={handleSubmit}>
            <div className="form-heading">
              <h2>{editingId ? "Edit Task" : "Create Task"}</h2>
              {editingId && (
                <button type="button" className="ghost-button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>

            <label>
              Title
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Finish project wireframe"
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short summary of what needs to be done"
                rows="4"
              />
            </label>

            <label>
              Notes / Comments
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Extra details, reminders, or comments"
                rows="4"
              />
            </label>

            <button type="submit" className="primary-button">
              {editingId ? "Update Task" : "Add Task"}
            </button>

            {message && <p className="status-message">{message}</p>}
          </form>

          <section className="task-board">
            <div className="board-heading">
              <h2>Task Cards</h2>
              <p>Metallic dashboard view</p>
            </div>

            {loading ? (
              <p className="empty-state">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="empty-state">No tasks yet. Create your first TaskFlow card.</p>
            ) : (
              <div className="task-list">
                {tasks.map((task) => (
                  <article className="task-card" key={task._id}>
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
