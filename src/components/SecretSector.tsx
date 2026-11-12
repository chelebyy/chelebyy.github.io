import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../constants/translations';

interface SecretSectorProps {
    lang: Language;
    unlocked: boolean;
    onUnlock: () => void;
}

/** Easter egg: the passcode hidden in the system log unlocks the yellow/red theme. */
const SecretSector: React.FC<SecretSectorProps> = ({ lang, unlocked, onUnlock }) => {
    const t = translations[lang];
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [denied, setDenied] = useState(false);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (input.trim() === '1905') {
            onUnlock();
            setOpen(false);
        } else {
            setDenied(true);
            setInput('');
            window.setTimeout(() => setDenied(false), 900);
        }
    };

    return (
        <section id="secret-section" className="scroll-mt-12 border-b border-border-dark px-6 py-6 font-mono text-xs md:px-10">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <span className="text-gray-600">{unlocked ? 'drwxr-xr-x' : 'drwx------'}</span>
                <span className="text-gray-600">root</span>
                {unlocked ? (
                    <span className="gs-secret text-sm">{t.secretName}</span>
                ) : (
                    <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} className="text-gray-500 hover:text-white">
                        {t.secretName}
                    </button>
                )}
                {!unlocked && !open && <span className="text-gray-600">{t.secretLocked}</span>}
            </div>

            {!unlocked && open && (
                <form onSubmit={submit} className={`mt-4 flex max-w-sm items-center gap-2 border-b pb-1 ${denied ? 'border-red-500' : 'border-primary'}`}>
                    <label htmlFor="secret-passcode" className={denied ? 'text-red-500' : 'text-primary-text'}>
                        {denied ? t.secretDenied : `${t.secretPrompt}:`}
                    </label>
                    <input
                        id="secret-passcode"
                        type="password"
                        inputMode="numeric"
                        autoFocus
                        maxLength={10}
                        value={input}
                        onChange={event => setInput(event.target.value)}
                        className="w-full bg-transparent tracking-[0.4em] text-white outline-none"
                    />
                    <span className="whitespace-nowrap text-[10px] text-gray-600">{t.secretHint}</span>
                </form>
            )}

            {unlocked && (
                <div className="mt-4 max-w-xl space-y-1 text-gray-400">
                    <p className="text-primary-text">{t.secretUnlocked}</p>
                    <p>{t.secretBody}</p>
                </div>
            )}
        </section>
    );
};

export default SecretSector;
