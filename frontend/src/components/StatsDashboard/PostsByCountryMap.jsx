import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

// Number of posts by country 

const PostsByCountryMap = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data.length) return;

        const width = 800;
        const height = 500;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const projection = d3.geoNaturalEarth1().scale(150).translate([width / 2, height / 2]);
        const path = d3.geoPath().projection(projection);

        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(worldData => {
            const countries = topojson.feature(worldData, worldData.objects.countries).features;

            const maxPosts = d3.max(data, d => d.postCount);
            const colorScale = d3.scaleLinear().domain([0, maxPosts]).range(["#bbdefb", "#2196f3"]);

            svg.selectAll("path")
                .data(countries)
                .join("path")
                .attr("d", path)
                .attr("fill", d => {
                    const countryData = data.find(c => c.country.toLowerCase() === d.properties.name.toLowerCase());
                    return countryData ? colorScale(countryData.postCount) : "#eee";
                })
                .attr("stroke", "#999")
                .append("title")
                .text(d => {
                    const countryData = data.find(c => c.country.toLowerCase() === d.properties.name.toLowerCase());
                    return `${d.properties.name}: ${countryData ? countryData.postCount : 0} posts`;
                });
        });
    }, [data]);

    return <svg ref={svgRef} width={800} height={500}></svg>;
};

export default PostsByCountryMap;
