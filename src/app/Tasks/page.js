"use client";

import { useState, useEffect } from "react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [employees, setEmployees] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  const fetchTasks = async () => {
    try {
      if (!currentUser) return;
      let url = "/api/tasks";
      if (currentUser.role === "employee") {
        url += `?userId=${currentUser.id}&role=employee`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      if (currentUser?.role !== "manager") return;
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
      if (currentUser.role === "manager") fetchEmployees();
      const refreshTasks = () => fetchTasks();
      window.addEventListener("tasksUpdated", refreshTasks);
      return () => window.removeEventListener("tasksUpdated", refreshTasks);
    }
  }, [currentUser]);


  const addTask = async () => {
  if (!title.trim()) return alert("Title is required ❌");

  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null, 
      userId:
        currentUser.role === "employee"
          ? currentUser.id
          : assignedTo
          ? Number(assignedTo) 
          : null,
    }),
  });

  if (res.ok) {
    setTitle("");
    setDescription("");
    setDueDate("");
    setAssignedTo("");
    fetchTasks();
    window.dispatchEvent(new Event("tasksUpdated"));
  } else {
    const err = await res.json();
    alert("❌ Failed to add task: " + err.error);
  }
};


  const toggleComplete = async (id, completed) => {
    const res = await fetch(
      `/api/tasks/${id}?userId=${currentUser.id}&role=${currentUser.role}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      }
    );
    if (res.ok) {
      fetchTasks();
      window.dispatchEvent(new Event("tasksUpdated"));
    }
  };


  const editTask = async (id, oldTitle, oldDescription, oldDueDate) => {
    const newTitle = prompt("Edit Title:", oldTitle);
    if (!newTitle) return;
    const newDesc = prompt("Edit Description:", oldDescription);
    const newDue = prompt("Edit Due Date (YYYY-MM-DD):", oldDueDate || "");

    const res = await fetch(
      `/api/tasks/${id}?userId=${currentUser.id}&role=${currentUser.role}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          dueDate: newDue,
        }),
      }
    );
    if (res.ok) {
      fetchTasks();
      window.dispatchEvent(new Event("tasksUpdated"));
    }
  };


  const deleteTask = async (id) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(
      `/api/tasks/${id}?userId=${currentUser.id}&role=${currentUser.role}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      fetchTasks();
      window.dispatchEvent(new Event("tasksUpdated"));
    }
  };

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className="tasks-container">
      <h2> Tasks</h2>

      <div className="task-form">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />


        {currentUser.role === "manager" && (
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">-- Assign To --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
        )}

        <button onClick={addTask}>Add Task</button>
      </div>



      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-info">
              <h3 className={task.completed ? "completed" : ""}>
                {task.title}
              </h3>
              {task.description && <p>{task.description}</p>}
              {task.dueDate && (
                <small>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </small>
              )}
              {currentUser.role === "manager" && task.user && (
                <p>
                  👤 Assigned to:{" "}
                  <strong>{task.user?.name || "Unassigned"}</strong>
                </p>
              )}
            </div>
            <div className="task-actions">
              <button onClick={() => toggleComplete(task.id, task.completed)}>
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button
                onClick={() =>
                  editTask(task.id, task.title, task.description, task.dueDate)
                }
              >
                Edit
              </button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
