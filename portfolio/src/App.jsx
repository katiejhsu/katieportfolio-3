import { useState, useEffect, useRef, useCallback } from "react";

import beachImg from "./assets/beach.jpeg";
import dunesImg from "./assets/dunes.jpeg";
import seattleImg from "./assets/seattle.jpg";
import valleyImg from "./assets/valley.jpg";
import paddleImg from "./assets/paddle.jpg";
import hikingImg from "./assets/hiking.jpg";
import trailImg from "./assets/trail.jpg";
import swimImg from "./assets/swim.jpg";
import yogaImg from "./assets/yoga.jpg";

const PHOTO_URLS = [
  beachImg,
  dunesImg,
  seattleImg,
  valleyImg,
];

const NAV_LINKS = ["Skills", "Projects", "Experience", "Socials"];

const skills = {
  "Programming Languages": ["Java", "SQL", "Python", "R", "HTML", "CSS", "JavaScript", "Swift"],
  "Libraries & Frameworks": ["Firebase", "React", "Node.js", "pandas", "plotly", "scikit-learn", "matplotlib", "RShiny", "Vite"],
  "Tools & Methodologies": ["Relational Data Modeling", "Data Analysis", "Data Cleaning", "Data Visualization", "Query Writing", "DBMS", "Git", "Power BI", "Azure DevOps", "RESTful API Design", "Auth (Azure AD)", "Unit Testing (XCTest, Jest)", "CI/CD (Render)"],
};

const projects = [
  { title: "Mood Diary", subtitle: "Full Stack Web App", desc: "A full-stack mood sharing web application with friends featuring Azure authentication, WebSockets for real-time interaction, and a MongoDB backend.", tags: ["MongoDB", "WebSockets", "Azure"], links: [{ label: "Git Repo", href: "https://github.com/katiejhsu/Mood-Diary" }, { label: "Live Demo", href: "https://final-project-group5-its0.onrender.com/" }], emoji: "🌸", categories: ["fullstack", "database"] },
  { title: "Analyzing Netflix", subtitle: "RShiny App", desc: "An interactive RShiny application featuring statistical analysis of genre trends and content performance using a consolidated dataset of 1,700+ entries.", tags: ["R", "RShiny", "Statistics"], links: [{ label: "Git Repo", href: "https://github.com/katiejhsu/AnalyzingNetflix" }, { label: "Live Demo", href: "https://analyzingnetflix.shinyapps.io/analyzingNetflix/" }], emoji: "📊", categories: ["datascience"] },
  { title: "Global Hunger & Food Needs Database", subtitle: "SQL", desc: "A relational database utilizing 9 interconnected tables and complex SQL queries to analyze global land use and sustainability insights.", tags: ["SQL", "Database Design", "Sustainability"], links: [{ label: "Git Repo", href: "https://github.com/katiejhsu/INFO-330-Project" }], emoji: "🌿", categories: ["database"] },
  { title: "Solar Power Generation Efficiency Analysis", subtitle: "Python", desc: "A Python-based analysis of three distinct datasets using pandas and plotly to visualize power generation trends through dynamic charts.", tags: ["Python", "pandas", "plotly"], links: [{ label: "Git Repo", href: "https://github.com/katiejhsu/Solar-Power-Generation-Efficiency-Analysis" }], emoji: "☀️", categories: ["datascience"] },
  { title: "Husky Maps", subtitle: "2nd Place Hackathon Project", desc: "An award-winning navigation API that utilizes a modified Dijkstra's algorithm to calculate optimal campus paths based on real-time building access.", tags: ["Algorithms", "APIs", "Hackathon"], links: [{ label: "Hackathon Page", href: "https://devpost.com/software/husky-maps" }], emoji: "🗺️", categories: ["fullstack"] },
  { title: "Analyzing Social & Demographic Influences on Income", subtitle: "R & Power BI", desc: "An end-to-end statistical analysis using multiple linear regression in R and an interactive Power BI dashboard with automated ETL pipelines and dynamic slicers.", tags: ["R", "Power BI", "Machine Learning", "ETL"], links: [{ label: "R Git Repo", href: "https://github.com/katiejhsu/Analyzing-Social-and-Demographic-Influences-on-Income" }, { label: "Power BI Git Repo", href: "https://github.com/katiejhsu/PowerBI-Dashboard-Analyzing-Sociodemographic-Influences-on-Income-.git" }], emoji: "📈", categories: ["datascience"] },
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

function EnvelopeScreen({ onOpen, isClosing, hasVisited }) {
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
      
      {/* Made with / thanks for visiting text — shown below envelope when centered */}
      {!pos && (
        <div className="intro-text" style={{ position: "absolute", bottom: 120, fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(1.9rem, 5vw, 2.6rem)", color: "#c4778a", textAlign: "center", fontWeight: 300 }}>
          {hasVisited
            ? <em>thanks for visiting! 🩷</em>
            : <><em>made with </em><span style={{ fontSize: "clamp(1.9rem, 5vw, 2.6rem)", verticalAlign: "middle", display: "inline-block", lineHeight: 1 }}>🩷</span></>
          }
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
            <path d={`M ${envW/2} ${envH/2+30}
              C ${envW/2-4} ${envH/2+26} ${envW/2-28} ${envH/2+14} ${envW/2-28} ${envH/2}
              C ${envW/2-28} ${envH/2-14} ${envW/2-18} ${envH/2-22} ${envW/2} ${envH/2-10}
              C ${envW/2+18} ${envH/2-22} ${envW/2+28} ${envH/2-14} ${envW/2+28} ${envH/2}
              C ${envW/2+28} ${envH/2+14} ${envW/2+4} ${envH/2+26} ${envW/2} ${envH/2+30} Z`}
              fill="url(#sealGrad)" />
            <text x={envW/2} y={envH/2+12} textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="18" fontStyle="italic" fontWeight="400" fill="rgba(255,255,255,0.9)" style={{ pointerEvents: "none" }}>K</text>
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

  const sendToPrev = () => {
    if (sendingBack) return;
    setSendingBack(true);
    setTimeout(() => {
      setCurrentIndex(i => (i - 1 + total) % total);
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
    if (dragX < -60) sendToBack();
    else if (dragX > 60) sendToPrev();
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
    if (dragX < -60) sendToBack();
    else if (dragX > 60) sendToPrev();
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

function useDraggableFloating(initialX, initialY, size) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const userHasDragged = useRef(false); // tracks if user ever manually moved it
  const initialYRef = useRef(initialY);
  const ref = useRef(null);

  const clamp = useCallback((x, y) => ({
    x: Math.min(Math.max(x, 0), window.innerWidth - size),
    y: Math.min(Math.max(y, 0), window.innerHeight - size),
  }), [size]);

  // On resize: snap back to right edge if user hasn't dragged, otherwise just clamp
  useEffect(() => {
    const onResize = () => {
      if (!userHasDragged.current) {
        setPos({ x: window.innerWidth - 80, y: initialYRef.current });
      } else {
        setPos(p => clamp(p.x, p.y));
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clamp]);

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
      userHasDragged.current = true;
      setPos(clamp(e.clientX - offset.x, e.clientY - offset.y));
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, offset, clamp]);

  return { pos, dragging, hasDragged, ref, onMouseDown };
}

function DraggableEnvButton({ onBack }) {
  const size = 70;
  const { pos, dragging, hasDragged, ref, onMouseDown } = useDraggableFloating(
    window.innerWidth - 80, window.innerHeight - 80, size
  );
  const [hovered, setHovered] = useState(false);

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
        animation: dragging ? "none" : "floatAnim 3.5s ease-in-out infinite",
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

// FitTextLines: each line fills the container width, but the whole block is also
// capped so every line fits within the container height — no scroll ever.
function FitTextLines({ lines, style }) {
  const containerRef = useRef(null);
  const measureRef = useRef(null);
  const [fontSizes, setFontSizes] = useState([]);
  const LINE_HEIGHT = 1.1;
  const lastWidth = useRef(0);

  useEffect(() => {
    const measure = (forceRun) => {
      const container = containerRef.current;
      const ruler = measureRef.current;
      if (!container || !ruler) return;
      const containerW = container.offsetWidth;
      const containerH = container.offsetHeight;
      if (!forceRun && containerW === lastWidth.current) return;
      lastWidth.current = containerW;
      const widthBasedSizes = lines.map((line) => {
        ruler.style.fontSize = "100px";
        ruler.style.whiteSpace = "nowrap";
        const plainText = line.map(seg => {
          if (typeof seg === "string") return seg;
          return seg.props?.word ?? seg.props?.children ?? "";
        }).join("");
        ruler.textContent = plainText;
        const lineW = ruler.scrollWidth;
        return (containerW / lineW) * 100;
      });
      const totalH = widthBasedSizes.reduce((sum, fs) => sum + fs * LINE_HEIGHT, 0);
      let finalSizes = widthBasedSizes;
      if (containerH > 0 && totalH > containerH) {
        const scale = containerH / totalH;
        finalSizes = widthBasedSizes.map(fs => fs * scale);
      }
      setFontSizes(finalSizes.map(fs => Math.floor(fs)));
    };
    measure(true);
    const ro = new ResizeObserver(() => measure(false));
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [lines]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <div ref={measureRef} style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", fontFamily: style?.fontFamily, fontWeight: style?.fontWeight, fontStyle: style?.fontStyle, letterSpacing: style?.letterSpacing }} />
      {lines.map((line, i) => (
        <div key={i} style={{ ...style, fontSize: (fontSizes[i] || 16) + "px", whiteSpace: "nowrap", lineHeight: LINE_HEIGHT, display: "block", width: "100%" }}>
          {line}
        </div>
      ))}
    </div>
  );
}


const ASCII_KATIE_HSU_FANCY = `.--.   .--.     ____   ,---------. .-./\`)     .-''-.          .---.  .---.    .-'''-. ___    _  
|  | _/  /    .'  __ \`.\          \\ .-.')  .'_ _   \`         |   |  |_ _|   / _     \`.'   |  | | 
| (\`' ) /    /   '  \\  \`\`--.  ,---'/ \`-' \\ / ( \` )   '        |   |  ( ' )  (\`' )/\`--'|   .'  | | 
|(_ ()_)     |___|  /  |   |   \\    \`-'\`"\`. (_ o _)  |        |   '-(_{;}_)(_ o _).   .'  '_  | | 
| (_,_)   __    _.-\`   |   :_ _:    .---. |  (_,_)___|        |      (_,_)  (_,_). '. '   ( \\.-.| 
|  |\ \\ |  |.'   _    |  (_(=)_)   |   | '  \\   .---.        | _ _--.   | .---.  \\  :' (\`. _\` /| 
|  | \\ \`'   /|  _( )_  |   (_I_)    |   |  \\  \`-'    /        |( ' ) |   | \\    \`-'  || (_ (_) _) 
|  |  \\    / \\ (_ o _) /   (_I_)    |   |   \\       /         (_{;}_)|   |  \\       /  \\ /  . \\ / 
\`--'   \`'-'   '.(_,_).'    '---'    '---'    \`'-..-'          '(_,_) '---'   \`-...-'    \`\`-'\`-''`;

const ASCII_KATIE_HSU_CURSIVE = `     .                          .--.      __.....__                  .                               
   .'|                          |__|  .-''         '.              .'|                               
 .'  |                      .|  .--. /     .-''"'-.  \`.           <  |                               
<    |            __      .' |_ |  |/     /________\\   \\           | |                               
 |   | ____    .:--.'.  .'     ||  ||                  |           | | .''-. \`        _     _    _   
 |   | \\ .'   / |   \\ |'--.  .-'|  |\\    .-------------'           | |/.'''. \\      .' |   | '  / |  
 |   |/  .    \`" __ | |   |  |  |  | \\    '-.____...---.           |  /    | |     .   | /.' | .' |  
 |    /\\  \\    .'.''| |   |  |  |__|  \`.             .'            | |     | |   .'.'| |///  | /  |  
 |   |  \\  \\  / /   | |_  |  '.'        \`''-...... -'              | |     | | .'.'.-'  /|   \`'.  |  
 '    \\  \\  \\ \\ \\._,\\ '/  |   /                                    | '.    | '..'   \\_.' '   .'|  '/ 
'------'  '---'\`--'  \`"   \`'-'                                     '---'   '---'          \`-'  \`--'`;

const NAME_STYLES = [
  {
    fontFamily: "Cormorant Garamond, Georgia, serif",
    fontStyle: "italic",
    fontWeight: 300,
    color: "#c4778a",
  },
  {
    fontFamily: "Georgia, serif",
    fontStyle: "normal",
    fontWeight: 400,
    color: "#c4778a",
    letterSpacing: "0.1em",
  },
  {
    fontFamily: "'Lucida Console', 'Consolas', 'Courier New', monospace",
    fontStyle: "normal",
    fontWeight: 900,
    color: "#c4778a",
    whiteSpace: "pre",
    lineHeight: 1.2,
    textShadow: "0.4px 0 0 #c4778a, -0.4px 0 0 #c4778a, 0 0.4px 0 #c4778a, 0 -0.4px 0 #c4778a",
  },
  {
    fontFamily: "'Lucida Console', 'Consolas', 'Courier New', monospace",
    fontStyle: "normal",
    fontWeight: 900,
    color: "#c4778a",
    whiteSpace: "pre",
    lineHeight: 1.25,
    textShadow: "0.4px 0 0 #c4778a, -0.4px 0 0 #c4778a, 0 0.4px 0 #c4778a, 0 -0.4px 0 #c4778a",
  },
];

const NAME_TEXT = ["Katie Hsu", "徐家琳", ASCII_KATIE_HSU_CURSIVE, ASCII_KATIE_HSU_FANCY];

function ScaledPre({ text, style }) {
  const containerRef = useRef(null);
  const preRef = useRef(null);
  const [fontSize, setFontSize] = useState(16);
  const lastWidth = useRef(0);

  useEffect(() => {
    const fit = (forceRun) => {
      const container = containerRef.current;
      const pre = preRef.current;
      if (!container || !pre) return;
      const targetW = container.offsetWidth;
      if (!forceRun && targetW === lastWidth.current) return;
      lastWidth.current = targetW;
      let lo = 4, hi = 200, best = 8;
      for (let i = 0; i < 30; i++) {
        const mid = (lo + hi) / 2;
        pre.style.fontSize = mid + "px";
        if (pre.scrollWidth <= targetW) { best = mid; lo = mid; }
        else { hi = mid; }
      }
      setFontSize(Math.floor(best));
    };
    setTimeout(() => fit(true), 50);
    const ro = new ResizeObserver(() => fit(false));
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div ref={containerRef} style={{ width: "100%", overflow: "hidden" }}>
      <pre
        ref={preRef}
        style={{
          ...style,
          fontSize,
          margin: 0,
          padding: 0,
          display: "block",
          whiteSpace: "pre",
        }}
      >
        {text}
      </pre>
    </div>
  );
}

function FrozenHeightName() {
  const wrapRef = useRef(null);
  const [lockedHeight, setLockedHeight] = useState(null);
  useEffect(() => {
    const lock = () => { if (wrapRef.current) setLockedHeight(wrapRef.current.scrollHeight); };
    const t = setTimeout(lock, 120);
    const onResize = () => { setLockedHeight(null); setTimeout(() => { if (wrapRef.current) setLockedHeight(wrapRef.current.scrollHeight); }, 120); };
    window.addEventListener("resize", onResize);
    return () => { clearTimeout(t); window.removeEventListener("resize", onResize); };
  }, []);
  return (
    <div ref={wrapRef} style={{ height: lockedHeight ?? "auto", overflow: "hidden", contain: "strict", width: "100%" }}>
      <CyclingName />
    </div>
  );
}

function CyclingName() {
  const [styleIndex, setStyleIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [hovered, setHovered] = useState(false);

  const cycle = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setStyleIndex(i => (i + 1) % NAME_STYLES.length);
      setAnimating(false);
    }, 200);
  }, []);

  useEffect(() => {
    const interval = setInterval(cycle, 3000);
    return () => clearInterval(interval);
  }, [cycle]);

  const handleClick = () => { if (animating) return; cycle(); };
  const currentStyle = NAME_STYLES[styleIndex];
  const activeStyle = hovered ? { ...currentStyle, color: "inherit" } : currentStyle;
  const isAscii = currentStyle?.whiteSpace === "pre";
  const asciiData = NAME_TEXT[styleIndex];

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={hovered ? "name-rainbow" : ""}
      style={{
        cursor: "pointer",
        opacity: animating ? 0 : 1,
        transform: animating ? "translateY(8px)" : "translateY(0)",
        transition: "opacity 0.2s ease, transform 0.2s ease",
        userSelect: "none",
        width: "100%",
      }}
    >
      {isAscii ? (
        <div>
          {typeof asciiData === 'object' && asciiData.katie ? (
            <>
              <ScaledPre text={asciiData.katie} style={activeStyle} />
              <ScaledPre text={asciiData.hsu} style={activeStyle} />
            </>
          ) : (
            <ScaledPre text={asciiData} style={activeStyle} />
          )}
        </div>
      ) : (
        <FitSingleLine
          style={activeStyle}
          splitAt={styleIndex === 0 ? ["Katie", "Hsu"] : styleIndex === 1 ? ["徐家", "琳"] : undefined}
        >{NAME_TEXT[styleIndex]}</FitSingleLine>
      )}
    </div>
  );
}

function FitSingleLine({ children, style, splitAt }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(16);
  const [split, setSplit] = useState(false);
  const lastWidth = useRef(0);

  useEffect(() => {
    const fit = (forceRun) => {
      const container = containerRef.current;
      const text = textRef.current;
      if (!container || !text) return;
      const targetW = container.offsetWidth;
      if (!forceRun && targetW === lastWidth.current) return;
      lastWidth.current = targetW;
      text.style.whiteSpace = "nowrap";
      let lo = 8, hi = 400, best = 16;
      for (let i = 0; i < 30; i++) {
        const mid = (lo + hi) / 2;
        text.style.fontSize = mid + "px";
        if (text.scrollWidth <= targetW) { best = mid; lo = mid; }
        else { hi = mid; }
      }
      const shouldSplit = splitAt && best < 40;
      setSplit(shouldSplit);
      setFontSize(Math.floor(best));
    };
    fit(true);
    const ro = new ResizeObserver(() => fit(false));
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [children, splitAt]);

  if (split && splitAt) {
    return (
      <div ref={containerRef} style={{ width: "100%" }}>
        <div ref={textRef} style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", ...style, whiteSpace: "nowrap" }}>{children}</div>
        <FitTextLines
          lines={splitAt.map(word => [word])}
          style={style}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <div ref={textRef} style={{ ...style, fontSize, whiteSpace: "nowrap", display: "block" }}>
        {children}
      </div>
    </div>
  );
}

const FILTERS = [
  { id: "all", label: "All" },
  { id: "fullstack", label: "Full-Stack Web Development" },
  { id: "datascience", label: "Data Science & Analytics" },
  { id: "database", label: "Database Systems & Engineering" },
];

function ProjectsWithFilter() {
  const [activeFilter, setActiveFilter] = useState("all");
  const filtered = activeFilter === "all"
    ? projects
    : projects.filter(p => p.categories.includes(activeFilter));

  return (
    <>
      {/* Filter buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.78rem",
              fontWeight: 500,
              letterSpacing: "0.03em",
              padding: "8px 20px",
              borderRadius: "100px",
              border: activeFilter === f.id ? "none" : "1.5px solid #e8a0b0",
              background: activeFilter === f.id ? "#e8a0b0" : "transparent",
              color: activeFilter === f.id ? "#fff" : "#c4778a",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (activeFilter !== f.id) { e.currentTarget.style.background = "#fce8ed"; } }}
            onMouseLeave={e => { if (activeFilter !== f.id) { e.currentTarget.style.background = "transparent"; } }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Project grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24, gridAutoRows: "1fr" }}>
        {filtered.map((p, i) => (
          <ScrollReveal key={p.title} delay={i * 80} direction="up" threshold={0.1} style={{ height: "100%" }}>
            <div className="project-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "2rem", marginBottom: 14, height: "2.5rem" }}>{p.emoji}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.04em", textTransform: "uppercase", color: "#b08090", fontWeight: 500, marginBottom: 6, minHeight: "1.2em" }}>{p.subtitle}</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 500, color: "#3a2a2e", marginBottom: 12, minHeight: "3em", display: "flex", alignItems: "flex-start" }}>{p.title}</h3>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", lineHeight: 1.75, color: "#6a4c58", fontWeight: 400, marginBottom: 18, flex: 1 }}>{p.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
                {p.tags.map((t) => <span key={t} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", background: "rgba(139,94,74,0.12)", color: "#5a2d1a", padding: "3px 12px", borderRadius: "100px" }}>{t}</span>)}
              </div>
              <div style={{ display: "flex", gap: 18 }}>
                {p.links.map((l) => <a key={l.label} href={l.href} className="proj-link" target="_blank" rel="noreferrer">{l.label} →</a>)}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}

function FunZoneModal({ onClose }) {
  const [hoveredKeyword, setHoveredKeyword] = useState(null);
  const [panelWidth, setPanelWidth] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 700);
  const rulerRef = useRef(null);

  const keywordImages = {
    paddleboarding: paddleImg,
    hiking: hikingImg,
    "trail running": trailImg,
    swimming: swimImg,
    yoga: yogaImg,
  };

  const activeImg = hoveredKeyword ? keywordImages[hoveredKeyword] : null;

  const plainLines = [
    "when i'm not", "creating websites", "or playing with", "data, i'm either",
    "out paddleboarding", "or swimming", "or hiking", "or yoga", "or trail running",
  ];

  const computeLayout = useCallback(() => {
    const mobile = window.innerWidth < 700;
    setIsMobile(mobile);
    if (mobile) { setPanelWidth(null); return; }
    const ruler = rulerRef.current;
    if (!ruler) return;
    const vh = window.innerHeight;
    const LINE_HEIGHT = 1.1;
    const REF = 100;
    ruler.style.fontFamily = "Cormorant Garamond, Georgia, serif";
    ruler.style.fontStyle = "italic";
    ruler.style.whiteSpace = "nowrap";
    ruler.style.fontSize = REF + "px";
    const naturalWidths = plainLines.map(text => { ruler.textContent = text; return ruler.scrollWidth; });
    const sumInv = naturalWidths.reduce((acc, nw) => acc + 1 / nw, 0);
    setPanelWidth(Math.ceil(vh / (LINE_HEIGHT * REF * sumInv)) + 48);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = setTimeout(computeLayout, 50);
    window.addEventListener("resize", computeLayout);
    return () => { document.body.style.overflow = ""; clearTimeout(t); window.removeEventListener("resize", computeLayout); };
  }, [computeLayout]);

  const Keyword = ({ word, id }) => {
    const active = hoveredKeyword === id;
    return (
      <span
        onClick={() => setHoveredKeyword(active ? null : id)}
        onMouseEnter={() => !isMobile && setHoveredKeyword(id)}
        onMouseLeave={() => !isMobile && setHoveredKeyword(null)}
        style={{
          color: active ? "#fff" : "#fce8ed",
          textDecoration: "underline",
          textUnderlineOffset: "4px",
          textDecorationColor: active ? "rgba(255,255,255,0.7)" : "rgba(252,232,237,0.5)",
          cursor: "pointer",
          transition: "color 0.2s",
          WebkitTapHighlightColor: "transparent",
        }}
      >{word}</span>
    );
  };

  const textLines = [
    ["when i'm not"], ["creating websites"], ["or playing with"], ["data, i'm either"],
    ["out ", <Keyword key="pb" word="paddleboarding" id="paddleboarding" />],
    ["or ", <Keyword key="sw" word="swimming" id="swimming" />],
    ["or ", <Keyword key="hk" word="hiking" id="hiking" />],
    ["or practicing ", <Keyword key="yg" word="yoga" id="yoga" />],
    ["or ", <Keyword key="tr" word="trail running" id="trail running" />],
  ];
  const textStyle = { fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 400, fontStyle: "italic", letterSpacing: "0.01em", color: "#fce8ed" };

  if (isMobile) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", flexDirection: "column", animation: "fadeInUp 0.35s cubic-bezier(.16,1,.3,1) both" }}>
        {/* Pink text — top 45vh, height: 100% so FitTextLines fills it correctly */}
        <div style={{ height: "45vh", background: "#c4556e", padding: "0 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
          <FitTextLines style={textStyle} lines={textLines} />
        </div>
        {/* Photo panel — remaining height */}
        <div style={{ flex: 1, background: "#fff", padding: "16px 24px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", overflowY: "auto", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#b08090", letterSpacing: "0.04em", textTransform: "uppercase", padding: "6px 10px", borderRadius: 100 }}>close ✕</button>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#b08090", marginBottom: 6, marginTop: 4 }}>just for fun</p>
          <h2 style={{ fontSize: "clamp(1.3rem, 5vw, 2rem)", fontWeight: 300, lineHeight: 1.1, fontFamily: "Cormorant Garamond, Georgia, serif", marginBottom: 6 }}>
            <em style={{ color: "#c4778a" }}>get to know me! ✨</em>
          </h2>
          <div style={{ width: 40, height: 2, background: "#e8a0b0", margin: "10px 0 14px", borderRadius: 2 }} />
          <div style={{ borderRadius: 16, background: "#fce8ed", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flex: 1, minHeight: 120 }}>
            {activeImg
              ? <img key={hoveredKeyword} src={activeImg} alt={hoveredKeyword} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: 16, animation: "fadeInUp 0.3s ease both" }} />
              : <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontStyle: "italic", fontSize: "1rem", color: "#c4778a", textAlign: "center", padding: "24px 16px" }}>tap a keyword ↑</p>
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", animation: "fadeInUp 0.35s cubic-bezier(.16,1,.3,1) both" }}>
      <div ref={rulerRef} style={{ position: "fixed", top: -9999, left: 0, visibility: "hidden", pointerEvents: "none" }} />
      <div onClick={e => e.stopPropagation()} style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", display: "flex" }}>
        <div style={{ width: panelWidth ? panelWidth + "px" : "50vw", height: "100vh", background: "#c4556e", padding: "0 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", flexShrink: 0, position: "sticky", top: 0, alignSelf: "flex-start", transition: "width 0.25s ease" }}>
          <FitTextLines style={textStyle} lines={textLines} />
        </div>
        <div style={{ flex: 1, maxHeight: "100vh", background: "#fff", padding: "32px 48px", boxSizing: "border-box", display: "flex", flexDirection: "column", overflowY: "scroll", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#b08090", letterSpacing: "0.04em", textTransform: "uppercase", padding: "6px 12px", borderRadius: 100, transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#fce8ed"} onMouseLeave={e => e.currentTarget.style.background = "none"}>close ✕</button>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#b08090", marginBottom: 10 }}>just for fun</p>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, lineHeight: 1.1, fontFamily: "Cormorant Garamond, Georgia, serif", marginBottom: 8 }}>
            <em style={{ color: "#c4778a" }}>get to know me a little more! ✨</em>
          </h2>
          <div style={{ width: 60, height: 2, background: "#e8a0b0", margin: "16px 0 28px", borderRadius: 2 }} />
          <div style={{ borderRadius: 20, background: "#fce8ed", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
            {activeImg
              ? <img key={hoveredKeyword} src={activeImg} alt={hoveredKeyword} style={{ width: "100%", height: "auto", display: "block", borderRadius: 20, animation: "fadeInUp 0.3s ease both" }} />
              : <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontStyle: "italic", fontSize: "1.2rem", color: "#c4778a", textAlign: "center", padding: "32px 24px" }}>hover over a keyword ←</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingShavedIceButton({ onClick }) {
  const size = 60;
  const { pos, dragging, hasDragged, ref, onMouseDown } = useDraggableFloating(
    window.innerWidth - 80, window.innerHeight - 240, size
  );
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onClick={() => { if (!hasDragged) onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed", left: pos.x, top: pos.y, zIndex: 201,
        cursor: dragging ? "grabbing" : "grab",
        fontSize: "3.6rem", lineHeight: 1,
        userSelect: "none",
        filter: hovered
          ? "drop-shadow(0 0 22px rgba(255,180,200,0.95))"
          : "drop-shadow(0 0 14px rgba(255,180,200,0.6))",
        transform: hovered && !dragging ? "scale(1.15)" : "scale(1)",
        transition: dragging ? "none" : "transform 0.2s, filter 0.2s",
        animation: dragging ? "none" : "floatAnim 3.5s ease-in-out infinite",
      }}
    >
      🍧
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
          fontSize: "1.4rem",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 16px rgba(196,119,138,0.15)",
          pointerEvents: "none",
        }}>
          🤭
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

const SKILL_CARDS = [
  { emoji: "🧹", label: "Dataset Cleaning & Analysis", desc: "R and Python (pandas) to engineer end-to-end pipelines transforming raw data into reproducible statistical models." },
  { emoji: "📊", label: "Data Visualization & Dashboards", desc: "RShiny, Power BI, Plotly and Matplotlib to translate complex trends into data-driven recommendations." },
  { emoji: "💻", label: "Full Stack Web Development", desc: "JavaScript, React, Node.js, and Swift with REST APIs, Azure Auth, and WebSockets for real-time interaction." },
  { emoji: "📈", label: "Predictive Modeling & Statistics", desc: "Multiple linear regression and socioeconomic impact modeling with scikit-learn and statistical methods." },
  { emoji: "🗄️", label: "Database Management", desc: "SQL (PostgreSQL) and NoSQL (MongoDB) with ETL methodologies, normalized schema design, and complex querying." },
];

const RAINBOW_COLORS = ["#e8a0b0", "#f4a261", "#f9c74f", "#90be6d", "#4cc9f0", "#7b5ea7", "#e8a0b0"];

function RainbowKatieButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    if (!hovered) { setColorIndex(0); return; }
    const id = setInterval(() => setColorIndex(i => (i + 1) % RAINBOW_COLORS.length), 160);
    return () => clearInterval(id);
  }, [hovered]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "none", border: "none", padding: 0, width: 110, height: 60, transition: "transform 0.2s", flexShrink: 0 }}
    >
      <svg viewBox="0 0 110 60" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        <path d="M55 54 C54 53 4 37 4 18 C4 8 15 2 28 2 C37 2 47 8 55 18 C63 8 73 2 82 2 C95 2 106 8 106 18 C106 37 56 53 55 54Z" fill="#e8a0b0"/>
      </svg>
      <span style={{ position: "relative", zIndex: 1, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "0.95rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "lowercase", color: hovered ? RAINBOW_COLORS[colorIndex] : "#fff", lineHeight: 1, textAlign: "center", paddingBottom: 5, transition: hovered ? "color 0.12s ease" : "color 0.5s ease" }}>
        katie hsu
      </span>
    </button>
  );
}
function SkillCarousel() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [dir, setDir] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [cardHeight, setCardHeight] = useState(null);
  const outerRef = useRef(null);
  const intervalRef = useRef(null);
  const total = SKILL_CARDS.length;

  const advance = (direction, idx) => {
    if (animating) return;
    const next = idx !== undefined ? idx : (active + direction + total) % total;
    if (next === active) return;
    setPrev(active);
    setDir(direction >= 0 ? 1 : -1);
    setAnimating(true);
    setActive(next);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 750);
  };

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!paused) intervalRef.current = setInterval(() => advance(1), 2400);
    return () => clearInterval(intervalRef.current);
  }, [paused, active, animating]);

  useEffect(() => {
    if (!outerRef.current) return;
    const stage = outerRef.current.querySelector("[data-stage]");
    if (!stage) return;
    const stageW = stage.offsetWidth;
    const cardW = (stageW - 8) / 2; // two cards with 8px gap

    const tmp = document.createElement("div");
    tmp.style.cssText = `position:fixed;visibility:hidden;pointer-events:none;top:-9999px;left:0;display:flex;flex-direction:column;gap:8px`;
    document.body.appendChild(tmp);

    SKILL_CARDS.forEach(card => {
      const el = document.createElement("div");
      el.style.cssText = `width:${cardW}px;background:#fff;border:1.5px solid #e8a0b0;border-radius:18px;padding:16px 18px;box-sizing:border-box;font-family:Inter,sans-serif;font-size:0.76rem;line-height:1.6`;
      el.innerHTML = `<div style="font-size:1.6rem;margin-bottom:8px">${card.emoji}</div><div style="font-weight:600;font-size:0.78rem;margin-bottom:6px">${card.label}</div><p style="margin:0;font-size:0.76rem;line-height:1.6">${card.desc}</p>`;
      tmp.appendChild(el);
    });

    const max = Math.max(...Array.from(tmp.children).map(el => el.offsetHeight));
    document.body.removeChild(tmp);
    if (max > 0) setCardHeight(max);
  }, []);

  const go = (direction) => { setPaused(true); advance(direction); };
  const pick = (i) => { if (i === active) return; setPaused(true); advance(i > active ? 1 : -1, i); };

  return (
    <div ref={outerRef} style={{ position: "relative", width: "100%" }}>
      <style>{`
        @keyframes slideInRight { from { opacity: 0; transform: translateX(38px) scale(0.97); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes slideInLeft  { from { opacity: 0; transform: translateX(-38px) scale(0.97); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes slideOutLeft  { from { opacity: 1; transform: translateX(0) scale(1); } to { opacity: 0; transform: translateX(-38px) scale(0.97); } }
        @keyframes slideOutRight { from { opacity: 1; transform: translateX(0) scale(1); } to { opacity: 0; transform: translateX(38px) scale(0.97); } }
        .skill-enter-fwd  { animation: slideInRight 0.75s cubic-bezier(.34,1.56,.64,1) both; }
        .skill-enter-back { animation: slideInLeft  0.75s cubic-bezier(.34,1.56,.64,1) both; }
        .skill-exit-fwd   { animation: slideOutLeft  0.75s cubic-bezier(.4,0,.2,1) both; }
        .skill-exit-back  { animation: slideOutRight 0.75s cubic-bezier(.4,0,.2,1) both; }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button onClick={() => go(-1)} style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "#c4778a", fontSize: "1.4rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", padding: "0 4px" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#e8a0b0"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#c4778a"; }}>‹</button>

        <div data-stage="1" style={{ flex: 1, position: "relative", height: cardHeight ?? undefined, overflow: cardHeight ? "hidden" : undefined }}>
          {prev !== null && (
            <div key={`exit-${prev}`} className={dir === 1 ? "skill-exit-fwd" : "skill-exit-back"} style={{ position: "absolute", inset: 0, display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}><SkillCard card={SKILL_CARDS[prev]} height={cardHeight} /></div>
              <div style={{ flex: 1 }}><SkillCard card={SKILL_CARDS[(prev + 1) % total]} height={cardHeight} /></div>
            </div>
          )}
          <div key={`enter-${active}`} className={animating ? (dir === 1 ? "skill-enter-fwd" : "skill-enter-back") : ""} style={{ position: cardHeight ? "absolute" : "relative", inset: cardHeight ? 0 : undefined, display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}><SkillCard card={SKILL_CARDS[active]} height={cardHeight} /></div>
            <div style={{ flex: 1 }}><SkillCard card={SKILL_CARDS[(active + 1) % total]} height={cardHeight} /></div>
          </div>
        </div>

        <button onClick={() => go(1)} style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "#c4778a", fontSize: "1.4rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", padding: "0 4px" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#e8a0b0"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#c4778a"; }}>›</button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
        {SKILL_CARDS.map((_, i) => (
          <div key={i} onClick={() => pick(i)} style={{ width: i === active ? 18 : 7, height: 7, borderRadius: 100, background: i === active ? "#c4778a" : "#f9c8d4", transition: "all 0.3s", cursor: "pointer" }} />
        ))}
      </div>

      {paused && (
        <button onClick={() => setPaused(false)} style={{ display: "block", margin: "8px auto 0", background: "none", border: "none", fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: "#b08090", cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          resume ▶
        </button>
      )}
    </div>
  );
}

function SkillCard({ card, height }) {
  return (
    <div style={{ width: "100%", height: height ?? "auto", background: "#fff", border: "1.5px solid #e8a0b0", borderRadius: 18, padding: "16px 18px", boxShadow: "0 8px 28px rgba(180,120,140,0.13)", display: "flex", flexDirection: "column", justifyContent: "flex-start", boxSizing: "border-box" }}>
      <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>{card.emoji}</div>
      <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "#6b3a2a", marginBottom: 6, letterSpacing: "0.01em" }}>{card.label}</div>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.76rem", lineHeight: 1.6, color: "#7a5060", margin: 0 }}>{card.desc}</p>
    </div>
  );
}


export default function Portfolio() {
  const [opened, setOpened] = useState(false);
  const [envelopeClosing, setEnvelopeClosing] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);
  const [funZoneOpen, setFunZoneOpen] = useState(false);
  const activeSection = useScrollSpy(NAV_LINKS.map((n) => n.toLowerCase()));
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const handleBack = () => {
    setEnvelopeClosing(true);
    setHasVisited(true);
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&family=Bebas+Neue&display=swap');

        @media (max-width: 900px) {
          .home-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .home-photo-container { order: -1; min-height: 380px !important; justify-content: center !important; }
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
        .skill-tag { display: inline-block; background: #c4a898; border: 1.5px solid #c4a898; color: #fff; font-family: Inter, sans-serif; font-size: 0.8rem; padding: 5px 14px; border-radius: 100px; transition: all 0.2s; font-weight: 400; }
        .skill-tag:hover { background: #fff; color: #5a2d1a; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(107,68,50,0.15); }
        @keyframes rainbowShift {
          0%   { color: #ff6b6b; }
          16%  { color: #ffaa33; }
          32%  { color: #ffe066; }
          48%  { color: #77dd77; }
          64%  { color: #66b3ff; }
          80%  { color: #c084fc; }
          100% { color: #ff6b6b; }
        }
        .name-rainbow { animation: rainbowShift 1.5s linear infinite; }
        .name-rainbow span, .name-rainbow div, .name-rainbow pre { color: inherit !important; }
        .project-card { background: #fff; border: 1.5px solid #f0d8de; border-radius: 18px; padding: 28px 30px; transition: all 0.3s cubic-bezier(.34,1.56,.64,1); position: relative; overflow: hidden; }
        .project-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #f9a8ba, #8b5e4a); opacity: 0; transition: opacity 0.3s; }
        .project-card:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(180,120,140,0.12); border-color: #e8c0ca; }
        .project-card:hover::before { opacity: 1; }
        .proj-link { display: inline-flex; align-items: center; gap: 5px; font-family: Inter, sans-serif; font-size: 0.78rem; font-weight: 500; text-decoration: none; color: #6b3a2a; border-bottom: 1.5px solid #8b5e4a; padding-bottom: 1px; transition: all 0.2s; }
        .proj-link:hover { color: #5a2d1a; }
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

      {(!opened || envelopeClosing) && <EnvelopeScreen onOpen={() => { window.scrollTo({ top: 0 }); setOpened(true); }} isClosing={envelopeClosing} hasVisited={hasVisited} />}

      {opened && <DraggableEnvButton onBack={handleBack} />}
      {opened && <FloatingShavedIceButton onClick={() => setFunZoneOpen(true)} />}
      {funZoneOpen && <FunZoneModal onClose={() => setFunZoneOpen(false)} />}

      <div className="grid-bg" style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", color: "#3a2a2e", opacity: opened ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>

        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99, height: 150, backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", background: "linear-gradient(to bottom, rgba(252,232,237,0.55) 0%, rgba(252,232,237,0) 100%)", maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)", pointerEvents: "none" }} />

        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 100, display: "flex", alignItems: "center", gap: 8, width: "calc(100vw - 48px)", maxWidth: 1200, justifyContent: "space-between" }}>
          <RainbowKatieButton onClick={() => scrollTo("home")} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {NAV_LINKS.map((link) => (
              <button key={link} className={"nav-heart" + (activeSection === link.toLowerCase() ? " active" : "")} onClick={() => scrollTo(link.toLowerCase())}>
                <svg viewBox="0 0 68 60" xmlns="http://www.w3.org/2000/svg">
                  <path d="M34 54 C33 53 4 37 4 18 C4 8 12 2 21 2 C27 2 32 6 34 10 C36 6 41 2 47 2 C56 2 64 8 64 18 C64 37 35 53 34 54Z" fill="#e8a0b0"/>
                </svg>
                <span>{link}</span>
              </button>
            ))}
          </div>
        </div>

        <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "170px 5vw 80px", position: "relative", overflow: "hidden" }}>
          <span className="sp3" style={{ position: "absolute", bottom: "14%", left: "3%", fontSize: "clamp(0.6rem, 1.5vw, 1rem)", color: "#e8a0b0", pointerEvents: "none" }}>✦</span>
          <span className="sp4" style={{ position: "absolute", bottom: "12%", right: "3%", fontSize: "clamp(0.6rem, 1.5vw, 1rem)", color: "#c4778a", pointerEvents: "none" }}>✦</span>
          <span className="sp1" style={{ position: "absolute", bottom: "28%", left: "2%", fontSize: "clamp(0.5rem, 1vw, 0.8rem)", color: "#c4778a", pointerEvents: "none" }}>✦</span>
          <span className="sp2" style={{ position: "absolute", bottom: "26%", right: "2%", fontSize: "clamp(0.5rem, 1vw, 0.8rem)", color: "#e8a0b0", pointerEvents: "none" }}>✦</span>
          <div className="home-grid" style={{ maxWidth: 1100, width: "100%", display: "grid", gridTemplateColumns: "3fr 2fr", gap: "60px", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#b08090", marginBottom: 12 }} className="fade-up">welcome to my portfolio</p>
              <div style={{ marginBottom: 52 }}>
                <h1 className="home-title fade-up d1" style={{ fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 0 }}>
                  <span style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}>Hi, I'm</span><br />
                  <FrozenHeightName />
                </h1>
              </div>
              <div className="fade-up d2" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24, marginTop: 0 }}>
                {[
                  "Third Year Informatics Major, Data Science Minor @ UW Seattle",
                  "Client Side Web Development TA @ UW iSchool",
                  "Swim Instructor, Lifeguard & Camp Leader @ Pro Sports Club",
                  "Interested in Software Development (full stack web dev) and Data Science!",
                ].map((line) => (
                  <div key={line} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ color: "#e8a0b0", fontSize: "0.65rem", marginTop: "0.05em", flexShrink: 0 }}>✦</span>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.92rem", lineHeight: 1.5, color: "#6a4c58", fontWeight: 400, margin: 0 }}>{line}</p>
                  </div>
                ))}
              </div>
              <div className="fade-up d3" style={{ marginBottom: 36 }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#b08090", marginBottom: 14 }}>here's a brief overview of what I have experience with</p>
                <SkillCarousel />
              </div>
              <div className="home-buttons fade-up d4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <button onClick={() => scrollTo("projects")} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "13px 28px", background: "#e8a0b0", color: "#fff", border: "none", borderRadius: "100px", cursor: "pointer", boxShadow: "0 6px 20px rgba(196,119,138,0.22)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>View Projects</button>
                <button onClick={() => scrollTo("socials")} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "13px 28px", background: "transparent", color: "#6b3a2a", border: "1.5px solid #8b5e4a", borderRadius: "100px", cursor: "pointer", transition: "all 0.25s" }} onMouseEnter={e => { e.currentTarget.style.background="#e8a0b0"; e.currentTarget.style.color="#fff"; }} onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#6b3a2a"; }}>Get In Touch</button>
              </div>
            </div>
            <div className="home-photo-container fade-up d2" style={{ display: "flex", justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
              <div style={{ position: "relative", width: 320, height: 480, display: "flex", justifyContent: "center" }}>
                <PolaroidGallery />
              </div>
            </div>
          </div>
        </section>
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
                  <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "#6b3a2a", marginBottom: 18 }}>{cat}</h3>
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
              <div style={{ width: 60, height: 2, background: "#e8a0b0", margin: "20px 0 32px", borderRadius: 2 }} />
              <ProjectsWithFilter />
            </ScrollReveal>
          </div>
        </section>
        {/* EXPERIENCE */}
        <section id="experience" style={{ padding: "100px 5vw", borderTop: "1px solid #f0d8de" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <ScrollReveal delay={0}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#b08090", marginBottom: 12 }}>where i've worked</p>
              <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 300, lineHeight: 1.1, fontFamily: "Cormorant Garamond, Georgia, serif" }}>Work<br /><em style={{ color: "#e8a0b0" }}>Experience</em></h2>
              <div style={{ width: 60, height: 2, background: "#e8a0b0", margin: "20px 0 48px", borderRadius: 2 }} />
            </ScrollReveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                {
                  emoji: "📚",
                  role: "Teaching Assistant — INFO 340",
                  subtitle: "Client Side Web Development",
                  org: "University of Washington",
                  location: "Seattle, WA",
                  date: "Dec 2025 – Present",
                  bullets: [
                    "Facilitate weekly labs for 35+ students, translating web development concepts into accessible lessons and providing real-time debugging for HTML, CSS, and JavaScript projects.",
                    "Assess front-end applications to provide actionable technical feedback and verify code quality.",
                    "Instruct students on version control using Git, guiding them through collaborative workflows and repository management to ensure best practices in software development.",
                  ],
                  tags: ["HTML", "CSS", "JavaScript", "Git", "Teaching"],
                },
                {
                  emoji: "🏊",
                  role: "Swim Instructor · Camp Leader · Lifeguard",
                  subtitle: "Aquatics & Youth Programs",
                  org: "Pro Sports Club",
                  location: "Bellevue, WA",
                  date: "May 2022 – Present",
                  bullets: [
                    "Ensure safety at pools with over 30 patrons, utilizing problem-solving and risk assessment skills.",
                  ],
                  tags: ["Lifeguarding", "Swim Instruction", "Leadership", "Safety"],
                },
              ].map((exp, i) => (
                <ScrollReveal key={exp.role} delay={i * 100} direction="up">
                  <div className="project-card" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: "1.8rem" }}>{exp.emoji}</span>
                        <div>
                          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.04em", textTransform: "uppercase", color: "#b08090", fontWeight: 500, marginBottom: 3 }}>{exp.subtitle}</div>
                          <h3 style={{ fontSize: "1.15rem", fontWeight: 500, color: "#3a2a2e", margin: 0 }}>{exp.role}</h3>
                        </div>
                      </div>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "#b08090", fontWeight: 400, whiteSpace: "nowrap", paddingTop: 2 }}>{exp.date}</span>
                    </div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "#8a6070", fontWeight: 400, margin: "4px 0 16px", paddingLeft: 52 }}>{exp.org} · {exp.location}</p>
                    <ul style={{ margin: "0 0 18px", paddingLeft: 52, display: "flex", flexDirection: "column", gap: 8 }}>
                      {exp.bullets.map((b, j) => (
                        <li key={j} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", lineHeight: 1.75, color: "#6a4c58", fontWeight: 400, paddingLeft: 4 }}>{b}</li>
                      ))}
                    </ul>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, paddingLeft: 52 }}>
                      {exp.tags.map((t) => <span key={t} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", background: "rgba(139,94,74,0.12)", color: "#5a2d1a", padding: "3px 12px", borderRadius: "100px" }}>{t}</span>)}
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
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#6b3a2a", fontWeight: 500, marginBottom: 6 }}>{s.handle}</p>
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
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <a href="https://www.linkedin.com/in/katiejhsu/" target="_blank" rel="noreferrer" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "13px 32px", background: "#e8a0b0", color: "#fff", borderRadius: "100px", textDecoration: "none", display: "inline-block", boxShadow: "0 6px 20px rgba(196,119,138,0.22)" }}>Say Hello on LinkedIn →</a>
                  <a href="mailto:katiejhsu@gmail.com" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "13px 32px", background: "transparent", color: "#c4778a", border: "1.5px solid #e8a0b0", borderRadius: "100px", textDecoration: "none", display: "inline-block", transition: "all 0.25s" }} onMouseEnter={e => { e.currentTarget.style.background="#e8a0b0"; e.currentTarget.style.color="#fff"; }} onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#c4778a"; }}>Send Me an Email ✉️</a>
                </div>
              </div>
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