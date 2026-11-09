import links from "./navigation_links.tsx";

export type SidebarLink = {
  title: string;
  path: string;
  icon: React.ReactNode;
  activeStateIcon?: React.ReactNode;
};

const sidebarLinks: SidebarLink[] = [
  {
    title: "Overview",
    path: links.overview,
    icon: <i className="bi bi-house-heart" aria-hidden />,
    activeStateIcon: <i className="bi bi-house-heart-fill" aria-hidden />,
  },
  {
    title: "Caledndar",
    path: links.calendar,
    icon: <i className="bi bi-calendar-week" aria-hidden />,
    activeStateIcon: <i className="bi bi-calendar-week-fill" aria-hidden />,
  },
  {
    title: "Notes",
    path: links.notes,
    icon: <i className="bi bi-journal-bookmark" aria-hidden />,
    activeStateIcon: <i className="bi bi-journal-bookmark-fill" aria-hidden />,
  },
  {
    title: "Settings",
    path: links.settings,
    icon: <i className="bi bi-gear" aria-hidden />,
    activeStateIcon: <i className="bi bi-gear-fill" aria-hidden />,
  },
] as const;

export default sidebarLinks;
