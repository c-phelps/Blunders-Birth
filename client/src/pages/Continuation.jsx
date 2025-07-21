import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward, faPlay, faForwardFast } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import { useLocation } from "react-router-dom";
import BoardComponent from "../components/Chessboard";
import { Chess } from "chess.js";

const ContinuationComponent = () => {
  const [activeSpeed, setActiveSpeed] = useState(1000);
  const playSpeed = useRef(activeSpeed);

  const [moveDisplay, setMoveDisplay] = useState("");
  const [currentMove, setCurrentMove] = useState("");

  const [isDisabled, setDisabled] = useState(false);

  const location = useLocation();
  const {
    selectedEco: eco,
    selectedOpening: opening,
    arrContinuations,
    boardState: startingState,
  } = location.state || {};

  const [boardState, setBoardState] = useState(startingState);
  const [clearText, setClearText] = useState(false);

  const handleSpeed = (speed) => {
    if (!isDisabled) {
      setActiveSpeed(speed);
      playSpeed.current = speed;
    }
  };

  // copy pasted from Home functionality:
  const handleChange = (event) => {
    // turn off controls during the run
    setDisabled(true);
    const openingSelect = document.querySelector("#openings");
    const { value } = event.target;
    const eco = event.target.options[event.target.selectedIndex].dataset.eco;
    const seq = event.target.options[event.target.selectedIndex].dataset.seq;
    const arrMoves = seq.split(" ");
    setBoardState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    let moveIndex = 0;
    let currState = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    setMoveDisplay("");
    // adjust the clearText boolean to reset the text in the child component
    setClearText((prev) => !prev);
    openingSelect.setAttribute("disabled", "disabled");
    
    const intervalId = setInterval(() => {
      // make sure we are still in the array boundaries
      if (moveIndex < arrMoves.length) {
        // set the move variable to the array at the current index
        const move = arrMoves[moveIndex].trim();
        // instantiate a new chess object based on the current boardstate
        const chess = new Chess(currState);
        // adjust the moveBuilder to include the current move
        setMoveDisplay((prev) => prev + `${move} `);
        // simple regex check to see if the move is leading with a number and exit loop if so
        // ex "1. " or "2. "
        if (move.match(/^\d+\./)) {
          moveIndex++;
          return;
        }
        setCurrentMove(move);
        // apply the move using chess.move with the current move ex "e4"
        chess.move(move);
        // update the boardstate to the fen
        setBoardState(chess.fen());
        // update the currentState local variable for the loop
        currState = chess.fen();
        // increment the moveIndex
        moveIndex++;
      } else {
        // clear the intervalId after the index has moved past the length of the array
        // reset the openingSelect's value for disabled to enabled
        openingSelect.removeAttribute("disabled");
        setDisabled(false);
        clearInterval(intervalId); // Stop interval when done
      }
    }, playSpeed.current);
  };
  return (
    <div className="fullscreen">
      <h1>
        {eco} - {opening}
      </h1>
      <select name="opening" id="openings" onChange={handleChange} defaultValue="">
        <option value="" disabled>
          Select a continuation!
        </option>

        {arrContinuations && arrContinuations.length > 0 ? (
          arrContinuations.map((continuation, index) => (
            <option key={index} value={continuation.name} data-eco={continuation.eco} data-seq={continuation.pgn}>
              {continuation.eco} - {continuation.name}
            </option>
          ))
        ) : (
          <p>Loading openings...</p>
        )}
      </select>
      <BoardComponent fen={boardState} clearText={clearText} arePiecesDraggable={false} />
      <div style={{ display: "flex", gap: "1rem", minHeight: "30px", alignItems: "center" }}>
        <FontAwesomeIcon
          disabled={false}
          cursor="pointer"
          icon={faPlay}
          className={`${activeSpeed === 1000 ? "border" : "invisBorder"} ${isDisabled ? "disabledIcons" : ""}`}
          data-tooltip-id="play-tooltip"
          id="slow"
          onClick={() => {
            handleSpeed(1000);
          }}
        />
        <FontAwesomeIcon
          disabled={false}
          cursor="pointer"
          className={`${activeSpeed === 700 ? "border" : "invisBorder"} ${isDisabled ? "disabledIcons" : ""}`}
          data-tooltip-id="forward-tooltip"
          id="fast"
          icon={faForward}
          onClick={() => {
            handleSpeed(700);
          }}
        />
        <FontAwesomeIcon
          disabled={false}
          cursor="pointer"
          className={`${activeSpeed === 300 ? "border" : "invisBorder"} ${isDisabled ? "disabledIcons" : ""}`}
          data-tooltip-id="fast-forward-tooltip"
          id="faster"
          icon={faForwardFast}
          onClick={() => {
            handleSpeed(300);
          }}
        />

        <Tooltip id="play-tooltip" content="1x" />
        <Tooltip id="forward-tooltip" content="2x" />
        <Tooltip id="fast-forward-tooltip" content="3x" />
      </div>
      <div style={{ minHeight: "50px" }}>
        <p id="currentMove" style={{ fontWeight: "bold", fontSize: "30px" }}>
          {currentMove}
        </p>
      </div>
      <p id="moves" style={{ fontWeight: "bold", minHeight: "10px" }}>
        {moveDisplay}
      </p>
    </div>
  );
};

export default ContinuationComponent;
