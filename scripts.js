// Constants
const width = 384;
const height = 216;

// Matrices (In the future, storing these in a texture might be better)
const bayerMatrix4x4 = [[.0, .5, .125, .625], [.75, .25, .875, .375], [.1875, .6875, .0625, .5625], [.9375, .4375, .8125, .3125]];
const bayerMatrix8x8 = [[.0, .5, .125, .625, .03125, .53125, .15625, .65625], [.75, .25, .875, .375, .78125, .28125, .90625, .40625], [.1875, .6875, .0625, .5625, .21875, .71875, .09375, .59375], [.9375, .4375, .8125, .3125, .96875, .46875, .84375, .34375], [.046875, .546875, .171875, .671875, .015625, .515625, .140625, .640625], [.796875, .296875, .921875, .421875, .765625, .265625, .890625, .390625], [.234375, .734375, .109375, .609375, .203125, .703125, .078125, .578125], [.984375, .484375, .859375, .359375, .953125, .453125, .828125, .328125]];

// HTML elements
const primaryColorPicker = document.getElementById('primaryColorPicker');
const secondaryColorPicker = document.getElementById('secondaryColorPicker');
const flipButton = document.getElementById('flipButton');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', {alpha: false, willReadFrequently: true});
const saveButton = document.getElementById('saveButton');
const patternSlider = document.getElementById('patternSlider');
const invertButton = document.getElementById('invertButton');
const ditherSelection = document.getElementById('ditherSelection');

// Settings
let primaryColorRgb = hexToRgb(primaryColorPicker.value);
let secondaryColorRgb = hexToRgb(secondaryColorPicker.value);
let patternInterval = parseInt(patternSlider.value);
let invertColours = false;
let flipImage = false;
canvas.width = width;
canvas.height = height;

// Event listeners
primaryColorPicker.addEventListener('input', () => {
    document.documentElement.style.setProperty('--primary-color', primaryColorPicker.value);
    const svgPattern = `
        <svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'>
            <rect x='0' y='0' width='2' height='2' fill='${primaryColorPicker.value}' />
            <rect x='4' y='4' width='2' height='2' fill='${primaryColorPicker.value}' />
        </svg>`;
    const encodedPattern = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgPattern)}")`;
    document.documentElement.style.setProperty('--dot-pattern', encodedPattern);
    primaryColorRgb = hexToRgb(primaryColorPicker.value);
});

secondaryColorPicker.addEventListener('input', () => {
    document.documentElement.style.setProperty('--secondary-color', secondaryColorPicker.value);
    secondaryColorRgb = hexToRgb(secondaryColorPicker.value);
});

patternSlider.addEventListener('input', () => patternInterval = parseInt(patternSlider.value));
invertButton.addEventListener('click', () => invertColours = !invertColours);
flipButton.addEventListener('click', () => flipImage = !flipImage);
video.addEventListener('play', processFrame);
saveButton.addEventListener('click', saveCanvasAsSVG);

// Get webcam feed
navigator.mediaDevices.getUserMedia({video: true})
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(err => {
        console.error("Error accessing the webcam: " + err);
    });

// Process each frame of the webcam feed
function processFrame() {
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

    // Greyscale the image using the luminance formula for sRGB
    const greyscaleData = new Float32Array(width * height);
    for (let i = 0; i < data.length; i += 4) {
        greyscaleData[i >>> 2] = .2126 * data[i] / 255 + .7152 * data[i + 1] / 255 + .0722 * data[i + 2] / 255;
    }

    function getPixelQuantised(x, y) {
        const i = y * width + x;
        switch (ditherSelection.value) {
            case 'none':
                return greyscaleData[i] > .5;
            case 'random':
                return greyscaleData[i] > Math.random();
            case 'ign':
                return greyscaleData[i] > 52.9829189 * ((.06711056 * x + .00583715 * y) % 1) % 1;
            case 'bayer4x4':
                return applyOrderedDithering(x, y, i, bayerMatrix4x4);
            case 'bayer8x8':
                return applyOrderedDithering(x, y, i, bayerMatrix8x8);
            case 'stucki':
                return applyStuckiDithering(x, y, i);
            case 'sierra':
                return applySierraDithering(x, y, i);
            case 'floydSteinberg':
                return applyFloydSteinbergDithering(x, y, i);
        }
    }

    function applyOrderedDithering(x, y, i, matrix) {
        // The following two lines kind of fix ordered dithering for patternInterval > 1
        // x = Math.floor(x / patternInterval);
        // y = Math.floor(y / patternInterval);
        return greyscaleData[i] > matrix[x & (matrix.length - 1)][y & (matrix.length - 1)];
    }

    function applyStuckiDithering(x, y, i) {
        const oldPixel = greyscaleData[i];
        const newPixel = Math.round(oldPixel);
        const error = oldPixel - newPixel;

        if (x + 1 < width) greyscaleData[i + 1] += error * 8 / 42;
        if (x + 2 < width) greyscaleData[i + 2] += error * 4 / 42;
        if (y + 1 < height) {
            greyscaleData[i + width - 2] += error * 2 / 42;
            greyscaleData[i + width - 1] += error * 4 / 42;
            greyscaleData[i + width] += error * 8 / 42;
            greyscaleData[i + width + 1] += error * 4 / 42;
            greyscaleData[i + width + 2] += error * 2 / 42;
        }
        if (y + 2 < height) {
            greyscaleData[i + width * 2 - 1] += error / 42;
            greyscaleData[i + width * 2] += error * 2 / 42;
            greyscaleData[i + width * 2 + 1] += error / 42;
        }
        return newPixel === 1;
    }

    function applySierraDithering(x, y, i) {
        const oldPixel = greyscaleData[i];
        const newPixel = Math.round(oldPixel);
        const error = oldPixel - newPixel;

        if (x + 1 < width) greyscaleData[i + 1] += error * 5 / 32;
        if (x + 2 < width) greyscaleData[i + 2] += error * 3 / 32;
        if (y + 1 < height) {
            greyscaleData[i + width - 2] += error * 2 / 32;
            greyscaleData[i + width - 1] += error * 4 / 32;
            greyscaleData[i + width] += error * 5 / 32;
            greyscaleData[i + width + 1] += error * 4 / 32;
            greyscaleData[i + width + 2] += error * 2 / 32;
        }
        if (y + 2 < height) {
            greyscaleData[i + width * 2 - 1] += error * 2 / 32;
            greyscaleData[i + width * 2] += error * 3 / 32;
            greyscaleData[i + width * 2 + 1] += error * 2 / 32;
        }
        return newPixel === 1;
    }

    function applyFloydSteinbergDithering(x, y, i) {
        const oldPixel = greyscaleData[i];
        const newPixel = Math.round(oldPixel);
        const error = oldPixel - newPixel;

        if (x + 1 < width) greyscaleData[i + 1] += error * 7 / 16;
        if (x - 1 >= 0 && y + 1 < height) greyscaleData[i + width - 1] += error * 3 / 16;
        if (y + 1 < height) greyscaleData[i + width] += error * 5 / 16;
        if (x + 1 < width && y + 1 < height) greyscaleData[i + width + 1] += error / 16;

        return newPixel === 1;
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            if (invertColours ^ getPixelQuantised(x, y) && ((x % patternInterval === 0 && y % patternInterval === 0) || ((x + 4) % patternInterval === 0 && (y + 4) % patternInterval === 0))) {
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

    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(processFrame);
}

// Helper functions
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255
    };
}

function saveCanvasAsSVG() {
    const imageData = ctx.getImageData(0, 0, width, height);
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
