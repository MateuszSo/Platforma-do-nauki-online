// Punkt wejścia Netlify Function: opakowuje aplikację Express (src/server.js)
// w handler zgodny z AWS Lambda / Netlify Functions.
const serverless = require("serverless-http");
const app = require("../../src/server");

const handler = serverless(app);

// Netlify potrafi przekazać jako event.path zarówno ścieżkę oryginalną
// (/api/login), jak i docelową (/.netlify/functions/api/login).
// Normalizujemy ją, żeby routing Expressa działał w obu przypadkach.
function normalizePath(path) {
  let p = path || "/";
  p = p.replace(/^\/\.netlify\/functions\/api/, "");
  p = p.replace(/^\/api(?=\/|$)/, "");
  return p || "/";
}

exports.handler = async (event, context) => {
  const normalizedEvent = {
    ...event,
    path: normalizePath(event.path),
  };

  return handler(normalizedEvent, context);
};
