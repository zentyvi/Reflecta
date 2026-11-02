import { useGoogleLogin } from "@react-oauth/google";

type Props = {
  className?: string;
};

function GoogleLoginButton({ className = "" }: Props) {
  const handleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
    onError: (err) => console.error(`[Google login failed] ${err}`),
  });

  return (
    <button
      onClick={() => handleLogin()}
      className={className}
      aria-label="Login via Google"
    >
      <img
        src="https://thesvg.org/icons/google/default.svg"
        alt="Google logo"
      />{" "}
      <span>Google</span>
    </button>
  );
}

export default GoogleLoginButton;
