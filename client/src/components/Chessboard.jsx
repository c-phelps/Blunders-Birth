import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
import Stockfish from "stockfish.js";

const BoardComponent = ({ fen }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [stockfishWorker, setStockfishWorker] = useState(null);

  useEffect(() => {
    // Instantiate the Stockfish worker
    try {
      const engine = Stockfish();
      setStockfishWorker(engine);

      // Example command to initialize the Stockfish engine
      engine.postMessage("uci");

      // Handle messages from Stockfish
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

  return <Chessboard position={fen} />;
};

export default BoardComponent;
