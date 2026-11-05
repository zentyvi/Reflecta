const apiVersion = import.meta?.env?.VITE_API_VERSION || "v1";

const devServer = import.meta?.env?.VITE_DEV_SERVER_URL;
const productionServer = import.meta?.env?.VITE_SERVER_URL;
const isDev = import.meta.env["VITE_DEV"] === "true";

const selectedServer = isDev ? devServer : productionServer;
const apiUrl = `${selectedServer}/api/${apiVersion}`;

const token = localStorage.getItem("token");
const bearer = token ? `Bearer ${token}` : null;

export { apiUrl, selectedServer, bearer };
