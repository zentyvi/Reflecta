import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import api from "../../api/index.js";
import links from "../config/navigation_links.js";
import useAuth from "../contexts/AuthProvider.js";
import { useTitle } from "../utils/hooks.js";

const styles = {} as CSSModuleClasses;

function GithubCallbackPage() {
  const [params] = useSearchParams();
  const code = params.get("code");
  const [state, setState] = useState<"loading" | "error">("loading");
  const { login } = useAuth();

  useTitle(state === "loading" ? "Authenticating..." : "Authentication Error");

  useEffect(() => {
    if (!code) {
      setState("error");
      return;
    }

    const handleGithubAuth = async () => {
      try {
        const result = await api.auth.githubLogin(code);
        if (result?.success) {
          login(result.token);
        }
      } catch (err) {
        setState("error");
        console.error(`[Github login failed] - ${err}`);
      }
    };

    handleGithubAuth();
  }, [code, login]);

  return (
    <main className={styles["auth-redirect"]}>
      <div className={styles["auth-redirect__card"]}>
        <div className={styles["auth-redirect__header"]}>
          <i
            className={`bi bi-exclamation-triangle ${styles["auth-redirect__icon"]}`}
            aria-hidden="true"
          />
          <h1 className={styles["auth-redirect__title"]}>
            {state === "loading" ? "Authenticating..." : "Error has occurred"}
          </h1>
          {state === "error" && (
            <p className={styles["auth-redirect__description"]}>
              The provided GitHub authorization code is invalid or expired.
              Please try logging in again.
            </p>
          )}
        </div>
        {state === "error" && (
          <div className={styles["auth-redirect__actions"]}>
            <Link to={links.auth.login} className="btn btn--primary">
              Login
            </Link>
            <Link to={links.auth.register} className="btn btn--secondary">
              Register
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default GithubCallbackPage;
