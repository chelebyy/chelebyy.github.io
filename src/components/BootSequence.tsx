import React, { useState, useEffect } from 'react';

interface BootSequenceProps {
    onComplete: () => void;
    playPhaseSound: (phase: 'bios' | 'auth' | 'access') => void;
    initAudio: () => void;
}

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete, playPhaseSound, initAudio }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [phase, setPhase] = useState<'start' | 'bios' | 'auth' | 'access' | 'drop'>('start');

    const handleStart = () => {
        initAudio(); // Explicitly wake up AudioContext on click
        setPhase('bios');
    };

    useEffect(() => {
        if (phase !== 'bios') return;

        // Phase 1: BIOS / POST
        const bootText = [
            "BIOS_MEM_CHECK: 64GB OK",
            "LOADING_KERNEL_V4.2... OK",
            "MOUNTING_VIRTUAL_FS... OK",
            "INIT_GRAPHICS_DRIVER... OK",
            "ESTABLISHING_SECURE_UPLINK... [CONNECTED]"
        ];

        // Play initial sound - NOW triggered by user click
        playPhaseSound('bios');

        let lineIndex = 0;
        const printInterval = setInterval(() => {
            setLines(prev => {
                const newLines = [...prev, bootText[lineIndex]];
                return newLines.slice(-7);
            });

            lineIndex++;

            if (lineIndex === bootText.length) {
                clearInterval(printInterval);
                setTimeout(() => setPhase('auth'), 600);
            }
        }, 400);

        return () => clearInterval(printInterval);
    }, [phase, playPhaseSound]);

    useEffect(() => {
        if (phase === 'auth') {
            playPhaseSound('auth');
            // Phase 2: Authentication
            const timer = setTimeout(() => {
                setPhase('access');
            }, 2500);
            return () => clearTimeout(timer);
        }

        if (phase === 'access') {
            playPhaseSound('access');
            // Phase 3: Access Granted -> The Drop
            const timer = setTimeout(() => {
                setPhase('drop');
                setTimeout(onComplete, 300); // Sync with CSS ping animation
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [phase, onComplete, playPhaseSound]);


    return (
        <div className={`fixed inset-0 z-[9999] bg-black text-green-500 font-mono flex flex-col items-center justify-center transition-all duration-300 ${phase === 'drop' ? 'opacity-0 scale-110' : 'opacity-100'}`}>

            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#0f0 1px, transparent 1px), linear-gradient(90deg, #0f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="max-w-xl w-full p-6 relative z-10">

                {/* Phase 0: Start Screen */}
                {phase === 'start' && (
                    <div className="text-center">
                        <div className="text-xs text-green-700 mb-4 tracking-widest uppercase">// System Ready</div>
                        <button
                            onClick={handleStart}
                            className="px-8 py-4 border border-green-500/50 bg-green-500/10 text-green-500 font-mono tracking-widest uppercase hover:bg-green-500/20 hover:border-green-500 transition-all duration-300 animate-pulse cursor-pointer"
                        >
                            [ INITIALIZE SYSTEM ]
                        </button>
                        <div className="text-[10px] text-green-900 mt-4">Click to begin boot sequence</div>
                    </div>
                )}

                {/* Phase 1: BIOS Lines */}
                {phase === 'bios' && (
                    <div className="space-y-1 font-mono text-left w-full">
                        {lines.map((line, i) => (
                            <div key={i} className="text-sm md:text-base opacity-80">
                                <span className="mr-2 text-green-700">{`>`}</span>
                                {line}
                            </div>
                        ))}
                        <div className="animate-pulse mt-2 ml-4">_</div>
                    </div>
                )}

                {/* Phase 2: Authentication */}
                {phase === 'auth' && (
                    <div className="text-center w-full">
                        <div className="text-xl md:text-2xl mb-8 animate-pulse font-bold tracking-widest">AUTHENTICATING_USER...</div>
                        <div className="h-1 w-64 bg-gray-900 mx-auto rounded overflow-hidden relative border border-green-900/30">
                            <div className="absolute inset-0 bg-green-500 animate-[loading_2s_ease-in-out]"></div>
                        </div>
                        <p className="text-[10px] text-green-600/70 mt-4 tracking-[0.2em] animate-pulse">VERIFYING_BIOMETRICS_HASH</p>
                    </div>
                )}

                {/* Phase 3: Access Granted */}
                {phase === 'access' && (
                    <div className="text-center relative w-full">
                        <div className="absolute inset-0 bg-green-500/10 blur-2xl animate-pulse"></div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter relative z-10 glitch-text" data-text="ACCESS GRANTED">
                            ACCESS GRANTED
                        </h1>
                        <p className="text-green-400 mt-6 tracking-[0.5em] text-xs uppercase animate-bounce">Welcome Back Admin</p>
                    </div>
                )}
            </div>

            {/* The Drop: CRT Flash */}
            {phase === 'drop' && (
                <div className="absolute inset-0 bg-white animate-[ping_0.1s_ease-out]"></div>
            )}
        </div>
    );
};

export default BootSequence;
