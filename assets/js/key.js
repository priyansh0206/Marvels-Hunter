// key.js
const publicKey = 'c2fe8ba050bcef541c9007527c79d8eb';
const privateKey = '5feaa4b48c9c3e69d89c19a199784ee815d1aa5c';

// Function to generate a timestamp
function generateTimestamp() {
    return new Date().getTime();
}

// Function to generate the MD5 hash
function generateHash(timestamp) {
    const hash = CryptoJS.MD5(`${timestamp}${privateKey}${publicKey}`).toString();
    return hash;
}

export const ts = generateTimestamp();
export const hash = generateHash(ts);