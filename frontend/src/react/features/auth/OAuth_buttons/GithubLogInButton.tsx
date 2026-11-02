const styles = {} as CSSModuleClasses;

type Props = {
  className?: string;
};

function GithubLoginButton({ className = "" }: Props) {
  const handleGithubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/github`;
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=read:user user:email`;

    window.location.href = githubUrl;
  };

  return (
    <button
      type="button"
      onClick={handleGithubLogin}
      className={`${styles["github-btn"]} ${className}`}
      aria-label="Login via GitHub"
    >
      <img
        src="https://thesvg.org/icons/github/default.svg"
        alt="Github logo"
        className={styles["github-btn__icon"]}
      />
      <span className={styles["github-btn__text"]}>GitHub</span>
    </button>
  );
}

export default GithubLoginButton;
