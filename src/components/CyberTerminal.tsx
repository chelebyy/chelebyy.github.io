import React, { useState, useEffect } from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';

const CyberTerminal = () => {
    const [lines, setLines] = useState<string[]>([]);
    // Use shared sound hook
    const { playHoverSound } = useSoundEffects();

    // Simulation of live log feed - TRON THEMED
    useEffect(() => {
        const logData = [
            "Initializing GRID transport...",
            "Derezzing unauthorized sectors...",
            "Disk defragmentation: 0% fragmentation",
            "Light Cycle protocol: READY",
            "Scanning Identity Disc...",
            "User: FLYNN [LEGACY_MODE]",
            "Compiling neon shaders...",
            "System integrity: 100%",
            "Loading ISO algorithms...",
            "Eradicating bugs...",
        ];

        // eslint-disable-next-line
        setLines([...logData, ...logData, ...logData]);
    }, []);

    return (
        <div
            className="hidden 2xl:flex flex-col absolute left-24 top-1/2 -translate-y-1/2 z-20 w-96 h-[450px] items-center justify-center pointer-events-auto terminal-stage"
            onMouseEnter={playHoverSound} // Trigger Sound on Hover
        >

            {/* Main Glass Screen - TRON CYAN GLOW */}
            <div className="terminal-screen w-80 h-full flex flex-col p-4 text-[#00f3ff] font-mono text-xs border border-[#00f3ff]/50 shadow-[0_0_30px_rgba(0,243,255,0.2)]">

                {/* Background Grid */}
                <div className="terminal-grid opacity-20"></div>

                {/* Header */}
                <div className="flex justify-between items-center border-b border-[#00f3ff] pb-2 mb-2 z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#00f3ff] rounded-full animate-pulse shadow-[0_0_15px_#00f3ff]"></div>
                        <span className="font-bold tracking-widest text-white drop-shadow-[0_0_5px_#00f3ff]">MCP_MASTER_CONTROL</span>
                    </div>
                    <span className="text-[10px] text-[#00f3ff]/70">v.TRON.01</span>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col gap-4 z-10 overflow-hidden relative">

                    {/* 1. System Stats (Tron Colors: Blue/White/Orange) */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase text-[#00f3ff]/80">
                            <span>Processing</span>
                            <span className="text-white font-bold">89%</span>
                        </div>
                        <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden border border-[#00f3ff]/30">
                            <div className="h-full bg-[#00f3ff] w-[89%] shadow-[0_0_10px_#00f3ff]"></div>
                        </div>

                        <div className="flex justify-between text-[10px] uppercase text-[#00f3ff]/80">
                            <span>Memory</span>
                            <span className="text-orange-400 font-bold">TERA_FLOPS</span>
                        </div>
                        <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden border border-orange-400/30">
                            <div className="h-full bg-orange-400 w-[64%] shadow-[0_0_10px_orange]"></div>
                        </div>
                    </div>

                    {/* 2. Scrolling Code Block */}
                    <div className="flex-1 border border-[#00f3ff]/30 bg-[#00f3ff]/5 rounded p-2 terminal-code-container relative overflow-hidden">
                        <div className="absolute inset-x-2 animate-[code-scroll_10s_linear_infinite]">
                            {lines.map((line, i) => (
                                <div key={i} className="whitespace-nowrap opacity-80 mb-1 hover:opacity-100 hover:text-white transition-opacity text-[#00f3ff]">
                                    <span className="text-[#00f3ff]/50 mr-2">_</span>
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Active Task - NEW TEXT */}
                    <div className="bg-[#00f3ff]/10 border-l-2 border-[#00f3ff] p-2">
                        <div className="text-[10px] text-[#00f3ff]/70 mb-1">STATUS UPDATE</div>
                        <div className="text-white typing-cursor font-bold tracking-wider drop-shadow-[0_0_8px_#00f3ff]">
                            NEURAL_UPLINK_ACTIVE
                        </div>
                    </div>

                </div>

                {/* Reflection Shine */}
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent pointer-events-none"></div>

            </div>

            {/* Decorative Elements around screen */}
            <div className="absolute -left-4 top-10 w-0.5 h-32 bg-[#00f3ff] shadow-[0_0_10px_#00f3ff] opacity-80"></div>
            <div className="absolute -right-4 bottom-10 w-0.5 h-32 bg-orange-400 shadow-[0_0_10px_orange] opacity-80"></div>

        </div>
    );
};

export default CyberTerminal;
