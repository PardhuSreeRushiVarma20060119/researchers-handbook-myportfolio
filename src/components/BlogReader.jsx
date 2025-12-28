import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useData } from '../context/DataContext';

const BlogReader = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data } = useData();
    const [post, setPost] = useState(null);

    useEffect(() => {
        // Toggle Reading Mode Body Class
        document.body.classList.add('reading-mode');
        return () => document.body.classList.remove('reading-mode');
    }, []);

    useEffect(() => {
        // Load Data
        if (data?.blogs) {
            const found = data.blogs.find(b => b.id === id);
            if (found) setPost(found);
        }
    }, [id, data]);

    if (!post) return <div style={{ color: 'var(--text-main)', padding: '2rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

    // Reading Time Calculation
    const words = post.content ? post.content.trim().split(/\s+/).length : 0;
    const readTime = Math.ceil(words / 200);

    return (
        <div style={{
            // background: handled by body.reading-mode
            minHeight: '100vh',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-serif)',
            padding: '4rem 2rem'
        }}>
            {/* Nav */}
            <nav style={{ maxWidth: '800px', margin: '0 auto 4rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-dim)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    ← BACK TO LAB
                </button>
                <div className="mono" style={{ fontSize: '0.8rem', color: '#444' }}>READING MODE</div>
            </nav>

            <article style={{ maxWidth: '720px', margin: '0 auto' }}>
                {/* Header */}
                <header style={{ marginBottom: '3rem', borderBottom: '1px solid #222', paddingBottom: '2rem' }}>
                    <div className="mono" style={{ color: 'var(--accent-cyber)', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
                        {post.type || 'Article'}
                    </div>
                    <h1 style={{ fontSize: '2.5rem', lineHeight: 1.3, marginBottom: '1rem', color: 'white' }}>
                        {post.title}
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
                        {post.desc}
                    </p>

                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#666', fontFamily: 'var(--font-mono)' }}>
                        <span>{post.date}</span>
                        <span>{readTime} min read</span>
                        {post.tags && <span>{post.tags}</span>}
                    </div>
                </header>

                {/* Content */}
                <div className="markdown-reader" style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#ccc' }}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{ background: '#111', borderRadius: '8px', padding: '1.5rem', margin: '2rem 0', border: '1px solid #333' }}
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.3rem', borderRadius: '3px', fontSize: '0.9em' }} {...props}>
                                        {children}
                                    </code>
                                )
                            },
                            h2: ({ node, ...props }) => <h2 style={{ color: 'white', marginTop: '3rem', marginBottom: '1rem', fontSize: '1.8rem' }} {...props} />,
                            h3: ({ node, ...props }) => <h3 style={{ color: 'white', marginTop: '2rem', marginBottom: '0.8rem', fontSize: '1.4rem' }} {...props} />,
                            p: ({ node, ...props }) => <p style={{ marginBottom: '1.5rem' }} {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote style={{ borderLeft: '4px solid var(--accent-cyber)', paddingLeft: '1.5rem', margin: '2rem 0', color: 'var(--text-muted)', fontStyle: 'italic' }} {...props} />,
                            img: ({ node, ...props }) => <img style={{ maxWidth: '100%', borderRadius: '8px', margin: '2rem 0', border: '1px solid #222' }} {...props} />,
                            a: ({ node, ...props }) => <a style={{ color: 'var(--accent-cyber)', textDecoration: 'underline' }} {...props} />
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>



                {/* References Section */}
                {
                    post.references && post.references.length > 0 && (
                        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #333' }}>
                            <h3 className="mono" style={{ fontSize: '1rem', color: '#888', marginBottom: '1.5rem', textTransform: 'uppercase' }}>References & Citations</h3>
                            <ol style={{ paddingLeft: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#aaa', lineHeight: 1.6 }}>
                                {post.references.map((ref, i) => (
                                    <li key={i} style={{ marginBottom: '1rem' }} id={`ref-${i + 1}`}>
                                        {ref.text}
                                        {ref.url && (
                                            <a
                                                href={ref.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{ color: 'var(--accent-cyber)', marginLeft: '0.5rem', textDecoration: 'none' }}
                                            >
                                                [Source ↗]
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )
                }

                {/* Footer */}
                <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid #222', textAlign: 'center', color: '#444' }}>
                    <div className="mono" style={{ marginBottom: '1rem' }}>***</div>
                    Thank you for reading.
                </div>
            </article >
        </div >
    );
};

export default BlogReader;
