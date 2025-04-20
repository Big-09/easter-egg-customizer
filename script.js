    // ==== ELEMENT REFERENCES ====
    const buttons = document.querySelectorAll('.color-buttons button');
    const eggFill = document.getElementById('egg-fill');
    const patternButtons = document.querySelectorAll('.pattern-buttons button');
    const stickerButtons = document.querySelectorAll('.sticker-buttons button');
    const patternLayer = document.getElementById('pattern-layer');
    const stickerLayer = document.getElementById('sticker-layer');
    const popup = document.getElementById('edit-popup');
    const colorInput = document.getElementById('edit-color');
    const sizeInput = document.getElementById('edit-size');
    const svg = document.getElementById('egg');
    
    let selectedElement = null;
    
    
    
    // ==== CHANGE EGG COLOR ====
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const color = button.getAttribute('data-color');
        eggFill.setAttribute('fill', color);
        customColorRangeInput.value = color
      });
    });
    
    
    
    // ==== ADD PATTERNS ====
    patternButtons.forEach(button => {
      button.addEventListener('click', () => {
        const pattern = button.getAttribute('data-pattern');
    
        if (pattern === 'dots') {
          const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot.setAttribute('cx', 50 + Math.random() * 100);
          dot.setAttribute('cy', 80 + Math.random() * 140);
          dot.setAttribute('r', 8);
          dot.setAttribute('fill', '#ab47bc');
          patternLayer.appendChild(dot);
          makeDraggable(dot);
          makeInteractive(dot);
        }
    
        if (pattern === 'stripes') {
          const stripe = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          stripe.setAttribute('x', 20);
          stripe.setAttribute('y', 60 + Math.random() * 180);
          stripe.setAttribute('width', 160);
          stripe.setAttribute('height', 10);
          stripe.setAttribute('fill', '#42a5f5');
          patternLayer.appendChild(stripe);
          makeDraggable(stripe);
          makeInteractive(stripe);
        }
      });
    });
    
    // ==== ADD STICKERS ====
    stickerButtons.forEach(button => {
      button.addEventListener('click', () => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', 90 + Math.random() * 20);
        text.setAttribute('y', 130 + Math.random() * 30);
        text.setAttribute('font-size', '24');
        text.setAttribute('fill', '#000000');
        text.textContent = button.textContent;
        stickerLayer.appendChild(text);
        makeDraggable(text);
        makeInteractive(text);
    
        
      });
    });
    
    // ==== MAKE SVG ELEMENTS DRAGGABLE ====
    function makeDraggable(el) {
      let isDragging = false;
      let offset = { x: 0, y: 0 };
    
      function getEventClientCoords(evt) {
        if (evt.touches && evt.touches.length > 0) {
          return { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
        } else {
          return { x: evt.clientX, y: evt.clientY };
        }
      }
    
      const startDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
        const coords = getEventClientCoords(e);
        const pt = getMousePositionFromCoords(coords);
    
        if (el.hasAttribute('x')) {
          offset.x = pt.x - parseFloat(el.getAttribute('x'));
          offset.y = pt.y - parseFloat(el.getAttribute('y'));
        } else if (el.hasAttribute('cx')) {
          offset.x = pt.x - parseFloat(el.getAttribute('cx'));
          offset.y = pt.y - parseFloat(el.getAttribute('cy'));
        }
      };
    
      const doDrag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const coords = getEventClientCoords(e);
        const pt = getMousePositionFromCoords(coords);
    
        if (el.hasAttribute('x')) {
          el.setAttribute('x', pt.x - offset.x);
          el.setAttribute('y', pt.y - offset.y);
        } else if (el.hasAttribute('cx')) {
          el.setAttribute('cx', pt.x - offset.x);
          el.setAttribute('cy', pt.y - offset.y);
        }
      };
    
      const endDrag = () => {
        isDragging = false;
      };
    
      // 🖱 Mouse events
      el.addEventListener('mousedown', startDrag);
      document.addEventListener('mousemove', doDrag);
      document.addEventListener('mouseup', endDrag);
    
      // 📱 Touch events
      el.addEventListener('touchstart', startDrag, { passive: false });
      document.addEventListener('touchmove', doDrag, { passive: false });
      document.addEventListener('touchend', endDrag);
    }
    
    // 👇 Modified helper function for touch support:
    function getMousePositionFromCoords({ x, y }) {
      const pt = svg.createSVGPoint();
      pt.x = x;
      pt.y = y;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    
    
    // ==== GET MOUSE POSITION RELATIVE TO SVG ====
    function getMousePosition(evt) {
      const pt = svg.createSVGPoint();
      pt.x = evt.clientX;
      pt.y = evt.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    
    // ==== MAKE ELEMENTS INTERACTIVE (EDITABLE) ====
    function makeInteractive(el) {
      el.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents popup from closing if inside popup
        showPopup(el, e.clientX, e.clientY);
      });
    }
    
    const rangeInputLabel = document.getElementById('rangeInputLabel')
    const rangeInputLabelLength = document.getElementById('rangeInputLabelLength')
    
    // ==== SHOW POPUP FOR COLOR AND SIZE ====
    function showPopup(el, x, y) {
      selectedElement = el;
      popup.style.left = `${x + 10}px`;
      popup.style.top = `${y + 10}px`;
      popup.style.display = 'block';
    
      const fill = el.getAttribute('fill') || '#000000';
      colorInput.value = fill;
    
      let size = 20;
      if (el.tagName === 'circle') {
        size = el.getAttribute('r') || size;
        rangeInputLabel.style.display = 'none'
        rangeInputLabelLength.style.display = 'none'
        
      } else if (el.tagName === 'rect') {
        size = el.getAttribute('height') || size;
        rangeInputLabel.style.display = 'block'
        rangeInputLabelLength.style.display = 'block'
        
      } else if (el.tagName === 'text') {
        size = el.getAttribute('font-size') || size;
        rangeInputLabel.style.display = 'none'
        rangeInputLabelLength.style.display = 'none'
      }
    
      sizeInput.value = size;
    
    
    }
    
    // ==== ROTATE BASED ON SLIDER INPUT ====
    
    
    
    
    // ==== CHANGE COLOR BASED ON INPUT ====
    colorInput.addEventListener('input', () => {
      if (selectedElement) {
        selectedElement.setAttribute('fill', colorInput.value);
      }
    });
    
    
    let lengthInput = document.getElementById('length-slider')
    lengthInput.addEventListener('input', () => {
      if(!selectedElement) return;
      if (selectedElement.tagName === 'rect') {
        selectedElement.style.width = `${lengthInput.value}px`;
      }
    });
    
    let rangeInput = document.getElementById('rotate-slider')
    
    
    rangeInput.addEventListener('input', () => {
      if(!selectedElement) return;
      if (selectedElement.tagName === 'rect') {
        // Set transform origin to center of the rectangle
        const x = parseFloat(selectedElement.getAttribute('x'));
        const y = parseFloat(selectedElement.getAttribute('y'));
        const width = parseFloat(selectedElement.getAttribute('width'));
        const height = parseFloat(selectedElement.getAttribute('height'));
    
        const centerX = x + width / 2;
        const centerY = y + height / 2;
    
        selectedElement.setAttribute('transform-origin', `${centerX}px ${centerY}px`);
        selectedElement.style.transformOrigin = `${centerX}px ${centerY}px`;
    
        // Apply rotation around center
        selectedElement.style.transform = `rotate(${rangeInput.value}deg)`;
      }
    })
    
    // ==== CHANGE SIZE BASED ON INPUT ====
    sizeInput.addEventListener('input', () => {
      if (!selectedElement) return;
      const val = sizeInput.value;
      if (selectedElement.tagName === 'circle') {
        selectedElement.setAttribute('r', val);
      } else if (selectedElement.tagName === 'rect') {
        selectedElement.setAttribute('height', val);
      } else if (selectedElement.tagName === 'text') {
        selectedElement.setAttribute('font-size', val);
      }
    });
    
    
    
    // ==== ADD REMOVE BUTTON FUNCTIONALITY ====
    // Add event listener for the "Remove" button inside the popup
    document.getElementById('remove-element').addEventListener('click', () => {
        if (selectedElement) {
          // Remove the selected element from its parent layer
          selectedElement.remove();
          // Hide the popup after removing the element
          popup.style.display = 'none';
        }
      });
    
      
    
      const zIndexBackward = () => {
        if (selectedElement) {
          selectedElement.parentNode.appendChild(selectedElement);
          selectedElement.style.zIndex -= 100
        }
      }
    
      const zIndexForward = () => {
        if (selectedElement) {
          selectedElement.parentNode.insertBefore(selectedElement, selectedElement.parentNode.firstChild);
          selectedElement.style.zIndex += 100 
        }
      }
      document.getElementById('send-to-back').addEventListener('click', zIndexForward);
      document.getElementById('bring-to-front').addEventListener('click', zIndexBackward);
      
      document.body.addEventListener('click', (e) => {
        if (!popup.contains(e.target)) {
          popup.style.display = 'none';
        }})
    
    
        const customColorRangeInput = document.getElementById('egg-color')
        
        customColorRangeInput.addEventListener('input', () => {
          eggFill.setAttribute('fill', customColorRangeInput.value);
        })
    
        function saveAsPNG() {
          let username = window.prompt("What is your name?");
          while (!username || username.trim() === '') {
            alert("Please enter your name.");
            username = window.prompt("What is your name?");
          }
        
          let watermarkText = `by ${username.length > 17 ? username = username.substring(0, 12) + '...'  : username}, happy Easter!!`;
        
          const svg = document.getElementById('egg');
          const svgData = new XMLSerializer().serializeToString(svg);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
        
          const img = new Image();
          img.onload = function () {
            const canvas = document.createElement('canvas');
            const outputWidth = 800;
            const outputHeight = 1200;
            canvas.width = outputWidth;
            canvas.height = outputHeight;
            const ctx = canvas.getContext('2d');
        
            // ✅ Clear canvas with transparent background
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        
            // ✅ Draw the SVG image onto the canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
            // ✅ Add watermark (unchanged styling)
            ctx.font = username.length > 17 ? '30px Arial' : '50px Arial'; // ✅ Make text bold
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(watermarkText, canvas.width / 2, canvas.height - 40);
        
            // ✅ Export to PNG
            const pngData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngData;
            link.download = 'easter-egg.png';
            link.click();
        
            URL.revokeObjectURL(url);
          };
        
          img.src = url;
        }
        
    
    
    
        