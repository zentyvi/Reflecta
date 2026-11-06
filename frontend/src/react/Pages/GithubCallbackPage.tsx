import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import useAuth from "../contexts/AuthProvider.js";
import api from "../../api/index.js";

const styles = {} as CSSModuleClasses;

function GithubCallbackPage() {
  const [params] = useSearchParams();
  const code = params.get("code");
  const [loading, setLoading] = useState(Boolean(code));
  const { login } = useAuth();

  // useTitle(loading ? "Authenticating..." : "Authentication Error");

  useEffect(() => {
    if (!code) {
      return;
    }

    const handleGithubAuth = async () => {
      try {
        const result = await api.auth.githubLogin(code);
        if (result?.success) {
          login(result.token);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
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
          <h2 className={styles["auth-redirect__title"]}>
            An error has occurred
          </h2>
          <p className={styles["auth-redirect__description"]}>
            The provided GitHub authorization code is invalid or expired. Please
            try logging in again.
          </p>
        </div>

        <div className={styles["auth-redirect__actions"]}>
          <Link to="/auth/login" className="btn btn--primary">
            Login
          </Link>
          <Link to="/auth/register" className="btn btn--secondary">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}

export default GithubCallbackPage;
