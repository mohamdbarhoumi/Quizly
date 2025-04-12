// Type for individual topic items
export type TopicType = {
    text: string;
    value: number;
  };
  
  // Props for the CustomWordCloud component
  export type CustomWordCloudProps = {
    topics: TopicType[];
    width?: number;
    height?: number;
    className?: string;
    onWordClick?: (word: TopicType) => void;  // Optional click handler
  };
  
  // Type for the D3 word layout
  export type WordLayoutType = TopicType & {
    size: number;
    x: number;
    y: number;
    rotate: number;
  };