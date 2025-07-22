import { Chessboard } from "react-chessboard";
import { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import { Stockfish } from "stockfish/src/stockfish-nnue-16";
import styles from "./Chessboard.module.css";
import { Tooltip } from "react-tooltip";

// TODO: Get stockfish evaluation to work
const BoardComponent = ({ fen, clearText }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [worker, setWorker] = useState(null);
  const location = useLocation();
  const tooltipText =
    "Render's free deployment will not serve the files required to allow for Stockfish evaluation. For full evaluation and analysis with depth, deploy locally from github!";

  useEffect(() => {
    const chessWorker = new Worker("/stockfish-worker.js");
    setWorker(chessWorker);
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
    return (
      <div className={styles.welcomeText}>
        <p>
          Welcome to Blunder's Birth a site where you can learn and study book openings for chess! To get started,
          select an opening from the drop down menu above the chess board. Then you can see potential continuations by
          clicking the button below the chess board!
        </p>
      </div>
    );
  };

  // set the position to the fen prop passed on change from the homepage
  return (
    <Container className="text-center">
      <Row className="align-items-start">
        <Col className={styles.columnContainers}>
          <p>Chess Position Evaluation</p>
          <button onClick={analyzePosition} data-tooltip-id="eval-button">
            Evaluate Position
          </button>
          <Tooltip id="eval-button" className={styles.buttonTooltip} content={tooltipText} />
          {evaluation !== null ? (
            <p id="eval">Evaluation: {evaluation > 0 ? `White +${evaluation}` : `Black ${evaluation}`}</p>
          ) : (
            <p id="eval"></p>
          )}
        </Col>
        <Col className={styles.columnContainers}>
          <Chessboard position={fen} arePiecesDraggable={false} />
        </Col>
        <Col className={styles.columnContainers}>
          <BackButton />
        </Col>
      </Row>
    </Container>
  );
};

export default BoardComponent;
