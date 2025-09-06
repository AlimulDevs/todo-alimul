import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  completed: number;
  total: number;
  darkMode: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total, darkMode }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="max-w-2xl mx-auto mb-8"
    >
      <div className={`backdrop-blur-md rounded-2xl p-6 border ${
        darkMode 
          ? 'bg-black/40 border-gray-700' 
          : 'bg-black/60 border-gray-600'
      } shadow-xl`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Progress
          </h3>
          <span className={`text-sm font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-400'
          }`}>
            {completed} / {total}
          </span>
        </div>
        
        <div className={`h-3 rounded-full overflow-hidden ${
          darkMode ? 'bg-gray-800' : 'bg-gray-700'
        }`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full shadow-lg"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))'
            }}
          />
        </div>
        
        {total > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-sm text-center mt-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-400'
            }`}
          >
            {percentage === 100 
              ? "You're absolutely crushing it! 🔥" 
              : percentage > 50 
              ? "More than halfway there! Keep going! 💪"
              : "Just getting started, you got this! ✨"
            }
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default ProgressBar;