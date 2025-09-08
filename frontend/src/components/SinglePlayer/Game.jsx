import React from 'react'
import { useParams } from 'react-router-dom'
import CardflippingT from '../Games/CardflippingT';
import Cardflipping from '../Games/Cardflipping';
import SaveTheGirl from '../Games/SaveTheGirl';
import Riddle from '../Games/Riddle';
import WordSearchGame from '../Games/WordSearchGame';
import SaveGirl2 from '../Games/SaveGirl2';

const Game = () => {
  const {classId,subject}=useParams();
  return (
    <div>
      {subject==="tamil" && <CardflippingT />}
      {subject==="english" && <Cardflipping />}
      {subject==="math" && <SaveTheGirl />}
      {subject==="science" && <Riddle />}
      {subject==="social studies" && <WordSearchGame /> }
      {classId>10 && <SaveGirl2 />}

    </div>
  )
}

export default Game