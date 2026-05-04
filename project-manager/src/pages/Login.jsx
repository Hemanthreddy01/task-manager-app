import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member"); // 👈 selected role

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("https://task-manager-app-production-3b52.up.railway.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // 👇 check role matches
        if (data.role !== role) {
          alert("Wrong role selected");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/member");
        }

      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Error logging in");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br />

      {/* 👇 ROLE SELECT */}
      <select onChange={e => setRole(e.target.value)} value={role}>
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}