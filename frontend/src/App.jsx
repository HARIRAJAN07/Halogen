import React from 'react';
import XO from './components/Multiplayer/XO';
import ChooseSorM from './components/chooseSorM';
import Input from './components/SinglePlayer/input';
import { BrowserRouter, Route, Routes  } from 'react-router-dom';
import SubjectSelection from './components/SinglePlayer/selectSubject';
import SelectMode from './components/SinglePlayer/selectMode';
import Game from './components/SinglePlayer/Game';

const App = () => {
  return (
    <BrowserRouter>
    <Routes >
      <Route path="/"  element={<ChooseSorM />}/>
      <Route path='/single' element={<Input />}/>
      <Route path="/subject" element={<SubjectSelection />} />
      <Route path="/multi" element={<XO />} />
      <Route path="/single/:classId" element={<SubjectSelection />} />
      <Route path="/single/:classId/:subject" element={<SelectMode />} />
      <Route path="/single/:classId/:subject/game" element={<Game />} />
      {/* <Route path="/single/:classId/:subject/match" element={<Link />} /> */}
    </Routes >
    </BrowserRouter>
  )
}

export default App;
