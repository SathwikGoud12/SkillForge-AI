import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import './SolarSystem.css';

const paths = [
    {
        name: 'Domains',
        icon: '🎯',
        color: '#f87171',
        size: 'small',
        orbitSize: 300,
        duration: 20,
        description: 'Master DSA, Web Dev, AI/ML, Cloud Computing & more with hands-on coding challenges',
        link: '/user/domains'
    },
    {
        name: 'Topics',
        icon: '📖',
        color: '#a78bfa',
        size: 'medium',
        orbitSize: 480,
        duration: 30,
        description: 'Explore comprehensive topics across all domains with structured learning paths',
        link: '/user/domains'
    },
    {
        name: 'Projects',
        icon: '💼',
        color: '#34d399',
        size: 'large',
        orbitSize: 660,
        duration: 40,
        description: 'Build real-world projects, create your portfolio & showcase your skills',
        link: '/user/projects'
    },
    {
        name: 'Assessments',
        icon: '📝',
        color: '#fbbf24',
        size: 'medium',
        orbitSize: 840,
        duration: 50,
        description: 'Test your knowledge with MCQs, coding challenges & comprehensive assessments',
        link: '/user/assessments'
    }
];


const SolarSystem = () => {
    const navigate = useNavigate();
    const solarSystemRef = useRef(null);
    const [hoveredPlanet, setHoveredPlanet] = useState(null);
    const [hoveredPlanetData, setHoveredPlanetData] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const hoverTimeoutRef = useRef(null);

    const handlePlanetEnter = (e, path) => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setHoveredPlanet(path.name);
        setHoveredPlanetData(path);
        const rect = e.currentTarget.getBoundingClientRect();
        setPopupPosition({
            x: rect.left + rect.width / 2,
            y: rect.bottom + 10
        });
    };

    const handlePlanetLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredPlanet(null);
            setHoveredPlanetData(null);
        }, 200); // 200ms delay to allow moving to popup
    };

    const handlePopupEnter = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };

    const handlePopupLeave = () => {
        handlePlanetLeave();
    };

    useEffect(() => {
        const handleScroll = () => {
            if (solarSystemRef.current) {
                const scrollY = window.scrollY;
                const orbits = solarSystemRef.current.querySelectorAll('.orbit');
                orbits.forEach((orbit, index) => {
                    const speed = (index + 1) * 0.05;
                    orbit.style.transform = `rotate(${scrollY * speed}deg)`;
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="solar-system-container">
            {/* Decorative Stars - now covers the whole container */}
            <div className="stars">
                {[...Array(150)].map((_, i) => (
                    <div
                        key={i}
                        className="star"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            opacity: Math.random() * 0.5 + 0.3,
                        }}
                    ></div>
                ))}
            </div>

            <div className="solar-system-content">
                <div className="section-header">
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)',
                        borderRadius: '50px', padding: '6px 16px', marginBottom: '16px'
                    }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', color: '#a78bfa', textTransform: 'uppercase' }}>
                            ✦ Interactive Universe
                        </span>
                    </div>
                    <h2 className="section-title">Explore Your Universe</h2>
                    <p className="section-subtitle">Hover over any planet to discover what's inside. Click to navigate.</p>
                </div>

                <div className="solar-system" ref={solarSystemRef}>
                    {/* Central Sun - SkillForge Logo */}
                    <div className="sun">
                        <div className="sun-core">
                            <div className="logo-center">
                                <span className="logo-text">SkillForge</span>
                            </div>
                        </div>
                        <div className="sun-glow"></div>
                    </div>

                    {/* Orbits and Planets */}
                    {paths.map((path, index) => {
                        const isHovered = hoveredPlanet === path.name;
                        const anyHovered = !!hoveredPlanet;
                        return (
                            <div
                                key={path.name}
                                className={`orbit ${anyHovered ? 'paused' : ''}`}
                                style={{
                                    width: `${path.orbitSize}px`,
                                    height: `${path.orbitSize}px`,
                                    animation: `rotate ${path.duration}s linear infinite`,
                                    animationPlayState: anyHovered ? 'paused' : 'running',
                                }}
                            >
                                <div className="orbit-line"></div>
                                <div
                                    className={`planet planet-${path.size} ${isHovered ? 'hovered' : ''} ${anyHovered ? 'paused' : ''}`}
                                    style={{
                                        boxShadow: `0 0 30px ${path.color}80, inset 0 0 20px ${path.color}40`,
                                        animationPlayState: anyHovered ? 'paused' : 'running',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate(path.link)}
                                    onMouseEnter={(e) => handlePlanetEnter(e, path)}
                                    onMouseLeave={handlePlanetLeave}
                                >
                                    <div className="planet-surface"></div>
                                    <div
                                        className="planet-content"
                                        style={{
                                            animation: `counterRotate ${path.duration}s linear infinite`,
                                            animationPlayState: anyHovered ? 'paused' : 'running',
                                        }}
                                    >
                                        <div className="planet-icon">{path.icon}</div>
                                    </div>
                                    {/* Planet Label - sticks to bottom of planet */}
                                    <div
                                        className="planet-label"
                                        style={{
                                            animation: `counterRotate ${path.duration}s linear infinite`,
                                            color: path.color,
                                            animationPlayState: anyHovered ? 'paused' : 'running',
                                        }}
                                    >
                                        {path.name}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Popup - Positioned near hovered planet */}
                {hoveredPlanetData && (
                    <div
                        className="planet-info-fixed"
                        style={{
                            left: `${popupPosition.x}px`,
                            top: `${popupPosition.y}px`,
                        }}
                        onMouseEnter={handlePopupEnter}
                        onMouseLeave={handlePopupLeave}
                    >
                        <h3 className="planet-name" style={{ color: hoveredPlanetData.color }}>
                            {hoveredPlanetData.name}
                        </h3>
                        <p className="planet-description">{hoveredPlanetData.description}</p>
                        <button
                            className="explore-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(hoveredPlanetData.link);
                            }}
                            style={{
                                background: `linear-gradient(135deg, ${hoveredPlanetData.color}dd, ${hoveredPlanetData.color}99)`,
                                boxShadow: `0 4px 15px ${hoveredPlanetData.color}40`
                            }}
                        >
                            Explore <span>→</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SolarSystem;
