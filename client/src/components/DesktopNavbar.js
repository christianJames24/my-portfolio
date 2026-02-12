// DesktopNavbar.js
import React, { useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { LanguageContext } from "../App";
import "../styles/DesktopNavbar.css";

export default function DesktopNavbar({ items, currentPath, onItemClick }) {
    const { language, toggleLanguage, t, theme, toggleTheme } = useContext(LanguageContext);
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const location = useLocation();

    const handleLogin = () => {
        loginWithRedirect({
            appState: {
                returnTo: location.pathname
            }
        });
    };

    return (
        <nav className="desktop-navbar" aria-label="Main navigation">
            <div className="desktop-navbar-container">
                <ul className="desktop-nav-list">
                    {items.map((item, idx) => {
                        const isActive = item.path === currentPath;
                        return (
                            <li key={idx} className="desktop-nav-item">
                                <a
                                    href={item.href || "#"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onItemClick(item, idx);
                                    }}
                                    className={`desktop-nav-link ${isActive ? "active" : ""}`}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {item.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>

                <div className="desktop-nav-utilities">
                    <button
                        onClick={toggleTheme}
                        className="desktop-nav-util-btn"
                        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    >
                        {theme === 'light' ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
                                <circle cx="19" cy="5" r="2" fill="currentColor" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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

                    <button
                        onClick={toggleLanguage}
                        className="desktop-nav-util-btn"
                        aria-label="Toggle language"
                    >
                        {language === 'en' ? 'FR' : 'EN'}
                    </button>

                    <button
                        onClick={isAuthenticated
                            ? () => logout({ logoutParams: { returnTo: window.location.origin } })
                            : handleLogin
                        }
                        className="desktop-nav-util-btn"
                    >
                        {isAuthenticated ? t.nav.logout : t.nav.login}
                    </button>
                </div>
            </div>
        </nav>
    );
}
