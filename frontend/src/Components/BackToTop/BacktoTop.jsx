import React, { useState, useEffect } from "react";
import './BacktoTop.css';

const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Toggle visibility based on scroll position
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Smooth scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            style={{
                position: "fixed",
                bottom: "30px",
                right: "30px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "60px", // Increased size
                height: "60px", // Increased size
                fontSize: "24px", // Larger font for arrow
                cursor: "pointer",
                display: isVisible ? "block" : "none",
                zIndex: 1000,
                boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.3)", // Slightly larger shadow
                transition: "all 0.3s ease", // Smooth transition for hover effects
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")} // Darker green on hover
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")} // Reset on mouse leave
            onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")} // Scale down on click
            onMouseUp={(e) => (e.target.style.transform = "scale(1)")} // Reset scale on release
        >
            ↑
        </button>

    );
};

export default BackToTopButton;
