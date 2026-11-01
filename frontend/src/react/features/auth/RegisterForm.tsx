import { Link } from "react-router";
import { useState } from "react";
import FormInput from "../../components/FormInput.tsx";
import GoogleLoginButton from "./OAuth_buttons/GoogleLogInButton.tsx";
import GitHubLoginButton from "./OAuth_buttons/GithubLogInButton.tsx";

function RegisterForm() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch =
    password === confirmPassword ||
    password.length === 0 ||
    confirmPassword.length === 0;

  const onShowPassword = () => setShowPasswords((prev) => !prev);

  return (
    <main>
      {/* Hidden heading */}
      <h1 className="visually-hidden">Register</h1>
      {/* Form header */}
      <div>
        <span>Hello!</span>
        <p>
          Create a new account, or <Link to="/auth/login">login</Link>.
        </p>
      </div>
      {/* Register form */}
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
          showPassword={showPasswords}
          onShowPassword={onShowPassword}
          error={!passwordsMatch ? "Passwords don't match" : ""}
          required
        />
        <FormInput
          type="password"
          name="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          label={
            <>
              <img src="/assets/icons/check-mark.svg" alt="" aria-hidden />{" "}
              <span>Confirm password</span>
            </>
          }
          placeholder="•••••••••"
          showPassword={showPasswords}
          onShowPassword={onShowPassword}
          required
        />
        {/* Show passwords checkbox */}
        <div>
          <input
            type="checkbox"
            id="show-passwords-toggle"
            checked={showPasswords}
            onChange={(e) => setShowPasswords(e.target.checked)}
          />
          <label htmlFor="show-passwords-toggle">Show passwords</label>
        </div>
        {/* Submit */}
        <button type="submit">
          <span>Register</span>
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

export default RegisterForm;
