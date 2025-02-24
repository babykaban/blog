---
layout: post
title: The Road to Rewriting Clipper2
date: 2024-10-23
description: Clipper-2d
categories: blog
---

While developing the navigation meshes for my game, I ran into a persistent issue: **clipping polygons**. I initially implemented a polygon subtraction algorithm that worked well for most cases, but it quickly became apparent that there might be a **better approach** to polygon clipping.

## Inspiration from Godot Engine

After taking a short break from game development, I decided to dig into the **Godot game engine**, specifically its latest version, which includes navigation mesh support. After setting up everything in the debugger, I discovered the library Godot uses for polygon clipping. At first, I was confused by how it worked and why it was implemented that way. But after reading the documentation and doing some research, I gained a clearer understanding.

This led me to clone the **Clipper2 Library** from [GitHub](https://github.com/AngusJohnson/Clipper2) to explore it further and see if it could fit into my project. I experimented with the library and studied how it functioned, but ultimately, I felt the need to **rewrite it** for personal use—and to share with others in case they find it better suited to their needs.

## Issues with the Original Clipper2

While Clipper2 is a solid library, there are a few aspects that didn’t sit well with me, both personal and technical:

1. **Coding Style**: This might be just my personal preference, but I’m not a fan of the way Clipper2 was written. Specifically, I prefer not to use C++ `std::vector`s because it’s nearly impossible to see their values clearly in the debugger. Additionally, the library’s code follows **OOP** and "Clean Code" principles, which, in my opinion, make things slower and more complicated than necessary. I prefer a more direct, functional approach.

2. **Lack of SIMD Optimization**: On a technical note, I noticed the absence of **SIMD (Single Instruction, Multiple Data) registers** in Clipper2. Given that many operations involve **2D vectors** with double-precision floating points, using 128-bit wide registers for these calculations would make the operations significantly faster. This is a missed optimization opportunity.

3. **Integration Difficulties**: Clipper2 requires at least **C++17** to run, which isn’t ideal for my setup. Additionally, integrating the library means adding extra compilation units, which goes against my preference for **single-unit builds**. Alternatively, including all the source and header files in one go felt clunky and inconvenient.

## The Plan for My Reimplementation

To address these concerns, I decided to reimplement the Clipper2 library with a few key goals in mind:

1. **Code in My Style**: I will rewrite the Clipper2 code using my own coding style, removing unnecessary abstractions and making it easier to debug. This includes using simpler data structures that are easier to inspect during runtime.

2. **Optimization**: I plan to introduce **SIMD optimization** to speed up the clipping operations by using 128-bit registers for vector operations, which should lead to a noticeable performance boost.

3. **Simplified Integration**: My version of Clipper2 will be easier to integrate into a project. It will be compatible with earlier C++ standards, and I’ll ensure it can be included as a **single header file**, making it easier to drop into any codebase.

4. **Comprehensive Documentation**: I will also provide **more comprehensive documentation** with this reimplementation. My goal is to offer clear and detailed explanations of how the library works, the rationale behind certain design choices, and how developers can customize it to fit their own needs. I want to ensure that anyone using the library will find it easy to understand and modify.

## What's Next

The first step will be to rewrite the core functionality while staying close to the original algorithm, but in my coding style. After that, I’ll strip away any unnecessary parts, optimize the library, and package it into a **single include file** for simplicity. I believe this reimplementation will provide a more efficient and user-friendly solution for anyone who needs clipping in their projects, especially those with similar requirements to mine.

Stay tuned for more updates on the progress of this reimplementation, and I’ll be sharing the final library and its comprehensive documentation once it’s ready!
