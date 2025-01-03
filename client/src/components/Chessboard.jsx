import { Chessboard } from "react-chessboard";
import { useState, useEffect, useRef } from "react";
import { Stockfish } from "stockfish/src/stockfish-nnue-16";
// TODO: Get stockfish evaluation to work
const BoardComponent = ({ fen }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const chessWorker = new Worker("/stockfish-worker.js");
    console.log('Worker initialized:', worker);
    setWorker(chessWorker);
    chessWorker.onmessage = (event) => {
      console.log('Worker message received:', event.data);
      setEvaluation(event.data);
    };
    return () => chessWorker.terminate();
  }, []);

  const analyzePosition = () => {
    if (worker) {
      console.log('Sending FEN to worker:', fen);
      worker.postMessage(fen);
    }
    console.log(worker);
  };

  // set the position to the fen prop passed on change from the homepage
  return (
    <div id="chessboard-container">
      <div>
        <h1>Chess Position Evaluation</h1>
        <button onClick={analyzePosition}>Evaluate Position</button>
        {evaluation !== null && <p>Evaluation: {evaluation > 0 ? `White +${evaluation}` : `Black ${evaluation}`}</p>}
      </div>
      <Chessboard position={fen} arePiecesDraggable={false} />
    </div>
  );
};

export default BoardComponent;
