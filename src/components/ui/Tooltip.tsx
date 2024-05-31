import React, { useState, useEffect } from 'react';

interface FloatingTooltipProps {
  message: string;
  position: { top: number; left: number };
}

const FloatingTooltip: React.FC<FloatingTooltipProps> = ({ message, position }) => {
  const [tooltipStyle, setTooltipStyle] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    const calculatePosition = () => {
      const tooltipWidth = 200;
      const tooltipHeight = 40; 

      const calculatedLeft = position.left - tooltipWidth - 10;
      const calculatedTop = position.top - tooltipHeight / 2;

      setTooltipStyle({
        top: calculatedTop,
        left: calculatedLeft,
      });
    };

    calculatePosition();

    window.addEventListener('resize', calculatePosition);

    return () => {
      window.removeEventListener('resize', calculatePosition);
    };
  }, [position]);

  return (
    <div
      style={{
        position: 'absolute',
        top: tooltipStyle.top,
        left: tooltipStyle.left + 50,
        backgroundColor: '#FFCE56',
        color: '#333',
        filter: 'drop-shadow(0 10 10px rgba(0, 0, 0, 0.2))',
        padding: '6px',
        fontSize: '10px',
        borderRadius: '20px',
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
};

export default FloatingTooltip;
