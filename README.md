# Google Search Export Tool

A web application that captures Google search results as screenshots and HTML.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Install Node.js from [https://nodejs.org/](https://nodejs.org/)
2. Open a terminal in this project directory
3. Run the following command to install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Start the server with:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Features

- Enter a search query in the input field
- Click "Search & Export" to process the search
- The application will:
  - Perform a Google search
  - Capture a screenshot of the results
  - Save the HTML content
  - Package both into a zip file
  - Provide a download link

## Note

The application uses Puppeteer to capture Google search results. For best results, ensure you have a stable internet connection.
