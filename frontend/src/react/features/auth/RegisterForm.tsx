import type { ErrorsObject } from "@shared/ErrorObjects.d.ts";
import { useState } from "react";
import api from "../../../api/index.ts";
import FormInput from "../../components/FormInput.tsx";
import useAuth from "../../contexts/AuthProvider.tsx";
import { useTitle } from "../../utils/hooks.tsx";
import { validatePassword, validateUsername } from "../../utils/validators.ts";
import GithubLoginButton from "./OAuth_buttons/GithubLogInButton.tsx";
import GoogleLoginButton from "./OAuth_buttons/GoogleLogInButton.tsx";

function RegisterForm() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [errors, setErrors] = useState<ErrorsObject>({});
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassword_confirmation] = useState("");
  const { login } = useAuth();

  useTitle("Register");

  const handleSubmit: React.SubmitEventHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const data = {
        username: username.toLowerCase(),
        password,
        password_confirmation,
      };
      const result = await api.auth.signUp(data);
      if (!result.success) {
        setErrors(result.errors);
        return;
      }

      login(result.token);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    password === password_confirmation ||
    password.length === 0 ||
    password_confirmation.length === 0;

  const onShowPassword = () => setShowPasswords((prev) => !prev);

  return (
    <main>
      <form aria-label="Register form" onSubmit={handleSubmit}>
        <FormInput
          disabled={loading}
          name="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            validateUsername(e, setErrors, "username");
          }}
          error={errors?.username}
          label={
            <>
              <i className="bi bi-person-fill" aria-hidden />
              <span>Username</span>
            </>
          }
          placeholder="John_Doe"
          required
        />
        <FormInput
          disabled={loading}
          type="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e, setErrors, "password");
          }}
          error={errors?.password}
          label={
            <>
              <i className="bi bi-lock-fill" aria-hidden />
              <span>Password</span>
            </>
          }
          placeholder="•••••••••"
          showPassword={showPasswords}
          onShowPassword={onShowPassword}
          required
        />
        <FormInput
          disabled={loading}
          type="password"
          name="password_confirmation"
          value={password_confirmation}
          onChange={(e) => setPassword_confirmation(e.target.value)}
          error={
            !passwordsMatch
              ? "Passwords don't match"
              : errors?.password_confirmation
          }
          label={
            <>
              <i className="bi bi-check" aria-hidden />
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
            disabled={loading}
            type="checkbox"
            id="show-passwords-toggle"
            checked={showPasswords}
            onChange={(e) => setShowPasswords(e.target.checked)}
          />
          <label htmlFor="show-passwords-toggle">Show passwords</label>
        </div>
        {/* Submit */}
        <button
          type="submit"
          data-testid="submit-button"
          disabled={loading || !passwordsMatch}
        >
          <span>Register</span>
          <i className="bi bi-arrow-right-short" aria-hidden />
        </button>
      </form>
      {/* Separator */}
      <div>
        <span>Or use</span>
      </div>
      {/* OAuth buttons */}
      <div>
        <GoogleLoginButton disabled={loading} />
        <GithubLoginButton disabled={loading} />
      </div>
    </main>
  );
}

export default RegisterForm;
