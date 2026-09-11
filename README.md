# Blunder's Birth

A chess opening explorer that lets users browse opening lines and view the resulting position on an interactive chessboard.

## Features

* Browse chess openings and opening lines
* Select moves within an opening
* Display the resulting board position
* Retrieve opening data from the backend
* Responsive chessboard interface

## Architecture

The project has a separate frontend and backend.

The frontend is built with React and handles the chessboard and user interaction.

The backend uses Node.js, Express, and MongoDB to store and retrieve opening data. When an opening line is selected, the backend returns the corresponding position data (FEN) for the frontend to display on the chessboard.

## Technology

**Frontend**

* React
* JavaScript

**Backend**

* Node.js
* Express
* MongoDB

## Purpose

This project was built to practice working with a frontend and backend together, handling API requests, storing structured data, and updating the UI based on backend responses.
