import { Link } from "react-router";
import { useState } from "react";
import FormInput from "../../components/FormInput.tsx";
import GoogleLoginButton from "./OAuth_buttons/GoogleLogInButton.tsx";
import GitHubLoginButton from "./OAuth_buttons/GithubLogInButton.tsx";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main>
      {/* Hidden heading */}
      <h1 className="visually-hidden">Login</h1>
      {/* Form header */}
      <div>
        <span>Hello!</span>
        <p>
          Sign in your account, or <Link to="/auth/register">create one</Link>.
        </p>
      </div>
      {/* Login form */}
      <form>
        <FormInput
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label={
            <>
              <img src="/assets/icons/user.svg" alt="" aria-hidden />{" "}
              <span>Username</span>
            </>
          }
          placeholder="John_Doe"
          required
        />
        <FormInput
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label={
            <>
              <img src="/assets/icons/lock.svg" alt="" aria-hidden />{" "}
              <span>Password</span>
            </>
          }
          placeholder="•••••••••"
          showPassword={showPassword}
          onShowPassword={() => setShowPassword((prev) => !prev)}
          showPasswordToggle
          required
        />
        {/* Submit */}
        <button type="submit">
          <span>Login</span>
          <img src="/assets/icons/arrow.svg" alt="" aria-hidden />
        </button>
      </form>
      {/* Separator */}
      <div>
        <span>Or use</span>
      </div>
      {/* OAuth buttons */}
      <div>
        <GoogleLoginButton />
        <GitHubLoginButton />
      </div>
    </main>
  );
}

export default LoginForm;
