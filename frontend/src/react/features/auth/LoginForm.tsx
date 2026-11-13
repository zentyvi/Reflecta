import { useState } from "react";
import type {FormErrorsObject} from "@shared/other/FormValidationErrors.d.ts";
import api from "../../../api/index.ts";
import FormInput from "../../components/FormInput.tsx";
import useAuth from "../../contexts/AuthProvider.tsx";
import { useTitle } from "../../utils/hooks.tsx";
import GithubLoginButton from "./OAuth_buttons/GithubLogInButton.tsx";
import GoogleLoginButton from "./OAuth_buttons/GoogleLogInButton.tsx";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrorsObject>({});
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  useTitle("Login");

  const handleLogin: React.SubmitEventHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const data = { username: username.toLowerCase(), password };
      const result = await api.auth.login(data);

      if (!result.success) {
        setErrors(result?.errorData);
        return;
      }

      login(result.data.token);
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
          onChange={(e) => setPassword(e.target.value)}
          error={errors?.password}
          label={
            <>
              <i className="bi bi-lock-fill" aria-hidden />
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

export default LoginForm;
