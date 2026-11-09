const links = {
  auth: {
    path: "/auth",
    login: "/auth/login",
    register: "/auth/register",
    githubCallback: "/auth/github",
  },
} as const;

export default links;
