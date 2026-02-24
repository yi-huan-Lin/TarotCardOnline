import { CardSpread } from "./card-spread";
import { CardDrawTips } from "./card-draw-tips";
import { CardDeck } from "../components/CardDeck"; // 導入新寫的扇形組件
import { useCardShuffle } from "../hook/useCardShuffle";
import { useState } from "react";
import { useGeminiStreaming } from "../hook/useGeminiStreaming";
import ResetButton from "./ResetButton";

import QuestionInput from "./question-form/QuestionInput";
const CardDrawPage = ({
    cardList,
    CardShuffleHandler,
    openHistory,
    setCardList,
    CardDrawHandler

}) => {   
    const { tarotCards, shuffleCards, gameId } = useCardShuffle()
    const [finalQuestion, setFinalQuestion] = useState("");
    const [step, setStep] = useState(0);
    const { output, isGenerating, error, streamInterpretation } = useGeminiStreaming();
    const handleReset = () => {
        // 1. 回到抽牌步驟
        setStep(0);

        // 2. 清空已抽出的 7 張牌
        setCardList([]); // 這裡請對應你儲存已抽牌陣的 state 名稱

        // 3. 重新洗牌 (假設你的牌組 state 叫 cards，初始化函式叫 shuffleDeck)
        shuffleCards();


    };
    const handleAskAI = () => {
        const prompt = `
# 塔羅占卜解讀任務

你是一位神祕且洞察力敏銳的塔羅占卜師。
請結合牌義與牌位意義，進行有層次、有邏輯的完整解讀。

---

## 使用者問題
「${finalQuestion}」

---

## 牌位定義
1. 過去
2. 現在
3. 未來
4. 環境影響
5. 內心真實想法
6. 當事人的行動
7. 最終結果

---

## 抽出的牌

1. 過去：${cardList[0].name_zh}（${cardList[0].position ? '逆位' : '正位'}）
2. 現在：${cardList[1].name_zh}（${cardList[1].position ? '逆位' : '正位'}）
3. 未來：${cardList[2].name_zh}（${cardList[2].position ? '逆位' : '正位'}）
4. 環境：${cardList[3].name_zh}（${cardList[3].position ? '逆位' : '正位'}）
5. 內心：${cardList[4].name_zh}（${cardList[4].position ? '逆位' : '正位'}）
6. 行動：${cardList[5].name_zh}（${cardList[5].position ? '逆位' : '正位'}）
7. 結果：${cardList[6].name_zh}（${cardList[6].position ? '逆位' : '正位'}）

---

## 解讀要求

請務必依照牌位順序進行推演，而非單張獨立說明。

請分為三個段落：

### 一、現況分析
- 結合「過去＋現在＋環境」分析整體局勢
- 指出目前的核心問題

### 二、建議行動
- 分析「內心想法＋當事人行動」是否一致
- 給出具體調整建議

### 三、未來指引
- 根據「未來＋結果」推演發展方向
- 說明這段關係是否轉化、延續或結束
- 提供成長方向

---

請確保：
- 內容具有故事感與流動性
- 每張牌都被解讀到
- 牌與牌之間有因果連結
- 不要只解釋牌義，要解釋“為什麼會這樣發展”

語氣神祕、深刻但溫柔。
`;
        const encodedPrompt = encodeURIComponent(prompt);
        window.open(`https://chat.openai.com/?q=${encodedPrompt}`, '_blank');
        // streamInterpretation(prompt);
    };


    const showDeck = step === 1 && !openHistory;


    return (
        <>
            {!showDeck && <QuestionInput
                question={finalQuestion}
                setQuestion={setFinalQuestion}
                onConfirm={() => setStep(1)}
            />}
            {/* 上方：展示已抽出的牌陣 */}
            <CardSpread cardList={cardList} />
            {cardList.length === 7 && (
                <div className="sticky mt-8 px-4 max-w-2xl mx-auto pb-20 z-50">
                    {!output && !isGenerating && (
                        <button
                            onClick={handleAskAI}
                            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-xl shadow-xl hover:scale-105 transition-transform"
                        >
                            <div className="bg-slate-900 rounded-[10px] px-6 py-3">
                                <span className="text-white font-bold">✨ 獲得 AI 深度解析</span>
                            </div>
                        </button>
                    )}

                    {/* 解析結果顯示區(暫時無用) */}
                    {(output || isGenerating) && (
                        <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <h3 className="text-indigo-300 font-bold mb-4 flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full bg-indigo-400 ${isGenerating ? 'animate-pulse' : ''}`} />
                                塔羅冥想解讀中...
                            </h3>

                            <div className="text-slate-100 leading-relaxed text-left whitespace-pre-wrap font-serif">
                                {output}
                                {isGenerating && <span className="inline-block w-1 h-5 ml-1 bg-indigo-400 animate-bounce" />}
                            </div>

                            {error && <p className="text-red-400 mt-4 text-sm">❌ {error}</p>}
                        </div>
                    )}
                </div>
            )}

            {(!openHistory && showDeck) && (
                <div>
                    {/*抽牌提示 */}
                    <ResetButton onClick={handleReset} />
                    <CardDrawTips CardShuffleHandler={CardShuffleHandler} />
                    {/* 關鍵改動：用 CardDeck 取代原本的 CardDraw */}

                    <CardDeck
                        gameId={gameId}
                        cards={tarotCards}
                        onPickCard={CardDrawHandler}
                        selectedCards={cardList}
                    />


                </div>
            )}
        </>
    );
};

export { CardDrawPage };