import React, { useState } from 'react';

// QuestionInput.jsx
const QuestionInput = ({ question, setQuestion, onConfirm }) => {
  const maxLength = 50;

  return (
    <div className="w-full max-w-md mx-auto pt-10 px-4">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur opacity-30 group-focus-within:opacity-100 transition duration-500"></div>
        
        <div className="relative bg-slate-900 rounded-lg p-1">
          <input
            type="text"
            value={question} // 這裡由父層傳入
            onChange={(e) => setQuestion(e.target.value.slice(0, maxLength))} // 同步回父層
            placeholder="請輸入您想請示的問題..."
            className="w-full bg-slate-900 text-purple-100 placeholder-slate-500 px-4 py-3 rounded-md focus:outline-none"
          />
          <div className="absolute right-3 bottom-[-25px] text-[10px] tracking-widest text-slate-400">
            <span className={question.length >= maxLength ? "text-red-400" : "text-purple-400"}>
              {question.length}
            </span> / {maxLength}
          </div>
        </div>
      </div>
      
      <button
        onClick={onConfirm}
        className={`mt-8 w-full py-3 rounded-full font-bold tracking-[0.2em] transition-all duration-300 ${
          question.length > 0 
          ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:bg-purple-500" 
          : "bg-slate-800 text-slate-500 cursor-not-allowed"
        }`}
      >
        開始冥想抽牌
      </button>
    </div>
  );
};

export default QuestionInput;