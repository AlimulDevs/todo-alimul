import React from 'react';
import { motion } from 'framer-motion';
import { FilterType } from '../App';

interface FilterTabsProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  darkMode: boolean;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ filter, setFilter, darkMode }) => {
  const tabs: { key: FilterType; label: string; emoji: string }[] = [
    { key: 'all', label: 'All', emoji: '📋' },
    { key: 'active', label: 'Active', emoji: '⚡' },
    { key: 'completed', label: 'Completed', emoji: '✅' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="max-w-md mx-auto mb-8"
    >
      <div className={`backdrop-blur-md rounded-2xl p-2 border ${
        darkMode 
          ? 'bg-black/40 border-gray-700' 
          : 'bg-black/60 border-gray-600'
      } shadow-xl`}>
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 relative px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === tab.key
                  ? 'text-white shadow-lg'
                  : darkMode
                  ? 'text-gray-300 hover:text-white hover:bg-black/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-black/20'
              }`}
            >
              {filter === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-lg">{tab.emoji}</span>
                {tab.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterTabs;