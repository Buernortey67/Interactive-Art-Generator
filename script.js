let tool = 'pen';
let strokeColor = '#000000';
let fillColor = '#ffffff';
let strokeSize = 5;
let randomize = false;

// Variables for shape drawing
let startX, startY;
let isDrawing = false;

// Undo/Redo Stacks
let undoStack = [];
let redoStack = [];

function setup() {
    const canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    background(255);

    // Initialize event listeners
    initializeControls();
}

function draw() {
    // No continuous drawing needed
}

function mousePressed() {
    if (mouseButton === LEFT && mouseInCanvas()) {
        isDrawing = true;
        startX = mouseX;
        startY = mouseY;

        // Save current state for undo
        saveState();
    }
}

function mouseReleased() {
    if (isDrawing) {
        if (tool !== 'pen' && tool !== 'eraser') {
            drawShape(startX, startY, mouseX, mouseY);
        }
        isDrawing = false;
    }
}

function mouseDragged() {
    if (tool === 'pen' && mouseInCanvas()) {
        stroke(strokeColor);
        strokeWeight(strokeSize);
        line(pmouseX, pmouseY, mouseX, mouseY);
    } else if (tool === 'eraser' && mouseInCanvas()) {
        stroke(255);
        strokeWeight(strokeSize * 2);
        line(pmouseX, pmouseY, mouseX, mouseY);
    }
}

function drawShape(x1, y1, x2, y2) {
    stroke(strokeColor);
    strokeWeight(strokeSize);
    fill(fillColor);

    // Apply randomness if enabled
    if (randomize) {
        strokeColor = color(random(255), random(255), random(255));
        fillColor = color(random(255), random(255), random(255), 150);
    }

    switch (tool) {
        case 'line':
            line(x1, y1, x2, y2);
            break;
        case 'rectangle':
            rectMode(CORNERS);
            rect(x1, y1, x2, y2);
            break;
        case 'circle':
            let radius = dist(x1, y1, x2, y2);
            ellipse(x1, y1, radius * 2, radius * 2);
            break;
        case 'triangle':
            let size = dist(x1, y1, x2, y2);
            triangle(
                x1, y1 - size,
                x1 - size, y1 + size,
                x1 + size, y1 + size
            );
            break;
        default:
            break;
    }

    // Reset colors if randomize was enabled
    if (randomize) {
        strokeColor = document.getElementById('strokeColor').value;
        fillColor = document.getElementById('fillColor').value;
    }
}

function initializeControls() {
    // Tool Selection
    const toolSelector = document.getElementById('tool');
    toolSelector.addEventListener('change', function () {
        tool = this.value;
    });

    // Stroke Color
    const strokeColorPicker = document.getElementById('strokeColor');
    strokeColorPicker.addEventListener('input', function () {
        strokeColor = this.value;
    });

    // Fill Color
    const fillColorPicker = document.getElementById('fillColor');
    fillColorPicker.addEventListener('input', function () {
        fillColor = this.value;
    });

    // Stroke Size
    const strokeSizeSlider = document.getElementById('strokeSize');
    const sizeDisplay = document.getElementById('sizeDisplay');
    strokeSizeSlider.addEventListener('input', function () {
        strokeSize = this.value;
        sizeDisplay.textContent = this.value;
    });

    // Randomize Toggle
    const randomizeToggle = document.getElementById('randomize');
    randomizeToggle.addEventListener('change', function () {
        randomize = this.checked;
    });

    // Undo Button
    const undoBtn = document.getElementById('undo-btn');
    undoBtn.addEventListener('click', undo);

    // Redo Button
    const redoBtn = document.getElementById('redo-btn');
    redoBtn.addEventListener('click', redo);

    // Clear Button
    const clearBtn = document.getElementById('clear-btn');
    clearBtn.addEventListener('click', clearCanvas);

    // Save Button
    const saveBtn = document.getElementById('save-btn');
    saveBtn.addEventListener('click', saveArtwork);
}

function saveState() {
    undoStack.push(get());
    // Clear redo stack whenever a new action is performed
    redoStack = [];
}

function undo() {
    if (undoStack.length > 0) {
        redoStack.push(get());
        let previousState = undoStack.pop();
        clear();
        image(previousState, 0, 0);
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(get());
        let redoState = redoStack.pop();
        clear();
        image(redoState, 0, 0);
    }
}

function clearCanvas() {
    saveState();
    background(255);
}

function saveArtwork() {
    saveCanvas('my-artwork', 'png');
}

function mouseInCanvas() {
    return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}
