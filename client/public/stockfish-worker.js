// eslint-disable-next-line no-undef
try {
  importScripts("/stockfish-nnue-16.js");
} catch (error) {
  console.error("Failed to load Stockfish script:", error);
}

if (typeof STOCKFISH === "function") {
  const stockfish = STOCKFISH();
  self.onmessage = (event) => {
    const fen = event.data;

    stockfish.postMessage(`position to fen ${fen}`);

    stockfish.postMessage(`go depth 15`);

    stockfish.onmessage = (response) => {
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
  const stockfish = new Worker("/stockfish-nnue-16.js");
  self.onmessage = (event) => {
    const fen = event.data;

    stockfish.postMessage(`position to fen ${fen}`);

    stockfish.postMessage(`go depth 15`);

    stockfish.onmessage = (response) => {
      const message = response.data; 
      if (message.includes("score")) {
        const match = message.match(/score cp (-?\d+)/);
        if (match) {
          const score = parseInt(match[1], 10);
          self.postMessage(score);
        }
      }
    };
  };
}
