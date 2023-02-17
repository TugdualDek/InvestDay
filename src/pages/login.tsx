import Head from "next/head";
import { useState } from "react";
import { useAuthentification } from "../context/AuthContext";
import homeStyles from "../styles/Home.module.css";
import loginStyles from "../styles/Login.module.css";
import logo from "src/public/assets/logo.webp";
import Image from "next/image";
import Partners from "../components/Partners.component";
import { useFetch } from "../context/FetchContext.js";
export default function Login() {
  const fetch = useFetch();
  const { login, register } = useAuthentification();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailR, setEmailRegister] = useState("");
  const [passwordR, setPasswordRegister] = useState("");
  const [name, setName] = useState("");
  const [toggleLogin, setToggle] = useState(false);

  function handleError(error: string) {
    setError("Identifiants invalides");
  }
  async function handleLogin(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (email === "" || password === "")
      return setError("Veuillez remplir tous les champs");

    // check is email is valid
    if (!email.includes("@")) return setError("Email invalide");

    login(fetch, email, password, handleError);
  }

  async function handleRegister(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (emailR === "" || passwordR === "" || name === "")
      return setError("Veuillez remplir tous les champs");

    // check is email is valid
    if (!emailR.includes("@eleve.isep.fr") && !emailR.includes("@isep.fr"))
      return setError("Merci d'utiliser votre mail ISEP");

    // check if password is valid
    if (passwordR.length < 8)
      return setError("Le mot de passe doit contenir au moins 8 caractères");

    register(fetch, emailR, passwordR, name, handleError);
  }

  function toggleLoginState() {
    setToggle((prevState) => !prevState);
    setError("");
  }

  return (
    <>
      <Head>
        <title>InvestTrade - Connexion</title>
        <meta name="description" content="Page d'accueil" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={homeStyles.pageContainer}>
        <div className={loginStyles.container}>
          <div className={loginStyles.imageDessus}>
            <Image src={logo} width={200} alt="logo" />
          </div>
          <div
            className={`${loginStyles.main} ${
              toggleLogin ? loginStyles.active : ""
            }`}
          >
            <div className={loginStyles.login}>
              <form>
                <label
                  onClick={toggleLoginState}
                  className={`${toggleLogin ? loginStyles.inactive : ""}`}
                >
                  Connexion
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Mail ISEP"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Mot de passe"
                />
                <button
                  type="submit"
                  value="Submit"
                  onClick={handleLogin}
                  className={loginStyles.button}
                >
                  Connexion
                </button>
                {error && <p className={loginStyles.error}>{error}</p>}
              </form>
            </div>
            <div
              className={`${loginStyles.signin} ${
                toggleLogin ? loginStyles.active : ""
              }`}
            >
              <form>
                <label
                  onClick={toggleLoginState}
                  className={`${toggleLogin ? loginStyles.active : ""}`}
                >
                  Inscription
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  name="nom"
                  id="nom"
                  placeholder="Identifiant ISEP"
                />
                <input
                  value={emailR}
                  onChange={(e) => setEmailRegister(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Mail ISEP"
                />
                <input
                  value={passwordR}
                  onChange={(e) => setPasswordRegister(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Mot de passe"
                />
                <button
                  type="submit"
                  value="Submit"
                  onClick={handleRegister}
                  className={loginStyles.button}
                >
                  Inscription
                </button>
                {error && (
                  <p className={loginStyles.error} style={{ color: "white" }}>
                    {error}
                  </p>
                )}
              </form>
            </div>
          </div>
          <Partners />
        </div>
      </main>
    </>
  );
}
