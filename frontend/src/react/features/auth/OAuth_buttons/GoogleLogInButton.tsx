import { useGoogleLogin } from "@react-oauth/google";

function GoogleLoginButton() {
  const handleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
    onError: (err) => console.error(`[Google login failed] ${err}`),
  });

  return (
    <button onClick={() => handleLogin()}>
      <img
        src="https://thesvg.org/icons/google/default.svg"
        alt="Google logo"
      />{" "}
      <span>Google</span>
    </button>
  );
}

export default GoogleLoginButton;
