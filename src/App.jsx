import React, { useEffect, useState } from "react";

function App() {
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });
  const [activePlanet, setActivePlanet] = useState(null);

  // Planet definitions
  const planets = [
    { id: "summary", label: "Mission Briefing", description: "Summary", size: 140 },
    { id: "experience", label: "Work Experience", description: "Career orbits", size: 170 },
    { id: "skills", label: "Skills Station", description: "Tech stack & tools", size: 150 },
    { id: "education", label: "Education Star", description: "Academic core", size: 130 },
    { id: "fun", label: "Fun Comet", description: "Fun fact & links", size: 110 },
  ];

  // Orbit radii
  const radii = {
    summary: 260,
    experience: 380,
    skills: 520,
    education: 680,
    fun: 840,
  };

  // Planet texture images
  const planetTextures = {
    summary:
      "url('https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg')",
    experience:
      "url('https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg')",
    skills:
      "url('https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg')",
    education:
      "url('https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg')",
    fun:
      "url('https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg')",
  };

  // UFO cursor tracking
  useEffect(() => {
    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;
    setPointerPos({ x: initialX, y: initialY });

    const handleMouseMove = (e) => {
      setPointerPos((prev) => {
        const easing = 0.2;
        return {
          x: prev.x + (e.clientX - prev.x) * easing,
          y: prev.y + (e.clientY - prev.y) * easing,
        };
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="space-root h-screen w-screen overflow-hidden text-slate-100 cursor-none">
      {/* Inline CSS */}
      <style>{`
        .space-root {
          position: relative;
          overflow: hidden;
          background: radial-gradient(circle at 50% 30%, #020617 0%, #020111 55%, #000008 100%);
          font-family: system-ui, sans-serif;
        }

        .starfield,
        .starfield--mid,
        .starfield--slow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .starfield {
          background-image: url('https://raw.githubusercontent.com/matteobruni/tsparticles/gh-pages/images/stars.png');
          background-size: repeat;
          opacity: 0.9;
          animation: driftFast 80s linear infinite;
        }

        .starfield--mid {
          background-image:
            radial-gradient(circle at 60% 40%, rgba(140,80,255,0.25) 0, transparent 70%),
            radial-gradient(circle at 20% 70%, rgba(255,80,180,0.18) 0, transparent 72%);
          background-size: cover;
          mix-blend-mode: screen;
          opacity: 0.7;
          animation: driftMid 140s linear infinite;
        }

        .starfield--slow {
          background-image: url('https://raw.githubusercontent.com/matteobruni/tsparticles/gh-pages/images/stars.png');
          background-size: 200% 200%;
          opacity: 0.35;
          filter: blur(1px);
          animation: driftSlow 220s linear infinite;
        }

        .astronaut {
          position: fixed;
          transform: translate(-50%, -50%);
          font-size: 2.4rem;
          pointer-events: none;
          animation: bob 2.8s ease-in-out infinite;
          z-index: 8;
        }

        .hud {
          position: absolute;
          top: 1.5rem;
          left: 2rem;
          z-index: 9;
          padding: 0.75rem 1.25rem;
          border-radius: 999px;
          background: rgba(4, 9, 27, 0.85);
          border: 1px solid rgba(138, 180, 255, 0.4);
          backdrop-filter: blur(12px);
        }

        .sun {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, #fffbe6, #ffb733, #6b3500);
          box-shadow: 0 0 120px rgba(255,187,51,0.8);
          animation: sunPulse 6s infinite;
          z-index: 5;
        }

        .orbit {
          position: absolute;
          border-radius: 50%;
          border: 1px dashed rgba(160, 190, 255, 0.35);
          animation-name: planetOrbit;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          z-index: 4;
        }

        .planet {
          position: absolute;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          cursor: pointer;
        }

        .planet__body {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background-image: var(--planetTexture);
          background-size: cover;
          animation: spin 40s linear infinite;
        }

        .planet__ring {
          position: absolute;
          width: 170%;
          height: 52%;
          border-radius: 50%;
          border: 3px solid rgba(187,215,255,0.7);
          transform: rotate(25deg);
        }

        .planet__label {
          position: absolute;
          bottom: -3.2rem;
          background: rgba(3,10,25,0.9);
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          border: 1px solid rgba(163,200,255,0.7);
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          z-index: 98;
        }

        .modal {
          position: fixed;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          width: min(650px, 92vw);
          background: rgba(15,32,72,0.95);
          padding: 1.3rem;
          border-radius: 1.4rem;
          border: 1px solid rgba(163,200,255,0.7);
          z-index: 99;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bob {
          0%,100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-6px); }
        }
        @keyframes driftFast { to { transform: translate(-600px, -260px); } }
        @keyframes driftMid { to { transform: translate(-320px, -180px); } }
        @keyframes driftSlow { to { transform: translate(-200px, -120px); } }
        @keyframes planetOrbit { to { transform: rotate(360deg); } }
        @keyframes sunPulse {
          0%,100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.06); }
        }
      `}</style>

      {/* Galaxy Layers */}
      <div className="starfield"></div>
      <div className="starfield--mid"></div>
      <div className="starfield starfield--slow"></div>

      {/* UFO Cursor */}
      <div
        className="astronaut"
        style={{ left: pointerPos.x, top: pointerPos.y }}
      >
        🛸
      </div>

      {/* HUD */}
      <header className="hud">
        <h1>Orbital Resume</h1>
        <p>Fly the UFO and click on planets to explore sections.</p>
      </header>

      {/* Sun */}
      <div className="sun"></div>

      {/* Planets + Orbits */}
      {planets.map((planet, index) => {
        const r = radii[planet.id];
        const orbitDuration = 26 + r / 10;
        const phaseOffset = (index / planets.length) * orbitDuration;

        return (
          <div
            key={planet.id + "-orbit"}
            className="orbit"
            style={{
              left: "50%",
              top: "50%",
              width: r * 2,
              height: r * 2,
              marginLeft: -r,
              marginTop: -r,
              animationDuration: `${orbitDuration}s`,
              animationDelay: `${-phaseOffset}s`,
            }}
          >
            <div
              className="planet"
              style={{
                left: "50%",
                top: 0,
                width: planet.size,
                height: planet.size,
              }}
              onClick={() => setActivePlanet(planet)}
            >
              <div
                className="planet__body"
                style={{
                  "--planetTexture": planetTextures[planet.id],
                }}
              ></div>

              {planet.id === "experience" && <div className="planet__ring"></div>}

              <div className="planet__label">
                <h3>{planet.label}</h3>
                <small>{planet.description}</small>
              </div>
            </div>
          </div>
        );
      })}

      {/* Modal */}
      {activePlanet && (
        <>
          <div className="modal-backdrop" onClick={() => setActivePlanet(null)} />

          <section className="modal">
            <header className="modal__header">
              <h2>{activePlanet.label}</h2>
              <button
                className="modal__close"
                onClick={() => setActivePlanet(null)}
              >
                ✕
              </button>
            </header>

            <div className="modal__content">
              {activePlanet.id === "summary" && (
                <>
                  <h3>Mission Summary</h3>
                  <p>
                    Software Engineer with 4+ years of hands-on experience building scalable backend systems.
                  </p>
                </>
              )}

              {activePlanet.id === "experience" && (
                <>
                  <h3>Work Experience</h3>
                  <p>Techpods LLC – Software Developer</p>
                  <p>Inqui-Lab Foundation – Software Developer</p>
                  <p>Morgan Stanley – Software Developer</p>
                </>
              )}

              {activePlanet.id === "skills" && (
                <>
                  <h3>Skills Space Station</h3>
                  <p>Java, Python, JS, React, AWS, Docker, Kubernetes, etc.</p>
                </>
              )}

              {activePlanet.id === "education" && (
                <>
                  <h3>Education Star</h3>
                  <p><strong>University of Florida</strong></p>
                  <p>MS in Computer Science</p>
                </>
              )}

              {activePlanet.id === "fun" && (
                <>
                  <h3>Fun Comet</h3>
                  <p>“Reject this resume and risk being intercepted by 3I/ATLAS.”</p>
                  <a href="mailto:saikiranpatwari99@gmail.com">Email</a>
                  <br />
                  <a href="https://www.linkedin.com/in/patwari-saikiran/" target="_blank">
                    LinkedIn
                  </a>
                </>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
