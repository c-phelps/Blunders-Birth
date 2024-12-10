import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
import Stockfish from "stockfish.js";

const BoardComponent = ({ fen }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [stockfishWorker, setStockfishWorker] = useState(null);

  useEffect(() => {
    // Instantiate the Stockfish worker
    try {
      // instantiate the stockfish engine for analysis
      const engine = Stockfish();
      // set the stockfish worker to the new engine
      setStockfishWorker(engine);

      // initialize the Stockfish engine
      engine.postMessage("uci");

      //
      engine.onmessage = (event) => {
        console.log("Stockfish response:", event.data); // Log engine output for debugging
      };

      // Cleanup on unmount
      return () => {
        if (engine) {
          engine.terminate();
        }
      };
    } catch (error) {
      console.error("Error initializing Stockfish:", error); // Catch any errors during initialization
    }
  }, []);

  // set the position to the fen prop passed on change from the homepage
  return <Chessboard position={fen} arePiecesDraggable={false} />;
};

export default BoardComponent;
