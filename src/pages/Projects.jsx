import React from 'react';
import Navigation from '../components/Navigation/Navigation.jsx';
import HomeHero from '../components/Home/HomeHero';
import HomeArticles from '../components/Home/HomeArticles';
import Footer from '../components/Footer/Footer.jsx';

const Projects = () => {
    return (
        <>
            <Navigation page="projects" />
            <HomeHero />
            <HomeArticles />
            <Footer />
        </>
    );
}

export default Projects;