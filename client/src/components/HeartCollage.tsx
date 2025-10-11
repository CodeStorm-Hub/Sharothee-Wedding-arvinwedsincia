import React from 'react';
import Image from 'next/image';
import { assetUrl } from '@/lib/utils';

interface HeartCollageProps {
  coupleImage?: string;
  cakeImage?: string;
}

const HeartCollage: React.FC<HeartCollageProps> = ({ 
  coupleImage = assetUrl('/images/heart/couple.jpeg'),
  cakeImage = assetUrl('/images/heart/cake.jpeg')
}) => {
  return (
    <div className="relative flex justify-center items-center py-8 sm:py-12 animate-scaleIn">
      {/* Enhanced Floating Elements - More Visible and Elegant */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Larger floating elements with better visibility and staggered animations */}
        <div className="absolute top-1/6 left-1/5 w-3 h-3 bg-primary/50 rounded-full animate-float shadow-lg opacity-80"></div>
        <div className="absolute top-2/3 right-1/5 w-4 h-4 bg-accent/70 rounded-full animate-float delay-700 shadow-lg opacity-80"></div>
        <div className="absolute top-1/2 left-1/8 w-2.5 h-2.5 bg-primary/60 rounded-full animate-float delay-300 opacity-75"></div>
        <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-accent/80 rounded-full animate-float delay-500 shadow-md opacity-75"></div>
        <div className="absolute bottom-1/6 left-2/3 w-3.5 h-3.5 bg-primary/45 rounded-full animate-float delay-900 shadow-lg opacity-70"></div>
        
        {/* Additional elegant floating hearts with enhanced visibility */}
        <div className="absolute top-1/3 left-1/12 w-2.5 h-2.5 bg-primary/40 rounded-full animate-float delay-1200 opacity-85 shadow-sm"></div>
        <div className="absolute bottom-1/3 right-1/12 w-2.5 h-2.5 bg-accent/60 rounded-full animate-float delay-1500 opacity-85 shadow-sm"></div>
        
        {/* Enhanced sparkle effects with better contrast */}
        <div className="absolute top-1/8 right-1/6 w-1.5 h-6 bg-gradient-to-t from-transparent via-primary/40 to-transparent rotate-45 animate-pulse opacity-60"></div>
        <div className="absolute bottom-1/8 left-1/4 w-6 h-1.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-pulse delay-700 opacity-60"></div>
        
        {/* Additional magical sparkles */}
        <div className="absolute top-1/5 left-3/4 w-1 h-3 bg-primary/30 rotate-12 animate-pulse delay-400 opacity-70"></div>
        <div className="absolute bottom-1/5 right-3/4 w-3 h-1 bg-accent/40 rotate-45 animate-pulse delay-1000 opacity-70"></div>
      </div>
      
      {/* Heart-shaped collage container with enhanced hover effects */}
      <div className="relative group">
        <div className="heart-shape relative transition-all duration-500 group-hover:scale-105">
          {/* Perfect Heart SVG for clipping */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <clipPath id="perfectHeart" clipPathUnits="objectBoundingBox">
                <path d="M0.5,0.9 C0.5,0.9 0.1,0.6 0.1,0.35 C0.1,0.15 0.2,0.1 0.35,0.1 C0.4,0.1 0.45,0.15 0.5,0.25 C0.55,0.15 0.6,0.1 0.65,0.1 C0.8,0.1 0.9,0.15 0.9,0.35 C0.9,0.6 0.5,0.9 0.5,0.9 Z" />
              </clipPath>
            </defs>
          </svg>
          
          {/* Heart container with enhanced shadows and effects */}
          <div 
            className="relative w-[240px] h-[216px] sm:w-[280px] sm:h-[252px] md:w-[320px] md:h-[288px] overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500"
            style={{ 
              clipPath: 'url(#perfectHeart)',
              filter: 'drop-shadow(0 8px 32px rgba(212, 165, 116, 0.3)) drop-shadow(0 4px 16px rgba(212, 165, 116, 0.2))'
            }}
          >
            {/* Enhanced background gradient with more depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/10 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
            
            {/* Elegant glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Left side - Couple photo with enhanced effects */}
            <div className="absolute left-0 top-0 w-1/2 h-full overflow-hidden">
              <Image 
                src={coupleImage}
                alt="Beautiful couple portrait"
                fill
                className="object-cover object-center transform scale-105 group-hover:scale-110 transition-transform duration-700 motion-reduce:transform-none motion-reduce:transition-none"
                style={{ 
                  filter: 'sepia(5%) saturate(105%) brightness(105%) contrast(102%)'
                }}
                sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 160px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/10 group-hover:to-primary/5 transition-colors duration-500"></div>
            </div>
            
            {/* Right side - Cake photo with enhanced effects */}
            <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden">
              <Image 
                src={cakeImage}
                alt="Beautiful wedding cake"
                fill
                className="object-cover object-center transform scale-105 group-hover:scale-110 transition-transform duration-700 motion-reduce:transform-none motion-reduce:transition-none"
                style={{ 
                  filter: 'sepia(3%) saturate(103%) brightness(108%) contrast(102%)'
                }}
                sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 160px"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-accent/15 group-hover:to-accent/8 transition-colors duration-500"></div>
            </div>
            
            {/* Enhanced center divider with glow effect */}
            <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/70 to-transparent transform -translate-x-0.5 opacity-60 group-hover:opacity-80 group-hover:shadow-lg transition-all duration-500"></div>
            
            {/* Heart overlay with enhanced pattern */}
            <div className="absolute inset-0 opacity-25 group-hover:opacity-35 transition-opacity duration-500">
              <div className="w-full h-full bg-gradient-radial from-accent/50 via-transparent to-primary/15"></div>
            </div>
          </div>
          
          {/* Enhanced decorative elements with better visibility and elegance */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-3 bg-primary/70 rounded-full animate-pulse shadow-lg ring-2 ring-primary/20"></div>
          </div>
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="w-2.5 h-2.5 bg-accent/90 rounded-full animate-pulse delay-300 shadow-md ring-2 ring-accent/30"></div>
          </div>
          <div className="absolute top-1/2 -left-3 transform -translate-y-1/2">
            <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-pulse delay-150 shadow-md"></div>
          </div>
          <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
            <div className="w-2.5 h-2.5 bg-accent/80 rounded-full animate-pulse delay-450 shadow-md"></div>
          </div>
          
          {/* Additional romantic floating elements around the heart */}
          <div className="absolute -top-6 left-1/4 transform -translate-x-1/2">
            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-float delay-200 opacity-70"></div>
          </div>
          <div className="absolute -top-6 right-1/4 transform translate-x-1/2">
            <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-float delay-800 opacity-70"></div>
          </div>
          <div className="absolute -bottom-6 left-1/3">
            <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-float delay-1100 opacity-70"></div>
          </div>
          <div className="absolute -bottom-6 right-1/3">
            <div className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-float delay-1400 opacity-70"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeartCollage;