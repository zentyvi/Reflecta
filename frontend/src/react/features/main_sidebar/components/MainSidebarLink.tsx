import { Link } from "react-router";
import type { SidebarLink } from "../../../config/sidebar_links.tsx";


function MainSidebarLink({isActive, title, path, icon, activeStateIcon = null}: SidebarLink & {isActive: boolean}) {
  return (
    <li>
      {isActive ? activeStateIcon : icon}
      <Link to={path}>{title}</Link>
    </li>
  );
}

export default MainSidebarLink;