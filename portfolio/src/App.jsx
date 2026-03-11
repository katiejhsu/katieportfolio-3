import { useState, useEffect, useRef, useCallback } from "react";

import beachImg from "./assets/beach.jpeg";
import dunesImg from "./assets/dunes.jpeg";
import seattleImg from "./assets/seattle.jpg";
import valleyImg from "./assets/valley.jpg";

const PHOTO_URLS = [
  beachImg,
  dunesImg,
  seattleImg,
  valleyImg,
];

const NAV_LINKS = ["Skills", "Projects", "Socials", "Fun"];

const skills = {
  "Programming Languages": ["Java", "SQL", "Python", "R", "HTML", "CSS", "JavaScript", "Swift"],
  "Libraries & Frameworks": ["Firebase", "React", "Node.js", "pandas", "plotly", "scikit-learn", "matplotlib", "RShiny", "Vite"],
  "Tools & Methodologies": ["Relational Data Modeling", "Data Analysis", "Data Cleaning", "Data Visualization", "Query Writing", "DBMS", "Git", "Power BI", "Azure DevOps", "RESTful API Design", "Auth (Azure AD)", "Unit Testing (XCTest, Jest)", "CI/CD (Render)"],
};

const projects = [
  { title: "Mood Diary", subtitle: "Full Stack Web App", desc: "A full-stack mood sharing web application with friends featuring Azure authentication, WebSockets for real-time interaction, and a MongoDB backend.", tags: ["MongoDB", "WebSockets", "Azure"], links: [{ label: "Git Repo", href: "https://github.com/katiejhsu/Mood-Diary" }, { label: "Live Demo", href: "https://final-project-group5-its0.onrender.com/" }], emoji: "🌸" },
  { title: "Analyzing Netflix", subtitle: "RShiny App", desc: "An interactive RShiny application featuring statistical analysis of genre trends and content performance using a consolidated dataset of 1,700+ entries.", tags: ["R", "RShiny", "Statistics"], links: [{ label: "Git Repo", href: "https://github.com/katiejhsu/AnalyzingNetflix" }, { label: "Live Demo", href: "https://analyzingnetflix.shinyapps.io/analyzingNetflix/" }], emoji: "📊" },
  { title: "Global Hunger & Food Needs Database", subtitle: "SQL", desc: "A relational database utilizing 9 interconnected tables and complex SQL queries to analyze global land use and sustainability insights.", tags: ["SQL", "Database Design", "Sustainability"], links: [{ label: "Git Repo", href: "https://github.com/katiejhsu/INFO-330-Project" }], emoji: "🌿" },
  { title: "Solar Power Generation Efficiency Analysis", subtitle: "Python", desc: "A Python-based analysis of three distinct datasets using pandas and plotly to visualize power generation trends through dynamic charts.", tags: ["Python", "pandas", "plotly"], links: [{ label: "Git Repo", href: "https://github.com/katiejhsu/Solar-Power-Generation-Efficiency-Analysis" }], emoji: "☀️" },
  { title: "Husky Maps", subtitle: "2nd Place Hackathon Project", desc: "An award-winning navigation API that utilizes a modified Dijkstra's algorithm to calculate optimal campus paths based on real-time building access.", tags: ["Algorithms", "APIs", "Hackathon"], links: [{ label: "Hackathon Page", href: "https://devpost.com/software/husky-maps" }], emoji: "🗺️" },
  { title: "Analyzing Social & Demographic Influences on Income", subtitle: "R & Power BI", desc: "An end-to-end statistical analysis using multiple linear regression in R and an interactive Power BI dashboard with automated ETL pipelines and dynamic slicers.", tags: ["R", "Power BI", "Machine Learning", "ETL"], links: [{ label: "R Git Repo", href: "https://github.com/katiejhsu/Analyzing-Social-and-Demographic-Influences-on-Income" }, { label: "Power BI Git Repo", href: "https://github.com/katiejhsu/PowerBI-Dashboard-Analyzing-Sociodemographic-Influences-on-Income-.git" }], emoji: "📈" },
];

const socials = [
  { name: "LinkedIn", handle: "@katiejhsu", href: "https://www.linkedin.com/in/katiejhsu/", emoji: "💼", desc: "Let's connect professionally" },
  { name: "Instagram", handle: "@katiejhsu", href: "https://www.instagram.com/katiejhsu/", emoji: "📸", desc: "Follow my adventures" },
  { name: "GitHub", handle: "@katiejhsu", href: "#", emoji: "🐙", desc: "Check out my code" },
  { name: "Email", handle: "katiejhsu@gmail.com", href: "mailto:katiejhsu@gmail.com", emoji: "✉️", desc: "Shoot me a message" },
];

function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(ids[0]);
  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);
  return activeId;
}

function EnvelopeScreen({ onOpen, isClosing }) {
  const [phase, setPhase] = useState("idle");
  const [pos, setPos] = useState(null); // null = centered via flex
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const envRef = useRef(null);

  const mouseDownPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (phase !== "idle") return;
    e.preventDefault();
    const rect = envRef.current.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    setHasDragged(false);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const dx = e.clientX - mouseDownPos.current.x;
      const dy = e.clientY - mouseDownPos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > 8) setHasDragged(true);
      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;
      setPos({ x, y });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, dragOffset]);

  // Touch support
  const handleTouchStart = (e) => {
    if (phase !== "idle") return;
    const t = e.touches[0];
    const rect = envRef.current.getBoundingClientRect();
    setDragOffset({ x: t.clientX - rect.left, y: t.clientY - rect.top });
    mouseDownPos.current = { x: t.clientX, y: t.clientY };
    setDragging(true);
    setHasDragged(false);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const t = e.touches[0];
      const dx = t.clientX - mouseDownPos.current.x;
      const dy = t.clientY - mouseDownPos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > 8) setHasDragged(true);
      setPos({ x: t.clientX - dragOffset.x, y: t.clientY - dragOffset.y });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => { window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onUp); };
  }, [dragging, dragOffset]);

  const handleClick = () => {
    if (hasDragged || phase !== "idle") return;
    setPhase("opening");
    setTimeout(() => setPhase("exiting"), 500);
    setTimeout(onOpen, 1200);
  };

  // Triggered externally when 💌 button is clicked on portfolio
  useEffect(() => {
    if (!isClosing) return;
    setPos(null);
    setPhase("closing");
    setTimeout(() => setPhase("idle"), 600);
  }, [isClosing]);

  const flapClass =
    phase === "closing" ? "flap-close" :
    (phase === "opening" || phase === "exiting") ? "flap-open" : "";
  const wrapExiting = phase === "exiting";

  const envW = 340;
  const envH = 230;

  const posStyle = pos
    ? { position: "fixed", left: pos.x, top: pos.y, zIndex: 10 }
    : { position: "relative", zIndex: 10 };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, backgroundColor: "#fce8ed", backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.85) 3.5px, transparent 3.5px)", backgroundSize: "52px 52px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", userSelect: "none" }}>
      <span className="sp1" style={{ position: "absolute", top: "20%", left: "20%", fontSize: "1.1rem", color: "#c4778a" }}>✦</span>
      <span className="sp2" style={{ position: "absolute", top: "25%", right: "20%", fontSize: "0.9rem", color: "#e8a0b0" }}>✦</span>
      <span className="sp3" style={{ position: "absolute", bottom: "22%", left: "18%", fontSize: "1rem", color: "#c4778a" }}>✦</span>
      <span className="sp4" style={{ position: "absolute", bottom: "20%", right: "22%", fontSize: "0.8rem", color: "#e8a0b0" }}>✦</span>

      {/* "you found me hehe" — always rendered, hidden under envelope until dragged */}
      <div style={{
        position: "fixed",
        left: pos ? pos.x + envW / 2 : "50%",
        top: pos ? pos.y + envH / 2 : "50%",
        transform: "translate(-50%, -50%)",
        fontFamily: "Cormorant Garamond, Georgia, serif",
        fontSize: "1.1rem",
        fontStyle: "italic",
        color: "#c4778a",
        opacity: (pos && phase === "idle") ? 1 : 0,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 5,
      }}>
        you found me hehe 🩷
      </div>

      {/* text above — only show when centered */}
      {!pos && (
        <div className="intro-text" style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(1.9rem, 5vw, 2.6rem)", fontWeight: 300, color: "#3a2a2e", lineHeight: 1.25 }}>
            katie's portfolio site
          </h1>
        </div>
      )}
      
      {/* Made with text — shown below envelope when centered */}
      {!pos && (
        <div className="intro-text" style={{ position: "absolute", bottom: 120, fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(1.9rem, 5vw, 2.6rem)", color: "#c4778a", textAlign: "center", fontWeight: 300 }}>
          <em>made with </em><span style={{ fontSize: "clamp(1.9rem, 5vw, 2.6rem)", verticalAlign: "middle", display: "inline-block", lineHeight: 1 }}>🩷</span>
        </div>
      )}

      {/* Envelope */}
      <div
        ref={envRef}
        style={{
          ...posStyle,
          width: envW,
          height: envH,
          cursor: dragging ? "grabbing" : (phase === "idle" ? "grab" : "default"),
          animation: wrapExiting ? "slideUpOff 0.85s cubic-bezier(.4,0,.2,1) forwards" : (pos ? "none" : "floatAnim 3.5s ease-in-out infinite"),
          filter: "drop-shadow(0 18px 40px rgba(180,120,140,0.22))",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
      >
        <svg width={envW} height={envH} viewBox={`0 0 ${envW} ${envH}`} xmlns="http://www.w3.org/2000/svg" style={{ display: "block", overflow: "visible" }}>
          <defs>
            <linearGradient id="envBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fdf8f0" />
              <stop offset="100%" stopColor="#f5ede0" />
            </linearGradient>
            <linearGradient id="envLeft" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ede0ce" />
              <stop offset="100%" stopColor="#f5ede0" />
            </linearGradient>
            <linearGradient id="envRight" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#ede0ce" />
              <stop offset="100%" stopColor="#f5ede0" />
            </linearGradient>
            <linearGradient id="envBottom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8d8c4" />
              <stop offset="100%" stopColor="#dfc9b0" />
            </linearGradient>
            <linearGradient id="flapGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#f0e4d2" />
              <stop offset="100%" stopColor="#fdf8f0" />
            </linearGradient>
            <radialGradient id="sealGrad" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#f0a0b8" />
              <stop offset="60%" stopColor="#e07090" />
              <stop offset="100%" stopColor="#c85070" />
            </radialGradient>
            <filter id="sealShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(180,60,90,0.3)" />
            </filter>
          </defs>

          {/* Body */}
          <rect x="0" y="0" width={envW} height={envH} rx="8" ry="8" fill="url(#envBody)" stroke="#ddc9b0" strokeWidth="1.5" />

          {/* Left triangle fold */}
          <polygon points={`0,0 0,${envH} ${envW/2},${envH/2}`} fill="url(#envLeft)" stroke="#ddc9b0" strokeWidth="1" />
          {/* Right triangle fold */}
          <polygon points={`${envW},0 ${envW},${envH} ${envW/2},${envH/2}`} fill="url(#envRight)" stroke="#ddc9b0" strokeWidth="1" />
          {/* Bottom triangle fold */}
          <polygon points={`0,${envH} ${envW},${envH} ${envW/2},${envH/2}`} fill="url(#envBottom)" stroke="#ddc9b0" strokeWidth="1" />

          {/* Wax seal - heart shape */}
          <g filter="url(#sealShadow)">
            <path d={`M ${envW/2} ${envH/2+32}
              C ${envW/2} ${envH/2+32} ${envW/2-34} ${envH/2+16} ${envW/2-34} ${envH/2+2}
              C ${envW/2-34} ${envH/2-14} ${envW/2-22} ${envH/2-22} ${envW/2} ${envH/2-8}
              C ${envW/2+22} ${envH/2-22} ${envW/2+34} ${envH/2-14} ${envW/2+34} ${envH/2+2}
              C ${envW/2+34} ${envH/2+16} ${envW/2} ${envH/2+32} ${envW/2} ${envH/2+32} Z`}
              fill="url(#sealGrad)" />
            <text x={envW/2} y={envH/2+14} textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="18" fontStyle="italic" fontWeight="400" fill="rgba(255,255,255,0.9)" style={{ pointerEvents: "none" }}>K</text>
          </g>

          {/* Flap — rendered on top */}
          <g className={flapClass} style={{ transformOrigin: `${envW/2}px 0px` }}>
            <polygon points={`0,0 ${envW},0 ${envW/2},${envH/2}`} fill="url(#flapGrad)" stroke="#ddc9b0" strokeWidth="1.5" />
          </g>

          {/* "click me" stamp — always on top, top-right corner */}
          <g transform={`translate(${envW - 72}, 14)`}>
            <rect x="0" y="0" width="58" height="44" rx="3" fill="#fdf8f0" stroke="#c4778a" strokeWidth="1.5" strokeDasharray="3,2" />
            <rect x="3" y="3" width="52" height="38" rx="2" fill="none" stroke="#e8a0b0" strokeWidth="0.8" />
            <text x="29" y="17" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="8" fontWeight="600" fill="#c4778a" letterSpacing="1.5">CLICK</text>
            <line x1="8" y1="21" x2="50" y2="21" stroke="#e8a0b0" strokeWidth="0.7" />
            <text x="29" y="33" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="8" fontWeight="600" fill="#c4778a" letterSpacing="1.5">TO OPEN</text>
          </g>
        </svg>
      </div>

    </div>
  );
}

// Generic hook for dragging within a parent container
function useDrag(initialPos) {
  const [pos, setPos] = useState(initialPos);
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const ref = useRef(null);

  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = ref.current.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const parent = ref.current?.offsetParent;
    const onMove = (e) => {
      if (!parent) return;
      const pr = parent.getBoundingClientRect();
      setPos({
        x: e.clientX - pr.left - offset.current.x,
        y: e.clientY - pr.top - offset.current.y,
      });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging]);

  return { pos, dragging, ref, onMouseDown };
}

function DraggableBadge({ children, initialPos, style, hoverLabel }) {
  const { pos, dragging, ref, onMouseDown } = useDrag(initialPos);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        background: "#fff",
        borderRadius: 14,
        padding: "10px 16px",
        fontFamily: "Inter, sans-serif",
        fontSize: "0.82rem",
        fontWeight: 500,
        whiteSpace: "nowrap",
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        zIndex: dragging ? 30 : 10,
        transition: dragging ? "none" : "box-shadow 0.2s",
        ...style,
      }}
    >
      {children}
      {hoverLabel && hovered && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#fff",
          border: "1.5px solid #f9c8d4",
          borderRadius: 10,
          padding: "6px 12px",
          fontSize: "0.78rem",
          fontWeight: 500,
          color: "#c4778a",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 16px rgba(196,119,138,0.15)",
          pointerEvents: "none",
        }}>
          {hoverLabel}
        </div>
      )}
    </div>
  );
}

function PolaroidGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [sendingBack, setSendingBack] = useState(false);
  const [hovered, setHovered] = useState(false);
  const startX = useRef(0);

  const ROTATIONS = [-3, 2, -1.5, 2.5];
  const visiblePhotos = PHOTO_URLS.filter(u => u);
  const total = visiblePhotos.length;

  const sendToBack = () => {
    if (sendingBack) return;
    setSendingBack(true);
    setTimeout(() => {
      setCurrentIndex(i => (i + 1) % total);
      setDragX(0);
      setSendingBack(false);
    }, 400);
  };

  const handleMouseDown = (e) => {
    if (sendingBack) return;
    startX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setDragX(e.clientX - startX.current);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(dragX) > 60) sendToBack();
    else setDragX(0);
  };

  const handleTouchStart = (e) => {
    if (sendingBack) return;
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setDragX(e.touches[0].clientX - startX.current);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(dragX) > 60) sendToBack();
    else setDragX(0);
  };

  if (total === 0) return null;

  // Render cards from bottom of stack to top so top card is last (highest z)
  // Indices: currentIndex = top, currentIndex+1 = second, etc.
  const stackOrder = [2, 1, 0]; // 0 = top card, rendered last

  return (
    <div style={{ position: "relative", width: 320, height: 420, userSelect: "none" }}>
      {stackOrder.map((stackPos) => {
        const photoIdx = (currentIndex + stackPos) % total;
        const isTop = stackPos === 0;
        const baseRot = ROTATIONS[photoIdx % ROTATIONS.length];

        // Top card: follows drag, then animates to back on release
        // Back cards: sit still, slightly offset
        const backOffset = stackPos * 5;
        const backRot = ROTATIONS[(photoIdx + stackPos) % ROTATIONS.length] * (stackPos === 1 ? 0.6 : 0.3);

        let transform, transition, zIndex, boxShadow;

        if (isTop) {
          const rot = baseRot + dragX * 0.03;
          if (sendingBack) {
            transform = `translateX(-50%) rotate(${baseRot * 0.3}deg) scale(0.88)`;
            transition = "transform 0.4s cubic-bezier(.4,0,.2,1), box-shadow 0.4s, z-index 0s 0.2s";
            zIndex = 1;
            boxShadow = "0 4px 16px rgba(180,120,140,0.1)";
          } else if (isDragging) {
            transform = `translateX(calc(-50% + ${dragX}px)) rotate(${rot}deg)`;
            transition = "none";
            zIndex = 10;
            boxShadow = "0 18px 50px rgba(180,120,140,0.28)";
          } else if (hovered) {
            transform = `translateX(-50%) rotate(${baseRot + 6}deg) translateY(-6px)`;
            transition = "transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s";
            zIndex = 10;
            boxShadow = "0 24px 60px rgba(180,120,140,0.35)";
          } else {
            transform = `translateX(calc(-50% + ${dragX}px)) rotate(${rot}deg)`;
            transition = "transform 0.3s cubic-bezier(.34,1.56,.64,1)";
            zIndex = 10;
            boxShadow = "0 18px 50px rgba(180,120,140,0.28)";
          }
        } else {
          // When top is sending back, shift stack up
          const shifting = sendingBack;
          const shiftedPos = shifting ? stackPos - 1 : stackPos;
          transform = `translateX(-50%) rotate(${shifting ? ROTATIONS[(photoIdx) % ROTATIONS.length] * (stackPos === 1 ? 0.3 : 0.6) : backRot}deg) translateY(${shiftedPos * 4}px)`;
          transition = sendingBack ? "transform 0.4s cubic-bezier(.34,1.56,.64,1)" : "none";
          zIndex = 10 - stackPos;
          boxShadow = "0 8px 28px rgba(180,120,140,0.13)";
        }

        return (
          <div
            key={`card-${photoIdx}`}
            onMouseDown={isTop ? handleMouseDown : undefined}
            onMouseMove={isTop ? handleMouseMove : undefined}
            onMouseUp={isTop ? handleMouseUp : undefined}
            onMouseLeave={isTop ? (e) => { handleMouseUp(e); setHovered(false); } : undefined}
            onMouseEnter={isTop ? () => setHovered(true) : undefined}
            onTouchStart={isTop ? handleTouchStart : undefined}
            onTouchMove={isTop ? handleTouchMove : undefined}
            onTouchEnd={isTop ? handleTouchEnd : undefined}
            style={{
              position: "absolute",
              top: isTop ? 0 : backOffset,
              left: "50%",
              transform,
              transition,
              width: 260,
              background: "#fff",
              padding: "12px 12px 60px",
              boxShadow,
              borderRadius: 4,
              zIndex,
              cursor: isTop ? (isDragging ? "grabbing" : "grab") : "default",
            }}
          >
            <div style={{ width: "100%", height: 290, background: "#f5f0ee", overflow: "hidden" }}>
              <img
                key={visiblePhotos[photoIdx]}
                src={visiblePhotos[photoIdx]}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", display: "block" }}
                draggable={false}
              />
            </div>
          </div>
        );
      })}

      {/* Dots */}
      <div style={{ position: "absolute", bottom: -36, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 20 }}>
        {visiblePhotos.map((_, i) => (
          <div
            key={i}
            style={{ width: i === currentIndex ? 20 : 8, height: 8, borderRadius: 100, background: i === currentIndex ? "#c4778a" : "#f9c8d4", transition: "all 0.3s", cursor: "pointer" }}
            onClick={() => {
              if (sendingBack) return;
              setCurrentIndex(i);
            }}
          />
        ))}
      </div>

      {/* Swipe hint */}
      <div style={{ position: "absolute", bottom: -58, left: "50%", transform: "translateX(-50%)", fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "0.78rem", fontStyle: "italic", color: "#c4778a", whiteSpace: "nowrap", opacity: 0.7 }}>swipe to flip through</div>
    </div>
  );
}

function DraggableEnvButton({ onBack }) {
  const [pos, setPos] = useState({ x: window.innerWidth - 120, y: window.innerHeight - 80 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  const onMouseDown = (e) => {
    e.preventDefault();
    const rect = ref.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragging(true);
    setHasDragged(false);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      setHasDragged(true);
      setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, offset]);

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onClick={() => { if (!hasDragged) onBack(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed", left: pos.x, top: pos.y, zIndex: 200,
        cursor: dragging ? "grabbing" : "grab",
        fontSize: "4.2rem", lineHeight: 1,
        userSelect: "none",
        filter: hovered ? "drop-shadow(0 0 25px rgba(255, 140, 170, 0.9))" : "drop-shadow(0 0 18px rgba(255, 140, 170, 0.7))",
        transform: hovered && !dragging ? "scale(1.1)" : "scale(1)",
        transition: dragging ? "none" : "transform 0.2s, filter 0.2s",
      }}
    >
      💌
      {hovered && !dragging && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.95)",
          border: "1.5px solid #f9c8d4",
          borderRadius: 10,
          padding: "6px 14px",
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: "1rem",
          fontStyle: "italic",
          fontWeight: 500,
          color: "#c4778a",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 16px rgba(196,119,138,0.15)",
          pointerEvents: "none",
        }}>
          close envelope
        </div>
      )}
    </div>
  );
}

function HeartClicker() {
  const [count, setCount] = useState(0);
  const [bursts, setBursts] = useState([]);
  const [pressing, setPressing] = useState(false);

  const MILESTONES = [10, 50, 100, 250, 500, 1000];
  const milestone = MILESTONES.slice().reverse().find(m => count >= m);

  const handleClick = (e) => {
    setCount(c => c + 1);
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const x = e.clientX - rect.left + (Math.random() - 0.5) * 40;
    const y = e.clientY - rect.top - 10;
    setBursts(b => [...b, { id, x, y }]);
    setTimeout(() => setBursts(b => b.filter(p => p.id !== id)), 700);
  };

  const getMessage = () => {
    if (count === 0) return "click the heart 🩷";
    if (count < 10) return "keep going...";
    if (count < 50) return "you're on a roll!";
    if (count < 100) return "ok you really like clicking";
    if (count < 250) return "are you ok 😭";
    if (count < 500) return "seek help immediately";
    if (count >= 1000) return "you need to go outside 💀";
    return "legendary clicker energy";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, paddingBottom: 40 }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* floating bursts */}
        {bursts.map(b => (
          <span key={b.id} style={{
            position: "absolute", left: b.x, top: b.y, fontSize: "1.1rem",
            pointerEvents: "none", zIndex: 10,
            animation: "burstFloat 0.7s ease-out forwards",
          }}>🩷</span>
        ))}

        {/* The big heart */}
        <button
          onMouseDown={() => setPressing(true)}
          onMouseUp={() => setPressing(false)}
          onMouseLeave={() => setPressing(false)}
          onClick={handleClick}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            fontSize: pressing ? "clamp(3.5rem, 10vw, 7rem)" : "clamp(4rem, 12vw, 8rem)",
            lineHeight: 1,
            transition: "font-size 0.08s ease",
            display: "block",
            filter: `drop-shadow(0 ${pressing ? 4 : 12}px ${pressing ? 8 : 32}px rgba(236,100,140,${pressing ? 0.2 : 0.35}))`,
            userSelect: "none",
          }}
        >
          🩷
        </button>
      </div>

      {/* Counter */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: "clamp(3rem, 8vw, 5rem)",
          fontWeight: 300,
          color: "#c4778a",
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}>{count.toLocaleString()}</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", letterSpacing: "0.04em", textTransform: "uppercase", color: "#b08090", marginTop: 6 }}>hearts given</div>
      </div>

      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "#8a6070", fontWeight: 300, textAlign: "center", minHeight: 24, transition: "all 0.3s" }}>
        {getMessage()}
      </p>

      {milestone && (
        <div style={{ background: "#fff5f7", border: "1.5px solid #f9c8d4", borderRadius: 14, padding: "10px 24px", fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "#c4778a", fontWeight: 500 }}>
          🎉 {milestone} hearts milestone!
        </div>
      )}

      <style>{`
        @keyframes burstFloat {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(1.4); }
        }
      `}</style>
    </div>
  );
}


function SparkCursor() {
  const [sparks, setSparks] = useState([]);
  const idRef = useRef(0);

  const onMouseMove = useCallback((e) => {
    const id = idRef.current++;
    const symbols = ["✦", "✦", "✧", "⋆", "·"];
    const colors = ["#e8a0b0", "#c4778a", "#e8a0b0", "#e8a0b0", "#f9c8d4", "#f9c8d4"];
    const size = 0.6 + Math.random() * 0.8;
    const offsetX = (Math.random() - 0.5) * 24;
    const offsetY = (Math.random() - 0.5) * 24;
    const spark = {
      id,
      x: e.clientX + offsetX,
      y: e.clientY + offsetY,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      size,
      rotate: Math.random() * 360,
    };
    setSparks(prev => [...prev.slice(-18), spark]);
    setTimeout(() => setSparks(prev => prev.filter(s => s.id !== id)), 700);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
      {sparks.map(s => (
        <span
          key={s.id}
          className="cursor-spark"
          style={{
            position: "fixed",
            left: s.x,
            top: s.y,
            fontSize: `${s.size}rem`,
            color: s.color,
            transform: `rotate(${s.rotate}deg)`,
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
}

function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { setVisible(entry.isIntersecting); },
      { threshold: options.threshold ?? 0.15, rootMargin: options.rootMargin ?? "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function ScrollReveal({ children, delay = 0, direction = "up", threshold = 0.15, style = {} }) {
  const { ref, visible } = useScrollReveal({ threshold });
  const translateMap = { up: "translateY(36px)", down: "translateY(-36px)", left: "translateX(-36px)", right: "translateX(36px)" };
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0)" : translateMap[direction],
        transition: `opacity 0.75s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.75s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function Portfolio() {
  const [opened, setOpened] = useState(false);
  const [envelopeClosing, setEnvelopeClosing] = useState(false);
  const activeSection = useScrollSpy(NAV_LINKS.map((n) => n.toLowerCase()));
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const handleBack = () => {
    setEnvelopeClosing(true);
    setTimeout(() => {
      setOpened(false);
      setEnvelopeClosing(false);
      window.scrollTo({ top: 0 });
    }, 700);
  };

  return (
    <>
      <SparkCursor />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');

        @media (max-width: 900px) {
          .home-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .home-photo-container { order: -1; min-height: 380px !important; }
          .home-title { font-size: clamp(2.5rem, 8vw, 4rem) !important; }
          .home-divider { margin: 20px 0 40px !important; }
        }

        body { background: #ffffff; }
        .grid-bg {
          background-color: #fce8ed;
          background-image: radial-gradient(circle, #ddd0cb 3.5px, transparent 3.5px);
          background-size: 52px 52px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #ffffff; }
        ::-webkit-scrollbar-thumb { background: #d4a5b0; border-radius: 10px; }
        @keyframes floatAnim { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes blobAnim { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
        @keyframes heartbeat { 0%,100%{transform:scale(1)} 30%{transform:scale(1.3)} 60%{transform:scale(0.95)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUpOff { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-120vh);opacity:0} }
        @keyframes sparkle { 0%,100%{opacity:0;transform:scale(0)} 50%{opacity:1;transform:scale(1)} }
        @keyframes sparkFade { 0%{opacity:1;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(0) translateY(-12px)} }
        .cursor-spark { animation: sparkFade 0.7s ease-out forwards; transform-origin: center; }
        @keyframes openFlap { 0%{transform:perspective(500px) rotateX(0deg)} 100%{transform:perspective(500px) rotateX(-165deg)} }
        @keyframes closeFlap { 0%{transform:perspective(500px) rotateX(-165deg)} 100%{transform:perspective(500px) rotateX(0deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .env-float { animation: floatAnim 3s ease-in-out infinite; }
        .env-exit { animation: slideUpOff 0.85s cubic-bezier(.4,0,.2,1) forwards; }
        .flap-open { animation: openFlap 0.45s cubic-bezier(.4,0,.2,1) forwards; }
        .flap-close { animation: closeFlap 0.5s cubic-bezier(.4,0,.2,1) forwards; }
        .heart { animation: heartbeat 1.4s ease-in-out infinite; display: inline-block; }
        .intro-text { animation: fadeInUp 0.8s ease both 0.35s; opacity: 0; }
        .click-hint { animation: fadeInUp 0.8s ease both 0.7s; opacity: 0; }
        .sp1 { animation: sparkle 2s ease-in-out infinite 0s; }
        .sp2 { animation: sparkle 2s ease-in-out infinite 0.4s; }
        .sp3 { animation: sparkle 2s ease-in-out infinite 0.8s; }
        .sp4 { animation: sparkle 2s ease-in-out infinite 1.2s; }
        .blob-img { animation: blobAnim 10s ease-in-out infinite; }
        .badge1 { animation: floatAnim 4s ease-in-out infinite; }
        .badge2 { animation: floatAnim 5s ease-in-out infinite 1s; }
        .fade-up { animation: fadeUp 0.8s cubic-bezier(.16,1,.3,1) both; }
        .d1 { animation-delay: 0.1s; }
        .d2 { animation-delay: 0.25s; }
        .d3 { animation-delay: 0.4s; }
        .d4 { animation-delay: 0.55s; }
        .nav-heart { position: relative; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; background: none; border: none; padding: 0; width: 68px; height: 60px; transition: transform 0.2s; }
        .nav-heart:hover { transform: scale(1.1); }
        .nav-heart svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        .nav-heart span { position: relative; z-index: 1; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.05em; text-transform: lowercase; color: #fff; line-height: 1; text-align: center; padding-bottom: 5px; }
        .nav-heart.active svg path { fill: #c4556e !important; }
        .skill-tag { display: inline-block; background: #fff; border: 1.5px solid #c8e8cf; color: #3a6047; font-family: Inter, sans-serif; font-size: 0.8rem; padding: 5px 14px; border-radius: 100px; transition: all 0.2s; font-weight: 400; }
        .skill-tag:hover { background: #c8e8cf; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(107,191,130,0.18); }
        .project-card { background: #fff; border: 1.5px solid #f0d8de; border-radius: 18px; padding: 28px 30px; transition: all 0.3s cubic-bezier(.34,1.56,.64,1); position: relative; overflow: hidden; }
        .project-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #f9a8ba, #a8d5b0); opacity: 0; transition: opacity 0.3s; }
        .project-card:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(180,120,140,0.12); border-color: #e8c0ca; }
        .project-card:hover::before { opacity: 1; }
        .proj-link { display: inline-flex; align-items: center; gap: 5px; font-family: Inter, sans-serif; font-size: 0.78rem; font-weight: 500; text-decoration: none; color: #5d9970; border-bottom: 1.5px solid #a8d5b0; padding-bottom: 1px; transition: all 0.2s; }
        .proj-link:hover { color: #3a6047; }
        .social-card { border-radius: 20px; padding: 32px 28px; border: 1.5px solid #f0d8de; text-decoration: none; display: block; background: #fff; transition: all 0.3s cubic-bezier(.34,1.56,.64,1); box-sizing: border-box; }
        .social-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 24px 50px rgba(180,120,140,0.15); }
        .heart-clip {
          clip-path: path('M 160 290 C 160 290 20 200 20 110 C 20 55 65 20 110 20 C 135 20 155 35 160 50 C 165 35 185 20 210 20 C 255 20 300 55 300 110 C 300 200 160 290 160 290 Z');
        }
        @keyframes heartPulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .heart-photo-wrap { animation: heartPulse 4s ease-in-out infinite; }
      `}</style>

      {(!opened || envelopeClosing) && <EnvelopeScreen onOpen={() => { window.scrollTo({ top: 0 }); setOpened(true); }} isClosing={envelopeClosing} />}

      {opened && <DraggableEnvButton onBack={handleBack} />}

      <div className="grid-bg" style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", color: "#3a2a2e", opacity: opened ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>

        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99, height: 150, backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", background: "linear-gradient(to bottom, rgba(252,232,237,0.55) 0%, rgba(252,232,237,0) 100%)", maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)", pointerEvents: "none" }} />

        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 100, display: "flex", alignItems: "stretch", gap: 12, width: "calc(100vw - 48px)", maxWidth: 1200 }}>
          {/* Logo pill - separate from nav */}
          <button onClick={() => scrollTo("home")} style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", border: "1.5px solid #f0d8de", borderRadius: "100px", padding: "10px 20px", boxShadow: "0 8px 32px rgba(180,120,140,0.12)", cursor: "pointer", fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "1.2rem", fontWeight: 600, color: "#c4778a", letterSpacing: "0.01em", whiteSpace: "nowrap", flexShrink: 0, display: "flex", alignItems: "center" }}>k.h.</button>
          {/* Nav pill - fills remaining space, hearts right-aligned with fixed gap */}
          <nav style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", border: "1.5px solid #f0d8de", borderRadius: "100px", padding: "10px 20px", boxShadow: "0 8px 32px rgba(180,120,140,0.12)", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", flex: 1 }}>
            {NAV_LINKS.map((link) => (
              <button key={link} className={"nav-heart" + (activeSection === link.toLowerCase() ? " active" : "")} onClick={() => scrollTo(link.toLowerCase())}>
                <svg viewBox="0 0 68 60" xmlns="http://www.w3.org/2000/svg">
                  <path d="M34 54 C33 53 4 37 4 18 C4 8 12 2 21 2 C27 2 32 6 34 10 C36 6 41 2 47 2 C56 2 64 8 64 18 C64 37 35 53 34 54Z" fill="#e8a0b0"/>
                </svg>
                <span>{link}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* HOME */}
        <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "170px 5vw 80px", position: "relative", overflow: "hidden" }}>
          {/* Sparkles - fixed to bottom corners only, well below nav and text */}
          <span className="sp3" style={{ position: "absolute", bottom: "14%", left: "3%", fontSize: "clamp(0.6rem, 1.5vw, 1rem)", color: "#e8a0b0", pointerEvents: "none" }}>✦</span>
          <span className="sp4" style={{ position: "absolute", bottom: "12%", right: "3%", fontSize: "clamp(0.6rem, 1.5vw, 1rem)", color: "#c4778a", pointerEvents: "none" }}>✦</span>
          <span className="sp1" style={{ position: "absolute", bottom: "28%", left: "2%", fontSize: "clamp(0.5rem, 1vw, 0.8rem)", color: "#c4778a", pointerEvents: "none" }}>✦</span>
          <span className="sp2" style={{ position: "absolute", bottom: "26%", right: "2%", fontSize: "clamp(0.5rem, 1vw, 0.8rem)", color: "#e8a0b0", pointerEvents: "none" }}>✦</span>
          <div className="home-grid" style={{ maxWidth: 1000, width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#b08090", marginBottom: 12 }} className="fade-up">welcome to my portfolio</p>
              <h1 className="home-title fade-up d1" style={{ fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
                <span style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}>Hi, I'm</span><br />
                <em style={{ color: "#c4778a", fontSize: "clamp(3.8rem, 9vw, 7rem)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>Katie Hsu</em>
              </h1>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", lineHeight: 1.8, color: "#6a4c58", fontWeight: 400, marginBottom: 24 }} className="fade-up d2">
                she/her<br />Informatics Major at UW Seattle<br />Teaching Assistant for Client Side Web Development
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", lineHeight: 1.8, color: "#7a5060", fontWeight: 400, marginBottom: 36 }} className="fade-up d3">
                I'm a BS Informatics student with a minor in Data Science at the University of Washington, graduating June 2027. I love building thoughtful web experiences and diving deep into data to uncover meaningful insights.
              </p>
              <div className="home-buttons fade-up d4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <button onClick={() => scrollTo("projects")} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "13px 28px", background: "#e8a0b0", color: "#fff", border: "none", borderRadius: "100px", cursor: "pointer", boxShadow: "0 6px 20px rgba(196,119,138,0.22)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>View Projects</button>
                <button onClick={() => scrollTo("socials")} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "13px 28px", background: "transparent", color: "#5d9970", border: "1.5px solid #a8d5b0", borderRadius: "100px", cursor: "pointer", transition: "all 0.25s" }} onMouseEnter={e => { e.currentTarget.style.background="#e8a0b0"; e.currentTarget.style.color="#fff"; }} onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#5d9970"; }}>Get In Touch</button>
              </div>
            </div>

            <div className="home-photo-container fade-up d2" style={{ position: "relative", width: "100%", minHeight: 420, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div style={{ position: "relative", width: 320, height: 480, display: "flex", justifyContent: "center" }}>
                <PolaroidGallery />
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" style={{ padding: "100px 5vw", backgroundColor: "#ffddea", backgroundImage: "radial-gradient(circle, #ffb6d1 3.5px, transparent 3.5px)", backgroundSize: "52px 52px", borderTop: "1px solid #f0d8de" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <ScrollReveal delay={0}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#b08090", marginBottom: 12 }}>what i know</p>
              <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 300, lineHeight: 1.1, fontFamily: "Cormorant Garamond, Georgia, serif" }}>Skills &amp;<br /><em style={{ color: "#e8a0b0" }}>Technologies</em></h2>
              <div style={{ width: 60, height: 2, background: "#e8a0b0", margin: "20px 0 40px", borderRadius: 2 }} />
            </ScrollReveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
              {Object.entries(skills).map(([cat, items], i) => (
                <ScrollReveal key={cat} delay={i * 100} direction="up">
                  <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "#5d9970", marginBottom: 18 }}>{cat}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {items.map((s) => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" style={{ padding: "100px 5vw", borderTop: "1px solid #f0d8de" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <ScrollReveal delay={0}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#b08090", marginBottom: 12 }}>things i've built</p>
              <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 300, lineHeight: 1.1, fontFamily: "Cormorant Garamond, Georgia, serif" }}>Featured<br /><em style={{ color: "#c4778a" }}>Projects</em></h2>
              <div style={{ width: 60, height: 2, background: "#e8a0b0", margin: "20px 0 40px", borderRadius: 2 }} />
            </ScrollReveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24, gridAutoRows: "1fr" }}>
              {projects.map((p, i) => (
                <ScrollReveal key={p.title} delay={i * 80} direction="up" threshold={0.1} style={{ height: "100%" }}>
                  <div className="project-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 14 }}>{p.emoji}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.04em", textTransform: "uppercase", color: "#b08090", fontWeight: 500, marginBottom: 6 }}>{p.subtitle}</div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 500, color: "#3a2a2e", marginBottom: 12 }}>{p.title}</h3>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", lineHeight: 1.75, color: "#6a4c58", fontWeight: 400, marginBottom: 18, flex: 1 }}>{p.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
                      {p.tags.map((t) => <span key={t} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", background: "rgba(168,213,176,0.2)", color: "#3a6047", padding: "3px 12px", borderRadius: "100px" }}>{t}</span>)}
                    </div>
                    <div style={{ display: "flex", gap: 18 }}>
                      {p.links.map((l) => <a key={l.label} href={l.href} className="proj-link" target="_blank" rel="noreferrer">{l.label} →</a>)}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* SOCIALS */}
        <section id="socials" style={{ padding: "100px 5vw", backgroundColor: "#ffddea", backgroundImage: "radial-gradient(circle, #ffb6d1 3.5px, transparent 3.5px)", backgroundSize: "52px 52px", borderTop: "1px solid #f0d8de" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <ScrollReveal delay={0}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#b08090", marginBottom: 12 }}>let's connect</p>
              <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 300, lineHeight: 1.1, fontFamily: "Cormorant Garamond, Georgia, serif" }}>Find Me<br /><em style={{ color: "#e8a0b0" }}>Online</em></h2>
              <div style={{ width: 60, height: 2, background: "#e8a0b0", margin: "20px 0 40px", borderRadius: 2 }} />
            </ScrollReveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 18, marginBottom: 60, alignItems: "stretch" }}>
              {socials.map((s, i) => (
                <ScrollReveal key={s.name} delay={i * 80} direction="up" threshold={0.1} style={{ height: "100%" }}>
                  <a href={s.href} className="social-card" target="_blank" rel="noreferrer" style={{ height: "100%" }}>
                    <div style={{ fontSize: "2.2rem", marginBottom: 14 }}>{s.emoji}</div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 500, marginBottom: 4, color: "#3a2a2e" }}>{s.name}</h3>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#5d9970", fontWeight: 500, marginBottom: 6 }}>{s.handle}</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#8a6070", fontWeight: 400 }}>{s.desc}</p>
                  </a>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal delay={100} direction="up">
              <div style={{ background: "#fff", border: "1.5px solid #f0d8de", borderRadius: 24, padding: "48px", textAlign: "center" }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b08090", marginBottom: 16 }}>open to opportunities</p>
                <h3 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 300, color: "#3a2a2e", marginBottom: 12 }}>Want to work together?</h3>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "#6a4c58", fontWeight: 300, margin: "0 auto 28px", maxWidth: 460, lineHeight: 1.75 }}>I'm always open to interesting projects, internships, and collaborations. Let's chat!</p>
                <a href="https://www.linkedin.com/in/katiejhsu/" target="_blank" rel="noreferrer" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "13px 32px", background: "#e8a0b0", color: "#fff", borderRadius: "100px", textDecoration: "none", display: "inline-block", boxShadow: "0 6px 20px rgba(109,191,130,0.22)" }}>Say Hello on LinkedIn →</a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* FUN */}
        <section id="fun" style={{ padding: "100px 5vw", minHeight: "60vh", borderTop: "1px solid #f0d8de" }}>
          <div style={{ maxWidth: 700, margin: "0 auto", width: "100%" }}>
            <ScrollReveal delay={0}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#b08090", marginBottom: 12 }}>just for fun</p>
              <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 300, lineHeight: 1.1, fontFamily: "Cormorant Garamond, Georgia, serif" }}>The Fun<br /><em style={{ color: "#c4778a" }}>Zone ✨</em></h2>
              <div style={{ width: 60, height: 2, background: "#e8a0b0", margin: "20px 0 40px", borderRadius: 2 }} />
            </ScrollReveal>
            <ScrollReveal delay={150} direction="up" threshold={0.1}>
              <HeartClicker />
            </ScrollReveal>
          </div>
        </section>

        <footer style={{ padding: "32px", textAlign: "center", borderTop: "1px solid #f0d8de" }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#b08090", fontWeight: 300 }}>designed &amp; built with &lt;3 by katie hsu · 2026</p>
        </footer>

      </div>
    </>
  );
}