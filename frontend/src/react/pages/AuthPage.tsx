import { GoogleOAuthProvider } from "@react-oauth/google";
import { Link, Outlet, useLocation } from "react-router";
import links from "../config/navigation_links.tsx";

function AuthPage() {
  const { pathname } = useLocation();
  const isLoginPage = pathname.includes("login");
  const subTitle = isLoginPage ? (
    <>
      Sign in your account, or <Link to={links.auth.register}>create one</Link>.
    </>
  ) : (
    <>
      Create an account, or <Link to={links.auth.login}>login</Link>.
    </>
  );

  return (
    <GoogleOAuthProvider clientId={import.meta.env["VITE_GOOGLE_CLIENT_ID"]}>
      <div>
        {/* Site header */}
        <div>
          <span aria-label="logo" data-testid="logo">
            Reflecta
          </span>
          <nav>
            <ul>
              <li>
                <Link to={isLoginPage ? links.auth.register : links.auth.login}>
                  {isLoginPage ? "Register" : "Login"}
                </Link>
              </li>
              <li>
                <button type="button">Theme</button>
              </li>
            </ul>
          </nav>
        </div>
        <main>
          {/* Hidden heading */}
          <h1 className="visually-hidden">
            {isLoginPage ? "Login" : "Register"}
          </h1>
          {/* Form header */}
          <div>
            <span>Hello!</span>
            <p>{subTitle}</p>
          </div>
          {/* Form from Outlet */}
          <Outlet />
        </main>
      </div>
      {/* Banner */}
      <aside>
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
