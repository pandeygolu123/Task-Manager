"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    fetchTasks();


    const refresh = () => fetchTasks();
    window.addEventListener("tasksUpdated", refresh);
    return () => window.removeEventListener("tasksUpdated", refresh);
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  
  
  const upcomingTasks = tasks
    .filter((t) => !t.completed && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  return (
    <div className="home-container">
   
   
      <h1 className="welcome">
        👋 Welcome {user ? user.name : "Guest"}
      </h1>

    
      <div className="cards">
        <div className="card">
          <h2>{totalTasks}</h2>
          <p>Total Tasks</p>
        </div>
        <div className="card">
          <h2>{completedTasks}</h2>
          <p>Completed</p>
        </div>
        <div className="card">
          <h2>{pendingTasks}</h2>
          <p>Pending</p>
        </div>
      </div>

      
      <div className="upcoming">
        <h2>📅 Upcoming Tasks</h2>
        {upcomingTasks.length > 0 ? (
          <ul>
            {upcomingTasks.map((task) => (
              <li key={task.id}>
                <strong>{task.title}</strong> – {task.description || "No description"}  
                <small style={{ color: "gray" }}>
                  (Due: {new Date(task.dueDate).toLocaleDateString()})
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming tasks 🎉</p>
        )}
      </div>

    
    
      <div className="quick-links">
        <Link href="/Tasks" className="btn">Manage Tasks</Link>
        <Link href="/Calendar" className="btn">View Calendar</Link>
      </div>
    </div>
  );
}
