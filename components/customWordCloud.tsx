'use client'
import { Value } from "@prisma/client/runtime/library";
import { maxHeaderSize } from "http";
import { useTheme } from "next-themes";
import React from "react";
import D3WordCloud from 'react-d3-cloud';
import { text } from "stream/consumers";

type Props = {}

const data = [
    {
        text: "hey",
        value: 3,
    },
    {
        text: "computer",
        value: 10,
    },
    {
        text: "HTML",
        value: 7,
    },
    {
        text: "Nextjs",
        value: 14,
    },
    {
        text: "java",
        value: 9,
    },
    {
        text: "php",
        value: 5,
    },
    
];

const FontSizeMapper = (word: {value: number}) => {
    return Math.log2(word.value) * 5 + 16;
}

const CustomWordCloud = (props: Props) => {
    const theme = useTheme();
    return(
    <>
    <D3WordCloud height={550} font="Times"
            fontSize={FontSizeMapper}
            rotate={0}
            padding={10}
            fill={theme.theme == "dark" ? 'white' : "black"} data={data}    />
    </>

    )
}

export default CustomWordCloud