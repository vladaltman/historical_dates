import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import gsap from 'gsap';
import './Styles/CircleComponent.scss';

export type CircleComponentHandle = {
  goToNext: () => void;
  goToPrev: () => void;
};

type Props = {
  onIndexChange?: (newIndex: number) => void;
};

const CircleComponent = forwardRef<CircleComponentHandle, Props>(({ onIndexChange }, ref) => {
  const totalPoints = 6;
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const circleRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    goToNext: () => handleClick((activeIndex + 1) % totalPoints),
    goToPrev: () => handleClick((activeIndex - 1 + totalPoints) % totalPoints),
  }));

  const handleClick = (newIndex: number) => {
    if (newIndex === activeIndex) return;

    const anglePerStep = 360 / totalPoints;
    const targetAngle = anglePerStep * newIndex;
    const currentAngle = anglePerStep * activeIndex;

    let delta = targetAngle - currentAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    const newRotation = rotation - delta;

    gsap.to(circleRef.current, {
      rotation: newRotation,
      duration: 1.2,
      ease: 'power2.out',
    });

    setRotation(newRotation);
    setActiveIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  const renderDots = () => {
    const radius = 50;

    return Array.from({ length: totalPoints }).map((_, i) => {
      const angle = (360 / totalPoints) * i - 60;
      const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
      const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

      return (
        <div
          key={i}
          className={`dot ${i === activeIndex ? 'active' : ''}`}
          onClick={() => handleClick(i)}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="dot-label" style={{
            transform: `rotate(${-rotation}deg)`
          }}>{i + 1}</span>
        </div>
      );
    });
  };

  return (
    <div className="circle-wrapper">
      <div className="circle" ref={circleRef}>
        {renderDots()}
      </div>
      <Tooltip activeIndex={activeIndex} />
    </div>
  );
});

export default CircleComponent;

type TooltipProps = {
    activeIndex: number;
};

function Tooltip({ activeIndex }: TooltipProps) {
    const tooltip: string[] = ['Театр', 'Кино', 'Литература', 'Музыка', 'Кино', 'Наука'];
    const [visible, setVisible] = useState(true);
    const [displayIndex, setDisplayIndex] = useState(activeIndex);

    useEffect(() => {
        if (activeIndex === displayIndex) return;
    
        setVisible(false);
    
        const timeout = setTimeout(() => {
          setDisplayIndex(activeIndex);
          setVisible(true);
        }, 1100);
    
        return () => clearTimeout(timeout);
      }, [activeIndex, displayIndex]);

    return (
        <span
            className="tooltip"
            style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.3s ease',
            }}
        >
            {tooltip[displayIndex]}
        </span>
    );
}