const primaryColorPicker = document.getElementById('primaryColorPicker');
const secondaryColorPicker = document.getElementById('secondaryColorPicker');

let primaryColour = primaryColorPicker.value;
let secondaryColour = secondaryColorPicker.value;

primaryColorPicker.addEventListener('input', () => {
    primaryColour = primaryColorPicker.value;
    updateGlobalColors();
    updateDotPattern();
});

secondaryColorPicker.addEventListener('input', () => {
    secondaryColour = secondaryColorPicker.value;
    updateGlobalColors();
});

function updateGlobalColors() {
    document.documentElement.style.setProperty('--primary-color', primaryColour);
    document.documentElement.style.setProperty('--secondary-color', secondaryColour);
}

function updateDotPattern() {
    const svgPattern = `
        <svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'>
            <rect x='0' y='0' width='2' height='2' fill='${primaryColour}' />
            <rect x='4' y='4' width='2' height='2' fill='${primaryColour}' />
        </svg>`;
    const encodedPattern = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgPattern)}")`;
    document.documentElement.style.setProperty('--dot-pattern', encodedPattern);
}

// Existing code for video processing and other functionalities
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const outputCanvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d');
const outputCtx = outputCanvas.getContext('2d');
const saveButton = document.getElementById('saveButton');
const patternSlider = document.getElementById('patternSlider');
const invertButton = document.getElementById('invertButton');

let patternInterval = parseInt(patternSlider.value);
let invertColours = false;

patternSlider.addEventListener('input', () => {
    patternInterval = parseInt(patternSlider.value);
});

invertButton.addEventListener('click', () => {
    invertColours = !invertColours;
});

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(err => {
        console.error("Error accessing the webcam: " + err);
    });

video.addEventListener('play', () => {
    const width = 320;
    const height = 240;
    canvas.width = width;
    canvas.height = height;
    outputCanvas.width = width;
    outputCanvas.height = height;

    function processFrame() {
        const width = canvas.width;
        const height = canvas.height;

        // Flip the image horizontally
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -width, 0, width, height);
        ctx.restore();

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const primaryColorRgb = hexToRgb(primaryColour);
        const secondaryColorRgb = hexToRgb(secondaryColour);

        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);

            if ((x % patternInterval === 0 && y % patternInterval === 0) ||
                ((x + 4) % patternInterval === 0 && (y + 4) % patternInterval === 0)) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                if (avg > 127) {
                    if (invertColours) {
                        data[i] = secondaryColorRgb.r;
                        data[i + 1] = secondaryColorRgb.g;
                        data[i + 2] = secondaryColorRgb.b;
                    } else {
                        data[i] = primaryColorRgb.r;
                        data[i + 1] = primaryColorRgb.g;
                        data[i + 2] = primaryColorRgb.b;
                    }
                } else {
                    if (invertColours) {
                        data[i] = primaryColorRgb.r;
                        data[i + 1] = primaryColorRgb.g;
                        data[i + 2] = primaryColorRgb.b;
                    } else {
                        data[i] = secondaryColorRgb.r;
                        data[i + 1] = secondaryColorRgb.g;
                        data[i + 2] = secondaryColorRgb.b;
                    }
                }
            } else {
                if (invertColours) {
                    data[i] = primaryColorRgb.r;
                    data[i + 1] = primaryColorRgb.g;
                    data[i + 2] = primaryColorRgb.b;
                } else {
                    data[i] = secondaryColorRgb.r;
                    data[i + 1] = secondaryColorRgb.g;
                    data[i + 2] = secondaryColorRgb.b;
                }
            }
        }

        outputCtx.putImageData(imageData, 0, 0);
        requestAnimationFrame(processFrame);
    }

    processFrame();
});

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function saveCanvasAsSVG() {
    const width = outputCanvas.width;
    const height = outputCanvas.height;
    const imageData = outputCtx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3] / 255;
            if (a > 0) {
                svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="rgba(${r},${g},${b},${a})" />\n`;
            }
        }
    }

    svg += '</svg>';

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pattern.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

saveButton.addEventListener('click', saveCanvasAsSVG);
