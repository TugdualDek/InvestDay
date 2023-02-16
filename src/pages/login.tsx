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
  const [error, setError] = useState({} as any);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailR, setEmailRegister] = useState("");
  const [passwordR, setPasswordRegister] = useState("");
  const [name, setName] = useState("");
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    // Rename this handleSubmit to handleLoginSubmit
    e.preventDefault();
    login(fetch, email, password);
  }; // Create new handleSubmit for signup

  const handleSubmitRegister = async (e: { preventDefault: () => void }) => {
    // Rename this handleSubmit to handleLoginSubmit
    e.preventDefault();
    register(fetch, emailR, passwordR, name);

    console.log(error);
  }; // Create new handleSubmit for signup

  const [toggleLogin, setToggle] = useState(false);

  function toggleLoginState() {
    setToggle((prevState) => !prevState);
    console.log(toggleLogin);
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
                  placeholder="email..."
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="mot de passe..."
                />
                <button
                  type="submit"
                  value="Submit"
                  onClick={handleSubmit}
                  className={loginStyles.button}
                >
                  Connexion
                </button>
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
                  placeholder="Nom..."
                />
                <input
                  value={emailR}
                  onChange={(e) => setEmailRegister(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email..."
                />
                <input
                  value={passwordR}
                  onChange={(e) => setPasswordRegister(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Mot de passe..."
                />
                <button
                  type="submit"
                  value="Submit"
                  onClick={handleSubmitRegister}
                  className={loginStyles.button}
                >
                  Inscription
                </button>
              </form>
            </div>
          </div>
          <Partners />
        </div>
      </main>
    </>
  );
}
