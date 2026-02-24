import { useState } from "react";
import { useCardShuffle } from "./useCardShuffle";
import { defaultOption, fortuneOption, loveOption, careerOption,QuestionTypeName } from "../js/questionOption";


const useClickHandler = () => {
  const CardHistory = localStorage.getItem("CardHistory") ? JSON.parse(localStorage.getItem("CardHistory")) : []
  const { tarotCards, setShuffle } = useCardShuffle()
  const [cardList, setCardList] = useState([])
  //Cards處理扇形牌堆  cardList處理用戶抽牌
  const [Cards, setCards] = useState(tarotCards)
  const [openHistory, setOpenHistory] = useState(false)
  const [historyOption, setHistoryOption] = useState(CardHistory)   

  function CardDrawHandler(img,id,name_zh) {
    
    const position = Math.random() < 0.5;
    const newCard = {
      cardId:id,
      CardImg: img,
      name_zh:name_zh,
      position: position
    }
    const newCards = Cards.map((card) =>
      card.id === id ? { ...card, hidden: true, style: true } : { ...card, style: false }
    );
    if (cardList.length < 7) {
      setCardList(preList => [...preList, newCard])
      setCards(newCards)
    }
  }

  function CardSaveHandler(cardList) {
    let CardHistory = localStorage.getItem('CardHistory') ? JSON.parse(localStorage.getItem('CardHistory')) : []
    let isRecord = CardHistory.map(list => list.type === QuestionType).some(Boolean);
    // console.log('isRecord', isRecord)

    if (isRecord) {      
      var yes = confirm(`[${QuestionTypeName[QuestionType]}]紀錄將被覆蓋`);
    }else{
      var yes = confirm(`確認儲存？`);
    }
    if (yes) {
      let newCardHistory = CardHistory.filter((list) =>
        list.type !== QuestionType
      )

      newCardHistory.push({ type: QuestionType, historyList: cardList })
      localStorage.setItem('CardHistory', JSON.stringify(newCardHistory));
      setHistoryOption(newCardHistory)
      alert('成功儲存');
    } else {
      alert('放棄儲存');

    }


  }

  function CardHistoryHandler(Type) {
    if (Type !== "") {
      const cardHistory = JSON.parse(localStorage.getItem('CardHistory'));
      setOpenHistory(true)
      const cardHistoryList = cardHistory.filter((cardRecord) => cardRecord.type === Type)
      setStep(3)
      setCardList(cardHistoryList[0].historyList)
      localStorage.setItem("QuestionType", Type);
    }
  }
  return {
    CardDrawHandler,  CardSaveHandler, CardHistoryHandler,setCardList,
     cardList, Cards, openHistory, historyOption
  }
}

export { useClickHandler };

