import { useState } from "react";
import { useCardShuffle } from "./useCardShuffle";
import { defaultOption, fortuneOption, loveOption, careerOption,QuestionTypeName } from "../js/questionOption";
import { CardImg } from "../components/card-img";

const useClickHandler = () => {
  const CardHistory = localStorage.getItem("CardHistory") ? JSON.parse(localStorage.getItem("CardHistory")) : []
  const { tarotCards, setShuffle } = useCardShuffle()
  const [cardList, setCardList] = useState([])
  const [Cards, setCards] = useState(tarotCards)
  const [openHistory, setOpenHistory] = useState(false)
  const [historyOption, setHistoryOption] = useState(CardHistory)
  const [step, setStep] = useState(1)
  const [QuestionType, setQuestionType] = useState('love')
  const [Option, setOption] = useState(defaultOption)

  // console.log('Cards:',Cards)
  function typehandler(type) {
    setQuestionType(type)
  }

  function stephandler() {
    if (QuestionType === "love") {
      setOption(loveOption)
      setQuestionType("love_1")
    } else if (QuestionType === "career") {
      setOption(careerOption)
      setQuestionType("career_1")
    } else if (QuestionType === "fortune") {
      setOption(fortuneOption)
      setQuestionType("fortune_1")
    }
    if (step === 1) { setStep(2) } else if (step === 2) {
      setStep(3)
      //儲存最後QuestionType
      localStorage.setItem("QuestionType", QuestionType);
    } else if (step === 3) {
      setStep(4)
    } else if (step === 4) {
      setStep(3)
    }
  }

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

  function CardShuffleHandler() {
    setCardList([])
    setShuffle((pre) => pre + 1)
    setCards(tarotCards)
    setStep(1)
    setQuestionType("love")
    setOption(defaultOption)
    setOpenHistory(false)
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
    CardDrawHandler, CardShuffleHandler, typehandler, stephandler, CardSaveHandler, CardHistoryHandler,
    step, Option, cardList, Cards, openHistory, historyOption
  }
}

export { useClickHandler };

