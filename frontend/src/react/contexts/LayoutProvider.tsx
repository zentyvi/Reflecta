import { createContext, useContext, useEffect, useState } from "react";

type LayoutContext = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type Props = {
  children: React.ReactNode;
};
const LayoutContext = createContext<LayoutContext | null>(null);

export function LayoutProvider({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const watchWindowResize = () => {
      const width = window.innerWidth;
      if (width > 1100 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", watchWindowResize);
    return () => {
      window.removeEventListener("resize", watchWindowResize);
    };
  });

  return (
    <LayoutContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </LayoutContext.Provider>
  );
}

const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("LayoutContext must be used within the LayoutProvider");
  }
  return context;
};

export default useLayout;
