import { useGoogleLogin } from "@react-oauth/google";
import api from "../../../../api/index.ts";
import useAuth from "../../../contexts/AuthProvider.tsx";

type Props = {
  disabled?: boolean;
  className?: string;
};

function GoogleLoginButton({ className = "", disabled = false }: Props) {
  const { login } = useAuth();
  const handleSuccess = async (token: string) => {
    try {
      const result = await api.auth.googleLogin(token);
      if (result.success) {
        login(result.token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => handleSuccess(tokenResponse.access_token),
    onError: (err) => console.error(`[Google login failed] - ${err}`),
  });

  return (
    <button
      onClick={() => handleLogin()}
      className={className}
      aria-label="Login via Google"
      disabled={disabled}
    >
      <img
        src="https://thesvg.org/icons/google/default.svg"
        alt="Google logo"
      />
      <span>Google</span>
    </button>
  );
}

export default GoogleLoginButton;
