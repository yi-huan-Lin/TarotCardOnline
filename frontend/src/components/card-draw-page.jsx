import { CardSuffleAnimation } from "./card-suffle-animate";
import { CardSpread } from "./card-spread";
import { CardDrawTips } from "./card-draw-tips";
import { CardDescriptionPage } from "./card-description-page";
import {CardDeck} from "../components/CardDeck"; // 導入新寫的扇形組件
import { useCardShuffle } from "../hook/useCardShuffle";
const CardDrawPage = ({
    step,
    cardList,
    CardShuffleHandler,  
    openHistory,
    CardDrawHandler,
    stephandler,
}) => {
    const finalQuestion = localStorage.getItem("QuestionType");
    const { tarotCards, gameId } = useCardShuffle()
    
    // 判斷是否已經抽完牌 (根據 cardList 長度與問題類型的邏輯)
    // 這裡假設如果還在抽牌階段（step 不等於 4），就顯示扇形堆疊
    const showDeck = step !== 4 && !openHistory;

    return (
        <>
            {step === 4 && <CardDescriptionPage stephandler={stephandler} cardList={cardList} />}
            
            {/* 上方：展示已抽出的牌陣 */}
            <CardSpread cardList={cardList} />

            {!openHistory && (
                <>
                    {/* 洗牌動畫與提示 */}
                    {/* <CardSuffleAnimation /> */}
                    <CardDrawTips CardShuffleHandler={CardShuffleHandler} />

                    {/* 關鍵改動：用 CardDeck 取代原本的 CardDraw */}
                    {showDeck && (
                        // <div className="tarot-deck-fixed-bottom">
                            <CardDeck 
                                gameId={gameId}
                                cards={tarotCards} 
                                onPickCard={CardDrawHandler} 
                                selectedCards={cardList}
                            />
                        // </div>
                    )}
                    

                </>
            )}
        </>
    );
};

export { CardDrawPage };