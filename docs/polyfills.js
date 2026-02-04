// Polyfill minimal `File` for environments (like Node 18 on RTD) where
// global File is not defined but packages (eg. undici) expect it.
try {
  if (typeof File === "undefined") {
    if (typeof Blob !== "undefined") {
      // Simple File implementation extending native Blob
      class FilePoly extends Blob {
        constructor(bits = [], name = "", options = {}) {
          super(bits, options);
          this.name = name;
          this.lastModified = options.lastModified || Date.now();
        }
        get [Symbol.toStringTag]() {
          return "File";
        }
      }
      global.File = FilePoly;
    } else {
      // Try fetch-blob as a fallback
      const fb = require("fetch-blob");
      if (fb && (fb.File || fb.Blob)) {
        global.File = fb.File || fb;
        global.Blob = fb.Blob || fb.Blob;
      }
    }
  }
} catch (e) {
  // If fetch-blob is not available, gracefully ignore — build may still fail.
  // If polyfill cannot be applied, let the build continue and surface error.
}
