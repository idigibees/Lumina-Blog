import React, { useEffect, useState } from 'react';

interface AdUnitProps {
  slot: 'sidebar' | 'banner' | 'inline';
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ slot, className = '' }) => {
  const [isVisible, setIsVisible] = useState(true);

  // In a real app, this would integrate with Google AdSense or similar
  const getDimensions = () => {
    switch(slot) {
      case 'sidebar': return { width: 300, height: 250, label: 'Sidebar Ad' };
      case 'banner': return { width: 728, height: 90, label: 'Leaderboard Ad' };
      case 'inline': return { width: '100%', height: 250, label: 'Sponsored Content' };
    }
  };

  const { width, height, label } = getDimensions();

  // Simulate ad loading occasionally failing (for realism) or ad blockers
  useEffect(() => {
     // 100% fill rate for demo
     setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`flex flex-col items-center justify-center bg-gray-100 border border-gray-200 rounded-lg overflow-hidden relative ${className}`} style={{ minHeight: typeof height === 'number' ? height : 200 }}>
       <div className="absolute top-0 right-0 bg-gray-200 text-gray-500 text-[10px] px-1 uppercase tracking-wider">Ad</div>
       <div className="text-center p-4">
           <p className="text-gray-400 font-medium text-sm mb-2">{label}</p>
           <p className="text-indigo-500 text-xs hover:underline cursor-pointer">Start your premium blog today with Lumina Pro</p>
       </div>
    </div>
  );
};

export default AdUnit;