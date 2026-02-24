
import { useClickHandler } from "./hook/useClickHandler";
import { CardDrawPage } from './components/card-draw-page';
import { CardPageContainer } from "./components/card-page-container";

import './index.css';
function App() {
  const {
    CardDrawHandler,
    CardShuffleHandler,
    typehandler,
    stephandler,
    CardHistoryHandler,
    CardSaveHandler,
    step, Option, cardList, Cards, openHistory, historyOption

  } = useClickHandler()

  return (
    <CardPageContainer>
      <CardDrawPage step={step} cardList={cardList} Cards={Cards} openHistory={openHistory}
        stephandler={stephandler}
        CardDrawHandler={CardDrawHandler}
        CardHistoryHandler={CardHistoryHandler}
        historyOption={historyOption}
      />
    </CardPageContainer>
  )
}

export default App
