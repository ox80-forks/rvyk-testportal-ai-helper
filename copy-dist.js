const fs = require("fs");
const path = require("path");

const manifestSource = path.join(__dirname, "manifest.json");
const manifestDest = path.join(__dirname, "dist", "manifest.json");

if (!fs.existsSync(path.join(__dirname, "dist"))) {
  fs.mkdirSync(path.join(__dirname, "dist"));
}

try {
  fs.copyFileSync(manifestSource, manifestDest);
  console.log("Successfully copied manifest.json to dist directory");
} catch (err) {
  console.error("Error while copying manifest.json:", err);
}
