import { useEffect, useState } from "react";
import { useNavigate, useRevalidator, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
// import Auth from "../utils/auth";
import BoardComponent from "../components/Chessboard";
import { OPENINGS_ASC, FIND_CONTINUATIONS } from "../utils/queries";
import { Chess } from "chess.js";

// set up homepage function that will return the jsx 'HTML' for the home-page
const Home = () => {
  // const navigate = useNavigate();
  const [boardState, setBoardState] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [selectedOpening, setOpening] = useState(null);
  const [selectedEco, setEco] = useState(null);
  const [arrContinuations, setArrContinuations] = useState([]);

  const moveDisplay = document.querySelector("#moves");
  const openingSelect = document.querySelector("#openings");

  // use query to retrieve a selection of openings to allow user to choose from
  const { loading, error, data } = useQuery(OPENINGS_ASC, {
    variables: { orderBy: { name: "ASC" } },
  });

  const {
    contLoading,
    contError,
    data: contData,
  } = useQuery(FIND_CONTINUATIONS, {
    variables: { orderBy: { name: "ASC" }, eco: selectedEco, opening: selectedOpening },
    skip: !selectedEco || !selectedOpening,
    fetchPolicy: "network-only",
  });
  if (contError) {
    console.error("Error in query:", contError);
  }

  const arrOpenings = data?.findMainLineOpenings;
  // when user selects an opening, change the boardState via setBoardState and load the opening into the BoardComponent
  const handleChange = (event) => {
    const { value } = event.target;
    const eco = event.target.options[event.target.selectedIndex].dataset.eco;
    const seq = event.target.options[event.target.selectedIndex].dataset.seq;
    const arrMoves = seq.split(" ");
    // reset board
    setBoardState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    // set the moveIndex, the moveBuilder string, and currentState variables that will be used in the setInterval
    let moveIndex = 0;
    let currState = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    let moveBuilder = "";
    // set our intervalId to the setInterval
    openingSelect.setAttribute("disabled", "disabled");
    const intervalId = setInterval(() => {
      // check to see if the moveIndex is < lenght of array
      if (moveIndex < arrMoves.length) {
        // set the move variable to the array at the current index
        const move = arrMoves[moveIndex].trim();
        // instantiate a new chess object based on the current boardstate
        const chess = new Chess(currState);
        // adjust the moveBuilder to include the current mvoe
        moveBuilder += `${move} `;
        // display the moves in the innterHTML
        moveDisplay.innerHTML = moveBuilder;
        // simple regex check to see if the move is leading with a number and exit loop if so
        // ex "1. " or "2. "
        if (move.match(/^\d+\./)) {
          moveIndex++;
          return;
        }
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
        clearInterval(intervalId); // Stop interval when done
      }
    }, 450);
    setOpening(value);
    setEco(eco);
  };

  useEffect(() => {
    setArrContinuations(contData?.findContinuations);
  }, [contData]);

  // additionally show the variations available for that particular opening as buttons? or links?
  // when the user selects a variation, display the specific variation based on the fen
  //  on the boardcomponent use stockfish engine to analyze and return a mp +/- advantage for the position when each new variation is selected
  return (
    <div className="fullscreen">
      <h1>Welcome :) hello Kristen</h1>
      {loading && <p>Loading...</p>}
      <select name="opening" id="openings" placeholder="Select an opening!" onChange={handleChange}>
        {arrOpenings && arrOpenings.length > 0 ? (
          arrOpenings.map((opening, index) => (
            <option key={index} value={opening.name} data-eco={opening.eco} data-seq={opening.pgn}>
              {opening.eco} - {opening.name}
            </option>
          ))
        ) : (
          <option disabled>Loading openings...</option> // Optional: display a loading message
        )}
      </select>
      <BoardComponent fen={boardState} arePiecesDraggable={false} />
      <p id="moves" style={{ fontWeight: "bold" }}></p>
      {selectedOpening?.length > 0 && arrContinuations?.length > 0 && (
        <div id="continuations">
          <Link to="/" state={{ selectedEco, selectedOpening }}>
            Check out possible continuations for {selectedEco} - {selectedOpening} →
          </Link>
          {arrContinuations.map((continuation, index) => (
            <p key={index}>{continuation.name}</p>
          ))}
        </div>
      )}
      {selectedOpening?.length > 0 && arrContinuations?.length === 0 && <p>No continuation found</p>}
    </div>
  );
};

export default Home;
