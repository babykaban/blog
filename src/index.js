import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route} from "react-router-dom";

import Home from "./pages/Home.jsx";
import ProjectsPage from "./pages/Projects.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
//import Test from "./pages/Test.jsx";

import BlogPost from './components/BlogPost/BlogPost';

import { AnimatePresence } from "framer-motion";
import { GlobalStyle } from "./components/StyledComponents/StyledComponents.jsx";
import { ThemeProvider } from "styled-components";
import theme from "./components/StyledComponents/Theme";

import Posts from '../src/posts/Posts';
import Projects from '../src/projects/Projects';

import 'line-awesome/dist/line-awesome/css/line-awesome.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <HashRouter>
        <AnimatePresence>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/contact" element={<Contact />} />
            {/*<Route path="/test" element={<Test />} />*/}
           
            {Posts.map(post => (
                <Route path={post.route} 
                element={
                <BlogPost title={post.title}
                          date={post.date}
                          image={post.image}
                          content_images={post.content_images}
                          content={post.content} />} />
            ))}

            {Projects.map(project => (
                <Route path={project.route} 
                element={
                <BlogPost title={project.title}
                          date={project.date}
                          image={project.image}
                          content={project.content} />} />
            ))}

          </Routes>
        </AnimatePresence>
      </HashRouter>
    </ThemeProvider >
  </React.StrictMode>
);
