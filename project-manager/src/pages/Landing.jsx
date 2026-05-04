import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Project Manager App</h1>
      <p>Manage your projects and tasks efficiently</p>

      <Link to="/login">
        <button>Login</button>
      </Link>

      <Link to="/signup">
        <button style={{ marginLeft: "10px" }}>Signup</button>
      </Link>
    </div>
  );
}