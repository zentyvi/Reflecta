import ReactFocusLock from "react-focus-lock";
import useLayout from "../../../contexts/LayoutProvider.tsx";
import { useEscape } from "../../../utils/hooks.tsx";

type Props = {
  children: React.ReactNode;
};

function MainSidebarWrapper({ children }: Props) {
  const { isSidebarOpen, setIsSidebarOpen } = useLayout().sidebar;
  useEscape(() => setIsSidebarOpen(false));

  return (
    <ReactFocusLock disabled={!isSidebarOpen}>
      <div />
      {children}
    </ReactFocusLock>
  );
}

export default MainSidebarWrapper;
