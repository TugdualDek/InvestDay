import React from "react";
import "../style/login.css";
import { useAuthentification } from "../context/AuthContext";
function Login() {
  const { login } = useAuthentification();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    login(email, password);
  };
  return (
    <div className="loginContainer">
      <h1>Login</h1>
      <div style={{ width: 400, justifySelf: "center" }}>
        <form style={{ display: "flex", flexDirection: "column" }}>
          <label for="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            id="email"
          />
          <label for="password">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            id="password"
          />
          <input type="submit" value="Submit" onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
}

export default Login;
