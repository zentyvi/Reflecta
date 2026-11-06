import { useState } from "react";
import type { ErrorsObject } from "@shared/ErrorObjects.d.ts";
import api from "../../../api/index.ts";
import FormInput from "../../components/FormInput.tsx";
import useAuth from "../../contexts/AuthProvider.tsx";
import GithubLoginButton from "./OAuth_buttons/GithubLogInButton.tsx";
import GoogleLoginButton from "./OAuth_buttons/GoogleLogInButton.tsx";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ErrorsObject>({});
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin: React.SubmitEventHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const data = { username: username.toLowerCase(), password };
      const result = await api.auth.login(data);

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

  return (
    <main>
      <form aria-label="Login form" onSubmit={handleLogin}>
        <FormInput
          disabled={loading}
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          disabled={loading}
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors?.password}
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
        <button type="submit" data-testid="submit-button" disabled={loading}>
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
        <GoogleLoginButton disabled={loading} />
        <GithubLoginButton disabled={loading} />
      </div>
    </main>
  );
}

export default LoginForm;
