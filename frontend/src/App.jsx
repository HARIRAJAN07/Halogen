import XO from './components/Multiplayer/XO';
import ChooseSorM from './components/chooseSorM';
import Input from './components/SinglePlayer/input';
import { BrowserRouter, Route, Routes  } from 'react-router-dom';
import SubjectSelection from './components/SinglePlayer/selectSubject';
import SelectMode from './components/SinglePlayer/selectMode';
import Game from './components/SinglePlayer/Game';
import TopicSelection from './components/SinglePlayer/TopicSelection';
import Match from './components/SinglePlayer/Match';
import MultiplayerInput from './components/MultiPlayer/MultiPlayerInput';
import ChooseLanguage from './components/SinglePlayer/ChooseLanguage';

const App = () => {
  return (
    <BrowserRouter>
    <Routes >
      <Route path="/"  element={<ChooseSorM />}/>
      <Route path='/single' element={<Input />}/>
      <Route path="/subject" element={<SubjectSelection />} />
      <Route path="/xo" element={<XO />} />
      <Route path="/multiplayer-input" element={<MultiplayerInput />} />
      <Route path="/single/:classId/:displayName/:schoolName" element={<SubjectSelection />} />
      <Route path="/single/:classId/:displayName/:schoolName/:subject" element={<SelectMode />} />
      <Route path="/single/:classId/:displayName/:schoolName/:subject/lang" element={<ChooseLanguage />} />
      <Route path="/single/:classId/:displayName/:schoolName/:subject/game" element={<Game />} />
      <Route path="/single/:classId/:displayName/:schoolName/:subject/lang/:lang" element={<TopicSelection />} />
      <Route path="/single/:classId/:displayName/:schoolName/:subject/lang/:lang/:topic/ma" element={<Match />} />
    </Routes >
    </BrowserRouter>
  )
}

export default App;