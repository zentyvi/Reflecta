import links from "./navigation_links.tsx";

type SidebarLink = {
  path: string;
  title: string;
  icon: React.ReactNode;
  selectedStateIcon?: React.ReactNode;
};

const sidebarLinks: SidebarLink[] = [];

export default sidebarLinks;
