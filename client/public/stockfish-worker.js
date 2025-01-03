// eslint-disable-next-line no-undef
try {
  importScripts("/stockfish-nnue-16.js");
  console.log("Stockfish script loaded successfully");
} catch (error) {
  console.error("Failed to load Stockfish script:", error);
}

if (typeof STOCKFISH === "function") {
  console.log("Stockfish engine loaded as a function");
  const stockfish = STOCKFISH();
  self.onmessage = (event) => {
    console.log("Message received in worker:", event.data);
    const fen = event.data;

    stockfish.postMessage(`position to fen ${fen}`);

    stockfish.postMessage(`go depth 15`);

    stockfish.onmessage = (response) => {
      console.log("Stockfish response:", response);
      if (response.includes("score")) {
        const match = response.match(/score cp (-?\d+)/);
        if (match) {
          const score = parseInt(match[1], 10);
          self.postMessage(score);
        }
      }
    };
  };
} else {
  console.log("Loading Stockfish engine as a worker");
  const stockfish = new Worker("/stockfish-nnue-16.js");
  self.onmessage = (event) => {
    console.log("Message received in worker:", event.data);
    const fen = event.data;

    stockfish.postMessage(`position to fen ${fen}`);

    stockfish.postMessage(`go depth 15`);

    stockfish.onmessage = (response) => {
      console.log("Stockfish response:", response);
      const message = response.data; 
      if (message.includes("score")) {
        const match = message.match(/score cp (-?\d+)/);
        if (match) {
          const score = parseInt(match[1], 10);
          console.log("score",score);
          self.postMessage(score);
        }
      }
    };
  };
}
