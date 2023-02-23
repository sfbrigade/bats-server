import { useState, useEffect } from 'react';

export const useTabPositions = (defaultTab, defaultPositions) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab);
  const [scrollTopPositions, setScrollTopPositions] = useState(defaultPositions);
  const handleSelectTab = (id) => {
    const currentScrollY = window.scrollY;
    setSelectedTab((current) => {
      setScrollTopPositions({
        ...scrollTopPositions,
        [current]: currentScrollY,
      });
      return id;
    });
  };
  useEffect(() => {
    window.scrollTo(0, scrollTopPositions[selectedTab]);
  }, [selectedTab, scrollTopPositions]);
return {selectedTab, setSelectedTab, scrollTopPositions, setScrollTopPositions, handleSelectTab}
}