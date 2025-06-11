/* filepath: /home/jonathan/git/onlyqr/app.js */
(function() {
  'use strict';

  // Initialize QR code generator
  var qrcode = new QRCode(document.getElementById("qrcode"), {
    colorDark: "#004c93"
  });

  var debounceTimer;

  function makeCode() {
    var elText = document.getElementById("text");
    var elColor = document.getElementById("color");
    var text = elText.value || "https://git.0n8.de/BerriJ/onlyqr";

    qrcode._htOption.colorDark = elColor.value;
    qrcode.makeCode(text);
  }

  function debouncedMakeCode() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(makeCode, 20);
  }

  function downloadSVG() {
    var svg = document.querySelector('#qrcode svg');
    if (!svg) {
      alert('No QR code to download. Please generate a QR code first.');
      return;
    }
    
    var svgData = new XMLSerializer().serializeToString(svg);
    var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    var svgUrl = URL.createObjectURL(svgBlob);

    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "qrcode.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  }

  function initializeApp() {
    // Generate initial QR code
    makeCode();

    // Focus the input field
    document.getElementById("text").focus();

    // Set up event listeners
    var textInput = document.getElementById("text");
    var colorInput = document.getElementById("color");
    var downloadButton = document.getElementById("download");

    // Text input events
    textInput.addEventListener('input', debouncedMakeCode);
    textInput.addEventListener('blur', makeCode);
    textInput.addEventListener('keydown', function(e) {
      if (e.keyCode === 13) {
        makeCode();
      }
    });

    // Color input events
    colorInput.addEventListener('change', makeCode);

    // Download button event
    downloadButton.addEventListener('click', downloadSVG);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
})();