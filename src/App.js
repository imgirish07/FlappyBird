import { useState } from "react";
import Game from "./components/Game";

function App() {
  // state to control jump of bird
  const [jump, setjump]= useState(500);

  // state  so that bird starts after first click
  const [start, setstart]= useState(false);

  // obstacle movement towards left
  const [moveleft, setmoveleft]= useState(950);

  return (
    <>
      <Game jump={jump} setjump={setjump} start={start} setstart= {setstart} moveleft={moveleft} setmoveleft={setmoveleft}   />
    </>
  );
}

export default App;
