import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

import BlogPost from './components/BlogPost/BlogPost';

import { AnimatePresence } from "framer-motion";
import { GlobalStyle } from "./components/StyledComponents/StyledComponents.jsx";
import { ThemeProvider } from "styled-components";
import theme from "./components/StyledComponents/Theme";

import Posts from '../src/posts/Posts';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <AnimatePresence>
          <Routes>
            <Route path="/blog" element={<Home />} />
            <Route path="/blog/about" element={<About />} />
            <Route path="/blog/contact" element={<Contact />} />
           
            {Posts.map(post => (
                <Route path={"/blog/" + post.route} 
                element={
                <BlogPost title={post.title}
                          date={post.date}
                          image={post.image}
                          content={post.content} />} />
            ))}
          </Routes>
          </AnimatePresence>
      </BrowserRouter>
    </ThemeProvider >
  </React.StrictMode>
);
