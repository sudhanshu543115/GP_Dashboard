import { createContext, useContext, useEffect, useState } from "react";

const ZoomContext = createContext();

export const ZoomProvider = ({ children }) => {
  const [zoom, setZoom] = useState(
    Number(localStorage.getItem("appZoom")) || 100
  );

  useEffect(() => {
    document.documentElement.style.zoom = `${zoom}%`;
    localStorage.setItem("appZoom", zoom);
  }, [zoom]);

  const zoomIn = () => setZoom((z) => Math.min(z + 10, 150));
  const zoomOut = () => setZoom((z) => Math.max(z - 10, 70));
  const resetZoom = () => setZoom(100);

  return (
    <ZoomContext.Provider value={{ zoom, zoomIn, zoomOut, resetZoom }}>
      {children}
    </ZoomContext.Provider>
  );
};

export const useZoom = () => useContext(ZoomContext);