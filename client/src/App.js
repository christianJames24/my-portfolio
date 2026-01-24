// App.js
import React, { useEffect, useState, createContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import BubbleMenu from "./components/BubbleMenu";
import BackgroundGradient from "./components/BackgroundGradient";
import TopNav from "./components/TopNav";
import BottomBar from "./components/BottomBar";
import PageNavigation from "./components/PageNavigation";
import ThreeD from "./ThreeD";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Projects from "./Pages/Projects";
import Resume from "./Pages/Resume";
import Comments from "./Pages/Comments";
import Contact from "./Pages/Contact";
import Dashboard from "./Pages/Dashboard";
import { EditProvider } from "./components/EditContext";
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
      resume: "resume",
      comments: "testimonials",
      contact: "contact",
      dashboard: "dashboard",
      login: "login",
      logout: "logout",
    },
  },
  fr: {
    nav: {
      home: "accueil",
      about: "à propos",
      projects: "projets",
      resume: "cv",
      comments: "témoignages",
      contact: "contact",
      dashboard: "tableau",
      login: "connexion",
      logout: "déconnexion",
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

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const t = translations[language];

  // Sync theme to document and localStorage
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const pages = [
    { path: "/", name: "home" },
    { path: "/about", name: "about" },
    { path: "/projects", name: "projects" },
    { path: "/resume", name: "resume" },
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
      label: t.nav.resume,
      ariaLabel: t.nav.resume,
      rotation: 8,
      hoverStyles: {
        bgColor: "var(--color-pink-1)",
        textColor: "var(--color-white)",
      },
      path: "/resume",
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
      case "/resume":
        return <Resume backendData={backendData} />;
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
      </EditProvider>
    </LanguageContext.Provider>
  );
}

export default App;