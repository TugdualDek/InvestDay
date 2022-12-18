import Head from "next/head";
import { useState } from "react";
import { useAuthentification } from "../context/AuthContext";
import homeStyles from "../styles/Home.module.css";
import loginStyles from "../styles/Login.module.css";
export default function Login() {
  const { login } = useAuthentification();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(email, password);
    login(email, password);
  };
  return (
    <>
      <Head>
        <title>InvestTrade - Connexion</title>
        <meta name="description" content="Page d'accueil" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={homeStyles.pageContainer}>
        <div className={loginStyles.loginContainer}>
          <h1>Login</h1>
          <div style={{ width: 400, justifySelf: "center" }}>
            <form style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="email">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                id="email"
              />
              <label htmlFor="password">Password</label>
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
      </main>
    </>
  );
}
