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
