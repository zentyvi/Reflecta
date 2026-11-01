import { GoogleOAuthProvider } from "@react-oauth/google";
import { Link, Outlet, useLocation } from "react-router";

function AuthPage() {
  const { pathname } = useLocation();
  const isLoginPage = pathname.includes("login");

  return (
    <GoogleOAuthProvider clientId={import.meta.env["VITE_GOOGLE_CLIENT_ID"]}>
      <div>
        {/* Site header */}
        <div>
          <span>Reflecta</span>
          <nav>
            <ul>
              <li>
                <Link to={isLoginPage ? "/auth/register" : "/auth/login"}>
                  {isLoginPage ? "Register" : "Login"}
                </Link>
              </li>
              <li>
                <button type="button">Theme</button>
              </li>
            </ul>
          </nav>
        </div>
        {/* Register/Login form */}
        <main>
          <Outlet />
        </main>
      </div>
      {/* Banner */}
      <aside>
        {/* Decor */}
        <img src="/assets/decor/lighting.png" alt="" aria-hidden />
        <img src="/assets/decor/spiral.svg" alt="" aria-hidden />
        {/* Banner's text */}
        <div>
          <h2>Reflecta</h2>
          <h3>Free emotions tracker</h3>
          <p>
            Use Reflecta, a free private mood and emotions tracker, to track
            daily, weekly, and monthly emotions.
          </p>
        </div>
      </aside>
    </GoogleOAuthProvider>
  );
}

export default AuthPage;
