import { useRef, useState } from "react";
import CircleComponent, { CircleComponentHandle } from "./CircleComponent";
import SliderComponent from "./SliderComponent";

export default function Content() {
    const circleRef = useRef<CircleComponentHandle>(null);
    const [sectionIndex, setSectionIndex] = useState(0);
    const [yearRange, setYearRange] = useState<[number, number]>([1999, 2004]);
    const animationRef = useRef<number | null>(null);

    const sectionYearRanges: [number, number][] = [
        [1999, 2004], 
        [1987, 1991], 
        [1992, 1997], 
        [1999, 2004], 
        [1987, 1991],
        [2015, 2022]
    ];

    const animateYearRange = (newIndex: number) => {
        const [targetStart, targetEnd] = sectionYearRanges[newIndex];
        const [currentStart] = yearRange;
    
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
    
        let start = currentStart;
        const step = targetStart > start ? 1 : -1;
    
        const animate = () => {
            if (start !== targetStart) {
                start += step;
                setYearRange([start, start + (targetEnd - targetStart)]);
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setYearRange([targetStart, targetEnd]);
                animationRef.current = null;
            }
        };
    
        animate();
    };

    const handleIndexChange = (newIndex: number) => {
        animateYearRange(newIndex);
        setSectionIndex(newIndex);
    };

    return (
        <div className="content">
            <div className="vertical-line"></div>
            <div className="horizontal-line"></div>

            <CircleComponent ref={circleRef} onIndexChange={handleIndexChange} />

            <div className="historical-dates">
                <div></div>
                <div>Исторические<span>даты</span></div>
            </div>

            <div className="numbers-dates">
                <span>{yearRange[0]}</span>
                <span>{yearRange[1]}</span>
            </div>
            <div className="circle-buttons">
                <div>{String(sectionIndex + 1).padStart(2, "0")}/06</div>
                <div>
                    <span
                        onClick={() => sectionIndex > 0 && circleRef.current?.goToPrev()}
                        className={sectionIndex === 0 ? "disabled" : ""}
                    >
                        ❮
                    </span>
                    <span
                        onClick={() => sectionIndex < sectionYearRanges.length - 1 && circleRef.current?.goToNext()}
                        className={sectionIndex === sectionYearRanges.length - 1 ? "disabled" : ""}
                    >
                        ❯
                    </span>
                </div>
            </div>
            <SliderComponent sectionIndex={sectionIndex} />
            <PointsPanel sectionYearRanges={sectionYearRanges} activeIndex={sectionIndex} />
      </div>
    );
}

type PointsPanelProps = {
    sectionYearRanges: [number, number][];
    activeIndex: number;
};

function PointsPanel( {sectionYearRanges, activeIndex}: PointsPanelProps ) {
    return (
        <div className="points-panel">
            {sectionYearRanges.map((_, index) => (
                <div
                    key={index}
                    className={`point ${index === activeIndex ? 'active' : ''}`}
                />
            ))}
        </div>
    );
}