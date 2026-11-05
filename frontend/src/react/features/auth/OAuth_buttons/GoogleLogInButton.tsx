import { useGoogleLogin } from "@react-oauth/google";

type Props = {
  disabled?: boolean;
  className?: string;
};

function GoogleLoginButton({ className = "", disabled = false }: Props) {
  const handleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
    onError: (err) => console.error(`[Google login failed] ${err}`),
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
