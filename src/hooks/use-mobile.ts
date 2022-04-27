import { useState, useEffect } from 'react';

export interface Size {
  width?: number;
  height?: number;
}

const DRAWER_MOBILE = 600;

export const useMobile = (): boolean => {
  const [windowSize, setWindowSize] = useState<Size>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (windowSize.width as number) < DRAWER_MOBILE;
};
