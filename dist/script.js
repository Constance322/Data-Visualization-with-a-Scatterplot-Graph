const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

fetch(url)
  .then(response => response.json())
  .then(data => {
    const dataset = data;

    const margin = { top: 50, right: 50, bottom: 50, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
                     .domain([d3.min(dataset, d => d.Year - 1), d3.max(dataset, d => d.Year + 1)])
                     .range([0, width]);

    const yScale = d3.scaleTime()
                     .domain(d3.extent(dataset, d => new Date(d.Seconds * 1000)))
                     .range([0, height]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    const svg = d3.select("#scatterplot")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.selectAll(".dot")
       .data(dataset)
       .enter()
       .append("circle")
       .attr("class", "dot")
       .attr("cx", d => xScale(d.Year))
       .attr("cy", d => yScale(new Date(d.Seconds * 1000)))
       .attr("r", 5)
       .attr("data-xvalue", d => d.Year)
       .attr("data-yvalue", d => new Date(d.Seconds * 1000))
       .on("mouseover", function(d) {
         d3.select(this).style("fill", "red");
         tooltip.transition()
                .duration(200)
                .style("opacity", .9);
         tooltip.html(`${d.Name}: ${d.Nationality}<br>${d.Year}, Time: ${d.Time}<br>${d.Doping ? d.Doping : 'No doping allegations'}`)
                .attr("data-year", d.Year)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
       })
       .on("mouseout", function(d) {
         d3.select(this).style("fill", "steelblue");
         tooltip.transition()
                .duration(500)
                .style("opacity", 0);
       });

    svg.append("g")
       .attr("id", "x-axis")
       .attr("transform", `translate(0,${height})`)
       .call(xAxis);

    svg.append("g")
       .attr("id", "y-axis")
       .call(yAxis);

    const legend = d3.select("#legend")
                     .html("<h3>Legend</h3>")
                     .append("ul");

    legend.append("li").text("Doping Allegations").style("color", "red");
    legend.append("li").text("No Doping Allegations").style("color", "steelblue");
  });