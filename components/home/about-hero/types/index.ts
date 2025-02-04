export interface ImageItem {
    url: string;
    alt: string;
    text: string;
    caption: string;
  }
  
  export interface Feature {
    title: string;
    id: string;
    description: string;
  }
  
  export interface ScrollMetrics {
    containerWidth: number;
    totalWidth: number;
    isAtStart: boolean;
    isAtEnd: boolean;
  }
  
  export interface ViewAllCardProps {
    inView: boolean;
    index: number;
  }