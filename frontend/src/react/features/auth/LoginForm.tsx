import { useState } from "react";
import FormInput from "../../components/FormInput.tsx";
import type { ErrorsObject } from "../../../@types/ErrorObjects";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ErrorsObject>({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form aria-label="Login form">
      <FormInput
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
      <button type="submit" data-testid="submit-button">
        <span>Login</span>
        <img src="/assets/icons/arrow.svg" alt="" aria-hidden />
      </button>
    </form>
  );
}

export default LoginForm;
