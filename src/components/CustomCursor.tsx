import React, { useState, useEffect } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const updateHoverState = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const clickable = target.closest('button, a, input, [role="button"]');
            setIsHovering(!!clickable);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', updatePosition);
        window.addEventListener('mousemove', updateHoverState);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            window.removeEventListener('mousemove', updateHoverState);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div
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
