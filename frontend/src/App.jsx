import XO from './components/Multiplayer/XO';
import ChooseSorM from './components/chooseSorM';
import Input from './components/SinglePlayer/input';
import { BrowserRouter, Route, Routes  } from 'react-router-dom';
import SubjectSelection from './components/SinglePlayer/selectSubject';
import SelectMode from './components/SinglePlayer/selectMode';
import Game from './components/SinglePlayer/Game';
import TopicSelection from './components/SinglePlayer/TopicSelection';
import Match from './components/SinglePlayer/Match';
import SaveTheGirl from './components/Games/SaveTheGirl';
import MultiplayerInput from './components/MultiPlayer/MultiPlayerInput';
const App = () => {
  return (
    <BrowserRouter>
    <Routes >
      <Route path="/"  element={<ChooseSorM />}/>
      <Route path='/single' element={<Input />}/>
      <Route path="/subject" element={<SubjectSelection />} />
      <Route path="/xo" element={<XO />} />
      <Route path="/multiplayer-input" element={<MultiplayerInput />} />
      <Route path="/single/:classId/:displayName" element={<SubjectSelection />} />
      <Route path="/single/:classId/:displayName/:subject" element={<SelectMode />} />
      <Route path="/single/:classId/:displayName/:subject/game" element={<Game />} />
      <Route path="/single/:classId/:displayName/:subject/:topic" element={<TopicSelection />} />
      <Route path="/single/:classId/:displayName/:subject/topic/match" element={<Match />} />
    </Routes >
    </BrowserRouter>

  )
}

export default App;
