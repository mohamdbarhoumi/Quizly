'use client';
import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import cloud from 'd3-cloud';
import { useTheme } from 'next-themes';

type Props = {
    width: number;  // Accept width as a prop
    height: number; // Accept height as a prop
}

const data = [
    { text: "JavaScript", value: 20 },
    { text: "React", value: 18 },
    { text: "Node.js", value: 15 },
    { text: "D3.js", value: 12 },
    { text: "HTML", value: 10 },
    { text: "CSS", value: 10 },
    { text: "Next.js", value: 14 },
    { text: "TypeScript", value: 16 },
    { text: "GraphQL", value: 8 },
    { text: "REST API", value: 9 },
    { text: "Web Development", value: 11 },
    { text: "Frontend", value: 13 },
    { text: "Backend", value: 7 },
    { text: "Full Stack", value: 6 },
    { text: "Software Engineering", value: 5 },
    { text: "Agile", value: 4 },
    { text: "DevOps", value: 3 },
    { text: "Cloud Computing", value: 8 },
    { text: "Machine Learning", value: 9 },
    { text: "Artificial Intelligence", value: 10 },
    { text: "Data Science", value: 11 },
    { text: "User  Experience", value: 12 },
    { text: "User  Interface", value: 13 },
    { text: "Mobile Development", value: 14 },
    
    
];

const FontSizeMapper = (word: { value: number }) => {
    return Math.log2(word.value) * 5 + 16; // Adjust the scaling as needed
}

const CustomWordCloud = ({ width, height }: Props) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const theme = useTheme();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const layout = cloud<{ text: string; size: number }>()
            .size([width, height]) // Use the passed width and height
            .words(data.map(d => ({ text: d.text, size: FontSizeMapper(d) })))
            .padding(5)
            .rotate(() => Math.random() * 90)
            .fontSize(d => d.size)
            .on('end', draw);

        layout.start();

        function draw(words: Array<{ text: string; size: number; x: number; y: number; rotate: number }>) {
            select(svgRef.current)
                .selectAll('*')
                .remove();

            select(svgRef.current)
                .append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')') // Center the words
                .selectAll('text')
                .data(words)
                .enter()
                .append('text')
                .style('font-size', d => d.size + 'px')
                .style('fill', theme.theme === 'dark' ? 'white' : 'white')
                .attr('text-anchor', 'middle')
                .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
                .text(d => d.text);
        }
    }, [theme, width, height]);

    return <svg ref={svgRef} width="100%" height={height} style={{ display: 'block' }}></svg>;
}

export default CustomWordCloud;