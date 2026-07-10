import { useEffect, useRef, useState } from 'react';

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
}

const SPOTLIGHT_R = 260;

export default function RevealLayer({
  image,
  cursorX,
  cursorY,
}: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [maskImage, setMaskImage] = useState<string>('');

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(
      cursorX,
      cursorY,
      0,
      cursorX,
      cursorY,
      SPOTLIGHT_R
    );

    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    const dataUrl = canvas.toDataURL();
    setMaskImage(dataUrl);
  }, [cursorX, cursorY, dimensions]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
        width={dimensions.width}
        height={dimensions.height}
      />
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          maskImage: maskImage ? `url(${maskImage})` : 'none',
          WebkitMaskImage: maskImage ? `url(${maskImage})` : 'none',
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
        }}
      />
    </>
  );
}
