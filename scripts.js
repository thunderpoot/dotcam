const primaryColorPicker = document.getElementById('primaryColorPicker');
const secondaryColorPicker = document.getElementById('secondaryColorPicker');
const flipButton = document.getElementById('flipButton');

let flipImage = true;
let primaryColour = primaryColorPicker.value;
let secondaryColour = secondaryColorPicker.value;

const bayerMatrix4x4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

const bayerMatrix8x8 = [[0, 48, 12, 60, 3, 51, 15, 63], [32, 16, 44, 28, 35, 19, 47, 31], [8, 56, 4, 52, 11, 59, 7, 55], [40, 24, 36, 20, 43, 27, 39, 23], [2, 50, 14, 62, 1, 49, 13, 61], [34, 18, 46, 30, 33, 17, 45, 29], [10, 58, 6, 54, 9, 57, 5, 53], [42, 26, 38, 22, 41, 25, 37, 21]];

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
const ditherSelection = document.getElementById('ditherSelection');

let patternInterval = parseInt(patternSlider.value);
let invertColours = false;

patternSlider.addEventListener('input', () => {
    patternInterval = parseInt(patternSlider.value);
});

invertButton.addEventListener('click', () => {
    invertColours = !invertColours;
});

flipButton.addEventListener('click', () => {
    flipImage = !flipImage;
});

navigator.mediaDevices.getUserMedia({video: true})
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

        ctx.save();
        if (flipImage) {
            ctx.scale(-1, 1);
            ctx.drawImage(video, -width, 0, width, height);
        } else {
            ctx.drawImage(video, 0, 0, width, height);
        }
        ctx.restore();

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const primaryColorRgb = hexToRgb(primaryColour);
        const secondaryColorRgb = hexToRgb(secondaryColour);

        function getThreshold(x, y) {
            switch (ditherSelection.value) {
                case 'none':
                    return 127;
                case 'random':
                    return Math.random() * 255;
                case 'ign':
                    return Math.floor(((52.9829189 * ((.06711056 * x + .00583715 * y) % 1)) % 1) * 255);
                case 'bayer4x4':
                    if (Number.isFinite(x) && Number.isFinite(y)) {
                        const modX = Math.floor(x) % 4;
                        const modY = Math.floor(y) % 4;
                        if (bayerMatrix4x4[modY] && bayerMatrix4x4[modY][modX] !== undefined) {
                            return bayerMatrix4x4[modY][modX] * 16;
                        } else {
                            // Invalid bayerMatrix4x4 access
                            return 127;
                        }
                    } else {
                        // Invalid coordinates
                        return 127;
                    }
                case 'bayer8x8':
                    if (Number.isFinite(x) && Number.isFinite(y)) {
                        const modX = Math.floor(x) % 8;
                        const modY = Math.floor(y) % 8;
                        if (bayerMatrix8x8[modY] && bayerMatrix8x8[modY][modX] !== undefined) {
                            return bayerMatrix8x8[modY][modX] * 4;
                        } else {
                            // Invalid bayerMatrix8x8 access
                            return 127;
                        }
                    } else {
                        // Invalid coordinates
                        return 127;
                    }
                case 'stucki':
                    return applyStuckiDithering(x, y, data, width, height);
                case 'sierra':
                    return applySierraDithering(x, y, data, width, height);
                case 'floydSteinberg':
                    return applyFloydSteinbergDithering(x, y, data, width, height);
            }
        }

        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);

            if ((x % patternInterval === 0 && y % patternInterval === 0) ||
                ((x + 4) % patternInterval === 0 && (y + 4) % patternInterval === 0)) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                if (avg > getThreshold(x / patternInterval, y / patternInterval)) {
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

function applyStuckiDithering(x, y, data, width, height) {
    const idx = (y * width + x) * 4;
    const oldPixel = data[idx];
    const newPixel = oldPixel < 128 ? 0 : 255;
    const error = oldPixel - newPixel;

    if (x + 1 < width) data[idx + 4] += (error * 8) / 42;
    if (x + 2 < width) data[idx + 8] += (error * 4) / 42;
    if (y + 1 < height) {
        data[idx + width * 4 - 8] += (error * 2) / 42;
        data[idx + width * 4 - 4] += (error * 4) / 42;
        data[idx + width * 4] += (error * 8) / 42;
        data[idx + width * 4 + 4] += (error * 4) / 42;
        data[idx + width * 4 + 8] += (error * 2) / 42;
    }
    if (y + 2 < height) {
        data[idx + width * 8 - 4] += (error * 1) / 42;
        data[idx + width * 8] += (error * 2) / 42;
        data[idx + width * 8 + 4] += (error * 1) / 42;
    }
    return newPixel;
}

function applySierraDithering(x, y, data, width, height) {
    const idx = (y * width + x) * 4;
    const oldPixel = data[idx];
    const newPixel = oldPixel < 128 ? 0 : 255;
    const error = oldPixel - newPixel;

    if (x + 1 < width) data[idx + 4] += (error * 5) / 32;
    if (x + 2 < width) data[idx + 8] += (error * 3) / 32;
    if (y + 1 < height) {
        data[idx + width * 4 - 8] += (error * 2) / 32;
        data[idx + width * 4 - 4] += (error * 4) / 32;
        data[idx + width * 4] += (error * 5) / 32;
        data[idx + width * 4 + 4] += (error * 4) / 32;
        data[idx + width * 4 + 8] += (error * 2) / 32;
    }
    if (y + 2 < height) {
        data[idx + width * 8 - 4] += (error * 2) / 32;
        data[idx + width * 8] += (error * 3) / 32;
        data[idx + width * 8 + 4] += (error * 2) / 32;
    }
    return newPixel;
}

function applyFloydSteinbergDithering(x, y, data, width, height) {
    const idx = (y * width + x) * 4;
    const oldPixel = data[idx];
    const newPixel = oldPixel < 128 ? 0 : 255;
    const error = oldPixel - newPixel;

    if (x + 1 < width) data[idx + 4] += (error * 7) / 16;
    if (x - 1 >= 0 && y + 1 < height) data[idx + width * 4 - 4] += (error * 3) / 16;
    if (y + 1 < height) data[idx + width * 4] += (error * 5) / 16;
    if (x + 1 < width && y + 1 < height) data[idx + width * 4 + 4] += (error * 1) / 16;

    return newPixel;
}

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

    const blob = new Blob([svg], {type: 'image/svg+xml'});
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
