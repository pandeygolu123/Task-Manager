"use client";

import { useEffect, useState } from "react";

export default function EmployeesList() {
  const [employees, setEmployees] = useState([]);

  
  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error("Failed to fetch employees:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employees List</h2>
      <ul>
        {employees.length > 0 ? (
          employees.map(emp => (
            <li key={emp.id} style={{ marginBottom: "10px" }}>
              <strong>{emp.name}</strong> ({emp.email})
            </li>
          ))
        ) : (
          <p>No employees found.</p>
        )}
      </ul>
    </div>
  );
}
