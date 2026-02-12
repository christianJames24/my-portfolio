// App.js
import React, { useEffect, useState, createContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import BubbleMenu from "./components/BubbleMenu";
import BackgroundGradient from "./components/BackgroundGradient";
import TopNav from "./components/TopNav";
import BottomBar from "./components/BottomBar";
import PageNavigation from "./components/PageNavigation";
import ToastContainer from "./components/ToastContainer";
import ThreeD from "./ThreeD";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Projects from "./Pages/Projects";
import Skills from "./Pages/Skills";
import Comments from "./Pages/Comments";
import Contact from "./Pages/Contact";
import Dashboard from "./Pages/Dashboard";
import { EditProvider } from "./components/EditContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { LightboxProvider } from "./contexts/LightboxContext";
import EditModeToggle from "./components/EditModeToggle";
import "./styles/animations.css";
import "./styles/pageTransitions.css";

export const LanguageContext = createContext();

//https://youtu.be/w3vs4a03y3I?si=cJiFQ1nQtIqFaHwx GOATED VIDEO
//run frontend: npm start
//run backend: npm run dev

const translations = {
  en: {
    nav: {
      home: "home",
      about: "about",
      projects: "projects",
      skills: "skills",
      comments: "testimonials",
      contact: "contact",
      dashboard: "dashboard",
      login: "login",
      logout: "logout",
    },
    emailVerification: {
      title: "Verify Your Email",
      checkInbox: "Please check your inbox ({email}) and verify your email address to continue.",
      afterVerifying: "After verifying, click on the button below to continue.",
      verified: "I've Verified My Email",
      resend: "Resend Verification Email",
      sending: "Sending...",
      notFinding: "Not finding the email? Check your spam folder.",
      tryRelogin: "Try logging out and logging back in, which often triggers a new verification email.",
      logout: "Log Out",
      emailSent: "Verification email sent! Please check your inbox (and spam).",
      sendFailed: "Failed to send: {error}",
      sendError: "Error sending email. Please try again later.",
      waitBeforeResend: "Please wait {seconds} seconds before resending.",
    },
  },
  fr: {
    nav: {
      home: "accueil",
      about: "à propos",
      projects: "projets",
      skills: "compétences",
      comments: "témoignages",
      contact: "contact",
      dashboard: "tableau",
      login: "connexion",
      logout: "déconnexion",
    },
    emailVerification: {
      title: "Vérifiez votre courriel",
      checkInbox: "Veuillez vérifier votre boîte de réception ({email}) et vérifier votre adresse courriel pour continuer.",
      afterVerifying: "Après la vérification, cliquez sur le bouton ci-dessous pour continuer.",
      verified: "J'ai vérifié mon courriel",
      resend: "Renvoyer le courriel de vérification",
      sending: "Envoi en cours...",
      notFinding: "Vous ne trouvez pas le courriel? Vérifiez votre dossier de courrier indésirable.",
      tryRelogin: "Essayez de vous déconnecter et de vous reconnecter, ce qui déclenche souvent un nouveau courriel de vérification.",
      logout: "Se déconnecter",
      emailSent: "Courriel de vérification envoyé! Veuillez vérifier votre boîte de réception (et courrier indésirable).",
      sendFailed: "Échec de l'envoi: {error}",
      sendError: "Erreur lors de l'envoi du courriel. Veuillez réessayer plus tard.",
      waitBeforeResend: "Veuillez attendre {seconds} secondes avant de renvoyer.",
    },
  },
};

function App() {
  const [backendData, setBackendData] = useState([{}]);
  const [scrollY, setScrollY] = useState(0);
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [displayLocation, setDisplayLocation] = useState(null);
  const [transitionStage, setTransitionStage] = useState("idle");
  const [direction, setDirection] = useState("forward");
  const [showFooter, setShowFooter] = useState(true);
  const [instantHide, setInstantHide] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  // const mobileWidth = 768;
  const mobileWidth = 1100;
  const [isMobile, setIsMobile] = useState(window.innerWidth < mobileWidth);

  // Email verification state (must be at top level for React Hooks rules)
  const [lastResendTime, setLastResendTime] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const RESEND_COOLDOWN = 30; // 30 seconds

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isAuthenticated, getAccessTokenSilently, user, logout, loginWithRedirect } = useAuth0();

  const t = translations[language];

  // Sync theme to document and localStorage
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const pages = [
    { path: "/", name: "home" },
    { path: "/about", name: "about" },
    { path: "/projects", name: "projects" },
    { path: "/skills", name: "skills" },
    { path: "/comments", name: "comments" },
    { path: "/contact", name: "contact" },
    ...(isAdmin ? [{ path: "/dashboard", name: "dashboard" }] : []),
  ];

  const menuItems = [
    {
      label: t.nav.home,
      ariaLabel: t.nav.home,
      rotation: -8,
      hoverStyles: {
        bgColor: "var(--color-pink-1)",
        textColor: "var(--color-white)",
      },
      path: "/",
    },
    {
      label: t.nav.about,
      ariaLabel: t.nav.about,
      rotation: 8,
      hoverStyles: {
        bgColor: "var(--color-pink-1)",
        textColor: "var(--color-white)",
      },
      path: "/about",
    },
    {
      label: t.nav.projects,
      ariaLabel: t.nav.projects,
      rotation: -8,
      hoverStyles: {
        bgColor: "var(--color-pink-1)",
        textColor: "var(--color-white)",
      },
      path: "/projects",
    },
    {
      label: t.nav.skills,
      ariaLabel: t.nav.skills,
      rotation: 8,
      hoverStyles: {
        bgColor: "var(--color-pink-1)",
        textColor: "var(--color-white)",
      },
      path: "/skills",
    },
    {
      label: t.nav.comments,
      ariaLabel: t.nav.comments,
      rotation: -8,
      hoverStyles: {
        bgColor: "var(--color-pink-1)",
        textColor: "var(--color-white)",
      },
      path: "/comments",
    },
    {
      label: t.nav.contact,
      ariaLabel: t.nav.contact,
      rotation: 8,
      hoverStyles: {
        bgColor: "var(--color-pink-1)",
        textColor: "var(--color-white)",
      },
      path: "/contact",
    },
    ...(isAdmin
      ? [
        {
          label: t.nav.dashboard,
          ariaLabel: t.nav.dashboard,
          rotation: 8,
          hoverStyles: {
            bgColor: "var(--color-pink-1)",
            textColor: "var(--color-white)",
          },
          path: "/dashboard",
        },
      ]
      : []),
  ];

  useEffect(() => {
    const checkAdmin = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch("/api/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setIsAdmin(data.permissions?.includes("admin:dashboard") || false);
        } catch (err) {
          console.error("Error checking admin:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => setBackendData(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < mobileWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [location.pathname]);

  useEffect(() => {
    if (displayLocation === null) {
      setDisplayLocation(location);
      setTransitionStage("idle");
      setShowFooter(true);
      setInstantHide(false);
      return;
    }

    if (location.pathname !== displayLocation.pathname) {
      const currentIndex = pages.findIndex(
        (p) => p.path === displayLocation.pathname
      );
      const nextIndex = pages.findIndex((p) => p.path === location.pathname);

      const isForward = nextIndex > currentIndex;
      setDirection(isForward ? "forward" : "backward");

      setInstantHide(true);
      setShowFooter(false);
      setTransitionStage("exiting");
    }
  }, [location, displayLocation]);

  const handleTransitionEnd = () => {
    if (transitionStage === "exiting") {
      window.scrollTo(0, 0);
      setDisplayLocation(location);
      setTransitionStage("entering");
    } else if (transitionStage === "entering") {
      setTransitionStage("idle");
      setInstantHide(false);
      setTimeout(() => {
        setShowFooter(true);
      }, 50);
    }
  };

  const handleMenuItemClick = (item) => {
    navigate(item.path);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "fr" : "en"));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Check for email verification
  if (isAuthenticated && user && !user.email_verified) {
    // Some social providers (like Google) automatically verify emails. 
    // Database connections (email/password) require manual verification.

    const handleResend = async () => {
      const now = Date.now();
      const timeSinceLastResend = (now - lastResendTime) / 1000;

      if (timeSinceLastResend < RESEND_COOLDOWN) {
        const remaining = Math.ceil(RESEND_COOLDOWN - timeSinceLastResend);
        alert(t.emailVerification.waitBeforeResend.replace("{seconds}", remaining));
        return;
      }

      const btn = document.getElementById("resend-btn");
      if (btn) {
        btn.disabled = true;
        btn.innerText = t.emailVerification.sending;
      }

      try {
        const token = await getAccessTokenSilently();
        const res = await fetch("/api/auth/resend-verification", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          alert(t.emailVerification.emailSent);
          setLastResendTime(now);
          setCountdown(RESEND_COOLDOWN);
        } else {
          const data = await res.json();
          alert(t.emailVerification.sendFailed.replace("{error}", data.error || "Unknown error"));
        }
      } catch (err) {
        console.error(err);
        alert(t.emailVerification.sendError);
      } finally {
        if (btn) {
          btn.disabled = countdown > 0;
          btn.innerText = countdown > 0
            ? `${t.emailVerification.resend} (${countdown}s)`
            : t.emailVerification.resend;
        }
      }
    };

    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg)",
        color: "var(--color-text)",
        textAlign: "center",
        padding: "20px",
        position: "relative"
      }}>
        {/* Language and Theme toggles */}
        <div style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          display: "flex",
          gap: "12px",
          alignItems: "center"
        }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: '3px solid var(--color-black)',
              background: 'var(--color-white)',
              color: 'var(--color-black)',
              fontSize: '16px',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '4px 4px 0 var(--color-black)',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-special)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transform: 'rotate(2deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) translate(-2px, -2px)';
              e.currentTarget.style.boxShadow = '6px 6px 0 var(--color-black)';
              e.currentTarget.style.background = 'var(--color-cyan)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(2deg)';
              e.currentTarget.style.boxShadow = '4px 4px 0 var(--color-black)';
              e.currentTarget.style.background = 'var(--color-white)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '2px 2px 0 var(--color-black)';
            }}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
                <circle cx="19" cy="5" r="2" fill="currentColor" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="4" />
                <rect x="11" y="1" width="2" height="4" rx="1" />
                <rect x="11" y="19" width="2" height="4" rx="1" />
                <rect x="19" y="11" width="4" height="2" rx="1" />
                <rect x="1" y="11" width="4" height="2" rx="1" />
                <rect x="17.5" y="4.1" width="2" height="4" rx="1" transform="rotate(45 18.5 6.1)" />
                <rect x="4.5" y="15.9" width="2" height="4" rx="1" transform="rotate(45 5.5 17.9)" />
                <rect x="15.9" y="17.5" width="4" height="2" rx="1" transform="rotate(45 17.9 18.5)" />
                <rect x="4.1" y="4.5" width="4" height="2" rx="1" transform="rotate(45 6.1 5.5)" />
              </svg>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: '3px solid var(--color-black)',
              background: 'var(--color-white)',
              color: 'var(--color-black)',
              fontSize: '16px',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '4px 4px 0 var(--color-black)',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-special)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transform: 'rotate(-2deg)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) translate(-2px, -2px)';
              e.currentTarget.style.boxShadow = '6px 6px 0 var(--color-black)';
              e.currentTarget.style.background = 'var(--color-yellow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(-2deg)';
              e.currentTarget.style.boxShadow = '4px 4px 0 var(--color-black)';
              e.currentTarget.style.background = 'var(--color-white)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '2px 2px 0 var(--color-black)';
            }}
            aria-label="Toggle language"
          >
            {language === "en" ? "FR" : "EN"}
          </button>
        </div>

        <h1 style={{ color: "var(--color-text)" }}>{t.emailVerification.title}</h1>
        <p style={{ color: "var(--color-text)" }}>
          {t.emailVerification.checkInbox.replace("{email}", user.email)}
        </p>
        <p style={{ color: "var(--color-text)" }}>{t.emailVerification.afterVerifying}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
          <button
            onClick={() => loginWithRedirect()}
            style={{
              padding: "10px 20px",
              background: "var(--color-primary, #007bff)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            {t.emailVerification.verified}
          </button>

          <button
            onClick={handleResend}
            id="resend-btn"
            disabled={countdown > 0}
            style={{
              padding: "10px 20px",
              background: countdown > 0 ? "var(--color-gray, #999)" : "var(--color-secondary, #6c757d)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: countdown > 0 ? "not-allowed" : "pointer",
              fontSize: "16px",
              opacity: countdown > 0 ? 0.6 : 1
            }}
          >
            {countdown > 0 ? `${t.emailVerification.resend} (${countdown}s)` : t.emailVerification.resend}
          </button>

          <p style={{ fontSize: "14px", marginTop: "10px", maxWidth: "400px" }}>
            {t.emailVerification.notFinding}
            <br />
            <br />
            {t.emailVerification.tryRelogin}
          </p>

          <button
            onClick={() => logout({ returnTo: window.location.origin })}
            style={{
              background: "transparent",
              color: "var(--color-text)",
              border: "1px solid var(--color-text)",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {t.emailVerification.logout}
          </button>
        </div>
      </div>
    );
  }

  const getTransitionClass = () => {
    if (transitionStage === "exiting") {
      return direction === "forward"
        ? "page-transition-exit-forward"
        : "page-transition-exit-backward";
    }
    if (transitionStage === "entering") {
      return direction === "forward"
        ? "page-transition-enter-forward"
        : "page-transition-enter-backward";
    }
    return "";
  };

  const renderPage = (pathname) => {
    switch (pathname) {
      case "/":
        return <Home backendData={backendData} />;
      case "/about":
        return <About backendData={backendData} />;
      case "/projects":
        return <Projects backendData={backendData} />;
      case "/skills":
        return <Skills backendData={backendData} />;
      case "/comments":
        return <Comments backendData={backendData} />;
      case "/contact":
        return <Contact />;
      case "/dashboard":
        return isAdmin ? <Dashboard /> : <Home backendData={backendData} />;
      default:
        return <Home backendData={backendData} />;
    }
  };

  const showCow = location.pathname === "/";

  const cowStyles = {
    pointerEvents: "none",
    position: "fixed",
    bottom: isMobile ? "-10%" : "0",
    right: isMobile ? "-20%" : "0",
    width: isMobile ? "75vw" : "50vw",
    height: isMobile ? "100vh" : "80vh",
    zIndex: 1,
    opacity: showCow ? (isMobile ? 0.3 : 1) : 0,
    transform: isMobile ? "scale(0.7)" : "scale(1)",
    transition: "opacity 0.5s ease-in-out",
  };

  return (
    <NotificationProvider>
      <LightboxProvider>
        <LanguageContext.Provider value={{ language, t, toggleLanguage, theme, toggleTheme }}>
          <EditProvider isAdmin={isAdmin}>
            <div
              style={{
                minHeight: "100vh",
                position: "relative",
                paddingBottom: "0",
              }}
            >
              <BackgroundGradient scrollY={scrollY} />

              <TopNav />

              <BubbleMenu
                items={menuItems}
                currentPath={location.pathname}
                menuAriaLabel="Toggle navigation"
                menuBg="var(--color-menu-bg)"
                menuContentColor="var(--color-menu-content)"
                useFixedPosition={true}
                animationEase="back.out(1.5)"
                animationDuration={0.5}
                staggerDelay={0.12}
                onItemClick={handleMenuItemClick}
              />

              <PageNavigation
                isTransitioning={transitionStage !== "idle"}
                pages={pages}
              />

              <div style={cowStyles}>
                <ThreeD />
              </div>

              <div className="page-transition-wrapper">
                <div
                  className={`page-transition-content ${transitionStage !== "idle" ? "transitioning" : ""
                    } ${getTransitionClass()}`}
                  onAnimationEnd={handleTransitionEnd}
                >
                  {displayLocation && renderPage(displayLocation.pathname)}
                </div>
              </div>

              {/* <BottomBar show={showFooter} /> */}
              {transitionStage === "idle" && (
                <BottomBar show={showFooter} instantHide={instantHide} />
              )}

              <EditModeToggle />
            </div>
            <ToastContainer />
          </EditProvider>
        </LanguageContext.Provider>
      </LightboxProvider>
    </NotificationProvider>
  );
}

export default App;