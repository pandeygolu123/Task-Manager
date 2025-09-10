"use client";

import { useEffect, useState } from "react";
import AssignTaskForm from "app/components/AssignTaskForm";

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [summary, setSummary] = useState({ total: 0, completed: 0, pending: 0 });
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  
  const fetchSummary = async () => {
    try {
      if (!currentUser) return;

      let url = `/api/tasks?role=${currentUser.role}`;
      if (currentUser.role === "employee") {
        url += `&userId=${currentUser.id}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        const completed = data.filter((t) => t.completed).length;
        const pending = data.filter((t) => !t.completed).length;
        setSummary({ total: data.length, completed, pending });
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  
  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchSummary();
      if (currentUser.role === "manager") {
        fetchEmployees();
      }
    }
    const refresh = () => {
      fetchSummary();
      if (currentUser?.role === "manager") {
        fetchEmployees();
      }
    };
    window.addEventListener("tasksUpdated", refresh);
    return () => window.removeEventListener("tasksUpdated", refresh);
  }, [currentUser]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>📊 Dashboard</h2>

      <div className="summary-cards">
        <div className="card total">
          <h3>Total Tasks</h3>
          <p>{summary.total}</p>
        </div>
        <div className="card completed">
          <h3>✅ Completed</h3>
          <p>{summary.completed}</p>
        </div>
        <div className="card pending">
          <h3>⏳ Pending</h3>
          <p>{summary.pending}</p>
        </div>
      </div>

      {currentUser.role === "manager" && (
        <>
          <h3 style={{ marginTop: "30px" }}>👥 Employees List</h3>
          {employees.length > 0 ? (
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Mobile</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.role}</td>
                    <td>{emp.mobile || "-"}</td>
                    <td>{new Date(emp.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No employees found.</p>
          )}

        
          <h3 style={{ marginTop: "30px" }}>Assign Task</h3>
          <AssignTaskForm
            employees={employees}
            onTaskAssigned={() => {
              fetchSummary();
              window.dispatchEvent(new Event("tasksUpdated"));
            }}
          />
        </>
      )}

    
      {tasks.length > 0 ? (
        <table className="task-report">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.description || "-"}</td>
                <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}</td>
                <td className={t.completed ? "status-completed" : "status-pending"}>
                  {t.completed ? "✅ Completed" : "⏳ Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
}
