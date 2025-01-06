import { Chessboard } from "react-chessboard";
import { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Stockfish } from "stockfish/src/stockfish-nnue-16";
// TODO: Get stockfish evaluation to work
const BoardComponent = ({ fen, clearText }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const chessWorker = new Worker("/stockfish-worker.js");
    console.log("Worker initialized:", worker);
    setWorker(chessWorker);
    chessWorker.onmessage = (event) => {
      console.log("Worker message received:", event.data);
      let parsedData = parseFloat(event.data);
      if (!isNaN(parsedData)) {
        parsedData = parsedData / 100;
        setEvaluation(parsedData);
      } else {
        setEvaluation(null);
      }
    };
    return () => chessWorker.terminate();
  }, []);

  useEffect(() => {
    setEvaluation(null);
  }, [clearText]);

  const analyzePosition = () => {
    if (worker) {
      console.log("Sending FEN to worker:", fen);
      worker.postMessage(fen);
    }
    console.log(worker);
  };

  // set the position to the fen prop passed on change from the homepage
  return (
    <Container className="text-center">
      <Row className="align-items-start">
        <Col>
          <p>Chess Position Evaluation</p>
          <button onClick={analyzePosition}>Evaluate Position</button>
          {evaluation !== null && (
            <p id="eval">Evaluation: {evaluation > 0 ? `White +${evaluation}` : `Black ${evaluation}`}</p>
          )}
        </Col>

        <Col>
          <Chessboard position={fen} arePiecesDraggable={false} />
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default BoardComponent;
