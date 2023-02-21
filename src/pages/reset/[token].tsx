import Head from "next/head";
import { useState } from "react";
import { useAuthentification } from "../../context/AuthContext";
import homeStyles from "../../styles/Home.module.css";
import loginStyles from "../../styles/Login.module.css";
import logo from "src/public/assets/logo.webp";
import Image from "next/image";
import Partners from "../../components/Partners.component";
import { useFetch } from "../../context/FetchContext.js";
import { toast } from "react-toastify";
export default function Login() {
  const fetch = useFetch();
  const { login, register } = useAuthentification();
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [toggleLogin, setToggle] = useState(false);

  function handleError(error: string) {
    setError("Identifiants invalides");
    toast.error(
      "Une erreur est survenue, vérifiez vos identifiants, si l'erreur persiste contactez nous sur notre discord"
    );
  }
  async function handleLogin(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (password === "")
      return setError("Veuillez remplir tous les champs");

    // check is email is valid
    //if (!email.includes("@")) return setError("Email invalide");

    //login(fetch, email, password, handleError);
  }

  return (
    <>
      <Head>
        <title>InvestTrade - Reinitialisation password</title>
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
                  className={`${toggleLogin ? loginStyles.inactive : ""}`}
                >
                  Reinitialiser Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Nouveau mot de passe"
                />
                <button
                  type="submit"
                  value="Submit"
                  onClick={handleLogin}
                  className={loginStyles.button}
                >
                  Modifier le mot de passe
                </button>
                {error && <p className={loginStyles.error}>{error}</p>}
              </form>
            </div>
          </div>
          <Partners />
        </div>
      </main>
    </>
  );
}
