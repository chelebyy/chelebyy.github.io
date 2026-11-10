import React, { useState, useEffect } from 'react';

const finePointer = () => typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches;

/** Crosshair cursor for mouse users. Touch devices keep their native behaviour. */
const CustomCursor = () => {
    const [enabled] = useState(finePointer);
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        if (!enabled) return;
        const root = document.documentElement;
        root.classList.add('custom-cursor');

        const handleMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            const target = e.target as HTMLElement | null;
            setIsHovering(!!target?.closest?.('button, a, input, label, [role="button"]'));
        };
        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            root.classList.remove('custom-cursor');
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <div
            aria-hidden="true"
            className="fixed pointer-events-none z-[9999] mix-blend-difference"
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -50%)'
            }}
        >
            <div className={`relative transition-all duration-150 ease-out ${isClicking ? 'scale-75' : 'scale-100'}`}>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] bg-white transition-all duration-300 ${isHovering ? 'w-8' : 'w-4'}`}></div>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] bg-white transition-all duration-300 ${isHovering ? 'h-8' : 'h-4'}`}></div>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}></div>

                {/* Corner Brackets */}
                <div className={`absolute -top-4 -left-4 w-2 h-2 border-t border-l border-white/50 transition-all duration-300 ${isHovering ? 'opacity-100 rotate-0' : 'opacity-0 rotate-45 scale-50'}`}></div>
                <div className={`absolute -bottom-4 -right-4 w-2 h-2 border-b border-r border-white/50 transition-all duration-300 ${isHovering ? 'opacity-100 rotate-0' : 'opacity-0 rotate-45 scale-50'}`}></div>
            </div>
        </div>
    );
};

export default CustomCursor;
