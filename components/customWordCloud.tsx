'use client'
'use client';
import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import cloud from 'd3-cloud';
import { useTheme } from 'next-themes';

type Props = {}

const data = [
    { text: "hey", value: 3 },
    { text: "computer", value: 10 },
    { text: "HTML", value: 7 },
    { text: "Nextjs", value: 14 },
    { text: "java", value: 9 },
    { text: "php", value: 5 },
];

const FontSizeMapper = (word: { value: number }) => {
    return Math.log2(word.value) * 5 + 16; // Adjust the scaling as needed
}

const CustomWordCloud = (props: Props) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const theme = useTheme();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const layout = cloud<{ text: string; size: number }>()
            .size([800, 400]) // Set the size of the word cloud
            .words(data.map(d => ({ text: d.text, size: FontSizeMapper(d) }))) // Map data to the format expected by d3-cloud
            .padding(5) // Padding between words
            .rotate(() => Math.random() * 90) // Random rotation
            .fontSize(d => d.size) // Use the size from the mapped data
            .on('end', draw);

        layout.start();

        function draw(words: Array<{ text: string; size: number; x: number; y: number; rotate: number }>) {
            select(svgRef.current)
                .selectAll('*')
                .remove(); // Clear previous words

            select(svgRef.current)
                .append('g')
                .attr('transform', 'translate(400,200)') // Center the words
                .selectAll('text')
                .data(words)
                .enter()
                .append('text')
                .style('font-size', d => d.size + 'px')
                .style('fill', theme.theme === 'dark' ? 'white' : 'black') // Set text color based on theme
                .attr('text-anchor', 'middle')
                .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
                .text(d => d.text);
        }
    }, [theme, data]);

    return <svg ref={svgRef} width={800} height={400} style={{ border: '1px solid black' }}></svg>;
}

export default CustomWordCloud;