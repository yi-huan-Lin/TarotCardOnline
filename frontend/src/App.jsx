
import { useClickHandler } from "./hook/useClickHandler";
import { CardDrawPage } from './components/card-draw-page';
import { CardPageContainer } from "./components/card-page-container";

import './index.css';
function App() {
  const {
    CardDrawHandler,
    CardShuffleHandler,
    typehandler,    
    CardHistoryHandler,
    CardSaveHandler,
    setCardList,
     Option, cardList, Cards, openHistory, historyOption

  } = useClickHandler()

  return (
    <CardPageContainer>
      <CardDrawPage cardList={cardList} Cards={Cards} openHistory={openHistory}        
        CardDrawHandler={CardDrawHandler}
        CardHistoryHandler={CardHistoryHandler}
        setCardList={setCardList}
        historyOption={historyOption}
      />
    </CardPageContainer>
  )
}

export default App
