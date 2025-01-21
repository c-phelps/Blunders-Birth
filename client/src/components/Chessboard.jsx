import { Chessboard } from "react-chessboard";
import { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import { Stockfish } from "stockfish/src/stockfish-nnue-16";
// TODO: Get stockfish evaluation to work
const BoardComponent = ({ fen, clearText }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [worker, setWorker] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const chessWorker = new Worker("/stockfish-worker.js");
    setWorker(chessWorker);
    console.log(location.pathname);
    chessWorker.onmessage = (event) => {
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
      worker.postMessage(fen);
    }
  };
  const BackButton = () => {
    if (location.pathname === "/continuations") {
      return (
        <Link to="/">
          <button> Go Back </button>{" "}
        </Link>
      );
    }
    return null;
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
        <Col>
          <BackButton />
        </Col>
      </Row>
    </Container>
  );
};

export default BoardComponent;
