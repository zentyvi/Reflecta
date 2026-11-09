import { Outlet } from "react-router";
import MainSidebar from "../features/main_sidebar/MainSidebar.tsx";
import { LayoutProvider } from "../contexts/LayoutProvider.tsx";

function AppLayout() {
  return (
    <LayoutProvider>
      <MainSidebar />
      <Outlet />
    </LayoutProvider>
  );
}

export default AppLayout;
