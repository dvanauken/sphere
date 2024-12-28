# Sphere Library Examples

This repository contains examples of using the @dvanauken/sphere library with d3-geo for spherical geometry visualization.

## Small Circle Example

The SmallCircleExample class demonstrates distributing points uniformly across a sphere and generating small circles at each point.

```typescript
import { SmallCircleExample } from '@dvanauken/sphere';
import { Distance } from '@dvanauken/sphere';
import * as d3 from 'd3';

// Create geometry 
const example = new SmallCircleExample(Distance.fromKilometers(100));

// Generate points using graticule method (30° intervals)
example.generateGraticulePoints(30);
// OR use icosahedron vertices for more uniform distribution
// example.generateIcosahedronPoints();

// Get circles for visualization
const circles = example.getCircles();

// Setup d3 projection
const width = 960;
const height = 500;
const projection = d3.geoOrthographic()
    .scale(250)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Create SVG
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Draw circles
circles.forEach(circle => {
    const points = circle.generatePoints(100);
    const coordinates = points.map(p => [p.longitude, p.latitude]);
    coordinates.push(coordinates[0]); // Close the path
    
    const pathData = path({
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: coordinates
        }
    });

    svg.append("path")
        .attr("d", pathData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1);
});

// Add rotation interaction
svg.call(d3.drag()
    .on("drag", (event) => {
        const rotate = projection.rotate();
        projection.rotate([
            rotate[0] + event.dx * 0.5,
            rotate[1] - event.dy * 0.5
        ]);
        svg.selectAll("path").attr("d", path);
    }));
```

## Features

- Uniform point distribution using graticule intersections or icosahedron vertices
- Small circle generation with configurable radius
- Integration with d3-geo for projection and visualization
- Interactive rotation support

## Installation

```bash
npm install @dvanauken/sphere d3
```