import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") {
      navigate("/");
      return;
    }

    fetch("http://localhost:5000/api/members")
      .then(res => res.json())
      .then(data => setMembers(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch("http://localhost:5000/api/tasks")
      .then(res => res.json())
      .then(data => setTasks(Array.isArray(data) ? data : []))
      .catch(console.error);

  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const assignTask = async () => {
    if (!title || !selectedUser) {
      alert("Enter task + select member");
      return;
    }

    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        assigned_to: selectedUser,
      }),
    });

    alert("Task assigned");

    // reload tasks properly
    fetch("http://localhost:5000/api/tasks")
      .then(res => res.json())
      .then(data => setTasks(Array.isArray(data) ? data : []));
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h3>Assign Task</h3>

      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Select Member</option>
        {members.map(m => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <button onClick={assignTask}>Assign</button>

      <h3>All Tasks</h3>

      {tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        tasks.map(t => (
          <div key={t.id}>
            <p>
              {t.title} - {t.member_name || t.name} - {t.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
}