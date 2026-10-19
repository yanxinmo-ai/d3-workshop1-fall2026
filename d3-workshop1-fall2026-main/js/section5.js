// ============================================================================
// SECTION 5:  LINE CHART 
// ============================================================================
// This mirrors the pattern you'll use in the stocks assignment!

// data source: https://fred.stlouisfed.org/series/APU000072610
const lineRaw = await d3.csv('data/state_elec_series.csv');
const regions = ["Midwest - Urban", "South - Urban", "West - Urban", "Northeast - Urban"];

const lineData = regions.map(region => ({
    name: region,
    values: lineRaw.map(d => ({
        Date: d3.timeParse('%Y-%m-%d')(d.observation_date),
        Price: parseFloat(d[region])
    }))
}));

// Set dimensions for line chart
const lineMargin = { top: 30, right: 160, bottom: 80, left: 80 };
const lineWidth = 700 - lineMargin.left - lineMargin.right;
const lineHeight = 400 - lineMargin.top - lineMargin.bottom;

// Create SVG for line chart
const lineSvg = d3.select('#demo-5')
    .append('svg')
    .attr('viewBox', `0 0 ${lineWidth + lineMargin.left + lineMargin.right} ${lineHeight + lineMargin.top + lineMargin.bottom}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g')
    .attr('transform', `translate(${lineMargin.left},${lineMargin.top})`);

// Create scales for line chart
const xLineScale = d3.scaleTime()
    .domain(d3.extent(lineData[0].values, d => d.Date)) // Assuming all regions have the same date range, we can use the first region to set the x-axis domain
    .range([0, lineWidth]); // Map the date range to the width of the chart

const yLineScale = d3.scaleLinear()
    .domain([
        d3.min(lineData, price => d3.min(price.values, d => d.Price)), // Get minimum price across all regions and dates
        d3.max(lineData, price => d3.max(price.values, d => d.Price)) // Get maximum price across all regions and dates
    ])
    .range([lineHeight, 0]); // Map the price range to the height of the chart (inverted because SVG y=0 is at the top)

// Create axes and append them to the svg
const x = d3.axisBottom(xLineScale)
    .ticks(d3.timeYear.every(1)) // Set ticks to be every year
    .tickFormat(d3.timeFormat('%Y')); // Format ticks to show only the year (e.g., 2020)

const y = d3.axisLeft(yLineScale)
    .ticks(10) // Set number of ticks on y axis
    .tickFormat(d => `$${d.toFixed(2)}`); // Format ticks to show dollar amounts with 2 decimal places

lineSvg.append('g')
    .attr('transform', `translate(0, ${lineHeight})`)
    .call(x)
    .selectAll('text')
    .style('font-size', '12px');

lineSvg.append('g')
    .attr('transform', 'translate(0, 0)')
    .call(y)
    .selectAll('text')
    .style('font-size', '12px');

// Create color scale for lines
const color = d3.scaleOrdinal(d3.schemeCategory10) // Use a built-in color scheme with 10 distinct colors
    .domain(lineData.map(d => d.name)); // Set the domain to be the names of the regions so that each region gets a unique color

// Create and append lines to the chart
const line = d3.line()
    .x(d => xLineScale(d.Date)) // Map the Date to the x-axis using the xLineScale
    .y(d => yLineScale(d.Price)) // Map the Price to the y-axis using the yLineScale
    .curve(d3.curveMonotoneX);  // Use a smooth curve for the lines

lineSvg.selectAll('.line') // Select any existing elements with class "line" (none on first run)
    .data(lineData) // Bind one data object per region
    .join('path') // Create a path for each region, update or remove on re-render
    .attr('class', 'line') // Tag each path so selectAll('.line') finds it next time
    .attr('fill', 'none') // Don't fill the area under the line
    .attr('stroke', d => color(d.name))  // Color the line by region name
    .attr('stroke-width', 2) // Line thickness in pixels
    .attr('d', d => line(d.values)); // Generate the path shape from this region's values

// Add legend
const legend = lineSvg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${lineWidth + 10}, 0)`); // Position the legend to the right of the chart

lineData.forEach((region, i) => {
    const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`); // Position each legend entry vertically with some spacing

    legendRow.append('rect')
        .attr('width', 10) 
        .attr('height', 10)
        .attr('fill', color(region.name)); // Use the same color for the legend as the line color

    legendRow.append('text')
        .attr('x', 15)
        .attr('y', 10)
        .text(region.name) // Set the text to be the name of the region
        .style('font-size', '12px') 
        .attr('alignment-baseline', 'center');
})

// Add title and axis label 
// Do it yourself! Hint: look back at the bar chart code for how to add text elements for the title and axis labels.
