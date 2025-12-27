import React from 'react';

const CyberMap = () => {
    return (
        <div className="relative w-[450px] h-[320px] terminal-stage flex items-center justify-center">
            {/* Main Glass Screen - Matches Terminal */}
            <div className="terminal-screen w-full h-full relative overflow-hidden border border-[#00f3ff]/50 bg-[#00f3ff]/5 shadow-[0_0_30px_rgba(0,243,255,0.15)] rounded-sm group">

                {/* 1. Map Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700"
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWTgp3bL6fzwmhtfxGfaIwYAThlSoMPXimutfwgnhJzbE_DxAGOPDI0878aHY7nIFl9Kdkw6H5rq2W8KbqF_qT89h0A9opqt-unsS4-62TgGu_oxsoTj8MUNILYm2rVf70iHZbHjIV3HPc6AWCtjyIKnqmcpIxwUa9BvwrLYqr4NRPceHW4awyvGkUizOXwGT7hWFQCl2ifjqP0b7reG4fiy1HftYlQJ_mO52Z5I3o6pnrW7KWXDyYcF4U7f26eBYlD3sPVHwYKB1W')` }}
                ></div>

                {/* 2. Grid Overlay */}
                <div className="absolute inset-0 terminal-grid opacity-30"></div>

                {/* 3. Radar Scan Effect REMOVED by User Request */}

                {/* 4. Active Target Ping (Turkey Location Adjusted) */}
                {/* Visually calibrated for Turkey on this specific map projection */}
                <div className="absolute top-[33%] left-[52%]">
                    {/* Ring ripple - Red for alert vibe */}
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping absolute opacity-75"></div>

                    {/* Core Dot - Alternating Red/White */}
                    <div className="w-2 h-2 rounded-full absolute shadow-[0_0_10px_white] animate-[flash-red-white_1s_infinite]"></div>

                    {/* Outer Echo Ring */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-red-500/50 rounded-full animate-ping opacity-20 delay-100"></div>
                </div>

                {/* 5. HUD Data Overlay */}
                <div className="absolute top-4 left-4 border-l-2 border-[#00f3ff] pl-2">
                    <div className="text-[10px] text-[#00f3ff] tracking-widest">TARGET_ZONE</div>
                    <div className="text-sm font-bold text-white shadow-[#00f3ff] drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]">SYSTEM_CORE</div>
                </div>

                <div className="absolute bottom-4 right-4 text-right">
                    <div className="flex gap-1 justify-end mb-1">
                        <span className="w-1 h-3 bg-[#00f3ff] animate-pulse"></span>
                        <span className="w-1 h-3 bg-[#00f3ff] animate-pulse delay-75"></span>
                        <span className="w-1 h-3 bg-[#00f3ff] animate-pulse delay-150"></span>
                    </div>
                    <div className="text-[9px] text-[#00f3ff]/70 font-mono">COORDS: 41.0082° N, 28.9784° E</div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00f3ff]"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00f3ff]"></div>

            </div>

            {/* Background Glow */}
            <div className="absolute -z-10 w-full h-full bg-[#00f3ff] opacity-5 blur-[100px]"></div>
        </div>
    );
};

export default CyberMap;
