import { useRef, useEffect } from "react";

export default function StampSignatureLayer({
  position,
  setPosition,
  readOnly
}) {
  const stampRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current || readOnly) return;

      const parent = document.getElementById("invoice-area");
      if (!parent) return;

      const rect = parent.getBoundingClientRect();

      let newX = e.clientX - rect.left - offset.current.x;
      let newY = e.clientY - rect.top - offset.current.y;

      // Prevent going outside invoice area
      const stampWidth = stampRef.current.offsetWidth;
      const stampHeight = stampRef.current.offsetHeight;

      newX = Math.max(0, Math.min(newX, rect.width - stampWidth));
      newY = Math.max(0, Math.min(newY, rect.height - stampHeight));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setPosition, readOnly]);

  const handleMouseDown = (e) => {
    if (readOnly) return;

    isDragging.current = true;

    const rect = stampRef.current.getBoundingClientRect();

    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  return (
    <div
      ref={stampRef}
      className="absolute z-20 cursor-move select-none"
      style={{
        top: position.y,
        left: position.x
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        src="/stamp.png"
        alt="Stamp"
        className="w-40 opacity-80 pointer-events-none"
        draggable={false}
      />
    </div>
  );
}