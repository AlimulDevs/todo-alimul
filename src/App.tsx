import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Moon, Sun, Trash2, Edit, Check, X } from "lucide-react";
import TodoItem from "./components/TodoItem";
import FilterTabs from "./components/FilterTabs";
import ProgressBar from "./components/ProgressBar";
import Confetti from "./components/Confetti";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  created_at: Date;
}

export type FilterType = "all" | "active" | "completed";
export type DateFilterType =
  | "all"
  | "today"
  | "this-week"
  | "this-month"
  | "this-year"
  | "custom";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [dateFilter, setDateFilter] = useState<DateFilterType>("all");
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [darkMode, setDarkMode] = useState(true);
  const [newTodo, setNewTodo] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  console.log(todos);

  // Load todos from localStorage on mount
  useEffect(() => {
    // const savedTodos = localStorage.getItem("genz-todos");
    // const savedTheme = localStorage.getItem("genz-theme");

    // if (savedTodos) {
    //   setTodos(JSON.parse(savedTodos));
    // }

    // if (savedTheme) {
    //   setDarkMode(savedTheme === "dark");
    // }

    const getTodos = async () => {
      const postaPI = await fetch(
        "https://todo-list.dummy-code.site/api/v1/data-list",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-token": "secret123",
          },
        }
      );

      const result = await postaPI.json();
      // filter data agar tidak ada object kosong
      const newData: Todo[] = result.data.filter(
        (item: any) => item && Object.keys(item).length > 0
      );

      setTodos(newData);
    };

    getTodos();
  }, []);

  // Save todos to localStorage whenever todos change

  // Save theme to localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem("genz-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const addTodo = async () => {
    if (newTodo.trim()) {
      const postaPI = await fetch(
        "https://todo-list.dummy-code.site/api/v1/data-list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-token": "secret123",
          },
          body: JSON.stringify({
            text: newTodo.trim(),
            completed: false,
            created_at: new Date().toString(),
          }),
        }
      );

      const result = await postaPI.json();
      const newData: Todo = result.data;

      setTodos([newData, ...todos]);
      setNewTodo("");
    }
  };

  const toggleTodo = async (id: string) => {
    const todoBeforeUpdate = todos.find((t) => t.id === id);
    if (!todoBeforeUpdate) return;

    const updatedCompleted = !todoBeforeUpdate.completed;

    const putApi = await fetch(
      `https://todo-list.dummy-code.site/api/v1/data-list/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-token": "secret123",
        },
        body: JSON.stringify({ completed: updatedCompleted }),
      }
    );

    const result = await putApi.json();

    if (result.status === "success") {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: updatedCompleted } : todo
        )
      );

      if (updatedCompleted) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  const deleteTodo = async (id: string) => {
    const deleteApi = await fetch(
      `https://todo-list.dummy-code.site/api/v1/data-list/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-token": "secret123",
        },
      }
    );
    const result = await deleteApi.json();

    if (result.status === "success") {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  const updateTodo = async (id: string, text: string) => {
    const putApi = await fetch(
      `https://todo-list.dummy-code.site/api/v1/data-list/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-token": "secret123",
        },
        body: JSON.stringify({
          text: text,
        }),
      }
    );

    const result = await putApi.json();

    if (result.status === "success") {
      setTodos(
        todos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
      );
    }
  };

  const isDateInRange = (date: Date) => {
    const now = new Date();
    const todoDate = new Date(date);

    switch (dateFilter) {
      case "today":
        return todoDate.toDateString() === now.toDateString();
      case "this-week":
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        return todoDate >= weekStart;
      case "this-month":
        return (
          todoDate.getMonth() === now.getMonth() &&
          todoDate.getFullYear() === now.getFullYear()
        );
      case "this-year":
        return todoDate.getFullYear() === now.getFullYear();
      case "custom":
        return (
          todoDate.getMonth() === selectedMonth &&
          todoDate.getFullYear() === selectedYear
        );
      default:
        return true;
    }
  };

  const filteredTodos = todos.filter((todo) => {
    // Apply completion filter
    let passesCompletionFilter = true;
    if (filter === "active") passesCompletionFilter = !todo.completed;
    if (filter === "completed") passesCompletionFilter = todo.completed;

    // Apply date filter
    const passesDateFilter = isDateInRange(todo.created_at);

    return passesCompletionFilter && passesDateFilter;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  const availableYears = [
    ...new Set(todos.map((todo) => new Date(todo.created_at).getFullYear())),
  ].sort((a, b) => b - a);
  const availableMonths = [
    ...new Set(
      todos
        .filter(
          (todo) => new Date(todo.created_at).getFullYear() === selectedYear
        )
        .map((todo) => new Date(todo.created_at).getMonth())
    ),
  ].sort((a, b) => a - b);

  const genZPhrases = [
    "Ready to slay your day? ✨",
    "Let's get things done bestie 🚀",
    "Your todo list is looking a little sus... Add some tasks! 👀",
    "Time to be productive, no cap 💯",
    "Add some tasks and let's get this bread 🍞",
  ];

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-black via-gray-900 to-black"
          : "bg-gradient-to-br from-gray-900 via-black to-gray-800"
      }`}
    >
      {showConfetti && <Confetti />}

      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-blue-500/10 to-turquoise-500/10 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full backdrop-blur-md border ${
                darkMode
                  ? "bg-black/40 border-gray-700 text-yellow-300"
                  : "bg-black/60 border-gray-600 text-purple-400"
              } hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all duration-300`}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </motion.button>
          </div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent`}
          >
            ✨ Alimul List ✨
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-lg ${
              darkMode ? "text-white/80" : "text-gray-700"
            } font-medium`}
          >
            Your productivity era starts now 💅
          </motion.p>
        </motion.header>

        {/* Progress Bar */}
        <ProgressBar
          completed={completedCount}
          total={totalCount}
          darkMode={darkMode}
        />

        {/* Add Todo Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div
            className={`backdrop-blur-md rounded-2xl p-6 border ${
              darkMode
                ? "bg-black/40 border-gray-700"
                : "bg-black/60 border-gray-600"
            } shadow-2xl`}
          >
            {/* <div className="flex gap-4">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                placeholder="What's on your mind? ✨"
                className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 ${
                  darkMode
                    ? "bg-black/20 border-gray-700 text-white placeholder-gray-400 focus:border-purple-400 focus:shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                    : "bg-black/40 border-gray-600 text-gray-200 placeholder-gray-500 focus:border-purple-500 focus:shadow-[0_0_20px_rgba(147,51,234,0.2)]"
                }`}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addTodo}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] transition-all duration-300 flex items-center gap-2"
              >
                <Plus size={20} />
                Add
              </motion.button>
            </div> */}
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <FilterTabs filter={filter} setFilter={setFilter} darkMode={darkMode} />

        {/* Date Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div
            className={`backdrop-blur-md rounded-2xl p-6 border ${
              darkMode
                ? "bg-black/40 border-gray-700"
                : "bg-black/60 border-gray-600"
            } shadow-xl`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-white" : "text-gray-200"
              }`}
            >
              📅 Filter by Date
            </h3>

            {/* Date Filter Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
              {[
                { key: "all", label: "All Time", emoji: "🌍" },
                { key: "today", label: "Today", emoji: "📅" },
                { key: "this-week", label: "This Week", emoji: "📆" },
                { key: "this-month", label: "This Month", emoji: "🗓️" },
                { key: "this-year", label: "This Year", emoji: "📊" },
                { key: "custom", label: "Custom", emoji: "🎯" },
              ].map((dateTab) => (
                <motion.button
                  key={dateTab.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDateFilter(dateTab.key as DateFilterType)}
                  className={`relative px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                    dateFilter === dateTab.key
                      ? "text-white shadow-lg"
                      : darkMode
                      ? "text-gray-300 hover:text-white hover:bg-black/20"
                      : "text-gray-400 hover:text-gray-200 hover:bg-black/20"
                  }`}
                >
                  {dateFilter === dateTab.key && (
                    <motion.div
                      layoutId="activeDateTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-turquoise-500 rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1">
                    <span className="text-xs">{dateTab.emoji}</span>
                    <span className="hidden sm:inline">{dateTab.label}</span>
                    <span className="sm:hidden">
                      {dateTab.label.split(" ")[0]}
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Custom Date Selectors */}
            {dateFilter === "custom" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex-1">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-400"
                    }`}
                  >
                    Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                      darkMode
                        ? "bg-black/20 border-gray-700 text-white focus:border-blue-400"
                        : "bg-black/40 border-gray-600 text-gray-200 focus:border-blue-500"
                    }`}
                  >
                    {availableYears.length > 0 ? (
                      availableYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))
                    ) : (
                      <option value={new Date().getFullYear()}>
                        {new Date().getFullYear()}
                      </option>
                    )}
                  </select>
                </div>
                <div className="flex-1">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-400"
                    }`}
                  >
                    Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                      darkMode
                        ? "bg-black/20 border-gray-700 text-white focus:border-blue-400"
                        : "bg-black/40 border-gray-600 text-gray-200 focus:border-blue-500"
                    }`}
                  >
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((month, index) => (
                      <option key={index} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Filter Results Summary */}
            <div
              className={`mt-4 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Showing {filteredTodos.length} of {totalCount} tasks
              {dateFilter !== "all" && (
                <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                  {dateFilter === "custom"
                    ? `${
                        [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ][selectedMonth]
                      } ${selectedYear}`
                    : dateFilter.replace("-", " ")}
                </span>
              )}
            </div>
          </div>
        </motion.div>
        {/* Todos List */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredTodos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`text-center py-16 backdrop-blur-md rounded-2xl border ${
                  darkMode
                    ? "bg-black/20 border-gray-800"
                    : "bg-black/40 border-gray-700"
                } shadow-xl`}
              >
                <div className="text-8xl mb-4">🦄</div>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-200"
                  }`}
                >
                  {filter === "completed"
                    ? "No completed tasks yet!"
                    : filter === "active"
                    ? "No active tasks!"
                    : "All caught up!"}
                </h3>
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-300" : "text-gray-400"
                  }`}
                >
                  {genZPhrases[Math.floor(Math.random() * genZPhrases.length)]}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onUpdate={updateTodo}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className={`text-center mt-12 ${
              darkMode ? "text-white/60" : "text-gray-600"
            }`}
          >
            <p className="text-sm">
              {completedCount} of {totalCount} tasks completed • Keep slaying!
              👑
            </p>
          </motion.footer>
        )}
      </div>
    </div>
  );
}

export default App;
