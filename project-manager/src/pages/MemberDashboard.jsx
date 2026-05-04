import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MemberDashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const getUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  };

  const userId = getUserId();

  useEffect(() => {
    if (localStorage.getItem("role") !== "member") {
      navigate("/");
      return;
    }

    fetch(`http://localhost:5000/api/my-tasks/${userId}`)
      .then(res => res.json())
      .then(data => setTasks(Array.isArray(data) ? data : []))
      .catch(console.error);

  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const updateStatus = async (taskId, status) => {
    await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, status } : t
      )
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Member Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h3>My Tasks</h3>

      {tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        tasks.map(t => (
          <div key={t.id}>
            <p>{t.title} - {t.status}</p>

            <select
              value={t.status}
              onChange={(e) =>
                updateStatus(t.id, e.target.value)
              }
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}