import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import './Styles/SliderComponent.scss';
import { textEvents } from './data/events';

type SliderComponentProps = {
    sectionIndex: number;
};

export default function SliderComponent({ sectionIndex }: SliderComponentProps) {
    const events = textEvents[sectionIndex] || [];
    const wrapperRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (window.innerWidth > 399) return;

        const updateVisibility = () => {
            const wrapper = wrapperRef.current;
            if (!wrapper) return;

            const container = wrapper.querySelector('.swiper') as HTMLElement;
            const containerRect = container.getBoundingClientRect();

            const slides = wrapper.querySelectorAll('.slide');
            slides.forEach((slide) => {
                const rect = slide.getBoundingClientRect();
                const fullyVisible =
                    rect.left >= containerRect.left &&
                    rect.right <= containerRect.right;

                if (fullyVisible) {
                    slide.classList.remove('partially-visible');
                } else {
                    slide.classList.add('partially-visible');
                }
            });

            rafRef.current = requestAnimationFrame(updateVisibility);
        };

        rafRef.current = requestAnimationFrame(updateVisibility);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [sectionIndex]);

    return (
        <div className="slider-wrapper" ref={wrapperRef}>
            <div className="swiper-button-prev">❮</div>
            <div className="swiper-button-next">❯</div>

            <Swiper
                modules={[Mousewheel, Navigation]}
                direction="horizontal"
                spaceBetween={20}
                slidesPerView="auto"
                mousewheel={{ forceToAxis: true }}
                navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
                className="slider"
            >
                {events.map(({ year, text }) => (
                    <SwiperSlide key={year} className="slide">
                        <div className="event">
                            <div>{year}</div>
                            <div>{text}</div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}