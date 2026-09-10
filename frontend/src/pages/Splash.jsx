import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();
  const [animating, setAnimating] = useState(false);
  const [hint, setHint] = useState(false);

  /* Show the "tap or press Enter" hint after 1.2s */
  useEffect(() => {
    const t = setTimeout(() => setHint(true), 1200);
    return () => clearTimeout(t);
  }, []);

  /* Keyboard listener */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " ") trigger();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function trigger() {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => navigate("/login"), 900);
  }

  return (
    <div
      className={`splash-screen${animating ? " splash-open" : ""}`}
      onClick={trigger}
      role="button"
      tabIndex={0}
      aria-label="Click or press Enter to continue"
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && trigger()}
    >
      {/* Left curtain */}
      <div className="splash-curtain splash-curtain-left">
        <div className="splash-logo-half splash-logo-left">
          <span className="splash-logo-shop">Shop</span>
        </div>
      </div>

      {/* Right curtain */}
      <div className="splash-curtain splash-curtain-right">
        <div className="splash-logo-half splash-logo-right">
          <span className="splash-logo-kart">Kart</span>
        </div>
      </div>

      {/* Tagline & hint — positioned at seam */}
      <div className={`splash-tagline${hint ? " splash-tagline-visible" : ""}`}>
        <span className="splash-tagline-text">Hop. Shop. Delivered.</span>
        <span className="splash-hint-pulse">
          Click anywhere or press <kbd>Enter</kbd>
        </span>
      </div>
    </div>
  );
}

export default Splash;
