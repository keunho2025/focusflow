"use client";

import { useState, useEffect, useRef } from "react";

type TodoCategory = "work" | "project" | "personal" | "learning" | "health";
type TodoPriority = "low" | "medium" | "high" | "urgent";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  pomodoroCount: number;
  dueDate?: string; // YYYY-MM-DD format
  category: TodoCategory;
  priority: TodoPriority;
};

const CATEGORIES: Record<TodoCategory, { label: string; icon: string; color: string }> = {
  work: { label: "Work", icon: "🏢", color: "bg-blue-100 border-blue-300" },
  project: { label: "Project", icon: "💡", color: "bg-purple-100 border-purple-300" },
  personal: { label: "Personal", icon: "🎯", color: "bg-green-100 border-green-300" },
  learning: { label: "Learning", icon: "📚", color: "bg-orange-100 border-orange-300" },
  health: { label: "Health", icon: "💪", color: "bg-red-100 border-red-300" },
};

const PRIORITIES: Record<TodoPriority, { label: string; icon: string; color: string }> = {
  low: { label: "Low", icon: "🟢", color: "bg-green-200" },
  medium: { label: "Medium", icon: "🟡", color: "bg-yellow-200" },
  high: { label: "High", icon: "🟠", color: "bg-orange-200" },
  urgent: { label: "Urgent", icon: "🔴", color: "bg-red-200" },
};

type TimerMode = "focus" | "short" | "long";
type Screen = "home" | "tasks" | "stats" | "settings";

type TimerSettings = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
};

const DEFAULT_SETTINGS: TimerSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 45,
};

function getModes(settings: TimerSettings): Record<TimerMode, { label: string; seconds: number }> {
  return {
    focus: { label: `Pomodoro · ${settings.focusMinutes}min`, seconds: settings.focusMinutes * 60 },
    short: { label: `Short Break · ${settings.shortBreakMinutes}min`, seconds: settings.shortBreakMinutes * 60 },
    long: { label: `Long Break · ${settings.longBreakMinutes}min`, seconds: settings.longBreakMinutes * 60 },
  };
}

const CIRCUMFERENCE = 565;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<TimerMode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SETTINGS.focusMinutes * 60);
  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_SETTINGS.focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoInput, setTodoInput] = useState("");
  const [todoDueDate, setTodoDueDate] = useState("");
  const [todoCategory, setTodoCategory] = useState<TodoCategory>("personal");
  const [todoPriority, setTodoPriority] = useState<TodoPriority>("medium");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<TodoCategory | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [weeklyData, setWeeklyData] = useState<
    Record<string, { sessions: number; focusMinutes: number }>
  >({});
  const [todaySessions, setTodaySessions] = useState(0);
  const [todayFocusMin, setTodayFocusMin] = useState(0);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    const savedWeeklyData = localStorage.getItem("weeklyData");
    const savedSettings = localStorage.getItem("timerSettings");

    if (savedTodos) {
      const parsed = JSON.parse(savedTodos);
      setTodos(parsed.map((todo: Todo) => ({
        ...todo,
        category: todo.category || "personal",
        priority: todo.priority || "medium",
      })));
    } else {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      setTodos([
        {
          id: "1",
          text: "디자인 시안 검토하기",
          completed: false,
          pomodoroCount: 0,
          dueDate: tomorrow.toISOString().split('T')[0],
          category: "work",
          priority: "high",
        },
        {
          id: "2",
          text: "API 문서 작성하기",
          completed: false,
          pomodoroCount: 0,
          dueDate: nextWeek.toISOString().split('T')[0],
          category: "project",
          priority: "medium",
        },
        {
          id: "3",
          text: "코드 리뷰 진행하기",
          completed: false,
          pomodoroCount: 0,
          dueDate: today.toISOString().split('T')[0],
          category: "learning",
          priority: "urgent",
        },
      ]);
    }

    if (savedWeeklyData) {
      const data = JSON.parse(savedWeeklyData);
      setWeeklyData(data);
      const today = todayKey();
      const todayData = data[today];
      if (todayData) {
        setTodaySessions(todayData.sessions);
        setTodayFocusMin(todayData.focusMinutes);
      }
    }

    if (savedSettings) {
      const settings = JSON.parse(savedSettings) as TimerSettings;
      setTimerSettings(settings);
      setSecondsLeft(settings.focusMinutes * 60);
      setTotalSeconds(settings.focusMinutes * 60);
    }

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("weeklyData", JSON.stringify(weeklyData));
    }
  }, [weeklyData, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("timerSettings", JSON.stringify(timerSettings));
    }
  }, [timerSettings, mounted]);

  const selectedTodo = todos.find((t) => t.id === selectedId && !t.completed);
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const strokeDashOffset = CIRCUMFERENCE * (1 - progress);

  function switchMode(newMode: TimerMode) {
    const modes = getModes(timerSettings);
    setMode(newMode);
    setSecondsLeft(modes[newMode].seconds);
    setTotalSeconds(modes[newMode].seconds);
    setIsRunning(false);
  }

  function completeSession() {
    setIsRunning(false);
    playNotification();

    if (mode === "focus") {
      const key = todayKey();
      const focusMinutes = timerSettings.focusMinutes;
      setWeeklyData((prev) => {
        const day = prev[key] || { sessions: 0, focusMinutes: 0 };
        const updated = {
          sessions: day.sessions + 1,
          focusMinutes: day.focusMinutes + focusMinutes,
        };
        setTodaySessions(updated.sessions);
        setTodayFocusMin(updated.focusMinutes);
        return { ...prev, [key]: updated };
      });
      if (selectedId) {
        setTodos((prev) =>
          prev.map((t) =>
            t.id === selectedId ? { ...t, pomodoroCount: t.pomodoroCount + 1 } : t
          )
        );
      }
    }
    switchMode(mode === "focus" ? "short" : "focus");
  }

  function playNotification() {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Pomodoro Complete!", {
        body: mode === "focus" ? "Time for a break! 🎉" : "Ready to focus? 🎯",
        icon: "🍅",
      });
    }
  }

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            completeSession();
            return MODES[mode].seconds;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, mode]);

  function startTimer() { setIsRunning(true); }
  function pauseTimer() { setIsRunning(false); }
  function resetTimer() {
    const modes = getModes(timerSettings);
    setIsRunning(false);
    setSecondsLeft(modes[mode].seconds);
    setTotalSeconds(modes[mode].seconds);
  }

  function selectTodo(id: string) {
    if (selectedId === id) {
      setSelectedId(null);
      pauseTimer();
    } else {
      setSelectedId(id);
      resetTimer();
      setTimeout(() => setIsRunning(true), 0);
    }
  }

  function addTodo() {
    const text = todoInput.trim();
    if (!text) return;
    const today = new Date().toISOString().split('T')[0];
    setTodos((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        text,
        completed: false,
        pomodoroCount: 0,
        dueDate: todoDueDate || today,
        category: todoCategory,
        priority: todoPriority,
      },
    ]);
    setTodoInput("");
    setTodoDueDate("");
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    if (id === selectedId) {
      setSelectedId(null);
      pauseTimer();
    }
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (id === selectedId) {
      setSelectedId(null);
      pauseTimer();
    }
  }

  const activeTodos = todos.filter(
    (t) => !t.completed && (selectedCategoryFilter === "all" || t.category === selectedCategoryFilter)
  );
  const completedTodos = todos.filter((t) => t.completed);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }

  const MODES = getModes(timerSettings);

  return (
    <div
      className="min-h-screen w-screen flex flex-col font-sans"
      style={{
        background: "linear-gradient(135deg, #b3e5fc 0%, #81d4fa 25%, #a5d6ff 50%, #80deea 75%, #4dd0e1 100%)",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 backdrop-blur-xs" />

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col w-full h-screen overflow-hidden pb-20">

        {/* Home Screen */}
        {screen === "home" && (
          <div className="flex-1 flex flex-col overflow-y-auto pb-24">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-600">🎯 FocusFlow</h1>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-400"></div>
                  <div className="w-6 h-6 rounded-full bg-red-400"></div>
                  <div className="w-6 h-6 rounded-full bg-green-400"></div>
                  <div className="w-6 h-6 rounded-full bg-yellow-400"></div>
                  <button className="w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center text-sm">
                    🔔
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <h2 className="text-3xl font-bold text-slate-700">Today</h2>
                <p className="text-slate-600 text-sm">
                  {new Date().toLocaleDateString("ko-KR", { month: "numeric", day: "numeric", weekday: "short" })}
                </p>
              </div>
            </div>

            {/* Main Dashboard - 2 Column Layout */}
            <div className="flex-1 px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">

              {/* LEFT COLUMN - Statistics & Task Breakdown */}
              <div className="space-y-4">
                {/* Today's Stats Card */}
                <div className="bg-white/90 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-600 tracking-widest">📊 TODAY'S PROGRESS</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Sessions</span>
                      <span className="text-2xl font-bold text-blue-600">{todaySessions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Focus Time</span>
                      <span className="text-2xl font-bold text-green-600">{Math.round(todayFocusMin)}m</span>
                    </div>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white/90 rounded-2xl p-6 space-y-3">
                  <h3 className="text-sm font-bold text-slate-600 tracking-widest">📂 BY CATEGORY</h3>
                  <div className="space-y-2">
                    {Object.entries(CATEGORIES).map(([key, { label, icon, color }]) => {
                      const count = activeTodos.filter((t) => t.category === key).length;
                      return (
                        <div key={key} className="flex justify-between items-center text-sm">
                          <span className="text-slate-700">{icon} {label}</span>
                          <span className="font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Completed Today */}
                {completedTodos.length > 0 && (
                  <div className="bg-white/90 rounded-2xl p-6 space-y-3">
                    <h3 className="text-sm font-bold text-slate-600 tracking-widest">✓ COMPLETED ({completedTodos.length})</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {completedTodos.slice(0, 5).map((t) => (
                        <div key={t.id} className="flex items-center gap-2 text-xs text-slate-600">
                          <span>✓</span>
                          <span className="line-through">{t.text}</span>
                        </div>
                      ))}
                      {completedTodos.length > 5 && (
                        <div className="text-xs text-slate-500 italic">+{completedTodos.length - 5} more</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN - Timer & Controls */}
              <div className="flex flex-col items-center justify-center space-y-6">
                {/* Analog Clock */}
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Clock Face */}
                    <circle cx="100" cy="100" r="95" fill="rgba(255,255,255,0.95)" stroke="white" strokeWidth="3" />

                    {/* Hour Markers */}
                    {mounted && [...Array(12)].map((_, i) => {
                      const angle = (i * 30 - 90) * (Math.PI / 180);
                      const x1 = 100 + 80 * Math.cos(angle);
                      const y1 = 100 + 80 * Math.sin(angle);
                      const x2 = 100 + 90 * Math.cos(angle);
                      const y2 = 100 + 90 * Math.sin(angle);
                      return (
                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a5f7a" strokeWidth="2" />
                      );
                    })}

                    {/* Center Dot */}
                    <circle cx="100" cy="100" r="5" fill="#1a5f7a" />

                    {mounted && (() => {
                      // Calculate hand angles
                      const minutes = Math.floor(secondsLeft / 60);
                      const seconds = secondsLeft % 60;

                      // Minute hand (0-360 degrees based on elapsed time)
                      const elapsedSeconds = totalSeconds - secondsLeft;
                      const minuteAngle = (elapsedSeconds / totalSeconds) * 360 - 90;

                      // Second hand (0-360 degrees for remaining seconds)
                      const secondAngle = (seconds / 60) * 360 - 90;

                      return (
                        <>
                          {/* Minute Hand */}
                          <line
                            x1="100"
                            y1="100"
                            x2={100 + 60 * Math.cos((minuteAngle * Math.PI) / 180)}
                            y2={100 + 60 * Math.sin((minuteAngle * Math.PI) / 180)}
                            stroke="#1a5f7a"
                            strokeWidth="6"
                            strokeLinecap="round"
                            className="transition-all duration-300"
                          />

                          {/* Second Hand */}
                          <line
                            x1="100"
                            y1="100"
                            x2={100 + 70 * Math.cos((secondAngle * Math.PI) / 180)}
                            y2={100 + 70 * Math.sin((secondAngle * Math.PI) / 180)}
                            stroke="#ef4444"
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="transition-all duration-300"
                          />
                        </>
                      );
                    })()}
                  </svg>

                  {/* Time Display in Center */}
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-1">
                    <p className="text-3xl font-bold text-slate-700 tabular-nums">
                      {formatTime(secondsLeft)}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">{MODES[mode].label}</p>
                  </div>
                </div>

                {/* Current Task */}
                <div className="text-center space-y-2">
                  <p className="text-white/70 text-xs font-light tracking-widest">
                    {selectedTodo ? "FOCUSING ON" : "SELECT A TASK"}
                  </p>
                  {selectedTodo ? (
                    <div className="space-y-1">
                      <p className="text-white font-bold text-lg">{selectedTodo.text}</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg">{CATEGORIES[selectedTodo.category].icon}</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${PRIORITIES[selectedTodo.priority].color}`}>
                          {PRIORITIES[selectedTodo.priority].icon}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/60 text-sm">No task selected</p>
                  )}
                </div>

                {/* Control Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => (isRunning ? pauseTimer() : startTimer())}
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95 font-bold text-xl text-slate-700"
                  >
                    {isRunning ? "⏸" : "▶"}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95 font-bold text-xl text-slate-700"
                  >
                    ↻
                  </button>
                </div>

                {/* Mode Buttons */}
                <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                  {Object.entries(MODES).map(([key, { label }]) => (
                    <button
                      key={key}
                      onClick={() => switchMode(key as TimerMode)}
                      disabled={isRunning}
                      className={`py-2 px-3 rounded-lg font-semibold text-xs transition-all ${
                        mode === key
                          ? "bg-white text-slate-700 shadow-lg"
                          : "bg-white/40 text-white border border-white/50 hover:bg-white/50 disabled:opacity-50"
                      }`}
                    >
                      {label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Screen - Timeline View */}
        {screen === "tasks" && (
          <div className="relative w-full flex-1 flex flex-col overflow-hidden pb-24">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 space-y-4 flex-shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-600">🎯 FocusFlow</h1>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-400"></div>
                  <div className="w-6 h-6 rounded-full bg-red-400"></div>
                  <div className="w-6 h-6 rounded-full bg-green-400"></div>
                  <div className="w-6 h-6 rounded-full bg-yellow-400"></div>
                  <button className="w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center text-sm">
                    🔔
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <h2 className="text-3xl font-bold text-slate-700">Tasks Timeline</h2>
                <p className="text-slate-600 text-sm">
                  {new Date().toLocaleDateString("ko-KR", { month: "numeric", day: "numeric", weekday: "short" })}
                </p>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="px-6 py-3 flex-shrink-0 bg-slate-50 border-b border-slate-200 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                <button
                  onClick={() => setSelectedCategoryFilter("all")}
                  className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                    selectedCategoryFilter === "all"
                      ? "bg-slate-700 text-white"
                      : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  All
                </button>
                {Object.entries(CATEGORIES).map(([key, { label, icon, color }]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategoryFilter(key as TodoCategory)}
                    className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                      selectedCategoryFilter === key
                        ? `${color} border border-current`
                        : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Task Form */}
            <div className="px-6 py-3 space-y-3 flex-shrink-0 bg-slate-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={todoInput}
                  onChange={(e) => setTodoInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTodo()}
                  placeholder="새 할 일..."
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-300 text-sm border border-slate-200"
                />
                <input
                  type="date"
                  value={todoDueDate}
                  onChange={(e) => setTodoDueDate(e.target.value)}
                  className="px-3 py-2.5 rounded-lg bg-white text-slate-700 outline-none focus:ring-2 focus:ring-blue-300 text-sm border border-slate-200"
                />
                <button
                  onClick={addTodo}
                  className="px-5 py-2.5 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all text-lg"
                >
                  +
                </button>
              </div>

              {/* Category & Priority Selection */}
              <div className="flex gap-2">
                <select
                  value={todoCategory}
                  onChange={(e) => setTodoCategory(e.target.value as TodoCategory)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white text-slate-700 outline-none focus:ring-2 focus:ring-blue-300 text-sm border border-slate-200"
                >
                  {Object.entries(CATEGORIES).map(([key, { label, icon }]) => (
                    <option key={key} value={key}>
                      {icon} {label}
                    </option>
                  ))}
                </select>

                <select
                  value={todoPriority}
                  onChange={(e) => setTodoPriority(e.target.value as TodoPriority)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white text-slate-700 outline-none focus:ring-2 focus:ring-blue-300 text-sm border border-slate-200"
                >
                  {Object.entries(PRIORITIES).map(([key, { label, icon }]) => (
                    <option key={key} value={key}>
                      {icon} {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Timeline View */}
            <div className="flex-1 overflow-auto px-6 py-4">
              {activeTodos.length > 0 ? (
                <div className="space-y-4">
                  {(() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const maxDate = new Date(today);
                    maxDate.setDate(maxDate.getDate() + 30);

                    return (
                      <>
                        {/* Timeline Header */}
                        <div className="sticky top-0 bg-white/80 backdrop-blur pb-2">
                          <div className="flex items-center">
                            <div className="w-32 flex-shrink-0 font-semibold text-slate-700 text-sm">Task</div>
                            <div className="flex-1 flex gap-1">
                              {Array.from({ length: 31 }).map((_, i) => {
                                const date = new Date(today);
                                date.setDate(date.getDate() + i);
                                const isToday = i === 0;
                                return (
                                  <div
                                    key={i}
                                    className={`w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                                      isToday
                                        ? "bg-blue-500 text-white rounded-full"
                                        : "text-slate-500"
                                    }`}
                                    title={date.toLocaleDateString()}
                                  >
                                    {date.getDate()}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Timeline Bars */}
                        {activeTodos.map((todo) => {
                          const dueDate = new Date(todo.dueDate || today.toISOString().split('T')[0]);
                          dueDate.setHours(0, 0, 0, 0);
                          const daysUntilDue = Math.ceil(
                            (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                          );
                          const isOverdue = daysUntilDue < 0;
                          const isToday = daysUntilDue === 0;
                          const isPending = daysUntilDue > 0;

                          const category = CATEGORIES[todo.category] || CATEGORIES.personal;
                          const priority = PRIORITIES[todo.priority];

                          return (
                            <div key={todo.id} className="flex items-center gap-2">
                              <div className="w-32 flex-shrink-0">
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="checkbox"
                                    checked={false}
                                    onChange={() => toggleTodo(todo.id)}
                                    className="cursor-pointer accent-blue-400 w-4 h-4"
                                  />
                                  <span
                                    className="text-2xl flex-shrink-0"
                                    title={category.label}
                                  >
                                    {category.icon}
                                  </span>
                                  <span
                                    className="text-xs font-medium text-slate-700 truncate cursor-pointer hover:underline"
                                    onClick={() => selectTodo(todo.id)}
                                  >
                                    {todo.text}
                                  </span>
                                </div>
                              </div>

                              {/* Timeline Bar */}
                              <div className="flex-1 relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                                {daysUntilDue >= 0 && daysUntilDue < 31 && (
                                  <div
                                    className={`h-full rounded-lg transition-all ${
                                      isOverdue
                                        ? "bg-red-400"
                                        : isToday
                                        ? "bg-blue-500"
                                        : "bg-blue-300"
                                    }`}
                                    style={{
                                      width: `${((daysUntilDue + 1) / 31) * 100}%`,
                                      minWidth: "24px",
                                    }}
                                    title={`Due: ${dueDate.toLocaleDateString()}`}
                                  />
                                )}
                              </div>

                              {/* Due Date Label */}
                              <div className="w-16 flex-shrink-0 text-right">
                                <span className="text-xs font-semibold text-slate-600">
                                  {daysUntilDue < 0 ? "기한초과" : daysUntilDue === 0 ? "오늘" : `${daysUntilDue}d`}
                                </span>
                              </div>

                              {/* Priority Badge */}
                              <span
                                className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${priority.color}`}
                                title={priority.label}
                              >
                                {priority.icon}
                              </span>

                              {/* Pomodoro Count */}
                              {todo.pomodoroCount > 0 && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold flex-shrink-0">
                                  🍅{todo.pomodoroCount}
                                </span>
                              )}

                              {/* Delete Button */}
                              <button
                                onClick={() => deleteTodo(todo.id)}
                                className="text-red-400 hover:text-red-600 text-lg flex-shrink-0"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-600">
                  <p>할 일을 추가해보세요!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Screen */}
        {screen === "stats" && (
          <div className="relative w-full flex-1 flex flex-col overflow-y-auto pb-24">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-600">🎯 FocusFlow</h1>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-400"></div>
                  <div className="w-6 h-6 rounded-full bg-red-400"></div>
                  <div className="w-6 h-6 rounded-full bg-green-400"></div>
                  <div className="w-6 h-6 rounded-full bg-yellow-400"></div>
                  <button className="w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center text-sm">
                    🔔
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <h2 className="text-3xl font-bold text-slate-700">Statistics</h2>
                <p className="text-slate-600 text-sm">
                  {new Date().toLocaleDateString("ko-KR", { month: "numeric", day: "numeric", weekday: "short" })}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-blue-100 text-center">
                  <div className="text-slate-600 text-xs font-semibold mb-2">SESSIONS</div>
                  <div className="text-3xl font-bold text-blue-600">{todaySessions}</div>
                </div>
                <div className="p-4 rounded-xl bg-green-100 text-center">
                  <div className="text-slate-600 text-xs font-semibold mb-2">FOCUS</div>
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round(todayFocusMin)}
                    <span className="text-lg">m</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-orange-100 text-center">
                  <div className="text-slate-600 text-xs font-semibold mb-2">STREAK</div>
                  <div className="text-3xl font-bold text-orange-600">🔥0d</div>
                </div>
              </div>

              {/* Weekly Chart */}
              <div className="p-6 rounded-xl bg-white/90 backdrop-blur-sm">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <p className="text-slate-700 font-semibold">이번 주 집중</p>
                    <p className="text-slate-600 text-sm mt-1">
                      {(() => {
                        const week = Object.values(weeklyData).slice(-7);
                        const totalSessions = week.reduce((sum, d) => sum + d.sessions, 0);
                        const totalMinutes = week.reduce((sum, d) => sum + d.focusMinutes, 0);
                        return `총 ${totalSessions}세션 · ${Math.round(totalMinutes)}m`;
                      })()}
                    </p>
                  </div>
                  <p className="text-slate-400 text-xs">©25-26</p>
                </div>

                <div className="grid grid-cols-7 gap-2 h-32 items-end pt-2">
                  {(() => {
                    const today = new Date();
                    const days = [];
                    for (let i = 6; i >= 0; i--) {
                      const d = new Date(today);
                      d.setDate(d.getDate() - i);
                      const y = d.getFullYear();
                      const m = String(d.getMonth() + 1).padStart(2, "0");
                      const day = String(d.getDate()).padStart(2, "0");
                      const key = `${y}-${m}-${day}`;
                      const data = weeklyData[key] || { sessions: 0, focusMinutes: 0 };
                      days.push({ key, data, idx: 6 - i });
                    }
                    const maxSessions = Math.max(1, Math.max(...days.map(d => d.data.sessions)));
                    return days.map(({ key, data, idx }) => {
                      const height = (data.sessions / maxSessions) * 128;
                      return (
                        <div key={key} className="flex flex-col items-center gap-2">
                          <div
                            className="w-full rounded-t-lg transition-all bg-gradient-to-t from-blue-400 to-blue-300"
                            style={{ height: `${Math.max(height, 8)}px` }}
                          />
                          <span className="text-xs font-semibold text-slate-600">
                            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][idx]}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Screen */}
        {screen === "settings" && (
          <div className="relative w-full flex-1 flex flex-col overflow-y-auto pb-24">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-600">🎯 FocusFlow</h1>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-400"></div>
                  <div className="w-6 h-6 rounded-full bg-red-400"></div>
                  <div className="w-6 h-6 rounded-full bg-green-400"></div>
                  <div className="w-6 h-6 rounded-full bg-yellow-400"></div>
                  <button className="w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center text-sm">
                    🔔
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <h2 className="text-3xl font-bold text-slate-700">Settings</h2>
                <p className="text-slate-600 text-sm">
                  {new Date().toLocaleDateString("ko-KR", { month: "numeric", day: "numeric", weekday: "short" })}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
              <p className="text-slate-600 text-sm">타이머 시간을 커스터마이징하세요</p>

              {/* Settings Card */}
              <div className="rounded-xl bg-white/90 backdrop-blur-sm p-6 space-y-5">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Focus Time (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={timerSettings.focusMinutes}
                    onChange={(e) => setTimerSettings({ ...timerSettings, focusMinutes: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Short Break (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={timerSettings.shortBreakMinutes}
                    onChange={(e) => setTimerSettings({ ...timerSettings, shortBreakMinutes: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Long Break (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={timerSettings.longBreakMinutes}
                    onChange={(e) => setTimerSettings({ ...timerSettings, longBreakMinutes: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={() => setTimerSettings(DEFAULT_SETTINGS)}
                  className="w-full py-3 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-all mt-6"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 flex justify-around bg-slate-600/80 backdrop-blur-lg p-4 text-slate-700">
          {(["home", "tasks", "stats", "settings"] as Screen[]).map((s) => {
            const icons: Record<Screen, string> = { home: "🏠", tasks: "✓", stats: "📊", settings: "⚙️" };
            const labels: Record<Screen, string> = { home: "Home", tasks: "Tasks", stats: "Stats", settings: "Settings" };
            return (
              <button
                key={s}
                onClick={() => setScreen(s)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 px-1.5 rounded-lg transition-all duration-300 ${
                  screen === s
                    ? "text-white"
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                <span className="text-xl">{icons[s]}</span>
                <span className="text-xs">{labels[s]}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
