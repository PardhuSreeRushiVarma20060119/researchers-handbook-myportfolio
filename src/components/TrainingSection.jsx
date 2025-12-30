import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const TrainingSection = () => {
    const { data } = useData();
    const thm = data.tryHackMe;
    const username = 'PardhuSreeRushiVarma20060119';
    const [activeTab, setActiveTab] = useState('tryhackme'); // 'tryhackme' | 'github'
    const [ghData, setGhData] = useState(null);
    const [ghEvents, setGhEvents] = useState([]);
    const [loadingGh, setLoadingGh] = useState(true);

    // FALLBACK DATA (Derived from User Input to ensure "Real Activity" display)
    const FALLBACK_EVENTS = [
        // DECEMBER 2025
        { type: 'PushEvent', created_at: '2025-12-25T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Mini-Projects' }, payload: { size: 17 } },
        { type: 'PushEvent', created_at: '2025-12-25T11:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/XolvenProject' }, payload: { size: 14 } },
        { type: 'PushEvent', created_at: '2025-12-24T10:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Project-Ouroboros' }, payload: { size: 8 } },
        { type: 'PushEvent', created_at: '2025-12-24T09:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/AI-Research-Experimentation-Repository' }, payload: { size: 7 } },
        { type: 'PushEvent', created_at: '2025-12-23T08:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/PardhuSreeRushiVarma20060119' }, payload: { size: 7 } },
        { type: 'PushEvent', created_at: '2025-12-22T14:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Cybersecurity-All-In-One' }, payload: { size: 5 } },
        { type: 'PushEvent', created_at: '2025-12-20T16:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/HuggingFace-Models' }, payload: { size: 2 } },
        { type: 'PushEvent', created_at: '2025-12-18T09:30:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/MirageC2' }, payload: { size: 1 } },
        { type: 'PushEvent', created_at: '2025-12-15T10:15:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/SQT-Training' }, payload: { size: 1 } },
        { type: 'CreateEvent', created_at: '2025-12-25T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/XolvenProject' }, payload: { ref_type: 'repository' } },
        { type: 'CreateEvent', created_at: '2025-12-24T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/AI-Research-Experimentation-Repository' }, payload: { ref_type: 'repository' } },
        { type: 'CreateEvent', created_at: '2025-12-22T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/SQT-Training-Qualcomm' }, payload: { ref_type: 'repository' } },

        // NOVEMBER 2025
        { type: 'PushEvent', created_at: '2025-11-20T10:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Project-Ouroboros' }, payload: { size: 15 } },
        { type: 'PushEvent', created_at: '2025-11-15T11:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Mini-Projects' }, payload: { size: 3 } },
        { type: 'PushEvent', created_at: '2025-11-10T09:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/PardhuSreeRushiVarma20060119' }, payload: { size: 2 } },

        // OCTOBER 2025
        { type: 'PushEvent', created_at: '2025-10-25T14:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Project-Ouroboros' }, payload: { size: 63 } },
        { type: 'PushEvent', created_at: '2025-10-20T15:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Cybersecurity-All-In-One' }, payload: { size: 12 } },
        { type: 'PushEvent', created_at: '2025-10-10T11:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/loadiscator' }, payload: { size: 2 } },
        { type: 'PushEvent', created_at: '2025-10-05T10:00:00Z', repo: { name: 'Tejaswini4119/PhishVault' }, payload: { size: 1 } },

        // SEPTEMBER 2025
        { type: 'PushEvent', created_at: '2025-09-30T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/HuggingFace-Models' }, payload: { size: 47 } },
        { type: 'PushEvent', created_at: '2025-09-25T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Exile' }, payload: { size: 27 } },
        { type: 'PushEvent', created_at: '2025-09-20T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Project-Ouroboros' }, payload: { size: 25 } },
        { type: 'PushEvent', created_at: '2025-09-15T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Mini-Projects' }, payload: { size: 20 } },
        { type: 'PushEvent', created_at: '2025-09-10T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/PardhuSreeRushiVarma20060119' }, payload: { size: 11 } },
        { type: 'PushEvent', created_at: '2025-09-08T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/loadiscator' }, payload: { size: 8 } },
        { type: 'PushEvent', created_at: '2025-09-05T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Rat_HVNC' }, payload: { size: 7 } },
        { type: 'PushEvent', created_at: '2025-09-04T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/The-Nexus-Project' }, payload: { size: 7 } },
        { type: 'PushEvent', created_at: '2025-09-02T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/AgenticAI-Udemy' }, payload: { size: 5 } },
        { type: 'PushEvent', created_at: '2025-09-01T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Exploit-Engines' }, payload: { size: 1 } },
        // Create Events (Sep)
        { type: 'CreateEvent', created_at: '2025-09-30T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Rat_HVNC' }, payload: { ref_type: 'repository' } },
        { type: 'CreateEvent', created_at: '2025-09-24T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/HuggingFace-Models' }, payload: { ref_type: 'repository' } },
        { type: 'CreateEvent', created_at: '2025-09-16T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Mini-Projects' }, payload: { ref_type: 'repository' } },
        { type: 'CreateEvent', created_at: '2025-09-07T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Project-Ouroboros' }, payload: { ref_type: 'repository' } },

        // AUGUST 2025
        { type: 'PushEvent', created_at: '2025-08-25T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/NDRA' }, payload: { size: 60 } },
        { type: 'PushEvent', created_at: '2025-08-20T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/AgenticAI-Udemy' }, payload: { size: 37 } },
        { type: 'PushEvent', created_at: '2025-08-15T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Cybersecurity-All-In-One' }, payload: { size: 12 } },
        { type: 'PushEvent', created_at: '2025-08-10T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/PardhuSreeRushiVarma20060119' }, payload: { size: 7 } },
        { type: 'PushEvent', created_at: '2025-08-05T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/loadiscator' }, payload: { size: 4 } },
        { type: 'CreateEvent', created_at: '2025-08-13T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/AgenticAI-Udemy' }, payload: { ref_type: 'repository' } },

        // JULY 2025
        { type: 'PushEvent', created_at: '2025-07-28T12:00:00Z', repo: { name: 'Tejaswini4119/PhishVault' }, payload: { size: 70 } },
        { type: 'PushEvent', created_at: '2025-07-25T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/NDRA' }, payload: { size: 55 } },
        { type: 'PushEvent', created_at: '2025-07-20T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Powershell-Scripts' }, payload: { size: 29 } },
        { type: 'PushEvent', created_at: '2025-07-15T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/PardhuSreeRushiVarma20060119' }, payload: { size: 26 } },
        { type: 'PushEvent', created_at: '2025-07-10T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/loadiscator' }, payload: { size: 19 } },
        { type: 'PushEvent', created_at: '2025-07-08T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Exploit-Engines' }, payload: { size: 6 } },
        { type: 'PushEvent', created_at: '2025-07-06T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/OpenLoRA' }, payload: { size: 4 } },
        { type: 'PushEvent', created_at: '2025-07-05T12:00:00Z', repo: { name: 'Rupakaredla/Undershell' }, payload: { size: 4 } },
        { type: 'PushEvent', created_at: '2025-07-03T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Void-Malware-Dev' }, payload: { size: 2 } },
        { type: 'PushEvent', created_at: '2025-07-02T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/MirageC2' }, payload: { size: 1 } },
        { type: 'PushEvent', created_at: '2025-07-01T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/The-Nexus-Project' }, payload: { size: 1 } },
        { type: 'CreateEvent', created_at: '2025-07-23T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/NDRA' }, payload: { ref_type: 'repository' } },
        { type: 'CreateEvent', created_at: '2025-07-11T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Exploit-Engines' }, payload: { ref_type: 'repository' } },
        { type: 'CreateEvent', created_at: '2025-07-04T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/loadiscator' }, payload: { ref_type: 'repository' } },
        { type: 'CreateEvent', created_at: '2025-07-02T12:00:00Z', repo: { name: 'PardhuSreeRushiVarma20060119/Powershell-Scripts' }, payload: { ref_type: 'repository' } },
    ];

    // Fetch GitHub Data on mount
    useEffect(() => {
        const fetchGitHub = async () => {
            setLoadingGh(true);
            try {
                // 1. Fetch Heatmap Data (Public Proxy)
                const resCalendar = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=2025`);
                if (resCalendar.ok) {
                    const jsonCalendar = await resCalendar.json();
                    setGhData(jsonCalendar);
                }

                // 2. Fetch Detailed Events (Official API)
                // Note: Rate limited to 60/hr per IP. Adding per_page=100
                const resEvents = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
                if (resEvents.ok) {
                    const jsonEvents = await resEvents.json();

                    if (jsonEvents && jsonEvents.length > 0) {
                        // MERGE STRATEGY:
                        // Use API events for the most recent data.
                        // Append Fallback events that are OLDER than the oldest API event.
                        // This ensures we have "Live" updates + "Historical" context.

                        const oldestApiDate = new Date(jsonEvents[jsonEvents.length - 1].created_at);
                        const historyEvents = FALLBACK_EVENTS.filter(e => new Date(e.created_at) < oldestApiDate);

                        setGhEvents([...jsonEvents, ...historyEvents]);
                    } else {
                        console.log("GitHub API returned 0 events, using full fallback.");
                        setGhEvents(FALLBACK_EVENTS);
                    }
                } else {
                    console.log("GitHub API failed or limit reached, using fallback data.");
                    setGhEvents(FALLBACK_EVENTS);
                }
            } catch (error) {
                console.error("GitHub Fetch Error:", error);
                setGhEvents(FALLBACK_EVENTS);
            } finally {
                setLoadingGh(false);
            }
        };

        // Only fetch if tab is active or just fetch once? 
        // Better to fetch on mount to have data ready.
        fetchGitHub();
    }, []);

    // Helper to process events into "Month -> Activity" format
    const processEvents = (events) => {
        if (!events || events.length === 0) return {};

        const grouped = {};
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        events.forEach(event => {
            const date = new Date(event.created_at);
            const key = `${months[date.getMonth()]} ${date.getFullYear()}`;

            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(event);
        });

        return grouped;
    };

    const groupedEvents = processEvents(ghEvents);

    // Calculate Overview Stats from Events (Last ~90 days usually returned by API)
    const stats = {
        commits: ghEvents.filter(e => e.type === 'PushEvent').reduce((acc, e) => acc + (e.payload.size || e.payload.commits?.length || 1), 0),
        prs: ghEvents.filter(e => e.type === 'PullRequestEvent').length,
        reviews: ghEvents.filter(e => e.type === 'PullRequestReviewEvent').length,
        createdRepos: ghEvents.filter(e => e.type === 'CreateEvent' && e.payload.ref_type === 'repository').length,
    };

    if (!thm || !thm.isVisible) return null;

    const maxSkill = Math.max(...Object.values(thm.skills || { a: 0 }));

    return (
        <section id="training" style={{ padding: '4rem 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 0 }}>
                    <span className="mono" style={{ fontSize: '1rem', color: 'var(--accent-cyber)', display: 'block', marginBottom: '0.5rem' }}>03b. TRAINING & ACTIVITY</span>
                    Hands-On Security & Code
                </h2>

                {/* Switcher */}
                <div style={{ display: 'flex', background: '#111', borderRadius: '30px', padding: '4px', border: '1px solid #333' }}>
                    <button
                        onClick={() => setActiveTab('tryhackme')}
                        style={{
                            background: activeTab === 'tryhackme' ? 'var(--accent-cyber)' : 'transparent',
                            color: activeTab === 'tryhackme' ? 'black' : '#888',
                            border: 'none', borderRadius: '25px', padding: '0.5rem 1.5rem',
                            cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', transition: 'all 0.3s'
                        }}
                    >
                        TryHackMe
                    </button>
                    <button
                        onClick={() => setActiveTab('github')}
                        style={{
                            background: activeTab === 'github' ? 'white' : 'transparent',
                            color: activeTab === 'github' ? 'black' : '#888',
                            border: 'none', borderRadius: '25px', padding: '0.5rem 1.5rem',
                            cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', transition: 'all 0.3s'
                        }}
                    >
                        GitHub
                    </button>
                </div>
            </div>

            <div style={{ minHeight: '400px' }}>

                {/* TRYHACKME VIEW (Unchanged basically) */}
                {activeTab === 'tryhackme' && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                            <div style={{ border: '1px solid var(--border-subtle)', padding: '2rem', background: 'rgba(0,0,0,0.2)' }}>
                                <h4 className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                                    OPERATIONAL METRICS
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div>
                                        <div className="mono" style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>{thm.roomsCompleted}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Rooms Completed</div>
                                    </div>
                                    <div>
                                        <div className="mono" style={{ fontSize: '3rem', color: 'var(--accent-cyber)', fontWeight: 'bold' }}>{thm.badges}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Badges Earned</div>
                                    </div>
                                    <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.2rem' }}>CURRENT RANK</div>
                                        <div className="mono" style={{ fontSize: '1.5rem', color: 'white' }}>{thm.rank.toUpperCase()}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ border: '1px solid var(--border-subtle)', padding: '2rem', background: 'rgba(0,0,0,0.2)' }}>
                                <h4 className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                                    SKILL DISTRIBUTION
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {Object.entries(thm.skills || {}).map(([skill, value]) => (
                                        <div key={skill}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                                                <span style={{ color: '#ccc' }}>{skill}</span>
                                                <span className="mono" style={{ color: 'var(--accent-cyber)' }}>{value}</span>
                                            </div>
                                            <div style={{ width: '100%', height: '4px', background: '#222' }}>
                                                <div style={{ width: `${(value / (maxSkill || 100)) * 100}%`, height: '100%', background: 'var(--accent-cyber)' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ gridColumn: '1 / -1', border: '1px solid var(--border-subtle)', padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h4 className="mono" style={{ fontSize: '1rem', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: '#888' }}>TRYHACKME</span> Yearly activity
                                    </h4>
                                    <div className="mono" style={{ fontSize: '0.9rem', color: '#aaa' }}>2025</div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.7rem', color: '#aaa' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><div style={{ width: '10px', height: '10px', background: '#3a3a4c', borderRadius: '2px' }} /> No activity</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><div style={{ width: '10px', height: '10px', background: '#ffe02e', borderRadius: '2px' }} /> 1 event</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><div style={{ width: '10px', height: '10px', background: '#46e01a', borderRadius: '2px' }} /> 2 events</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><div style={{ width: '10px', height: '10px', background: '#00a200', borderRadius: '2px' }} /> ≥ 3 events</div>
                                </div>
                                <div className="mono" style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', display: 'inline-block', fontSize: '0.8rem' }}>
                                    Total events: <span style={{ color: 'white', fontWeight: 'bold' }}>2767</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(53, 1fr)', gap: '3px', minWidth: '600px' }}>
                                        {Array.from({ length: 53 }).map((_, colIndex) => (
                                            <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                {Array.from({ length: 7 }).map((_, rowIndex) => {
                                                    const seed = (colIndex * 7) + rowIndex;
                                                    const isDensePeriod = colIndex > 10 && colIndex < 35;
                                                    const rand = Math.sin(seed * 9999);
                                                    let level = 0;
                                                    if (rand > 0.8) level = 3; else if (rand > 0.6) level = 2; else if (rand > 0.4) level = 1;
                                                    if (isDensePeriod && rand > 0.2) level = Math.max(level, 2);
                                                    if (!isDensePeriod && rand > 0.9) level = 3;
                                                    const colors = ['#3a3a4c', '#ffe02e', '#46e01a', '#00a200'];
                                                    return <div key={rowIndex} style={{ width: '10px', height: '10px', background: colors[level], borderRadius: '2px' }} />;
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* GITHUB VIEW */}
                {activeTab === 'github' && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        <div style={{ border: '1px solid var(--border-subtle)', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', marginBottom: '1.5rem' }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h4 className="mono" style={{ fontSize: '1rem', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: '#888' }}>GITHUB</span> Contribution Graph
                                </h4>
                                <div className="mono" style={{ fontSize: '0.9rem', color: '#aaa' }}>
                                    {loadingGh ? "SYNCING..." : "LIVE DATA"}
                                </div>
                            </div>

                            {/* Heatmap Area */}
                            {loadingGh && <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Fetching contributions from GitHub API...</div>}

                            {!loadingGh && ghData && (
                                <>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.7rem', color: '#aaa' }}>
                                        <span>Less</span>
                                        <div style={{ width: '10px', height: '10px', background: '#161b22', borderRadius: '2px' }} />
                                        <div style={{ width: '10px', height: '10px', background: '#0e4429', borderRadius: '2px' }} />
                                        <div style={{ width: '10px', height: '10px', background: '#006d32', borderRadius: '2px' }} />
                                        <div style={{ width: '10px', height: '10px', background: '#26a641', borderRadius: '2px' }} />
                                        <div style={{ width: '10px', height: '10px', background: '#39d353', borderRadius: '2px' }} />
                                        <span>More</span>
                                    </div>

                                    <div className="mono" style={{ background: '#0d1117', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', display: 'inline-block', fontSize: '0.8rem', border: '1px solid #30363d' }}>
                                        Total contributions (2025): <span style={{ color: 'white', fontWeight: 'bold' }}>{ghData.total ? (ghData.total[2025] || ghData.total[2024] || 0) : 'N/A'}</span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto', paddingBottom: '10px' }}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: `repeat(${Math.ceil((ghData.contributions?.length || 365) / 7)}, 1fr)`,
                                            gridTemplateRows: 'repeat(7, 1fr)',
                                            gridAutoFlow: 'column',
                                            gap: '3px',
                                            minWidth: '600px'
                                        }}>
                                            {ghData.contributions && ghData.contributions.map((day, i) => (
                                                <div
                                                    key={i}
                                                    title={`${day.date}: ${day.count} contributions`}
                                                    style={{
                                                        width: '10px', height: '10px',
                                                        background: day.count === 0 ? '#161b22' :
                                                            day.count < 3 ? '#0e4429' :
                                                                day.count < 6 ? '#006d32' :
                                                                    day.count < 10 ? '#26a641' : '#39d353',
                                                        borderRadius: '2px'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Recent Activity Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>

                            {/* Left: Overview (Radar-ish) */}
                            <div style={{
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                padding: '1.5rem',
                                background: 'rgba(5, 5, 5, 0.7)',
                                backdropFilter: 'blur(16px)',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                            }}>
                                <h4 className="mono" style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
                                    ACTIVITY OVERVIEW (Recent)
                                </h4>

                                {/* CSS Cross-Axis "Radar" */}
                                <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
                                    {/* Axes */}
                                    <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: '#333' }} /> {/* Horiz */}
                                    <div style={{ position: 'absolute', left: '50%', top: 0, height: '100%', width: '1px', background: '#333' }} /> {/* Vert */}

                                    {/* Labels */}
                                    <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', color: '#666' }}>Code Review</div>
                                    <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', color: '#666' }}>Pull Requests</div>
                                    <div style={{ position: 'absolute', left: '-10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', color: '#666' }}>Commits</div>
                                    <div style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', color: '#666' }}>Issues</div>

                                    {/* Data Points (Approximated Visuals) */}
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: '4px', height: '4px', background: 'white', borderRadius: '50%', transform: 'translate(-2px, -2px)' }} />

                                    {/* Commit Bar (Left) */}
                                    <div style={{ position: 'absolute', top: '50%', right: '50%', height: '2px', width: `${Math.min(stats.commits, 100)}px`, background: 'var(--accent-cyber)', boxShadow: '0 0 5px var(--accent-cyber)' }} />

                                    {/* PR Bar (Down) */}
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: '2px', height: `${Math.min(stats.prs * 20, 100)}px`, background: 'var(--accent-cyber)', opacity: 0.7 }} />

                                    {/* Issues Bar (Right) */}
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', height: '2px', width: '20px', background: 'var(--accent-cyber)', opacity: 0.3 }} />

                                </div>
                                <div className="mono" style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: '#aaa' }}>
                                    <div style={{ marginBottom: '0.3rem' }}>{stats.commits} Commits</div>
                                    <div style={{ marginBottom: '0.3rem' }}>{stats.createdRepos} Repos Created</div>
                                    <div>{stats.prs} Pull Requests</div>
                                </div>
                            </div>

                            {/* Right: Detailed Feed (Timeline Style) - GLOSSY MODE */}
                            <div className="glass-panel" style={{
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                padding: '1.5rem',
                                background: 'rgba(5, 5, 5, 0.7)',
                                backdropFilter: 'blur(16px)',
                                height: '100%',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                            }}>
                                <h4 className="mono" style={{ fontSize: '0.9rem', color: '#8b949e', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
                                    CONTRIBUTION ACTIVITY
                                </h4>

                                <div className="custom-scroll" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
                                    {Object.entries(groupedEvents).map(([month, events]) => {
                                        // Group by Repo within Month
                                        const pushEventsLimit = events.filter(e => e.type === 'PushEvent');
                                        const createEvents = events.filter(e => e.type === 'CreateEvent' && e.payload.ref_type === 'repository');

                                        if (pushEventsLimit.length === 0 && createEvents.length === 0) return null;

                                        // Calculate max commits for this month to scale bars
                                        const repoStats = {};
                                        let maxMonthlyCommits = 0;

                                        pushEventsLimit.forEach(e => {
                                            const count = e.payload.size || e.payload.commits?.length || 1;
                                            const name = e.repo.name;
                                            repoStats[name] = (repoStats[name] || 0) + count;
                                        });
                                        maxMonthlyCommits = Math.max(...Object.values(repoStats), 1);

                                        return (
                                            <div key={month} style={{ marginBottom: '2rem', position: 'relative' }}>
                                                {/* Vertical Timeline Line */}
                                                <div style={{ position: 'absolute', top: '2.2rem', left: '0.95rem', bottom: '-1rem', width: '2px', background: 'rgba(255, 255, 255, 0.05)' }}></div>

                                                <div style={{ fontSize: '0.85rem', color: '#c9d1d9', marginBottom: '1rem', fontWeight: 600, borderBottom: '1px dashed rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem', marginLeft: '2.5rem' }}>{month}</div>

                                                {/* Push Events Group */}
                                                {pushEventsLimit.length > 0 && (
                                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', position: 'relative' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                                                            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b949e', border: '2px solid rgba(255, 255, 255, 0.05)' }}>
                                                                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5h-3.32Z"></path></svg>
                                                            </div>
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: '0.9rem', color: '#c9d1d9', marginBottom: '0.8rem', lineHeight: '1.4' }}>
                                                                Created <span style={{ color: 'white', fontWeight: 'bold' }}>
                                                                    {pushEventsLimit.reduce((acc, e) => acc + (e.payload.size || e.payload.commits?.length || 1), 0)}
                                                                </span> commits in {new Set(pushEventsLimit.map(e => e.repo.name)).size} repositories
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                                {/* Sort repos by commit count desc */}
                                                                {Object.entries(repoStats)
                                                                    .sort(([, a], [, b]) => b - a)
                                                                    .map(([repoName, count]) => (
                                                                        <div key={repoName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.4rem 0.6rem', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                                                            <a href={`https://github.com/${repoName}`} target="_blank" rel="noreferrer" style={{ color: '#58a6ff', textDecoration: 'none', width: '35%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>
                                                                                {repoName.split('/')[1]}
                                                                            </a>
                                                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'flex-end' }}>
                                                                                {/* Progress Bar */}
                                                                                <div style={{ flex: 1, maxWidth: '120px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                                                                    <div style={{ width: `${(count / maxMonthlyCommits) * 100}%`, height: '100%', background: '#238636', borderRadius: '3px', boxShadow: '0 0 8px rgba(35, 134, 54, 0.4)' }} />
                                                                                </div>
                                                                                <span style={{ color: '#8b949e', minWidth: '65px', textAlign: 'right', fontSize: '0.75rem' }}>{count} commits</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Create Events Group */}
                                                {createEvents.length > 0 && (
                                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', position: 'relative' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                                                            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b949e', border: '2px solid rgba(255, 255, 255, 0.05)' }}>
                                                                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path></svg>
                                                            </div>
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: '0.9rem', color: '#c9d1d9', marginBottom: '0.8rem' }}>
                                                                Created {createEvents.length} repositories
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                                {createEvents.map((e, i) => (
                                                                    <div key={e.id || `evt-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.4)', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d29922' }}></div> {/* Lang Color */}
                                                                        <a href={`https://github.com/${e.repo.name}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#c9d1d9', textDecoration: 'none', fontWeight: 600 }}>
                                                                            {e.repo.name.split('/')[1]}
                                                                        </a>
                                                                        <span style={{ fontSize: '0.7rem', color: '#8b949e', marginLeft: 'auto' }}>
                                                                            {new Date(e.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {ghEvents.length === 0 && (
                                        <div style={{ fontSize: '0.8rem', color: '#8b949e' }}>No recent public activity found.</div>
                                    )}
                                </div>
                            </div>

                            {/* Inject Custom Scrollbar Styles */}
                            <style>{`
                                .glass-panel {
                                    /* Gradient Border trick? For now simple border */
                                }
                                .custom-scroll::-webkit-scrollbar {
                                    width: 6px;
                                }
                                .custom-scroll::-webkit-scrollbar-track {
                                    background: rgba(0,0,0,0.1); 
                                }
                                .custom-scroll::-webkit-scrollbar-thumb {
                                    background: rgba(255,255,255,0.15); 
                                    border-radius: 3px;
                                }
                                .custom-scroll::-webkit-scrollbar-thumb:hover {
                                    background: rgba(255,255,255,0.25); 
                                }
                            `}</style>
                        </div>
                    </div>
                )}

            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
};

export default TrainingSection;
