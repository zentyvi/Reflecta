import { useState } from "react";
import type { ErrorsObject } from "../../../@types/ErrorObjects";
import FormInput from "../../components/FormInput.tsx";
import { validatePassword, validateUsername } from "../../utils/validators.ts";
import GithubLoginButton from "./OAuth_buttons/GithubLogInButton.tsx";
import GoogleLoginButton from "./OAuth_buttons/GoogleLogInButton.tsx";

function RegisterForm() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [errors, setErrors] = useState<ErrorsObject>({});
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
      <form aria-label="Register form">
        <FormInput
          name="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            validateUsername(e, setErrors, "username");
          }}
          error={errors?.username}
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
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e, setErrors, "password");
          }}
          error={!passwordsMatch ? "Passwords don't match" : errors?.password}
          label={
            <>
              <img src="/assets/icons/lock.svg" alt="" aria-hidden />{" "}
              <span>Password</span>
            </>
          }
          placeholder="•••••••••"
          showPassword={showPasswords}
          onShowPassword={onShowPassword}
          required
        />
        <FormInput
          type="password"
          name="password_confirmation"
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
        <button type="submit" data-testid="submit-button">
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
        <GithubLoginButton />
      </div>
    </main>
  );
}

export default RegisterForm;
