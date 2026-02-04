// Polyfill minimal `File` for environments (like Node 18 on RTD) where
// global File is not defined but packages (eg. undici) expect it.
try {
  if (typeof File === "undefined") {
    const { File: FetchFile, Blob } = require("fetch-blob");
    global.File = FetchFile;
    global.Blob = Blob;
  }
} catch (e) {
  // If fetch-blob is not available, gracefully ignore — build may still fail.
}
