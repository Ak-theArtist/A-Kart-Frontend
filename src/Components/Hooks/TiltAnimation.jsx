import { useEffect } from 'react';
import './Hooks.css';

const useIntersectionObserverWithTilt = (elementsSelector, className) => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                } else {
                    entry.target.classList.remove(className);
                }
            });
        });

        const hiddenElements = document.querySelectorAll(elementsSelector);
        hiddenElements.forEach(element => observer.observe(element));

        return () => {
            hiddenElements.forEach(element => observer.unobserve(element));
        };
    }, [elementsSelector, className]);

    useEffect(() => {
        const elements = document.querySelectorAll(elementsSelector);
        const intervalId = setInterval(() => {
            elements.forEach(element => {
                if (element.classList.contains(className)) {
                    element.classList.add('tilt');
                    setTimeout(() => {
                        element.classList.remove('tilt');
                    }, 2000); 
                }
            });
        }, 3000); 

        return () => clearInterval(intervalId);
    }, [elementsSelector, className]);
};

export default useIntersectionObserverWithTilt;
