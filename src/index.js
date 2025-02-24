import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

import BlogPost from './components/BlogPost/BlogPost';

import { AnimatePresence } from "framer-motion";
import { GlobalStyle } from "./components/StyledComponents/StyledComponents.jsx";
import { ThemeProvider } from "styled-components";
import theme from "./components/StyledComponents/Theme";

import Posts from '../src/posts/Posts';

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
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
           
            {Posts.map(post => (
                <Route path={post.route} 
                element={
                <BlogPost title={post.title}
                          date={post.date}
                          image={post.image}
                          content={post.content} />} />
            ))}
          </Routes>
        </AnimatePresence>
      </HashRouter>
    </ThemeProvider >
  </React.StrictMode>
);
