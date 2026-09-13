import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Award,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const QuizModal: React.FC = () => {
  const { activeQuiz, setActiveQuiz, answerQuiz, answeredQuizIds } = useApp();
  const { currentUser } = useAuth();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!activeQuiz) return null;

  const isAlreadyAnswered = answeredQuizIds.has(activeQuiz.id);

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted || isAlreadyAnswered) return;
    setSelectedOption(idx);
    setHasSubmitted(true);
    const correct = answerQuiz(activeQuiz.id, idx);
    setIsCorrect(correct);
  };

  const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-amber-500/20 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Knowledge Check
              </h3>
              <span className="text-[11px] text-zinc-400 font-medium">
                {activeQuiz.category} • Earn +{activeQuiz.points} Pts
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveQuiz(null)}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Text */}
        <div className="my-5">
          <p className="text-base font-bold text-white leading-relaxed font-['Plus_Jakarta_Sans']">
            {activeQuiz.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2.5 mb-5">
          {activeQuiz.options.map((option, idx) => {
            const letter = OPTION_LETTERS[idx];
            let buttonStyle = 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-850';

            if (hasSubmitted || isAlreadyAnswered) {
              if (idx === activeQuiz.correctIndex) {
                buttonStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
              } else if (selectedOption === idx) {
                buttonStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
              } else {
                buttonStyle = 'bg-zinc-900/50 border-zinc-850 text-zinc-500 opacity-60';
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleSelectOption(idx)}
                disabled={hasSubmitted || isAlreadyAnswered}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left text-sm transition-all ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {letter}
                  </span>
                  <span>{option}</span>
                </div>

                {(hasSubmitted || isAlreadyAnswered) && idx === activeQuiz.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}

                {(hasSubmitted || isAlreadyAnswered) &&
                  selectedOption === idx &&
                  idx !== activeQuiz.correctIndex && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
              </button>
            );
          })}
        </div>

        {/* Result & Explanation Feedback */}
        {(hasSubmitted || isAlreadyAnswered) && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {isCorrect || isAlreadyAnswered ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-300">
                    Correct! You earned +{activeQuiz.points} points 🎉
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    {activeQuiz.explanation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-300">
                    Not quite! The correct answer was {OPTION_LETTERS[activeQuiz.correctIndex]}.
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    {activeQuiz.explanation}
                  </p>
                </div>
              </div>
            )}

            {/* Score pill */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-zinc-400 font-medium">
                Your Total Score: <strong className="text-white">{currentUser.quizPoints} pts</strong>
              </span>
              <button
                onClick={() => setActiveQuiz(null)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-500 text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
