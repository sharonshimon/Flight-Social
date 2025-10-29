import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// Number of posts per month (all groups combined) 

const PostsByMonth = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data.length) return;

        const width = 800;
        const height = 400;
        const margin = { top: 30, right: 30, bottom: 50, left: 50 };

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const x = d3.scaleBand()
            .domain(data.map(d => d.month))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)]).nice()
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => x(d.month))
            .attr("y", d => y(d.count))
            .attr("height", d => y(0) - y(d.count))
            .attr("width", x.bandwidth())
            .attr("fill", "#2196f3")
            .append("title")
            .text(d => `${d.month}: ${d.count} posts`);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));
    }, [data]);

    return <svg ref={svgRef} width={800} height={400}></svg>;
};

export default PostsByMonth;
