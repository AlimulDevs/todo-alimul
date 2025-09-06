import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, Check, X } from 'lucide-react';
import { Todo } from '../App';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  darkMode: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onUpdate, 
  darkMode 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleUpdate = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`backdrop-blur-md rounded-xl border p-4 transition-all duration-300 ${
        darkMode
          ? 'bg-black/40 border-gray-700 hover:bg-black/50'
          : 'bg-black/60 border-gray-600 hover:bg-black/70'
      } shadow-lg hover:shadow-xl group`}
    >
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
            todo.completed
              ? 'bg-gradient-to-r from-green-400 to-blue-500 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]'
              : darkMode
              ? 'border-gray-600 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(147,51,234,0.3)]'
              : 'border-gray-500 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(147,51,234,0.2)]'
          } flex items-center justify-center`}
        >
          {todo.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check size={14} className="text-white" />
            </motion.div>
          )}
        </motion.button>

        {/* Todo Text */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleUpdate();
                    if (e.key === 'Escape') handleCancel();
                  }}
                  onBlur={handleUpdate}
                  autoFocus
                  className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                    darkMode
                      ? 'bg-black/20 border-gray-700 text-white focus:border-purple-400'
                      : 'bg-black/40 border-gray-600 text-gray-200 focus:border-purple-500'
                  }`}
                />
              ) : (
                <motion.p
                  initial={false}
                  animate={{
                    opacity: todo.completed ? 0.6 : 1,
                    textDecorationLine: todo.completed ? 'line-through' : 'none',
                  }}
                  className={`text-lg font-medium transition-all duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-200'
                  } ${todo.completed ? 'opacity-60' : ''}`}
                >
                  {todo.text}
                </motion.p>
              )}
            </div>
            <div className={`text-xs ml-4 ${
              darkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>
              {new Date(todo.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: new Date(todo.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleUpdate}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? 'hover:bg-black/20 text-gray-400 hover:text-green-400'
                    : 'hover:bg-black/20 text-gray-500 hover:text-green-400'
                }`}
              >
                <Check size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCancel}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? 'hover:bg-black/20 text-gray-400 hover:text-red-400'
                    : 'hover:bg-black/20 text-gray-500 hover:text-red-400'
                }`}
              >
                <X size={16} />
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? 'hover:bg-black/20 text-gray-400 hover:text-blue-400'
                    : 'hover:bg-black/20 text-gray-500 hover:text-blue-400'
                }`}
              >
                <Edit size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(todo.id)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? 'hover:bg-black/20 text-gray-400 hover:text-red-400'
                    : 'hover:bg-black/20 text-gray-500 hover:text-red-400'
                }`}
              >
                <Trash2 size={16} />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TodoItem;