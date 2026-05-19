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

const SKILL_CATEGORIES: Record<SkillCategory, { label: string; icon: string; color: string }> = {
  programming: { label: "프로그래밍", icon: "💻", color: "bg-blue-100 border-blue-300" },
  design: { label: "디자인", icon: "🎨", color: "bg-purple-100 border-purple-300" },
  language: { label: "언어", icon: "🌍", color: "bg-green-100 border-green-300" },
  math: { label: "수학/통계", icon: "📐", color: "bg-yellow-100 border-yellow-300" },
  music: { label: "음악", icon: "🎵", color: "bg-pink-100 border-pink-300" },
  other: { label: "기타", icon: "⭐", color: "bg-slate-100 border-slate-300" },
};

type TimerMode = "focus" | "short" | "long";
type Screen = "home" | "tasks" | "stats" | "skills" | "settings";

type SkillCategory = "programming" | "design" | "language" | "math" | "music" | "other";

type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  icon: string;
  goalHours: number;
  totalMinutes: number;
  totalSessions: number;
  createdAt: string;
  color: string;
};

type News = {
  id: string;
  title: string;
  category: "ai" | "stock";
  date: string;
  icon: string;
  url: string;
};

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

const ALL_AI_NEWS: News[] = [
  { id: "ai-1", title: "Claude 4.7 API 업데이트, 성능 40% 향상", category: "ai", date: "오늘", icon: "🤖", url: "https://www.anthropic.com/" },
  { id: "ai-2", title: "생성형 AI 규제 법안 발효, 기업 준수 시작", category: "ai", date: "어제", icon: "⚖️", url: "https://news.naver.com/section/105" },
  { id: "ai-3", title: "구글 Gemini 2.0, 멀티모달 기능 강화", category: "ai", date: "3일전", icon: "🔍", url: "https://www.google.com/intl/ko/about/products/" },
  { id: "ai-4", title: "메타, 오픈소스 AI 모델 공개", category: "ai", date: "2일전", icon: "🦾", url: "https://www.meta.com/" },
  { id: "ai-5", title: "마이크로소프트 코파일럿, 성능 개선", category: "ai", date: "오늘", icon: "💻", url: "https://www.microsoft.com/en-us/copilot/" },
  { id: "ai-6", title: "AI 스타트업, 10억 달러 투자 유치", category: "ai", date: "어제", icon: "💰", url: "https://techcrunch.com/category/artificial-intelligence/" },
  { id: "ai-7", title: "AI 보안 위협, 기업 대응 강화", category: "ai", date: "2일전", icon: "🔐", url: "https://news.naver.com/section/105" },
  { id: "ai-8", title: "대학교 AI 연구센터 개설 확대", category: "ai", date: "3일전", icon: "🎓", url: "https://news.naver.com/section/105" },
  { id: "ai-9", title: "AI 기술로 신약 개발 성공", category: "ai", date: "오늘", icon: "🧬", url: "https://news.naver.com/section/105" },
  { id: "ai-10", title: "생성 AI 부작용 연구 논문 발표", category: "ai", date: "어제", icon: "📊", url: "https://news.naver.com/section/105" },
  { id: "ai-11", title: "AI 음성 기술, 실시간 번역 가능", category: "ai", date: "2일전", icon: "🎙️", url: "https://news.naver.com/section/105" },
  { id: "ai-12", title: "챗봇 기술로 고객 만족도 상승", category: "ai", date: "3일전", icon: "💬", url: "https://news.naver.com/section/105" },
];

const ALL_STOCK_NEWS: News[] = [
  { id: "stock-1", title: "테크 기업들 실적 개선, 지수 2.5% 상승", category: "stock", date: "오늘", icon: "📈", url: "https://finance.naver.com/" },
  { id: "stock-2", title: "AI 관련 주식 급등, 시가총액 신기록", category: "stock", date: "어제", icon: "💰", url: "https://finance.naver.com/" },
  { id: "stock-3", title: "반도체주, 실적 기대감에 상승", category: "stock", date: "2일전", icon: "🔌", url: "https://finance.naver.com/" },
  { id: "stock-4", title: "엔비디아, GPU 수요로 주가 급등", category: "stock", date: "3일전", icon: "🚀", url: "https://finance.naver.com/" },
  { id: "stock-5", title: "코스피, 3000선 회복 기대", category: "stock", date: "오늘", icon: "📊", url: "https://finance.naver.com/" },
  { id: "stock-6", title: "배당주 매력도 증가, 기관 매수", category: "stock", date: "어제", icon: "💵", url: "https://finance.naver.com/" },
  { id: "stock-7", title: "전기차 업체, 올해 실적 호조", category: "stock", date: "2일전", icon: "🚗", url: "https://finance.naver.com/" },
  { id: "stock-8", title: "금융주 실적 개선, 투자자 관심 증대", category: "stock", date: "3일전", icon: "🏦", url: "https://finance.naver.com/" },
  { id: "stock-9", title: "바이오 기업, 신약 개발 성공 기대", category: "stock", date: "오늘", icon: "🧪", url: "https://finance.naver.com/" },
  { id: "stock-10", title: "전자 기업 신제품 공개, 주가 상승", category: "stock", date: "어제", icon: "📱", url: "https://finance.naver.com/" },
  { id: "stock-11", title: "에너지주, 유가 상승에 수혜", category: "stock", date: "2일전", icon: "⛽", url: "https://finance.naver.com/" },
  { id: "stock-12", title: "통신주, 5G 본격 가입에 기대", category: "stock", date: "3일전", icon: "📡", url: "https://finance.naver.com/" },
];

function getRandomNews(newsArray: News[]): News[] {
  const shuffled = [...newsArray].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

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
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [skillCategory, setSkillCategory] = useState<SkillCategory>("programming");
  const [skillIcon, setSkillIcon] = useState("💻");
  const [skillGoalHours, setSkillGoalHours] = useState(0);
  const [skillsTab, setSkillsTab] = useState<"list" | "add">("list");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<SkillCategory | "all">("all");
  const [currentAINews, setCurrentAINews] = useState<News[]>([]);
  const [currentStockNews, setCurrentStockNews] = useState<News[]>([]);
  const [isLocked, setIsLocked] = useState(true);
  const [pinSetupStep, setPinSetupStep] = useState<"setup" | "confirm" | "unlock">("unlock");
  const [pinInput, setPinInput] = useState("");
  const [pinFirstEntry, setPinFirstEntry] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinShake, setPinShake] = useState(false);

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    const savedWeeklyData = localStorage.getItem("weeklyData");
    const savedSettings = localStorage.getItem("timerSettings");
    const savedSkills = localStorage.getItem("skills");

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

    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    } else {
      setSkills([
        {
          id: "skill-1",
          name: "TypeScript",
          category: "programming",
          icon: "💻",
          goalHours: 50,
          totalMinutes: 0,
          totalSessions: 0,
          createdAt: new Date().toISOString(),
          color: "bg-blue-100 border-blue-300",
        },
        {
          id: "skill-2",
          name: "UI 디자인",
          category: "design",
          icon: "🎨",
          goalHours: 30,
          totalMinutes: 0,
          totalSessions: 0,
          createdAt: new Date().toISOString(),
          color: "bg-purple-100 border-purple-300",
        },
      ]);
    }

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const savedPin = localStorage.getItem("appPin");
    if (savedPin) {
      setPinSetupStep("unlock");
    } else {
      setPinSetupStep("setup");
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

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("skills", JSON.stringify(skills));
    }
  }, [skills, mounted]);

  useEffect(() => {
    if (mounted) {
      setCurrentAINews(getRandomNews(ALL_AI_NEWS));
      setCurrentStockNews(getRandomNews(ALL_STOCK_NEWS));
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const newsInterval = setInterval(() => {
      setCurrentAINews(getRandomNews(ALL_AI_NEWS));
      setCurrentStockNews(getRandomNews(ALL_STOCK_NEWS));
    }, 10 * 60 * 1000);

    return () => clearInterval(newsInterval);
  }, [mounted]);

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
      if (selectedSkillId) {
        setSkills((prev) =>
          prev.map((sk) =>
            sk.id === selectedSkillId
              ? {
                  ...sk,
                  totalMinutes: sk.totalMinutes + timerSettings.focusMinutes,
                  totalSessions: sk.totalSessions + 1,
                }
              : sk
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

  function handlePinKey(key: string) {
    if (pinInput.length >= 4) return;
    const next = pinInput + key;
    setPinInput(next);
    setPinError("");

    if (next.length === 4) {
      setTimeout(() => {
        if (pinSetupStep === "unlock") {
          const saved = localStorage.getItem("appPin");
          if (next === saved) {
            setIsLocked(false);
            setPinInput("");
          } else {
            setPinError("PIN이 틀렸습니다");
            setPinShake(true);
            setPinInput("");
            setTimeout(() => setPinShake(false), 500);
          }
        } else if (pinSetupStep === "setup") {
          setPinFirstEntry(next);
          setPinSetupStep("confirm");
          setPinInput("");
        } else if (pinSetupStep === "confirm") {
          if (next === pinFirstEntry) {
            localStorage.setItem("appPin", next);
            setIsLocked(false);
            setPinInput("");
            setPinFirstEntry("");
          } else {
            setPinError("PIN이 일치하지 않습니다. 다시 시도하세요");
            setPinShake(true);
            setPinSetupStep("setup");
            setPinInput("");
            setPinFirstEntry("");
            setTimeout(() => setPinShake(false), 500);
          }
        }
      }, 100);
    }
  }

  function handlePinDelete() {
    setPinInput((prev) => prev.slice(0, -1));
    setPinError("");
  }

  function handlePinReset() {
    localStorage.removeItem("appPin");
    setPinSetupStep("setup");
    setPinInput("");
    setPinError("");
  }

  function addSkill() {
    const text = skillInput.trim();
    if (!text) return;
    setSkills((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: text,
        category: skillCategory,
        icon: skillIcon,
        goalHours: skillGoalHours,
        totalMinutes: 0,
        totalSessions: 0,
        createdAt: new Date().toISOString(),
        color: SKILL_CATEGORIES[skillCategory].color,
      },
    ]);
    setSkillInput("");
    setSkillGoalHours(0);
    setSkillsTab("list");
  }

  function deleteSkill(id: string) {
    setSkills((prev) => prev.filter((sk) => sk.id !== id));
    if (id === selectedSkillId) {
      setSelectedSkillId(null);
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

  if (isLocked) {
    const PIN_KEYS = ["1","2","3","4","5","6","7","8","9","","0","⌫"];
    return (
      <div
        className="min-h-screen w-screen flex flex-col items-center justify-center font-sans"
        style={{ background: "linear-gradient(135deg, #b3e5fc 0%, #81d4fa 25%, #a5d6ff 50%, #80deea 75%, #4dd0e1 100%)" }}
      >
        <div className="flex flex-col items-center gap-6 px-8 w-full max-w-xs">
          {/* Logo */}
          <div className="text-center">
            <p className="text-4xl mb-2">🎯</p>
            <h1 className="text-2xl font-bold text-slate-700">FocusFlow</h1>
            <p className="text-slate-500 text-sm mt-1">
              {pinSetupStep === "setup" && "새 PIN 번호를 설정하세요"}
              {pinSetupStep === "confirm" && "PIN 번호를 한 번 더 입력하세요"}
              {pinSetupStep === "unlock" && "PIN 번호를 입력하세요"}
            </p>
          </div>

          {/* Dots */}
          <div
            className={`flex gap-4 transition-all ${pinShake ? "animate-bounce" : ""}`}
            style={pinShake ? { animation: "shake 0.4s ease" } : {}}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                  i < pinInput.length
                    ? "bg-slate-700 border-slate-700 scale-110"
                    : "bg-transparent border-slate-400"
                }`}
              />
            ))}
          </div>

          {/* Error */}
          <p className="text-red-500 text-sm min-h-[20px] font-medium">{pinError}</p>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {PIN_KEYS.map((key, idx) => {
              if (key === "") return <div key={idx} />;
              if (key === "⌫") return (
                <button
                  key={idx}
                  onClick={handlePinDelete}
                  className="h-16 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 text-xl text-slate-600 font-semibold active:scale-95 transition-transform"
                >
                  {key}
                </button>
              );
              return (
                <button
                  key={idx}
                  onClick={() => handlePinKey(key)}
                  className="h-16 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/90 text-xl font-semibold text-slate-700 hover:bg-white active:scale-95 transition-transform shadow-sm"
                >
                  {key}
                </button>
              );
            })}
          </div>

          {/* Reset PIN (only on unlock screen) */}
          {pinSetupStep === "unlock" && (
            <button
              onClick={handlePinReset}
              className="text-slate-400 text-xs underline mt-2"
            >
              PIN 재설정
            </button>
          )}
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
          }
        `}</style>
      </div>
    );
  }

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
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 space-y-2 sm:space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-600">🎯 FocusFlow</h1>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-slate-400"></div>
                  <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-red-400"></div>
                  <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-green-400"></div>
                  <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-yellow-400"></div>
                  <button className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-400 text-white flex items-center justify-center text-xs sm:text-sm">
                    🔔
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Today</h2>
                <p className="text-slate-600 text-xs sm:text-sm">
                  {new Date().toLocaleDateString("ko-KR", { month: "numeric", day: "numeric", weekday: "short" })}
                </p>
              </div>
            </div>

            {/* Main Dashboard - Responsive Layout */}
            <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 overflow-y-auto">

              {/* LEFT COLUMN - Statistics & News */}
              <div className="space-y-3 sm:space-y-4 min-w-0">
                {/* Today's Stats Card */}
                <div className="bg-white/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-600 tracking-widest">📊 TODAY'S PROGRESS</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-slate-600 font-medium">Sessions</span>
                      <span className="text-xl sm:text-2xl font-bold text-blue-600">{todaySessions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-slate-600 font-medium">Focus Time</span>
                      <span className="text-xl sm:text-2xl font-bold text-green-600">{Math.round(todayFocusMin)}m</span>
                    </div>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-600 tracking-widest">📂 BY CATEGORY</h3>
                  <div className="space-y-1 sm:space-y-2">
                    {Object.entries(CATEGORIES).map(([key, { label, icon, color }]) => {
                      const count = activeTodos.filter((t) => t.category === key).length;
                      return (
                        <div key={key} className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-slate-700">{icon} {label}</span>
                          <span className="font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs">{count}</span>
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

                {/* AI News Section */}
                <div className="bg-white/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 flex flex-col">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-600 tracking-widest">🤖 AI 뉴스</h3>
                  <div className="space-y-1 sm:space-y-2 flex-1 overflow-y-auto">
                    {currentAINews.map((news) => (
                      <a
                        key={news.id}
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200 block min-h-12 sm:min-h-auto"
                      >
                        <span className="text-base sm:text-lg flex-shrink-0 mt-0.5">{news.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-slate-700 line-clamp-2">{news.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{news.date}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Stock News Section */}
                <div className="bg-white/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 flex flex-col">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-600 tracking-widest">📊 주식 뉴스</h3>
                  <div className="space-y-1 sm:space-y-2 flex-1 overflow-y-auto">
                    {currentStockNews.map((news) => (
                      <a
                        key={news.id}
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200 block min-h-12 sm:min-h-auto"
                      >
                        <span className="text-base sm:text-lg flex-shrink-0 mt-0.5">{news.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-slate-700 line-clamp-2">{news.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{news.date}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - Timer & Controls */}
              <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-6">
                {/* Analog Clock */}
                <div className="relative w-32 h-32 sm:w-48 sm:h-48">
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
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-0.5 sm:gap-1">
                    <p className="text-2xl sm:text-3xl font-bold text-slate-700 tabular-nums">
                      {formatTime(secondsLeft)}
                    </p>
                    <p className="text-xs text-slate-500 font-medium text-center px-2">{MODES[mode].label}</p>
                  </div>
                </div>

                {/* Current Task */}
                <div className="text-center space-y-1 sm:space-y-2 w-full px-2">
                  <p className="text-white/70 text-xs font-light tracking-widest">
                    {selectedTodo ? "FOCUSING ON" : "SELECT A TASK"}
                  </p>
                  {selectedTodo ? (
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-white font-bold text-sm sm:text-lg line-clamp-1">{selectedTodo.text}</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg">{CATEGORIES[selectedTodo.category].icon}</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${PRIORITIES[selectedTodo.priority].color}`}>
                          {PRIORITIES[selectedTodo.priority].icon}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/60 text-xs sm:text-sm">No task selected</p>
                  )}
                </div>

                {/* Control Buttons */}
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => (isRunning ? pauseTimer() : startTimer())}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95 font-bold text-lg sm:text-xl text-slate-700"
                  >
                    {isRunning ? "⏸" : "▶"}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95 font-bold text-lg sm:text-xl text-slate-700"
                  >
                    ↻
                  </button>
                </div>

                {/* Mode Buttons */}
                <div className="grid grid-cols-3 gap-1 sm:gap-2 w-full max-w-xs px-2">
                  {Object.entries(MODES).map(([key, { label }]) => (
                    <button
                      key={key}
                      onClick={() => switchMode(key as TimerMode)}
                      disabled={isRunning}
                      className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg font-semibold text-xs transition-all ${
                        mode === key
                          ? "bg-white text-slate-700 shadow-lg"
                          : "bg-white/40 text-white border border-white/50 hover:bg-white/50 disabled:opacity-50"
                      }`}
                    >
                      {label.split(" ")[0]}
                    </button>
                  ))}
                </div>

                {/* Skill Selection */}
                <select
                  value={selectedSkillId ?? ""}
                  onChange={(e) => setSelectedSkillId(e.target.value || null)}
                  className="w-full px-3 py-2 rounded-lg bg-white/80 text-slate-700 text-xs border border-white/60 outline-none focus:ring-2 focus:ring-blue-300 max-w-xs"
                >
                  <option value="">스킬 선택 안 함</option>
                  {skills.map((sk) => (
                    <option key={sk.id} value={sk.id}>
                      {sk.icon} {sk.name}
                    </option>
                  ))}
                </select>
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

              {/* PIN Settings Card */}
              <div className="rounded-xl bg-white/90 backdrop-blur-sm p-6 space-y-3">
                <h3 className="text-sm font-bold text-slate-700">🔒 PIN 보안</h3>
                <p className="text-xs text-slate-500">앱 잠금 PIN을 관리합니다</p>
                <button
                  onClick={() => {
                    handlePinReset();
                    setIsLocked(true);
                  }}
                  className="w-full py-3 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition-all"
                >
                  PIN 변경
                </button>
                <button
                  onClick={() => setIsLocked(true)}
                  className="w-full py-3 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all"
                >
                  앱 잠금
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Skills Screen */}
        {screen === "skills" && (
          <div className="relative w-full flex-1 flex flex-col overflow-y-auto pb-24">
            {/* Header */}
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 space-y-2 sm:space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-600">🎯 FocusFlow</h1>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-slate-400"></div>
                  <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-red-400"></div>
                  <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-green-400"></div>
                  <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-yellow-400"></div>
                  <button className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-400 text-white flex items-center justify-center text-xs sm:text-sm">
                    🔔
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Skills</h2>
                <p className="text-slate-600 text-xs sm:text-sm">
                  {new Date().toLocaleDateString("ko-KR", { month: "numeric", day: "numeric", weekday: "short" })}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4 overflow-y-auto">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-white/90 rounded-xl p-3 sm:p-4 text-center">
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold">스킬</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{skills.length}</p>
                </div>
                <div className="bg-white/90 rounded-xl p-3 sm:p-4 text-center">
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold">총 세션</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    {skills.reduce((s, sk) => s + sk.totalSessions, 0)}
                  </p>
                </div>
                <div className="bg-white/90 rounded-xl p-3 sm:p-4 text-center">
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold">총 시간</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">
                    {Math.round((skills.reduce((s, sk) => s + sk.totalMinutes, 0) / 60) * 10) / 10}h
                  </p>
                </div>
              </div>

              {/* Tab Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSkillsTab("list")}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                    skillsTab === "list"
                      ? "bg-slate-700 text-white"
                      : "bg-white/90 border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  스킬 목록
                </button>
                <button
                  onClick={() => setSkillsTab("add")}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                    skillsTab === "add"
                      ? "bg-slate-700 text-white"
                      : "bg-white/90 border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  스킬 추가
                </button>
              </div>

              {/* Skills List Tab */}
              {skillsTab === "list" && (
                <div className="space-y-3">
                  {/* Category Filter */}
                  <div className="overflow-x-auto pb-2">
                    <div className="flex gap-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedSkillFilter("all")}
                        className={`px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all flex-shrink-0 ${
                          selectedSkillFilter === "all"
                            ? "bg-slate-700 text-white"
                            : "bg-white/90 border border-slate-300 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        All
                      </button>
                      {Object.entries(SKILL_CATEGORIES).map(([key, { label, icon }]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedSkillFilter(key as SkillCategory)}
                          className={`px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all flex-shrink-0 ${
                            selectedSkillFilter === key
                              ? "bg-slate-700 text-white"
                              : "bg-white/90 border border-slate-300 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {icon} {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skills Cards */}
                  {skills.filter((sk) => selectedSkillFilter === "all" || sk.category === selectedSkillFilter).length > 0 ? (
                    <div className="space-y-2 sm:space-y-3">
                      {skills
                        .filter((sk) => selectedSkillFilter === "all" || sk.category === selectedSkillFilter)
                        .map((skill) => {
                          const progressPercent = skill.goalHours > 0 ? Math.min(100, Math.round((skill.totalMinutes / 60 / skill.goalHours) * 100)) : 0;
                          const isComplete = progressPercent >= 100;
                          return (
                            <div key={skill.id} className="bg-white/90 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2 sm:space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg sm:text-xl">{skill.icon}</span>
                                    <div className="min-w-0">
                                      <p className="font-bold text-slate-700 text-sm sm:text-base truncate">{skill.name}</p>
                                      <p className="text-xs text-slate-500">{SKILL_CATEGORIES[skill.category].label}</p>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => deleteSkill(skill.id)}
                                  className="text-red-400 hover:text-red-600 text-lg flex-shrink-0"
                                >
                                  ✕
                                </button>
                              </div>

                              <div className="flex gap-2 text-xs sm:text-sm text-slate-600">
                                <span>🎯 {skill.totalSessions}세션</span>
                                <span>⏱️ {Math.round((skill.totalMinutes / 60) * 10) / 10}h</span>
                              </div>

                              {skill.goalHours > 0 && (
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-xs text-slate-500">
                                    <span>목표 {skill.goalHours}h</span>
                                    <span className={isComplete ? "text-green-600 font-bold" : ""}>
                                      {progressPercent}% {isComplete ? "달성!" : ""}
                                    </span>
                                  </div>
                                  <div className="w-full h-2 sm:h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        isComplete
                                          ? "bg-gradient-to-r from-green-400 to-green-500"
                                          : progressPercent >= 75
                                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                          : progressPercent >= 50
                                          ? "bg-gradient-to-r from-blue-400 to-blue-500"
                                          : "bg-gradient-to-r from-slate-300 to-blue-300"
                                      }`}
                                      style={{ width: `${progressPercent}%` }}
                                    />
                                  </div>
                                  <p className="text-xs text-slate-400">{Math.round((skill.totalMinutes / 60) * 10) / 10}h / {skill.goalHours}h</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-slate-600">
                      <p className="text-sm">스킬을 추가해보세요!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Skills Add Tab */}
              {skillsTab === "add" && (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 block mb-2">스킬 이름</label>
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="예: TypeScript, UI 디자인"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 block mb-2">카테고리</label>
                    <select
                      value={skillCategory}
                      onChange={(e) => setSkillCategory(e.target.value as SkillCategory)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {Object.entries(SKILL_CATEGORIES).map(([key, { label, icon }]) => (
                        <option key={key} value={key}>
                          {icon} {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 block mb-2">아이콘 선택</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["💻", "🎨", "🌍", "📐", "🎵", "⭐", "🚀", "📚"].map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setSkillIcon(icon)}
                          className={`py-2 px-2 rounded-lg text-2xl transition-all ${
                            skillIcon === icon
                              ? "bg-slate-700 ring-2 ring-slate-700"
                              : "bg-white/90 border border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 block mb-2">목표 시간 (시간, 선택사항)</label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={skillGoalHours}
                      onChange={(e) => setSkillGoalHours(Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="예: 50"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <button
                    onClick={addSkill}
                    className="w-full py-2 sm:py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all text-sm sm:text-base"
                  >
                    스킬 추가
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 flex justify-around bg-slate-600/80 backdrop-blur-lg p-4 text-slate-700">
          {(["home", "tasks", "stats", "skills", "settings"] as Screen[]).map((s) => {
            const icons: Record<Screen, string> = { home: "🏠", tasks: "✓", stats: "📊", skills: "⚡", settings: "⚙️" };
            const labels: Record<Screen, string> = { home: "Home", tasks: "Tasks", stats: "Stats", skills: "Skills", settings: "Settings" };
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
