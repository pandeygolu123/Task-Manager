"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

 
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    const refresh = () => fetchTasks();
    window.addEventListener("tasksUpdated", refresh);
    return () => window.removeEventListener("tasksUpdated", refresh);
  }, []);

  const tasksForDate = tasks.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate).toDateString() === selectedDate.toDateString()
  );


  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayTasks = tasks.filter(
        (t) =>
          t.dueDate &&
          new Date(t.dueDate).toDateString() === date.toDateString()
      );
      if (dayTasks.length > 0) {
        return <div className="taskDot">{dayTasks.length}</div>;
      }
    }
    return null;
  };

  return (
    <div className="calendarContainer">

      <div className="calendarBox">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent}
        />
      </div>

   
      <div className="tasksBox">
        <h3 className="subHeading">
          Tasks for <span className="highlight">{selectedDate.toDateString()}</span>
        </h3>

        {tasksForDate.length > 0 ? (
          <ul className="taskList">
            {tasksForDate.map((task) => (
              <li
                key={task.id}
                className={`taskItem ${task.completed ? "completedTask" : ""}`}
              >
                <strong
                  className={`taskTitle ${
                    task.completed ? "completedText" : ""
                  }`}
                >
                  {task.title}
                </strong>
                <p className="taskDesc">{task.description || "No description"}</p>
                <span className="dueDate">
                  📌 Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
                <br />
                <span className="status">
                  {task.completed ? "✅ Completed" : "⏳ Pending"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="noTask">No tasks for this date.</p>
        )}
      </div>
    </div>
  );
}
