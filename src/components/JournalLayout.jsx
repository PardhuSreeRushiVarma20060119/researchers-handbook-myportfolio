import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import EditableText from './EditableText';
import Timeline from './Timeline';
import TryHackMeEditor from './TryHackMeEditor'; // Using the editor? No, Section. 
import TrainingSection from './TrainingSection';
import ThinkingSection from './ThinkingSection';
import BlogEditor from './BlogEditor';
import ProjectEditor from './ProjectEditor';
import AudioPlayer from './AudioPlayer';

const TOCItem = ({ id, label, active }) => (
    <a href={`#${id}`} style={{
        display: 'block',
        padding: '0.5rem 0',
        color: active ? 'var(--text-main)' : 'var(--text-dim)',
        textDecoration: 'none',
        borderLeft: active ? '2px solid var(--text-main)' : '1px solid transparent',
        paddingLeft: '1rem',
        fontSize: '0.85rem',
        fontFamily: 'var(--font-mono)',
        transition: 'all 0.2s'
    }}>
        {label}
    </a>
);

import { useGitHubStats } from '../hooks/useGitHubStats';

// Updated FigureCard to be clickable in Admin Mode and show GitHub Stats
const FigureCard = ({ project, onClick, isAdmin, adminMode }) => {
    const { stats, loading } = useGitHubStats(project.link);

    return (
        <div
            onClick={() => (isAdmin && adminMode) ? onClick(project) : null}
            style={{
                border: (isAdmin && adminMode) ? '1px dashed yellow' : '1px solid var(--border-subtle)',
                padding: '1.5rem',
                background: 'var(--bg-panel)',
                display: 'flex',
                flexDirection: 'column',
                cursor: (isAdmin && adminMode) ? 'pointer' : 'default',
                position: 'relative',
                opacity: (isAdmin && adminMode) ? 0.9 : 1
            }}
        >
            {(isAdmin && adminMode) && <div style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '0.6rem', color: 'yellow', border: '1px solid yellow', padding: '2px 4px' }}>EDIT</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    FIG. {project.status}
                </div>
                {stats && (
                    <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent-cyber)', display: 'flex', gap: '0.8rem' }}>
                        <span>★ {stats.stars}</span>
                        <span>⑂ {stats.forks}</span>
                    </div>
                )}
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{project.title}</h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', flexGrow: 1 }}>
                {project.description}
                {stats && <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>"{stats.desc}"</span>}
            </p>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {stats?.language || project.tech}
                </span>
                {project.link && project.link !== '#' && (
                    <a href={project.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>GitHub ↗</a>
                )}
            </div>
        </div>
    );
};

const PaperRow = ({ paper }) => (
    <div style={{
        padding: '1.5rem 0',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{paper.title}</h4>
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-cyber)', whiteSpace: 'nowrap' }}>{paper.status}</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '90%' }}>{paper.desc}</p>
        <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Type: {paper.type}</span>
    </div>
);

const BlogRow = ({ blog, onClick, onRead, isAdmin, adminMode }) => (
    <div
        onClick={() => (isAdmin && adminMode) ? onClick(blog) : onRead(blog)}
        style={{
            padding: '1rem 0',
            borderBottom: '1px dashed var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            opacity: (isAdmin && adminMode) ? 0.8 : 1,
            transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
        <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {blog.title}
                {blog.status === 'draft' && <span style={{ fontSize: '0.6rem', border: '1px solid #666', padding: '1px 3px', borderRadius: '4px', color: '#888' }}>DRAFT</span>}
                {blog.status === 'archived' && <span style={{ fontSize: '0.6rem', border: '1px solid #444', padding: '1px 3px', borderRadius: '4px', color: '#666' }}>ARCHIVED</span>}
                {(isAdmin && adminMode) && <span style={{ fontSize: '0.6rem', color: 'yellow' }}>✎ EDIT</span>}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{blog.desc}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{blog.date}</span>
            {blog.tags && <span className="mono" style={{ fontSize: '0.65rem', color: '#444' }}>{blog.tags.split(',')[0]}</span>}
        </div>
    </div>
);

import SectionHeading from './SectionHeading';

import { useNavigate } from 'react-router-dom';

const JournalLayout = () => {
    const { data, settings, updateSettings, updateField, saveBlog, deleteBlog, saveProject, deleteProject } = useData();
    const { isAdmin, adminMode } = useAuth();
    const navigate = useNavigate();
    const [activeId, setActiveId] = useState('abstract');

    const [editingBlog, setEditingBlog] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [blogSearch, setBlogSearch] = useState('');

    const toggleReaderMode = () => {
        updateSettings({ ...settings, readingMode: !settings.readingMode });
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) setActiveId(e.target.id);
            });
        }, { rootMargin: '-20% 0px -50% 0px' });

        document.querySelectorAll('section').forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    if (!data) return <div style={{ color: 'white', padding: '2rem' }}>Loading System...</div>;

    return (
        <div className="journal-grid" style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '4rem 2rem' }}>

            {/* READER MODE TOGGLE */}
            <button
                onClick={toggleReaderMode}
                title="Toggle Reading Mode"
                style={{
                    position: 'fixed',
                    top: '2rem',
                    right: '2rem',
                    zIndex: 1000,
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white', /* Always white for dark themes */
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            >
                {settings.readingMode ? (
                    <span style={{ fontSize: '1.2rem' }}>✕</span>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                )}
            </button>

            {editingBlog && (
                <BlogEditor
                    post={editingBlog}
                    onCancel={() => setEditingBlog(null)}
                    onDelete={(id) => { deleteBlog(id); setEditingBlog(null); }}
                    onSave={(post) => { saveBlog(post); setEditingBlog(null); }}
                />
            )}

            {editingProject && (
                <ProjectEditor
                    project={editingProject}
                    onCancel={() => setEditingProject(null)}
                    onDelete={(id) => { deleteProject(id); setEditingProject(null); }}
                    onSave={(proj) => { saveProject(proj); setEditingProject(null); }}
                />
            )}

            <aside style={{ height: 'calc(100vh - 8rem)', position: 'sticky', top: '4rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <div
                        style={{
                            width: '150px',
                            height: '150px',
                            margin: '0 auto 1.5rem auto',
                            borderRadius: '25px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            padding: '6px',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'pointer',
                            transformStyle: 'preserve-3d',
                            perspective: '1000px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(-5deg) scale(1.05)';
                            e.currentTarget.style.boxShadow = `0 10px 30px -10px ${settings.profileGlow || 'rgba(0, 255, 65, 0.3)'}`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <img
                            src={settings.profileImage || "/src/assets/profile.jpg"}
                            alt="Pardhu Varma"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '15px',
                                display: 'block'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none'; // Hide if missing
                                e.target.parentNode.innerText = 'PV'; // Fallback
                                e.target.parentNode.style.color = 'var(--accent-cyber)';
                                e.target.parentNode.style.display = 'flex';
                                e.target.parentNode.style.alignItems = 'center';
                                e.target.parentNode.style.justifyContent = 'center';
                                e.target.parentNode.style.fontSize = '2rem';
                                e.target.parentNode.style.fontFamily = 'var(--font-mono)';
                            }}
                        />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', lineHeight: 1 }}>Pardhu Varma</h1>
                    <p className="mono" style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                        Cybersecurity Researcher<br />Hyderabad, IN
                    </p>
                </div>

                <nav style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '1rem' }}>
                    <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '1rem', letterSpacing: '0.1em' }}>INDEX</div>
                    <TOCItem id="abstract" label="00. Abstract" active={activeId === 'abstract'} />
                    <TOCItem id="research-areas" label="01. Research Areas" active={activeId === 'research-areas'} />
                    <TOCItem id="papers" label="02. Papers & Preprints" active={activeId === 'papers'} />
                    <TOCItem id="selected-works" label="03. Selected Figures" active={activeId === 'selected-works'} />
                    <TOCItem id="trajectory" label="04. Trajectory" active={activeId === 'trajectory'} />
                    <TOCItem id="blogs" label="05. Notes & Essays" active={activeId === 'blogs'} />
                    <TOCItem id="second-brain" label="06. Second Brain" active={activeId === 'second-brain'} />
                    <TOCItem id="credentials" label="07. Credentials" active={activeId === 'credentials'} />
                    <TOCItem id="references" label="08. References" active={activeId === 'references'} />
                </nav>

                {/* Custom Audio Player - Resonance */}
                <AudioPlayer />

                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                    VOL. 2025 • ISSUE 3<br />
                    SYSTEMS SECURITY
                </div>
            </aside>

            <main>
                <section id="abstract" style={{ minHeight: 'auto', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '1rem' }}>ABSTRACT / INTRO</div>
                    <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '2rem' }}>
                        <EditableText
                            value={data.home.intro}
                            onChange={(val) => updateField('home', 'intro', val)}
                            multiline
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                        <div>{data.home.abstract.slice(0, 3).map((p, i) => <p key={i} style={{ marginBottom: '1.2rem' }}>{p}</p>)}</div>
                        <div>{data.home.abstract.slice(3).map((p, i) => <p key={i} style={{ marginBottom: '1.2rem' }}>{p}</p>)}</div>
                    </div>
                </section>

                {/* Stylized Quote - Apple Editorial (Serif) */}
                <div style={{
                    margin: '4rem 0 6rem 0',
                    padding: '0 2rem',
                    textAlign: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '3rem',
                    paddingBottom: '3rem'
                }}>
                    <blockquote style={{
                        fontSize: '2rem',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 400,
                        fontStyle: 'italic',
                        letterSpacing: '-0.02em',
                        color: 'var(--text-main)',
                        lineHeight: 1.5,
                        maxWidth: '900px',
                        margin: '0 auto',
                        textShadow: '0 0 30px rgba(255,255,255,0.05)'
                    }}>
                        "To emulate the <span style={{ color: 'var(--accent-cyber)', fontWeight: 600 }}>adversary</span> is to embody every doubt that was never tested enough."
                    </blockquote>

                </div>

                <section id="research-areas">
                    <SectionHeading id="research-areas"
                        action={(isAdmin && adminMode) ? (
                            <button onClick={() => {
                                const newArea = { title: "New Area", desc: "Description..." };
                                const newAreas = [...data.researchInterests, newArea];
                                updateField('researchInterests', null, newAreas); // This needs the updateField logic to support array replacement or specific item update. 
                                // Actually better: Add a dedicated update function or hack: "updateField" usually updates a property of an object. Here "settings" is explicit. 
                                // Let's use addItem('researchInterests') if defined, or patch updateField.
                                // Simplest: updateField('researchInterests', index, val) -> requires refactor of updateField.
                                // Let's assume for now we only edit EXISTING. Adding new research areas requires a UI. 
                                // For now, I'll enable EDITING existing ones.
                            }} style={{ display: 'none' }}>+ Add</button>
                        ) : null}
                    >01. Research Areas</SectionHeading>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {data.researchInterests.map((area, i) => (
                            <div key={i} style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                    <EditableText
                                        value={area.title}
                                        onChange={(val) => {
                                            const newAreas = [...data.researchInterests];
                                            newAreas[i] = { ...newAreas[i], title: val };
                                            // Direct State Update - We need a way to set the whole array in DataContext
                                            // Current updateField is: newState[section][field] = value. 
                                            // But researchInterests is an ARRAY at the top level? No, it's data.researchInterests.
                                            // So updateField('researchInterests', i, newVal) won't work with current logic.
                                            // Let's check DataContext.updateField logic:
                                            // newState[section][field] = value;
                                            // data.researchInterests is an Array. So section='researchInterests', field=index?
                                            // Yes! newState['researchInterests'][0] = ... works in JS.
                                            updateField('researchInterests', i, { ...area, title: val });
                                        }}
                                    />
                                </h4>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    <EditableText
                                        value={area.desc}
                                        onChange={(val) => {
                                            updateField('researchInterests', i, { ...area, desc: val });
                                        }}
                                        multiline
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="papers">
                    <SectionHeading id="papers">02. Publications & Preprints</SectionHeading>
                    <div>
                        {data.papers.map((paper, i) => <PaperRow key={i} paper={paper} />)}
                    </div>
                </section>

                <section id="selected-figures">
                    <SectionHeading id="selected-figures"
                        action={(isAdmin && adminMode) ? (
                            <button onClick={() => {
                                setEditingProject({
                                    id: null,
                                    title: "New Project",
                                    description: "Description...",
                                    tech: "Tech Stack",
                                    status: "CONCEPT",
                                    link: "#",
                                    isNew: true // Flag to handle create vs update
                                });
                            }} style={{ background: 'white', color: 'black', border: 'none', padding: '0.3rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                + NEW PROJECT
                            </button>
                        ) : null}
                    >03. Selected Figures</SectionHeading>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {data.projects
                            .filter(project => {
                                if (!isAdmin && project.visibility !== 'public') return false; // Hide non-public from guests
                                return true;
                            })
                            .map((project, i) => (
                                <div key={project.id || i} style={{ position: 'relative' }}>
                                    {/* Admin Indicators */}
                                    {(isAdmin && adminMode) && (project.visibility === 'draft' || project.visibility === 'archived') && (
                                        <div style={{
                                            position: 'absolute', top: '-10px', left: '10px', zIndex: 10,
                                            background: project.visibility === 'draft' ? '#444' : '#331100',
                                            color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid #666'
                                        }}>
                                            {project.visibility.toUpperCase()}
                                        </div>
                                    )}
                                    <FigureCard
                                        project={project}
                                        isAdmin={isAdmin}
                                        adminMode={adminMode}
                                        onClick={setEditingProject}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </section>

                <TrainingSection />

                <section id="trajectory">
                    <SectionHeading id="trajectory">04. Trajectory</SectionHeading>
                    <Timeline items={data.timeline} />
                </section>

                <section id="blogs">
                    <SectionHeading
                        id="blogs"
                        action={(isAdmin && adminMode) ? (
                            <button onClick={() => setEditingBlog({})} style={{ background: 'white', color: 'black', border: 'none', padding: '0.3rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                + NEW POST
                            </button>
                        ) : null}
                    >
                        05. Notes & Essays
                    </SectionHeading>

                    {/* Blog Search & Filter */}
                    <div style={{ marginBottom: '2rem' }}>
                        <input
                            placeholder="Filter by title or tag..."
                            value={blogSearch}
                            onChange={(e) => setBlogSearch(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border-subtle)',
                                padding: '0.5rem',
                                color: 'var(--text-main)',
                                width: '100%',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85rem'
                            }}
                        />
                    </div>

                    <div>
                        {data.blogs
                            .filter(blog => {
                                // 1. Status Filter (Hide drafts/archived unless admin)
                                if (!isAdmin && blog.status !== 'public') return false;

                                // 2. Search Filter
                                const search = blogSearch.toLowerCase();
                                const matchesTitle = blog.title.toLowerCase().includes(search);
                                const matchesTags = blog.tags ? blog.tags.toLowerCase().includes(search) : false;

                                return matchesTitle || matchesTags;
                            })
                            .map((blog, i) => (
                                <BlogRow
                                    key={i}
                                    blog={blog}
                                    isAdmin={isAdmin}
                                    adminMode={adminMode}
                                    onClick={setEditingBlog}
                                    onRead={(b) => navigate(`/blog/${b.id}`)}
                                />
                            ))
                        }
                        {data.blogs.filter(b => (!isAdmin && b.status !== 'public') ? false : true).length === 0 && (
                            <div style={{ fontStyle: 'italic', color: '#666' }}>No posts available.</div>
                        )}
                    </div>
                </section>

                <ThinkingSection />


                <section id="credentials">
                    <SectionHeading id="credentials">07. Credentials & Certifications</SectionHeading>
                    <div style={{ columnCount: 2, columnGap: '4rem' }}>
                        {data.certifications.map((cert, i) => (
                            <div key={i} style={{ marginBottom: '1.5rem', breakInside: 'avoid' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{cert.name}</div>
                                <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                    {cert.issuer} • {cert.date}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="references" style={{ marginTop: '8rem', paddingBottom: '8rem' }}>
                    <SectionHeading id="references">08. References & Contact</SectionHeading>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem' }}>
                        <div>
                            <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>EMAIL</div>
                            <a href={`mailto:${data.contact.email}`} style={{ color: 'var(--text-main)', fontSize: '1.1rem', textDecoration: 'none', borderBottom: '1px solid var(--accent-cyber)' }}>{data.contact.email}</a>
                        </div>
                        <div>
                            <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>SOCIALS</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <a href={data.contact.github} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>GitHub</span> <span style={{ fontSize: '0.8rem' }}>↗</span>
                                </a>
                                <a href={data.contact.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>LinkedIn</span> <span style={{ fontSize: '0.8rem' }}>↗</span>
                                </a>
                            </div>
                        </div>
                        <div>
                            <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>LOCATION</div>
                            <div style={{ color: 'var(--text-muted)' }}>{data.contact.location}</div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default JournalLayout;
