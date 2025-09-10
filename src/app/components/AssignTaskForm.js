

import { useState } from "react";

export default function AssignTaskForm({ employees, onTaskAssigned }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [userId, setUserId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !userId) {
      alert("Title and Employee are required!");
      return;
    }

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        dueDate,
        userId: Number(userId),
      }),
    });

    if (res.ok) {
      alert("Task assigned successfully!");
      setTitle("");
      setDescription("");
      setDueDate("");
      setUserId("");
      onTaskAssigned();
    } else {
      alert("Error assigning task.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={inputStyle}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={inputStyle}
      />
      <select value={userId} onChange={(e) => setUserId(e.target.value)} style={inputStyle}>
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.name} ({emp.email})
          </option>
        ))}
      </select>
      <button type="submit" style={btnStyle}>
        Assign Task
      </button>
    </form>
  );
}

const inputStyle = {
  padding: "8px",
  margin: "5px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  width: "100%",
};

const btnStyle = {
  padding: "8px 16px",
  margin: "5px",
  background: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
