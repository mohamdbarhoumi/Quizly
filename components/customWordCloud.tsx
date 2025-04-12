'use client';
import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import cloud from 'd3-cloud';
import { useTheme } from 'next-themes';

type TopicType = {
  text: string;
  value: number;
};

type Props = {
  topics: TopicType[];
  width?: number;
  height?: number;
  className?: string;
};

const FontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

const CustomWordCloud = ({ 
  topics, 
  width = 600, 
  height = 400,
  className = ''
}: Props) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!topics || topics.length === 0) return;
    if (!svgRef.current) return;

    const layout = cloud<TopicType & { size: number }>()
      .size([width, height])
      .words(topics.map(d => ({ 
        ...d, 
        size: FontSizeMapper(d) 
      })))
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 0 : 90)) // Only 0 or 90 degree rotation
      .fontSize(d => d.size)
      .on('end', draw);

    layout.start();

    function draw(words: Array<TopicType & { 
      size: number; 
      x: number; 
      y: number; 
      rotate: number 
    }>) {
      const svg = select(svgRef.current);
      svg.selectAll('*').remove();

      const g = svg
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      g.selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .style('font-size', d => `${d.size}px`)
        .style('fill', theme === 'dark' ? '#ffffff' : '#000000')
        .style('font-family', 'sans-serif')
        .style('cursor', 'pointer')
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text)
        .on('click', (event, d) => {
          console.log('Topic clicked:', d.text);
          // Add your click handler logic here
        });
    }
  }, [theme, width, height, topics]);

  return (
    <div className={className}>
      <svg 
        ref={svgRef} 
        width={width} 
        height={height} 
        style={{ 
          display: 'block',
          margin: '0 auto'
        }}
      />
    </div>
  );
};

export default CustomWordCloud;