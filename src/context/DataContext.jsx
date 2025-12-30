import React, { createContext, useContext, useState, useEffect } from 'react';
import { content as sourceContent } from '../data/content';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    // Initial State / Schema
    const initialContent = {
        name: "Dr. Pardhu",
        title: "Cybersecurity Specialist & Researcher",
        bio: "Specializing in offensive security, red teaming, and advanced threat simulation.",
        stats: {
            "DATA BREACHES": "0",
            "VULN REPORTED": "42",
            "SYSTEMS SECURED": "150+"
        },
        projects: [],
        timeline: [],
        blogs: [],
        reflections: [], // New: What Changed My Thinking
        ideas: [],       // New: Idea Parking Lot
        privateNotes: [] // New: Private Notes Mode
    };

    const [data, setData] = useState(null);
    // New: Site Settings State (Default values)
    const [settings, setSettings] = useState({
        siteTitle: "Scientific Journal",
        accentColor: "#00ff41", // Default Cyber Green
        enableAnimations: true,
        readingMode: false // New: Paper Mode
    });

    // Helper to ensure all items have IDs and proper structure
    const normalizeData = (raw) => {
        const normalized = { ...raw };
        const collections = ['blogs', 'projects', 'reflections', 'ideas', 'privateNotes', 'assets', 'researchInterests', 'papers', 'timeline', 'certifications'];

        collections.forEach(key => {
            if (Array.isArray(normalized[key])) {
                normalized[key] = normalized[key].map((item, i) => {
                    // Handle legacy string items
                    let obj = typeof item === 'string' ? { text: item } : { ...item };

                    // Ensure a stable ID if missing
                    if (!obj.id) {
                        // Use a combination of key, index and a one-time random seed or timestamp
                        // Since we save it back immediately, this becomes the permanent ID.
                        obj.id = `${key.slice(0, 3)}-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`;
                    } else {
                        obj.id = obj.id.toString();
                    }
                    return obj;
                });
            }
        });

        // Ensure critical objects exist
        if (!normalized.home || !normalized.home.mainText) normalized.home = { ...sourceContent.home, ...normalized.home };
        if (!normalized.about || !normalized.about.title) normalized.about = { ...sourceContent.about, ...normalized.about };
        if (!normalized.contact) normalized.contact = sourceContent.contact;

        // Ensure new sections exist (e.g., tryHackMe update)
        // Aggressive fix: if missing OR if it lacks actual data (like 'skills' which is new)
        if (!normalized.tryHackMe || !normalized.tryHackMe.skills) {
            console.log("Merging sourceContent.tryHackMe into data");
            normalized.tryHackMe = sourceContent.tryHackMe;
        }

        if (!normalized.settings) normalized.settings = settings;

        return normalized;
    };

    // Load from "DB" (LocalStorage) on mount
    useEffect(() => {
        const savedData = localStorage.getItem('portfolio_db');
        let initial;

        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                initial = normalizeData(parsed);
                if (parsed.settings) setSettings(parsed.settings);
            } catch (e) {
                console.error("DB Load Error", e);
                initial = normalizeData(sourceContent);
            }
        } else {
            initial = normalizeData(sourceContent);
        }

        setData(initial);
        // Persist normalized data immediately
        localStorage.setItem('portfolio_db', JSON.stringify({ ...initial, settings: settings }));
    }, []);

    // Save to "DB"
    const saveContent = (newData, newSettings = settings) => {
        const fullDb = { ...newData, settings: newSettings };
        setData(newData);
        setSettings(newSettings);
        localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
        console.log("Database Updated");
    };

    // Update Settings Action
    const updateSettings = (newSettings) => {
        saveContent(data, newSettings);
        // Apply CSS Variables immediately
        document.documentElement.style.setProperty('--accent-cyber', newSettings.accentColor);
    };

    // Generic Update helper with History
    const trackHistory = (oldItem, msg = "Update") => {
        const entry = {
            timestamp: new Date().toISOString(),
            msg,
            snapshot: { ...oldItem, history: undefined } // Don't nest history infinitely
        };
        return [...(oldItem.history || []), entry];
    };

    const updateField = (section, field, value) => {
        setData(prev => {
            const newState = { ...prev };

            if (field === null || field === undefined) {
                // Direct replacement
                newState[section] = value;
            } else if (Array.isArray(newState[section])) {
                // Handle Array index update
                const newArr = [...newState[section]];
                newArr[field] = value;
                newState[section] = newArr;
            } else if (typeof newState[section] === 'object' && newState[section] !== null) {
                // Handle Object property update
                newState[section] = { ...newState[section], [field]: value };
            } else {
                // Fallback for primitive or non-existent section
                newState[section] = value;
            }

            // Persist to localStorage after setting state
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    // Helper to add a new Paper/Project/Blog
    const addItem = (collectionName, item) => {
        setData(prev => {
            const newState = { ...prev };
            if (Array.isArray(newState[collectionName])) {
                const newItem = {
                    ...item,
                    history: [{ timestamp: new Date().toISOString(), msg: "Created" }]
                };
                newState[collectionName] = [newItem, ...newState[collectionName]];
            }
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    // Blog Specific Actions
    const saveBlog = (post) => {
        setData(prev => {
            const newState = { ...prev };
            const blogs = newState.blogs || [];

            if (post.id) {
                // Update existing
                newState.blogs = blogs.map(b => {
                    if (b.id === post.id) {
                        return {
                            ...post,
                            history: trackHistory(b, `Edited ${post.title}`)
                        };
                    }
                    return b;
                });
            } else {
                // Create new
                const newPost = {
                    ...post,
                    id: Date.now().toString(),
                    history: [{ timestamp: new Date().toISOString(), msg: "Created (Initial Draft)" }]
                };
                newState.blogs = [newPost, ...blogs];
            }
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    const deleteBlog = (id) => {
        if (!id) return;
        setData(prev => {
            const newState = { ...prev };
            newState.blogs = (newState.blogs || []).filter(b => {
                const bId = b.id?.toString() || '';
                const tId = id.toString();
                return bId !== tId;
            });
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    // Project Actions
    const saveProject = (project) => {
        setData(prev => {
            const newState = { ...prev };
            const projects = newState.projects || [];
            if (project.id) {
                newState.projects = projects.map(p => {
                    if (p.id === project.id) {
                        return {
                            ...project,
                            history: trackHistory(p, `Edited ${project.title}`)
                        };
                    }
                    return p;
                });
            } else {
                const newProj = {
                    ...project,
                    id: Date.now().toString(),
                    history: [{ timestamp: new Date().toISOString(), msg: "Created" }]
                };
                newState.projects = [newProj, ...projects];
            }
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    const deleteProject = (id) => {
        if (!id) return;
        setData(prev => {
            const newState = { ...prev };
            newState.projects = (newState.projects || []).filter(p => {
                const pId = p.id?.toString() || '';
                const tId = id.toString();
                return pId !== tId;
            });
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    // Paper Actions (Admin)
    const savePaper = (paper) => {
        setData(prev => {
            const newState = { ...prev };
            const papers = newState.papers || [];
            if (paper.id) {
                // Update
                newState.papers = papers.map(p => {
                    if (p.id === paper.id) {
                        return { ...paper, history: trackHistory(p, `Edited ${paper.title}`) };
                    }
                    return p;
                });
            } else {
                // Create
                const newPaper = {
                    ...paper,
                    id: `paper-${Date.now()}`,
                    history: [{ timestamp: new Date().toISOString(), msg: "Created" }]
                };
                newState.papers = [newPaper, ...papers];
            }
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    const deletePaper = (id) => {
        if (!id) return;
        setData(prev => {
            const newState = { ...prev };
            newState.papers = (newState.papers || []).filter(p => p.id !== id);
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    // Swap two papers by ID (for drag/drop or up/down logic)
    const swapPapers = (id1, id2) => {
        console.log(`swapPapers called with: ${id1}, ${id2}`);
        setData(prev => {
            const newState = { ...prev };
            const papers = [...(newState.papers || [])];
            const idx1 = papers.findIndex(p => p.id === id1);
            const idx2 = papers.findIndex(p => p.id === id2);

            console.log(`Indices found: ${idx1}, ${idx2}`);

            if (idx1 === -1 || idx2 === -1) {
                console.error("Swap failed: One or both IDs not found");
                return prev;
            }

            // Swap
            [papers[idx1], papers[idx2]] = [papers[idx2], papers[idx1]];

            newState.papers = papers;
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    const movePaper = (id, direction) => {
        setData(prev => {
            const newState = { ...prev };
            const papers = [...(newState.papers || [])];
            const index = papers.findIndex(p => p.id === id);

            if (index === -1) return prev;

            const newIndex = direction === 'up' ? index - 1 : index + 1;

            if (newIndex < 0 || newIndex >= papers.length) return prev; // Out of bounds

            // Swap
            [papers[index], papers[newIndex]] = [papers[newIndex], papers[index]];

            newState.papers = papers;
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };



    // Asset Actions
    const addAsset = (asset) => {
        setData(prev => {
            const newState = { ...prev };
            const assets = newState.assets || [];
            newState.assets = [{ ...asset, id: Date.now().toString() }, ...assets];
            saveContent(newState);
            return newState;
        });
    };

    const deleteAsset = (id) => {
        if (!id) return;
        setData(prev => {
            const newState = { ...prev };
            newState.assets = (newState.assets || []).filter(a => {
                const aId = a.id?.toString() || '';
                const tId = id.toString();
                return aId !== tId;
            });
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    // TryHackMe Actions
    const updateTryHackMe = (newStats) => {
        setData(prev => {
            const newState = { ...prev, tryHackMe: newStats };
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    // Export Data Action
    const exportData = () => {
        if (!data) return;
        const fullDb = { ...data, settings };
        const dataStr = JSON.stringify(fullDb, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Reflections (What Changed My Thinking) ---
    const addReflection = (reflection) => {
        setData(prev => {
            const newState = { ...prev };
            const newRef = {
                ...reflection,
                id: Date.now().toString(),
                date: new Date().toLocaleDateString(),
                history: [{ timestamp: new Date().toISOString(), msg: "Created" }]
            };
            newState.reflections = [newRef, ...(newState.reflections || [])];
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    const deleteReflection = (id) => {
        if (!id) return;
        setData(prev => {
            const newState = { ...prev };
            newState.reflections = (newState.reflections || []).filter(r => {
                const rId = r.id?.toString() || '';
                const tId = id.toString();
                return rId !== tId;
            });
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    const updateReflection = (reflection) => {
        if (!reflection || !reflection.id) return;
        setData(prev => {
            const newState = { ...prev };
            newState.reflections = (newState.reflections || []).map(r =>
                (r.id?.toString() === reflection.id.toString()) ? reflection : r
            );
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    // --- Idea Parking Lot ---
    const addIdea = (text) => {
        setData(prev => {
            const newState = { ...prev };
            const newIdea = {
                id: Date.now().toString(),
                text: typeof text === 'string' ? text : text.text, // Handle object or string
                isPrivate: typeof text === 'object' ? text.isPrivate : true,
                history: [{ timestamp: new Date().toISOString(), msg: "Created" }]
            };
            newState.ideas = [newIdea, ...(newState.ideas || [])];
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    const updateIdea = (idea) => {
        if (!idea || !idea.id) return;
        setData(prev => {
            const newState = { ...prev };
            newState.ideas = (newState.ideas || []).map(i =>
                (i.id?.toString() === idea.id.toString()) ? idea : i
            );
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    const deleteIdea = (id) => {
        if (!id) return;
        setData(prev => {
            const newState = { ...prev };
            newState.ideas = (newState.ideas || []).filter(i => {
                const iId = i.id?.toString() || '';
                const tId = id.toString();
                return iId !== tId;
            });
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    // --- Private Notes (Admin Only) ---
    const addPrivateNote = (text) => {
        setData(prev => {
            const newState = { ...prev };
            const newNote = {
                id: Date.now().toString(),
                text, // Expecting string or object? Let's say just text for now, but editor might send struct. 
                // Actually let's just match Idea structure but without isPrivate toggle (always private).
                date: new Date().toLocaleDateString(),
                history: [{ timestamp: new Date().toISOString(), msg: "Created" }]
            };
            newState.privateNotes = [newNote, ...(newState.privateNotes || [])];
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    const updatePrivateNote = (note) => {
        if (!note || !note.id) return;
        setData(prev => {
            const newState = { ...prev };
            newState.privateNotes = (newState.privateNotes || []).map(n =>
                (n.id?.toString() === note.id.toString()) ? note : n
            );
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    const deletePrivateNote = (id) => {
        if (!id) return;
        setData(prev => {
            const newState = { ...prev };
            newState.privateNotes = (newState.privateNotes || []).filter(n => {
                const nId = n.id?.toString() || '';
                const tId = id.toString();
                return nId !== tId;
            });
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    const toggleIdeaVisibility = (id) => {
        setData(prev => {
            const newState = {
                ...prev,
                ideas: (prev.ideas || []).map(i => i.id === id ? { ...i, isPrivate: !i.isPrivate } : i)
            };
            const fullDb = { ...newState, settings: settings };
            localStorage.setItem('portfolio_db', JSON.stringify(fullDb));
            return newState;
        });
    };

    return (
        <DataContext.Provider value={{
            data, settings, updateSettings,
            updateField, updateTryHackMe,
            saveProject, deleteProject,
            saveBlog, deleteBlog,
            savePaper, deletePaper, movePaper, swapPapers,
            addReflection, deleteReflection, updateReflection,
            addIdea, deleteIdea, updateIdea, toggleIdeaVisibility,
            addPrivateNote, deletePrivateNote, updatePrivateNote,
            addIdea, deleteIdea, updateIdea, toggleIdeaVisibility,
            addPrivateNote, deletePrivateNote, updatePrivateNote,
            addItem, addAsset, deleteAsset, exportData
        }}>
            {children}
        </DataContext.Provider>
    );
};
