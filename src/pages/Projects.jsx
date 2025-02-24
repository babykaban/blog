import React from 'react';
import Navigation from '../components/Navigation/Navigation.jsx';
import ProjectsHero from '../components/Projects/ProjectsHero';
import ProjectsArticles from '../components/Projects/ProjectsArticles';
import Footer from '../components/Footer/Footer.jsx';

const Projects = () => {
    return (
        <>
            <Navigation page="projects" />
            <ProjectsHero />
            <ProjectsArticles />
            <Footer />
        </>
    );
}

export default Projects;