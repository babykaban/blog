Hello all,

I’m excited to share a significant update in the development of **Spellweaver Saga: Retrieving The Legendary Relic**. 
As I delve deeper into refining the game's mechanics and world-building tools, I've decided to rebuild the editor's 'terrain' 
mode and introduce a fresh file format called **Spellweaver Saga World Map (SSWM)**.

## The Evolution of Terrain Mode

In the previous iteration of the editor, the terrain mode was relatively straightforward. It was essentially a grid where I 
could place different tiles to create a tile map. While this was functional, it lacked the flexibility needed for the 
interactions I envisioned in the game.

## SSWM: A New File Format

The SSWM file format represents a significant leap forward in how the game's world is structured and managed. Here's what SSWM brings to the table:

- **Tile Grid**: This grid holds bitmap IDs for ground tiles along with their positions, almost like the previous version. 
  This change allows tiles to be spawned as entities, opening up a world of interaction possibilities within the game.
- **Entities Metadata**: An array of entities' metadata will be stored within the SSWM file, facilitating more dynamic and rich world creation.
- **Polygons and Navigation Meshes**: One of the most exciting additions is the potential to store polygons and graphs for navigation meshes. 
  This idea appeared as I was refining the current movement system and realized that it sucked. Navigation meshes will enhance pathfinding and 
  movement, making gameplay smoother and more intuitive.

## Why SSWM?

The beauty of SSWM files lies in their versatility. They will be stored in the game asset file format, **Spellweaver Saga Assets (SSA)**, 
ensuring seamless integration and organization of all game assets.

## What’s Next?

Next, I’ll focus on improving and continuing to develop the editor to create game levels. This involves enhancing the tools to generate polygons 
and graphs for navigation meshes and refining other aspects to make level creation more efficient.

Stay tuned for more updates as I continue to build and refine **Spellweaver Saga: Retrieving The Legendary Relic**. 
