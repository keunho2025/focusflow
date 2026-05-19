"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen w-screen flex flex-col items-center justify-center font-sans px-4"
      style={{
        background:
          "linear-gradient(135deg, #b3e5fc 0%, #81d4fa 25%, #a5d6ff 50%, #80deea 75%, #4dd0e1 100%)",
      }}
    >
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-cyan-200/20 rounded-full blur-2xl" />
      </div>

      <div className="relative flex flex-col items-center gap-6 w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center">
          <div className="text-6xl mb-3 drop-shadow-sm">🎯</div>
          <h1 className="text-3xl font-bold text-slate-700 tracking-tight">FocusFlow</h1>
          <p className="text-slate-500 text-sm mt-1.5">집중력을 높이는 스마트 포모도로</p>
        </div>

        {/* 기능 뱃지 */}
        <div className="flex gap-2 flex-wrap justify-center">
          {["⏱ 포모도로 타이머", "⚡ 스킬 관리", "📊 집중 통계"].map((f) => (
            <span
              key={f}
              className="px-3 py-1 bg-white/50 backdrop-blur-sm rounded-full text-xs font-medium text-slate-600 border border-white/60"
            >
              {f}
            </span>
          ))}
        </div>

        {/* 로그인 카드 */}
        <div className="w-full bg-white/75 backdrop-blur-md rounded-3xl shadow-xl shadow-blue-200/40 p-8 border border-white/80">
          <h2 className="text-center text-base font-semibold text-slate-500 mb-6 tracking-wide uppercase">
            로그인
          </h2>

          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center gap-4 py-3.5 px-5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 hover:shadow-md active:scale-[0.98] transition-all duration-150 shadow-sm"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="flex-1 text-left">Google로 계속하기</span>
              <span className="text-slate-300 text-sm">→</span>
            </button>

            {/* GitHub */}
            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="w-full flex items-center gap-4 py-3.5 px-5 rounded-2xl bg-slate-800 text-white font-semibold hover:bg-slate-700 hover:shadow-md active:scale-[0.98] transition-all duration-150 shadow-sm"
            >
              <svg className="w-5 h-5 flex-shrink-0 fill-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="flex-1 text-left">GitHub로 계속하기</span>
              <span className="text-white/40 text-sm">→</span>
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 leading-relaxed">
              로그인 시{" "}
              <span className="underline cursor-pointer hover:text-slate-600">이용약관</span>
              {" "}및{" "}
              <span className="underline cursor-pointer hover:text-slate-600">개인정보처리방침</span>
              에 동의합니다
            </p>
          </div>
        </div>

        {/* 하단 문구 */}
        <p className="text-xs text-slate-400 text-center">
          계정 정보는 안전하게 보호됩니다 🔒
        </p>
      </div>
    </div>
  );
}
