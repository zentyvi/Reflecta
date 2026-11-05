import { Outlet } from "react-router";
import { AuthProvider } from "./contexts/AuthProvider.tsx";

function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export default App;
