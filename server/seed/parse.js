const fs = require("fs");
const path = require("path");
const { Chess } = require("chess.js");

const parseToJSON = (filePath) => {
  // reads the tsvData into a variable from the filepath location as utf-8 encoded
  const tsvData = fs.readFileSync(filePath, "utf-8");
  const rows = tsvData.split("\n"); //split each linebreak in an array
  const headers = rows[0].split("\t"); // retrieve the headers from row 1
  headers.push("fen");
  // jsonData will equal all data after row 1
  // and map the data to a new array
  const jsonData = rows.slice(1).map((row) => {
    // this will loop through each row and separate all data by tab
    // values will be set to each row's data delineated by a tab "\t"
    const values = row.split("\t");
    // Create an object by reducing the headers array
    // - `acc` (accumulator) starts as an empty object {}
    // - `header` is the current element in the headers array
    // - `index` represents the current position in the headers array
    return headers.reduce((acc, header, index) => {
      // For each header, assign the corresponding value from the values array
      // The key will be the header (e.g., "Name"), and the value will come from the values array at the same index
      if (values[index] !== undefined) {
        acc[header] = values[index]; // header: value
      }
      // If it's the FEN column (index #), convert PGN to FEN and add the 'fen' field at index 3
      if (index === 3 && values[index - 1] !== undefined) {
        const chess = new Chess();
        chess.loadPgn(values[index - 1]);
        acc[header] = chess.fen(); //use to to convert pgn to fen here
      }
      return acc; // Return the accumulator to continue building the object
    }, {}); // Start with an empty object for each row),
  });
  return jsonData;
};

// an array of the tsvFiles from Chess openings repo
const tsvFiles = [
  path.join(__dirname, "../data/a.tsv"),
  path.join(__dirname, "../data/b.tsv"),
  path.join(__dirname, "../data/c.tsv"),
  path.join(__dirname, "../data/d.tsv"),
  path.join(__dirname, "../data/e.tsv"),
];

// reduce the array of TSV files to an array of parsedJSON objects from the parseToJSON function
const combinedParsedData = tsvFiles.reduce((acc, filePath) => {
  const parsedData = parseToJSON(filePath);
  return acc.concat(parsedData);
}, []);

// function call to write all parsed data to a new file that can be used for seeding the database.
const writeParsedData = () => {
  const jsonData = JSON.stringify(combinedParsedData, null, 2);
  fs.writeFile(path.join(__dirname, "../data/openingData.json"), jsonData, (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("JSON conversion complete!");
    }
  });
};

writeParsedData();
