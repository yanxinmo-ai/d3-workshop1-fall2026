// ============================================================================
// SECTION 3: SCALES - Mapping Data to Pixels 
// ============================================================================
// Scales convert data values → visual properties (position, size, color)

// Linear Scale: numbers -> numbers
const xScale = d3.scaleLinear()
    .domain([0, 100]) // Input data range. Here we are saying our data goes from 0 to 100 (you can adjust this based on your data)
    .range([0, 400]); // Output pixel range. This means we want to map our data to a range of 0 to 400 pixels (the width of our SVG)

console.log('Scale examples: ');
console.log('xScale(0):', xScale(0)); // Should be 0 [which means that a data value of 0 maps to 0 pixels]
console.log('xScale(50):', xScale(50)); // Should be 200 [which means that a data value of 50 maps to 200 pixels, which is halfway across the SVG]
console.log('xScale(100):', xScale(100)); // Should be 400 [which means that a data value of 100 maps to 400 pixels, which is the full width of the SVG]

// Common scale types: 
// - scaleLinear: for continuous numerical data (e.g., prices, temperatures)
// - scaleTime/scaleUtc: for dates (e.g., stock prices over time)
// - scaleOrdinal: for categorical data (e.g., colors for different categories)

// Example: color scale for categories
const colorScale = d3.scaleOrdinal()
    .domain(['A', 'B', 'C']) // Input categories
    .range(['red', 'green', 'blue']); // Output colors

console.log('colorScale("A") =', colorScale('A'));  // Should be 'red'