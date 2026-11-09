import { useLocation } from "react-router";
import sidebarLinks from "../../config/sidebar_links.tsx";
import useLayout from "../../contexts/LayoutProvider.tsx";
import MainSidebarWrapper from "./components/MainSidebarWrapper.tsx";
import MainSidebarLink from "./components/MainSidebarLink.tsx";

function MainSidebar() {
  const { pathname: currentPath } = useLocation();
  const { isSidebarOpen, setIsSidebarOpen } = useLayout();

  return (
    <MainSidebarWrapper>
      <aside id="main-sidebar">
        <header>
          <div>
            <span>Reflecta</span>
            <button
              type="button"
              aria-label="Toggle sidebar"
              aria-pressed={isSidebarOpen}
              aria-controls="main-sidebar"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              <i className="bi bi-layout-sidebar-inset" aria-hidden />
            </button>
          </div>
        </header>
        <nav>
          <ul>
            {sidebarLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <MainSidebarLink
                  key={link.path}
                  isActive={isActive}
                  title={link.title}
                  path={link.path}
                  icon={link.icon}
                  activeStateIcon={link.activeStateIcon}
                />
              );
            })}
          </ul>
        </nav>
      </aside>
    </MainSidebarWrapper>
  );
}

export default MainSidebar;
