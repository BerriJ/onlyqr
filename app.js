/* filepath: /home/jonathan/git/onlyqr/app.js */
(function() {
  'use strict';

  // Initialize QR code generator
  var qrcode = new QRCode(document.getElementById("qrcode"), {
    colorDark: "#004c93"
  });

  var debounceTimer;

  function optimizeSVG(svg) {
    // Parse the existing SVG to extract the QR data
    const uses = svg.querySelectorAll('use');
    const qrData = [];
    let maxX = 0, maxY = 0;
    
    // Extract positions from use elements
    uses.forEach(use => {
      const x = parseInt(use.getAttribute('x') || '0');
      const y = parseInt(use.getAttribute('y') || '0');
      if (!qrData[y]) qrData[y] = [];
      qrData[y][x] = true;
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
    
    // Get the color from the original template
    const template = svg.querySelector('#template, rect[id]');
    const color = template ? template.getAttribute('fill') || '#000' : '#000';
    
    // Create optimized SVG
    const optimizedSVG = createOptimizedSVG(qrData, maxX + 1, maxY + 1, color);
    
    // Replace the old SVG with the optimized one
    svg.parentNode.replaceChild(optimizedSVG, svg);
    
    return optimizedSVG;
  }

  function createOptimizedSVG(qrData, width, height, color) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width * 10);
    svg.setAttribute('height', height * 10);
    
    // Create defs section with reusable cell (no fill - will inherit)
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const cellTemplate = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    cellTemplate.setAttribute('id', 'cell');
    cellTemplate.setAttribute('width', '1');
    cellTemplate.setAttribute('height', '1');
    defs.appendChild(cellTemplate);
    svg.appendChild(defs);
    
    // Create main group with fill color
    const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    mainGroup.setAttribute('fill', color);
    svg.appendChild(mainGroup);
    
    // Create optimized structure
    for (let y = 0; y < height; y++) {
      if (!qrData[y]) continue;
      
      // Find consecutive cells and group them
      let x = 0;
      while (x < width) {
        if (qrData[y][x]) {
          // Count consecutive cells
          let consecutiveCount = 1;
          while (x + consecutiveCount < width && qrData[y][x + consecutiveCount]) {
            consecutiveCount++;
          }
          
          if (consecutiveCount > 1) {
            // Use a single rect for multiple consecutive cells (inherits fill from group)
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', x);
            rect.setAttribute('y', y);
            rect.setAttribute('width', consecutiveCount);
            rect.setAttribute('height', '1');
            mainGroup.appendChild(rect);
          } else {
            // Use individual use elements for single cells (inherits fill from group)
            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttribute('href', '#cell');
            use.setAttribute('x', x);
            use.setAttribute('y', y);
            mainGroup.appendChild(use);
          }
          
          x += consecutiveCount;
        } else {
          x++;
        }
      }
    }
    
    return svg;
  }

  function makeCode() {
    var elText = document.getElementById("text");
    var elColor = document.getElementById("color");
    var text = elText.value || "https://git.0n8.de/BerriJ/onlyqr";

    qrcode._htOption.colorDark = elColor.value;
    qrcode.makeCode(text);
    
    // Wait for the QR code to be generated, then optimize it
    setTimeout(() => {
      const svg = document.querySelector('#qrcode svg');
      if (svg) {
        optimizeSVG(svg);
      }
    }, 10);
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
    
    // Trigger glitter effect on QR code
    triggerQRGlitterEffect();
    
    // Small delay to show the effect before download
    setTimeout(function() {
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
    }, 300);
  }

  function getRandomGlitterColor() {
    const colors = [
      '#FFD700', // Gold
      '#FF69B4', // Hot Pink
      '#00CED1', // Dark Turquoise
      '#FF6347', // Tomato
      '#9370DB', // Medium Purple
      '#32CD32', // Lime Green
      '#FF1493', // Deep Pink
      '#00BFFF', // Deep Sky Blue
      '#FFA500', // Orange
      '#DA70D6', // Orchid
      '#ADFF2F', // Green Yellow
      '#FF4500', // Orange Red
      '#7B68EE', // Medium Slate Blue
      '#00FF7F', // Spring Green
      '#DC143C', // Crimson
      '#40E0D0'  // Turquoise
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function createGlitter(container) {
    const glitter = document.createElement('div');
    glitter.className = 'glitter';
    
    // Random position within button
    const x = Math.random() * container.offsetWidth;
    const y = Math.random() * container.offsetHeight;
    
    glitter.style.left = x + 'px';
    glitter.style.top = y + 'px';
    
    // Random color
    const color = getRandomGlitterColor();
    glitter.style.background = color;
    glitter.style.boxShadow = `0 0 6px ${color}, 0 0 12px ${color}, 0 0 18px ${color}`;
    
    // Random animation type
    const animations = ['anim1', 'anim2', 'anim3'];
    const randomAnim = animations[Math.floor(Math.random() * animations.length)];
    glitter.classList.add(randomAnim);
    
    // Random delay
    glitter.style.animationDelay = Math.random() * 0.5 + 's';
    
    container.appendChild(glitter);
    
    // Remove glitter after animation
    setTimeout(() => {
      if (glitter.parentNode) {
        glitter.parentNode.removeChild(glitter);
      }
    }, 2000);
  }

  function startGlitterEffect(button) {
    const container = button.querySelector('.glitter-container');
    if (!container) return;
    
    // Create multiple glitter particles
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createGlitter(container), i * 200);
    }
  }

  function createQRGlitter(container) {
    const glitter = document.createElement('div');
    glitter.className = 'qr-glitter';
    
    // Random position within QR code area
    const x = Math.random() * container.offsetWidth;
    const y = Math.random() * container.offsetHeight;
    
    glitter.style.left = x + 'px';
    glitter.style.top = y + 'px';
    
    // Random color
    const color = getRandomGlitterColor();
    glitter.style.background = color;
    glitter.style.boxShadow = `0 0 8px ${color}, 0 0 16px ${color}, 0 0 24px ${color}`;
    
    // Random animation type
    const animations = ['anim1', 'anim2', 'anim3'];
    const randomAnim = animations[Math.floor(Math.random() * animations.length)];
    glitter.classList.add(randomAnim);
    
    // Random delay
    glitter.style.animationDelay = Math.random() * 0.3 + 's';
    
    container.appendChild(glitter);
    
    // Remove glitter after animation
    setTimeout(() => {
      if (glitter.parentNode) {
        glitter.parentNode.removeChild(glitter);
      }
    }, 2500);
  }

  function triggerQRGlitterEffect() {
    const qrcode = document.getElementById('qrcode');
    let container = qrcode.querySelector('.qr-glitter-container');
    
    // Create container if it doesn't exist
    if (!container) {
      container = document.createElement('div');
      container.className = 'qr-glitter-container';
      qrcode.appendChild(container);
    }
    
    // Create multiple waves of glitter
    for (let wave = 0; wave < 3; wave++) {
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
          setTimeout(() => createQRGlitter(container), i * 100);
        }
      }, wave * 300);
    }
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

    // Create glitter container for download button
    const glitterContainer = document.createElement('div');
    glitterContainer.className = 'glitter-container';
    downloadButton.appendChild(glitterContainer);

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

    // Download button events
    downloadButton.addEventListener('click', downloadSVG);
    
    // Glitter effect on hover
    let glitterInterval;
    downloadButton.addEventListener('mouseenter', function() {
      startGlitterEffect(downloadButton);
      glitterInterval = setInterval(() => {
        startGlitterEffect(downloadButton);
      }, 600);
    });
    
    downloadButton.addEventListener('mouseleave', function() {
      if (glitterInterval) {
        clearInterval(glitterInterval);
        glitterInterval = null;
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
})();