import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { useSoundEffects } from '../hooks/useSoundEffects';

const LogTerminal = ({ isOpen, onClose, lang }: { isOpen: boolean, onClose: () => void, lang: Language }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { playLogWriteSound } = useSoundEffects();

    useEffect(() => {
        if (!isOpen) {
            // eslint-disable-next-line
            setLogs([]);
            return;
        }

        const possibleLogs = {
            en: [
                "> SYSTEM_CHECK_INTEGRITY... OK",
                "> CONNECTING_TO_SATELLITE_UPLINK... SUCCESS",
                "> DECRYPTING_USER_DATA... [###########] 100%",
                "> WARNING: HIGH_MEMORY_USAGE_DETECTED",
                "> OPTIMIZING_RENDER_CYCLE... DONE",
                "> FETCHING_LATEST_ARTIFACTS... [CACHED]",
                "> USER_ID: VERIFIED // ACCESS_LEVEL: ARCHITECT",
                "> QUANTUM_TUNNELING_ESTABLISHED",
                "> MONITORING_NETWORK_TRAFFIC... STABLE",
                "> ANALYZING_USER_BEHAVIOR... [PRIVACY_MODE]",
                "> DEPLOYING_NANOBOTS_TO_DOM...",
                "> 0 Errors, 0 Warnings found.",
                "> EXECUTING_ORDER_66... [SKIPPING]",
                "> SEARCHING_FOR_MEANING_OF_LIFE... <span class='gs-secret'>1905</span>",
                "> UPLOADING_CONSCIOUSNESS... [|||.......] 23%",
                "> ERROR: COFFEE_LEVEL_CRITICAL",
                "> BYPASSING_FIREWALL... ACCESS_GRANTED",
                "> INITIATING_HYPER_DRIVE...",
                "> DETECTED_ANOMALY_IN_SECTOR_7G",
                "> RECALIBRATING_FLUX_CAPACITOR...",
                "> DOWNLOADING_INTERNET... PLEASE_WAIT",
                "> SYSTEM_UPDATE_REQUIRED [IGNORE]",
                "> ENCRYPTING_COMMUNICATION_CHANNEL...",
                "> SCANNING_FOR_VULNERABILITIES... NONE",
                "> REROUTING_POWER_TO_SHIELDS...",
                "> LOADING_TEXTURES... [HIGH_RES]",
                "> PING_REMOTE_SERVER: 2ms",
                "> ALLOCATING_VIRTUAL_MEMORY...",
                "> GARBAGE_COLLECTION_STARTED...",
                "> SYNCHRONIZING_CLOCKS... [NTP]",
                "> CHECKING_DISK_SPACE... 99TB FREE",
                "> MOUNTING_EXTERNAL_DRIVE: /DEV/SDA1",
                "> KERNEL_PANIC_PREVENTED",
                "> AI_CORE_ONLINE",
                "> ESTABLISHING_NEURAL_LINK...",
                "> COMPILING_SOURCE_CODE...",
                "> PACKET_LOSS_DETECTED: 0.0001%",
                "> TRACING_RAY_PATHS...",
                "> GENERATING_PROCEDURAL_TERRAIN...",
                "> LOADING_DAEMON_PROCESSES...",
                "> VERIFYING_CHECKSUMS... MATCH",
                "> PROTOCOL_OMEGA_ACTIVATED",
                "> SEARCHING_FOR_MEANING_OF_LIFE... <span class='gs-secret'>1905</span>",
                "> GALATASARAY_PROTOCOL_INITIALIZED... <span class='gs-secret'>1905</span>",
                "> SECRET_KEY_FOUND... <span class='gs-secret'>1905</span>"
            ],
            tr: [
                "> SISTEM_BUTUNLUK_KONTROLU... TAMAM",
                "> UYDU_BAGLANTISI_KURULUYOR... BASARILI",
                "> KULLANICI_VERISI_COZULUYOR... [###########] 100%",
                "> UYARI: YUKSEK_BELLEK_KULLANIMI_TESPIT_EDILDI",
                "> RENDER_DONGUSU_OPTIMIZE_EDILIYOR... TAMAMLANDI",
                "> SON_ESERLER_GETIRILIYOR... [ONBELLEK]",
                "> KULLANICI_KIMLIGI: DOGRULANDI // SEVIYE: MIMAR",
                "> KUANTUM_TUNELLEME_KURULUYOR...",
                "> AG_TRAFIGI_IZLENIYOR... STABIL",
                "> KULLANICI_DAVRANISI_ANALIZ_EDILIYOR... [GIZLI_MOD]",
                "> DOM_NANOBOTLARI_DAGITILIYOR...",
                "> 0 Hata, 0 Uyari bulundu.",
                "> EMIR_66_UYGULANIYOR... [ATLANIYOR]",
                "> HAYATIN_ANLAMI_ARANIYOR... <span class='gs-secret'>1905</span>",
                "> BILINC_YUKLENIYOR... [|||.......] %23",
                "> HATA: KAHVE_SEVIYESI_KRITIK",
                "> GUVENLIK_DUVARI_ASILIYOR... ERISIM_VERILDI",
                "> HIPER_SURUCU_BASLATILIYOR...",
                "> SECTOR_7G_BOLGESINDE_ANOMALI_TESPIT_EDILDI",
                "> AKIS_KAPASITORU_KALIBRE_EDILIYOR...",
                "> INTERNET_INDIRILIYOR... LUTFEN_BEKLEYIN",
                "> SISTEM_GUNCELLEMESI_GEREKLI [GORMEZDEN_GEL]",
                "> ILETISIM_KANALI_SIFRELENIYOR...",
                "> ZAFIYET_TARAMASI... TEMIZ",
                "> KALKANLARA_GUC_AKTARILIYOR...",
                "> DOKULAR_YUKLENIYOR... [YUKSEK_COZ]",
                "> SUNUCU_PING: 2ms",
                "> SANAL_BELLEK_AYRILIYOR...",
                "> COP_TOPLAYICI_BASLATILDI...",
                "> SAATLER_ESITLENIYOR... [NTP]",
                "> DISK_ALANI_KONTROLU... 99TB BOS",
                "> HARICI_SURUCU_BAGLANDI: /DEV/SDA1",
                "> CEKIRDEK_PANIGI_ONLENDI",
                "> YAPAY_ZEKA_CEKIRDEGI_CEVRIMICI",
                "> NORAL_BAGLANTI_KURULUYOR...",
                "> KAYNAK_KOD_DERLENIYOR...",
                "> PAKET_KAYBI_TESPIT_EDILDI: %0.0001",
                "> ISIN_IZLEME_YOLLARI_HESAPLANIYOR...",
                "> YORDAMSAL_ARAZI_OLUSTURULUYOR...",
                "> IBLIS_SURECLERI_YUKLENIYOR...",
                "> DOGRULAMA_TOPLAMLARI... ESLESTI",
                "> PROTOKOL_OMEGA_AKTIF",
                "> HAYATIN_ANLAMI_ARANIYOR... <span class='gs-secret'>1905</span>",
                "> GALATASARAY_PROTOKOLU_BASLATILDI... <span class='gs-secret'>1905</span>",
                "> GIZLI_ANAHTAR_BULUNDU... <span class='gs-secret'>1905</span>"
            ]
        };

        /* Hook moved to top level */

        const interval = setInterval(() => {
            playLogWriteSound();
            const randomLog = possibleLogs[lang][Math.floor(Math.random() * possibleLogs[lang].length)];
            const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
            setLogs(prev => [...prev.slice(-100), `[${timestamp}] ${randomLog}`]);
        }, 800);

        return () => clearInterval(interval);
    }, [isOpen, lang, playLogWriteSound]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 z-[40] backdrop-blur-sm" onClick={onClose}></div>
            )}

            {/* Sidebar Panel */}
            <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-[#0c0c0e] border-l border-primary/30 z-[50] transform transition-transform duration-300 ease-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full font-mono text-xs">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-border-dark bg-black/40">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-white font-bold">SYSTEM_LOGS</span>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors cursor-none">
                            [X]
                        </button>
                    </div>

                    {/* Logs Output */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 text-green-500/80 font-mono">
                        {logs.map((log, i) => (
                            <div key={i} className="border-l-2 border-green-900/30 pl-2 hover:border-green-500 transition-colors" dangerouslySetInnerHTML={{ __html: log }}>
                            </div>
                        ))}
                        <div className="animate-pulse">_</div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-border-dark text-gray-600 text-[10px] uppercase">
                        Use 'ESC' to close terminal uplink
                    </div>
                </div>
            </div>
        </>
    );
};

export default LogTerminal;
