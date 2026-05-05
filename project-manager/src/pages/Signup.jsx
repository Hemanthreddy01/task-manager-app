import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member"); // 👈 default

  const navigate = useNavigate();

  const handleSignup = async () => {
    console.log('hello');
  };

  return (
    <div>
      <h2>Signup</h2>

      <input placeholder="Name" onChange={e => setName(e.target.value)} /><br />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br />

      {/* 👇 ROLE SELECT */}
      <select onChange={e => setRole(e.target.value)} value={role}>
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select><br />

      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}