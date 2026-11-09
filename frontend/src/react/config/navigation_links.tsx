const links = {
  auth: {
    path: "/auth",
    login: "/auth/login",
    register: "/auth/register",
    githubCallback: "/auth/github",
  },
  overview: "/overview",
  calendar: "/calendar",
  analytics: "/analytics",
  notes: "/notes",
  settings: "/settings",
} as const;

export default links;
