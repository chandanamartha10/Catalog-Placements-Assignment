const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'polynomial_data.json');

// Function to decode a value from a given base
function decodeValue(value, base) {
    return parseInt(value, base);
}

// Function to perform Lagrange interpolation
function lagrangeInterpolation(points) {
    const k = points.length;
    let result = 0;

    for (let i = 0; i < k; i++) {
        const { x: xi, y: yi } = points[i];
        let li = 1;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                const xj = points[j].x;
                li *= (0 - xj) / (xi - xj);
            }
        }
        result += yi * li;
    }

    return result;
}

// Function to extract points from the input object
function extractPointsFromInput(input) {
    const points = [];
    const { keys } = input;

    for (const key in input) {
        if (key !== "keys") {
            const x = parseInt(key);
            const base = parseInt(input[key].base);
            const value = input[key].value;
            const y = decodeValue(value, base);

            points.push({ x, y });
        }
    }

    return points;
}

// Function to calculate the secret using Lagrange interpolation
function calculateSecret(input) {
    const points = extractPointsFromInput(input);
    const { k } = input.keys;

    if (points.length < k) {
        throw new Error('Not enough points provided');
    }

    return lagrangeInterpolation(points.slice(0, k));
}

// Read the JSON file and process the data
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the JSON file:', err);
        return;
    }

    try {
        const inputData = JSON.parse(data);
        const secret = calculateSecret(inputData);
        console.log("The constant term 'c' of the polynomial is:", secret);
    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});
