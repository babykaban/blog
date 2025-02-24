---
layout: post
title: Advancing Navigation Meshes and Triangulation
date: 2024-09-02
description: Editor update
categories: blog
---

## Introduction
Over the past few weeks, I’ve been focused on continuing my work with navigation meshes. After implementing features
in the editor to create polygons, the next major step was triangulating those polygons. This is important to placing
obstacles and later merging them into convex polygons. I will be using my previous algorithm to make holes in the 
triangulated polygons, representing obstacles. You can check out the details of that process in my [previous post](https://babykaban.github.io/blog/2024/editor-update-triangle-subtraction/).

## Diving into Triangulation
After wrapping up triangle subtraction, I shifted my focus to implementing triangulation. The first approach I tried 
was Ear Clipping triangulation, a simple method that works well for basic polygons. I followed an implementation 
walkthrough from [this video](https://www.youtube.com/watch?v=hTJFcHutls8&t=1648s). However, the Ear Clipping method 
described in this video is only effective for simple polygons, meaning no holes or intersecting edges.

Despite its simplicity, there’s one significant caveat I encountered: the algorithm occasionally produces sliver
triangles. While these aren't always a major issue, they can result in small, almost negligible polygons during the 
subtraction process, which might pose problems later down the road.

## Exploring Delaunay Triangulation
As I continued, I needed a more robust solution for triangulation, so I shifted my focus to Delaunay Triangulation. 
Initially, I struggled to find a ready-to-use implementation that I could port into my editor. Fortunately, I came 
across an excellent YouTube channel, [xmdi](https://www.youtube.com/@xmdi0), where the creator is building a CAD 
program from scratch in C. He had a few episodes dedicated to Delaunay Triangulation and even provided open-source 
code on GitHub.

[Delaunay Triangulation](https://en.wikipedia.org/wiki/Delaunay_triangulation) is a method of dividing a set of points 
into triangles in such a way that no point is inside the circumcircle of any triangle. This creates triangles that are 
as equilateral as possible, avoiding sharp angles. It’s widely used in computer graphics and geographic information 
systems because it guarantees a well-behaved mesh and supports interpolation between points in an efficient way.

The implementation xmdi follows is based on [S.W.Sloan's paper](https://www.newcastle.edu.au/__data/assets/pdf_file/0017/22508/13_A-fast-algorithm-for-constructing-Delaunay-triangulations-in-the-plane.pdf), 
which in detail explains the algorithm. After porting the algorithm into my editor, I started stepping through it in 
the debugger to understand its inner workings. Watching the creator's explanations and reviewing S.W.Sloan's paper helped 
me to understand the details and mechanics behind this more complex triangulation method.

## The Shift to Constrained Delaunay Triangulation
After getting familiar with the Delaunay Triangulation algorithm, I tested it on my polygons. That’s when I ran into a 
new issue — this implementation didn’t handle polygon boundaries as I needed, working only for convex polygons. This 
limitation made it clear that I needed to switch to Constrained Delaunay Triangulation.

In [Constrained Delaunay Triangulation (CDT)](https://en.wikipedia.org/wiki/Constrained_Delaunay_triangulation), 
additional constraints are introduced: the edges of the polygon (or any other constraints like holes) must be respected 
by the triangulation. This means that the triangles must not cross these edges, allowing it to handle complex shapes like 
non-convex polygons and polygons with holes, which is exactly what I needed for my navigation mesh.

Luckily, xmdi had another video covering this exact topic, once again based on another 
[S.W.Sloan’s paper](https://www.newcastle.edu.au/__data/assets/pdf_file/0019/22519/23_A-fast-algortithm-for-generating-constrained-Delaunay-triangulations.pdf). 
I followed the same process as before, porting his implementation into my editor and digging into the algorithm. However, 
I found that an additional step was necessary — removing triangles that fall outside of the polygon.

## Splitting Concave Polygons into Convex Parts
I considered two options: creating an algorithm to remove these triangles or splitting non-convex polygons into convex 
parts. For some reason, I decided to pursue the second option.

### How the Algorithm Works
The algorithm first identifies reflex points, which are vertices that form angles greater than 180 degrees with their adjacent 
edges. For each reflex point, it calculates a perpendicular line facing inside the polygon, which is used to find an edge where 
this line intersects. The intersection point is then inserted into the polygon's vertex array, splitting the polygon into smaller pieces.

Here is a simplified breakdown of the algorithm:
- **Finding Reflex Points**: The algorithm loops through each vertex of the polygon and calculates the cross product of the vectors 
formed by adjacent vertices. If the cross product is positive, the vertex is a reflex point and we increment the count. Also the
perpendicular line from reflex point is computed for futher computations.

```c++           
    v2 a = VertexCur - VertexPrev;
    v2 b = VertexNext - VertexCur;
        
    if(Cross(a, b) > 0.0f)
    {
        v2 Perpendicular = Perp(VertexPrev - VertexCur);
        v2 NewP = VertexCur + Normalize(Perpendicular)*100.0f;

        line *Line = PerpLines + ReflexCount;
        Line->a = VertexCur;
        Line->b = NewP;
        ++ReflexCount;
    }
```
- **Finding Intersection**: Then we loop through reflex points and look for the polygon edge that is intersecting with respective 
perpendicular and insert intersection point into the polygon's vertex array. We also check if the intersection point is not equal
to edge ends, because we won't need to insert the point in this case.

```c++
    for(s32 ReflexIndex = 0;
        ReflexIndex < ReflexCount;
        ++ReflexIndex)
    {
        line *ReflexPerp = PerpLines + ReflexIndex;
        v2 p;
        for(s32 VertexIndex = 0;
            VertexIndex < Poly->VertexCount;
            ++VertexIndex)
        {
            v2 p1 = Poly->Vertices[VertexIndex];
            v2 p2 = Poly->Vertices[(VertexIndex + 1) % Poly->VertexCount];
            if(LineIntersect(p1, p2, ReflexPerp->a, ReflexPerp->b, &p) > 0)
            {
                if(!SPLITPointsAreEqual(p, ReflexPerp->a))
                {
                    if(!SPLITPointsAreEqual(p, p1) && !SPLITPointsAreEqual(p, p2))
                    {
                        TRISUBInsertPointBetween(Poly, p, {VertexIndex, (VertexIndex + 1)});
                    }
                }
            }
        }
    }
```
- **Constructing New Polygon**: After inserting an intersection point (or not) we looking for reflex point index in
polygon's vertex array, it is needed to determine from where to start new polygon construction.

```c++
    s32 Reflex = 0;
    for(s32 I = 0;
        I < Poly->VertexCount;
        ++I)
    {
        if(SPLITPointsAreEqual(ReflexPerp->a, Poly->Vertices[I]))
        {
            Reflex = I;
            break;
        }
    }
```

Afterward we calculating the step to determine which way would be the fastest to reach inserted point.

```c++
    s32 Backward = (Reflex - VertexIndex - 1 + Poly->VertexCount) % Poly->VertexCount;
    s32 Forward = (VertexIndex + 1 - Reflex + Poly->VertexCount) % Poly->VertexCount;
    s32 Offset = (Forward > Backward) ? -1 : 1;                    
```

Then we construct the new polygon by stepping through polygon vertices and recording them into new polygon vertex array.
```c++
    // NOTE(babykaban): Construct resulting polygon
    v2 TestP = ReflexPerp->a;
    while(!SPLITPointsAreEqual(p, TestP))
    {
        TestP = Poly->Vertices[Reflex];
        NewPoly->Vertices[NewPoly->VertexCount++] = TestP;
        Reflex = GetIndex(Poly->VertexCount, Reflex + Offset);
    }
```

- **Removing Vertices from Polygon**: The next step is to basically cut of the vertices that we recorded in the new polygon
excluding the ones that make the edge between the reflex point and intersection. Also we increment the result polygon count.

```c++
    // NOTE(babykaban): Remove vertices from TempPoly that are clipped by NewPoly 
    for(s32 I = 0;
        I < NewPoly->VertexCount;
        ++I)
    {
        v2 Vertex = NewPoly->Vertices[I];
        if(!SPLITPointsAreEqual(p, Vertex) && !SPLITPointsAreEqual(ReflexPerp->a, Vertex))
        {
            for(s32 J = 0;
                J < Poly->VertexCount;
                ++J)
            {
                v2 TVertex = Poly->Vertices[J];
                if(SPLITPointsAreEqual(TVertex, Vertex))
                {
                    RemoveAt(Poly, J);
                    break;
                }
            }
        }
    }
    
    (*ResultCount)++;
```

- **Incrementing the ReflexIndex**: Then we need to corectly increment `ReflexIndex`. So we loop through new polygon vertices
and testing if they are equal to any reflex points if so that means that they are included into new polygon and have to be 
skipped.

```c++
    s32 Increase = 0;
    s32 Next = ReflexIndex + 1;
    for(s32 I = 0;
        I < NewPoly->VertexCount;
        ++I)
    {
        v2 Vertex = NewPoly->Vertices[I];
        if(SPLITPointsAreEqual(Vertex, PerpLines[Next].a))
        {
            ++Next;
            ++Increase;
        }
    }

    ReflexIndex += Increase;
```
After that the process repeats until we gone through all reflex points.

- **Convexcity Check**: After the loop we have the set of polygons but they are not necessaraly convex, so we test each of them
for convexcity and record their indecies into `NotConvexIndices` array.

```c++
    // NOTE(babykaban): Check if there are not-convex polygons present if so record the indices
    for(s32 I = ArrayEnd;
        I < *ResultCount;
        ++I)
    {
        polygon2 *P = ResultArray + I;
        if(!IsConvex(P))
        {
            NotConvexIndices[(*NotConvexCount)++] = I;
        }
    }
```

- **Final Steps**: If we found any not-convex polygons we need to repeat the process for each of the not-convex polygons
for that I made a simple function to do that. I tried to make it recursive but there were a big load on stack when spliting
big polygons.

Here is utility fucntion for spliting polygon into convex parts:
```c++
inline void
SplitPolygonIntoConvexParts(polygon2 *Polygons, s32 *Count, s32 *NotConvexIndices, s32 *NotConvexCount, memory_arena *Arena)
{
    s32 Start = (*Count) - 1;
    SplitPolygon(Polygons, Count, NotConvexIndices, NotConvexCount, Start, Arena);
    while((*NotConvexCount) > 0)
    {
        s32 NotConvexIndex = NotConvexIndices[(*NotConvexCount) - 1];
        (*NotConvexCount)--;
        SplitPolygon(Polygons, Count, NotConvexIndices, NotConvexCount, NotConvexIndex, Arena);
    }
}
```

For those interested in implementation here is the full code:

```c++
struct line
{
    v2 a;
    v2 b;
};

inline void
RemoveAt(polygon2 *Poly, s32 Index)
{
    Poly->Vertices[Index] = {};
    for(s32 I = Index;
        I < (Poly->VertexCount - 1);
        ++I)
    {
        Poly->Vertices[I] = Poly->Vertices[I + 1];
    }

    Poly->Vertices[Poly->VertexCount] = {};
    --Poly->VertexCount;
}

internal void
SplitPolygon(polygon2 *ResultArray, s32 *ResultCount, s32 *NotConvexIndices, s32 *NotConvexCount, s32 SubjectIndex, memory_arena *TempArena)
{
    s32 ArrayEnd = (*ResultCount) - 1;
    polygon2 *Poly = ResultArray + SubjectIndex;
    if((Poly->VertexCount > 3) && !IsConvex(Poly))
    {
        b32 Clockwise = (PolygonSignedArea(Poly) < 0.0f);
    
        s32 PrevOffset = Clockwise ? -1 : 1;
        s32 NextOffset = Clockwise ? 1 : -1;

        s32 ReflexCount = 0;
        line *PerpLines = PushArray(TempArena, Poly->VertexCount - 2, line);
    
        // TODO(babykaban): Cash calculated cross products
        // NOTE(babykaban): Found all reflex points and their perpendiculars
        for(s32 VertexIndex = 0;
            VertexIndex < Poly->VertexCount;
            ++VertexIndex)
        {
            v2 VertexPrev = Poly->Vertices[GetIndex(Poly->VertexCount, VertexIndex + PrevOffset)];
            v2 VertexCur = Poly->Vertices[VertexIndex];
            v2 VertexNext = Poly->Vertices[GetIndex(Poly->VertexCount, VertexIndex + NextOffset)];
                
            v2 a = VertexCur - VertexPrev;
            v2 b = VertexNext - VertexCur;
                
            if(Cross(a, b) > 0.0f)
            {
                v2 Perpendicular = Perp(VertexPrev - VertexCur);
                v2 NewP = VertexCur + Normalize(Perpendicular)*100.0f;

                line *Line = PerpLines + ReflexCount;
                Line->a = VertexCur;
                Line->b = NewP;
                ++ReflexCount;
            }
        }

        polygon2 *NewPoly = ResultArray + (*ResultCount);
        // NOTE(babykaban): Loop through Reflex points and split polygon by its intersection with perpendicular
        for(s32 ReflexIndex = 0;
            ReflexIndex < ReflexCount;
            ++ReflexIndex)
        {
            line *ReflexPerp = PerpLines + ReflexIndex;
            v2 p;
            for(s32 VertexIndex = 0;
                VertexIndex < Poly->VertexCount;
                ++VertexIndex)
            {
                v2 p1 = Poly->Vertices[VertexIndex];
                v2 p2 = Poly->Vertices[(VertexIndex + 1) % Poly->VertexCount];
                if(LineIntersect(p1, p2, ReflexPerp->a, ReflexPerp->b, &p) > 0)
                {
                    if(!PointsAreEqual(p, ReflexPerp->a))
                    {
                        if(!PointsAreEqual(p, p1) && !PointsAreEqual(p, p2))
                        {
                            InsertPointBetween(Poly, p, {VertexIndex, (VertexIndex + 1)});
                        }

                        s32 Reflex = 0;
                        for(s32 I = 0;
                            I < Poly->VertexCount;
                            ++I)
                        {
                            if(PointsAreEqual(ReflexPerp->a, Poly->Vertices[I]))
                            {
                                Reflex = I;
                                break;
                            }
                        }

                        s32 Backward = (Reflex - VertexIndex - 1 + Poly->VertexCount) % Poly->VertexCount;
                        s32 Forward = (VertexIndex + 1 - Reflex + Poly->VertexCount) % Poly->VertexCount;
                        s32 Offset = (Forward > Backward) ? -1 : 1;                    
                        // NOTE(babykaban): Construct resulting polygon
                        v2 TestP = ReflexPerp->a;
                        while(!SPLITPointsAreEqual(p, TestP))
                        {
                            TestP = Poly->Vertices[Reflex];
                            NewPoly->Vertices[NewPoly->VertexCount++] = TestP;
                            Reflex = GetIndex(Poly->VertexCount, Reflex + Offset);
                        }

                        // NOTE(babykaban): Remove vertices from TempPoly that are clipped by NewPoly 
                        for(s32 I = 0;
                            I < NewPoly->VertexCount;
                            ++I)
                        {
                            v2 Vertex = NewPoly->Vertices[I];
                            if(!PointsAreEqual(p, Vertex) && !PointsAreEqual(ReflexPerp->a, Vertex))
                            {
                                for(s32 J = 0;
                                    J < Poly->VertexCount;
                                    ++J)
                                {
                                    v2 TVertex = Poly->Vertices[J];
                                    if(SPLITPointsAreEqual(TVertex, Vertex))
                                    {
                                        RemoveAt(Poly, J);
                                        break;
                                    }
                                }
                            }
                        }
                        
                        (*ResultCount)++;

                        s32 Increase = 0;
                        s32 Next = ReflexIndex + 1;
                        for(s32 I = 0;
                            I < NewPoly->VertexCount;
                            ++I)
                        {
                            v2 Vertex = NewPoly->Vertices[I];
                            if(PointsAreEqual(Vertex, PerpLines[Next].a))
                            {
                                ++Next;
                                ++Increase;
                            }
                        }

                        ReflexIndex += Increase;
                            
                        NewPoly = ResultArray + (*ResultCount);
                        break;
                    }
                }
            }
        }
    }

    // NOTE(babykaban): Check if there are not-convex polygons present if so record the indices
    for(s32 I = ArrayEnd;
        I < *ResultCount;
        ++I)
    {
        polygon2 *P = ResultArray + I;
        if(!IsConvex(P))
        {
            NotConvexIndices[(*NotConvexCount)++] = I;
        }
    }
}

inline void
SplitPolygonIntoConvexParts(polygon2 *Polygons, s32 *Count, s32 *NotConvexIndices, s32 *NotConvexCount, memory_arena *Arena)
{
    s32 Start = (*Count) - 1;
    SplitPolygon(Polygons, Count, NotConvexIndices, NotConvexCount, Start, Arena);
    while((*NotConvexCount) > 0)
    {
        s32 NotConvexIndex = NotConvexIndices[(*NotConvexCount) - 1];
        (*NotConvexCount)--;
        SplitPolygon(Polygons, Count, NotConvexIndices, NotConvexCount, NotConvexIndex, Arena);
    }
}
```

## Moving Forward
While splitting concave polygons into convex parts was a useful solution to the problem, I still believe that developing an algorithm 
to remove triangles that fall outside the polygon would be a more efficient approach. Implementing such an algorithm could streamline 
the entire triangulation process by avoiding unnecessary polygon splitting altogether.

As a next step, I plan to focus on creating this more efficient solution. The goal is to directly eliminate any triangles outside the 
polygon after performing Constrained Delaunay Triangulation.

Take care,
**[BabyKaban](https://github.com/babykaban)**
