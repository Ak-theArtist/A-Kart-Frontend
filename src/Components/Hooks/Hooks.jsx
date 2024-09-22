import { useEffect } from 'react';
import './Hooks.css';

const useIntersectionObserver = (elementsSelector, className) => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                } 
                // else {
                //     entry.target.classList.remove(className);
                // }
            });
        });

        const hiddenElements = document.querySelectorAll(elementsSelector);
        hiddenElements.forEach(element => observer.observe(element));

        return () => {
            hiddenElements.forEach(element => observer.unobserve(element));
        };
    }, [elementsSelector, className]);
};


export default useIntersectionObserver;
