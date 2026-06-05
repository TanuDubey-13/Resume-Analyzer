# ResumeIQ - AI Resume Analyzer

ResumeIQ is a frontend resume analyzer built with HTML, CSS, and JavaScript. It helps users paste or upload a resume, select a target role, and get a quick analysis based on keyword match, measurable impact, structure, and improvement suggestions.

## Features

- Dark mode responsive user interface
- Animated background and resume scanning graphics
- Resume text input and file upload support
- PDF resume text extraction using PDF.js
- Target role based keyword matching
- Resume score calculation
- Keyword fit, impact signal, and structure metrics
- Actionable improvement suggestions
- Keyword radar visualization
- Sample resume loader for quick testing

## Tech Stack

- HTML
- CSS
- JavaScript
- PDF.js

## How It Works

The analyzer reads resume text from the text area or uploaded file. For PDF files, PDF.js extracts readable text from the document. The JavaScript logic then checks the resume against target role keywords, quantified achievements, action verbs, section structure, and resume length to generate a score and improvement tips.

## Project Structure

```text
Resume-Analyzer/
  index.html
  styles.css
  app.js
  README.md
```

## How To Run

Open `index.html` in a browser.

For PDF upload support, use an internet connection because PDF.js is loaded through a CDN.

## Deployment

This project can be deployed using GitHub Pages.

1. Keep `index.html`, `styles.css`, and `app.js` in the root of the repository.
2. Go to repository `Settings`.
3. Open `Pages`.
4. Select branch `main` and folder `/root`.
5. Save and open the generated GitHub Pages link.

## Future Scope

- Add real AI API integration for deeper resume feedback
- Add job description upload and compare resume against it
- Support OCR for scanned PDF resumes
- Add downloadable analysis report
- Add ATS compatibility score
- Add authentication and save previous resume reports
- Improve role keyword database for more job categories
- Add backend support with Node.js, Express, or Python FastAPI

## Note

This version runs fully in the browser. Resume data is not sent to a backend server. The current analysis is rule based and keyword based, not connected to a real AI model yet.

Author -
Tanu Dubey
Feel free to explore the project and share feedback!
