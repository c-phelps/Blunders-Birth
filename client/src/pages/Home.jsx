import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Auth from "../utils/auth";
import BoardComponent from "../components/Chessboard";
// set up homepage function that will return the jsx 'HTML' for the home-page
const Home = () => {
  // const navigate = useNavigate();
  const { boardState, setBoardState } = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

  return (
    <div>
      <h1>Welcome :) hello Kristen</h1>
      <BoardComponent fen={boardState} />
    </div>
  );
};

export default Home;
