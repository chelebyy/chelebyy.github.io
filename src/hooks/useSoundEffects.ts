import { useRef, useCallback } from 'react';

export const useSoundEffects = () => {
    const audioContextRef = useRef<AudioContext | null>(null);

    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (AudioContextClass) {
                audioContextRef.current = new AudioContext();
            }
        }
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume().catch(() => { /* ignore */ });
        }
    }, []);

    const playHoverSound = useCallback(() => {
        initAudio();
        if (!audioContextRef.current) return;

        try {
            const osc = audioContextRef.current.createOscillator();
            const gainNode = audioContextRef.current.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, audioContextRef.current.currentTime + 0.15);

            gainNode.gain.setValueAtTime(0.05, audioContextRef.current.currentTime); // Reduced volume
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.15);

            osc.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);

            osc.start();
            osc.stop(audioContextRef.current.currentTime + 0.15);
        } catch { /* ignore */ }
    }, [initAudio]);

    const playLogOpenSound = useCallback(() => {
        initAudio();
        if (!audioContextRef.current) return;

        try {
            const t = audioContextRef.current.currentTime;
            const osc = audioContextRef.current.createOscillator();
            const gainNode = audioContextRef.current.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(1200, t);
            osc.frequency.setValueAtTime(1800, t + 0.05);
            osc.frequency.setValueAtTime(800, t + 0.1);

            gainNode.gain.setValueAtTime(0.05, t);
            gainNode.gain.linearRampToValueAtTime(0.05, t + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

            osc.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);

            osc.start();
            osc.stop(t + 0.2);
        } catch { /* ignore */ }
    }, [initAudio]);

    const playLogWriteSound = useCallback(() => {
        initAudio();
        if (!audioContextRef.current) return;

        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(() => { });
        }

        const t = audioContextRef.current.currentTime;
        const osc = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);

        gainNode.gain.setValueAtTime(0.02, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        osc.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        osc.start(t);
        osc.stop(t + 0.05);
    }, [initAudio]);

    const playBootPhaseSound = useCallback((phase: 'bios' | 'auth' | 'access') => {
        initAudio();
        if (!audioContextRef.current) return;
        const t = audioContextRef.current.currentTime;

        if (phase === 'bios') {
            // Computing / Hard Drive noise
            const osc = audioContextRef.current.createOscillator();
            const gain = audioContextRef.current.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(50, t);
            osc.frequency.linearRampToValueAtTime(60, t + 0.1);
            osc.frequency.setValueAtTime(50, t + 0.2);

            gain.gain.setValueAtTime(0.02, t);
            gain.gain.linearRampToValueAtTime(0, t + 0.3);

            osc.connect(gain);
            gain.connect(audioContextRef.current.destination);
            osc.start(t);
            osc.stop(t + 0.3);
        } else if (phase === 'auth') {
            // Biometric Scan hum
            const osc = audioContextRef.current.createOscillator();
            const gain = audioContextRef.current.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, t);
            osc.frequency.exponentialRampToValueAtTime(800, t + 1);

            gain.gain.setValueAtTime(0.05, t);
            gain.gain.linearRampToValueAtTime(0, t + 1);

            osc.connect(gain);
            gain.connect(audioContextRef.current.destination);
            osc.start(t);
            osc.stop(t + 1);
        } else if (phase === 'access') {
            // Success Chime (Cyberpunk Chord)
            [440, 554, 659, 880].forEach((freq, i) => {
                const osc = audioContextRef.current!.createOscillator();
                const gain = audioContextRef.current!.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, t);

                gain.gain.setValueAtTime(0, t + (i * 0.05));
                gain.gain.linearRampToValueAtTime(0.1, t + (i * 0.05) + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8 + (i * 0.05));

                osc.connect(gain);
                gain.connect(audioContextRef.current!.destination);
                osc.start(t + (i * 0.05));
                osc.stop(t + 1.5);
            });
        }
    }, [initAudio]);

    const playCompletionSound = useCallback(() => {
        initAudio();
        if (!audioContextRef.current) return;
        const t = audioContextRef.current.currentTime;

        // Short rising "bleep-bloop" completion sound
        const frequencies = [600, 800, 1000];
        frequencies.forEach((freq, i) => {
            const osc = audioContextRef.current!.createOscillator();
            const gain = audioContextRef.current!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + (i * 0.08));

            gain.gain.setValueAtTime(0, t + (i * 0.08));
            gain.gain.linearRampToValueAtTime(0.08, t + (i * 0.08) + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + (i * 0.08) + 0.12);

            osc.connect(gain);
            gain.connect(audioContextRef.current!.destination);
            osc.start(t + (i * 0.08));
            osc.stop(t + (i * 0.08) + 0.15);
        });
    }, [initAudio]);

    return { playHoverSound, playLogOpenSound, playLogWriteSound, playBootPhaseSound, playCompletionSound, initAudio };
};
