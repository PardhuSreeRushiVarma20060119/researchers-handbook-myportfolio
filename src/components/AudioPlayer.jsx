import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Audio play error:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const neonColors = [
        '#ff1100', // Deep Red
        '#0044ff', // Royal Blue
        '#008800', // Forest Green
        '#ff6600', // Burnt Orange
        '#8800ff', // Deep Purple
        '#aa0000'  // Crimson
    ];

    return (
        <div style={{ marginBottom: '1.5rem', marginTop: 'auto', cursor: 'pointer' }} onClick={togglePlay}>
            <audio ref={audioRef} src="/music/strangerthings.mp3" loop />

            <div style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                boxShadow: 'none',
                height: '42px',
                overflow: 'hidden',
                padding: '0 0.8rem'
            }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
            >
                {/* SVG Flowing String Waves */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    opacity: isPlaying ? 0.7 : 0.1,
                    pointerEvents: 'none',
                    zIndex: 1,
                    transition: 'opacity 0.3s ease'
                }}>
                    <svg width="200%" height="100%" preserveAspectRatio="none" viewBox="0 0 200 40" style={{
                        animation: isPlaying ? 'flow-scroll 6s linear infinite' : 'none',
                        display: 'block'
                    }}>
                        {neonColors.map((color, i) => {
                            // Organic wavy paths with different amplitudes and phases
                            const amp = 4 + (i % 3) * 2;
                            const yBase = 20;
                            const d = `M 0 ${yBase} 
                                       C 25 ${yBase - amp}, 25 ${yBase + amp}, 50 ${yBase} 
                                       S 75 ${yBase - amp}, 100 ${yBase} 
                                       S 125 ${yBase + amp}, 150 ${yBase} 
                                       S 175 ${yBase - amp}, 200 ${yBase}`;

                            return (
                                <path
                                    key={i}
                                    d={d}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="0.8"
                                    opacity={0.6 - (i * 0.05)}
                                    style={{
                                        animation: isPlaying ? `string-vibrate ${0.4 + i * 0.1}s ease-in-out infinite` : 'none',
                                        filter: `drop-shadow(0 0 4px ${color})`
                                    }}
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* Minimal Play/Pause Icon */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    opacity: 0.9,
                    color: 'var(--text-main)',
                    zIndex: 2
                }}>
                    {isPlaying ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                        </svg>
                    ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </div>

                {/* Scrolling Text */}
                <div style={{ overflow: 'hidden', flexGrow: 1, maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', zIndex: 2 }}>
                    <div style={{
                        display: 'inline-block',
                        animation: isPlaying ? 'marquee 12s linear infinite' : 'none',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'rgba(255,255,255,0.9)',
                        whiteSpace: 'nowrap',
                        paddingLeft: isPlaying ? '100%' : '0',
                        letterSpacing: '0.5px',
                        textShadow: '0 0 8px rgba(0,0,0,1)'
                    }}>
                        Running Up That Hill (Epic Orchestra)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
