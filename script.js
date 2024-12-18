// Placeholder for messages
let studentMessages = [];
let currentMessageIndex = 0;



// HTML Elements
const consoleElement = document.getElementById('console');
const nextButton = document.getElementById('nextButton');

// Matrix Background Effect (no changes made)
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrixChars = "abcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()";
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(0);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff00";
    ctx.font = `${fontSize}px Courier`;

    drops.forEach((y, i) => {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        const x = i * fontSize;

        ctx.fillText(text, x, y * fontSize);

        if (y * fontSize > canvas.height || Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    });
}

// Start Matrix Animation
setInterval(drawMatrix, 30);

// Fetch Messages from Google Sheets
// Global Variables
const sheetURL = "https://corsproxy.io/?https://docs.google.com/spreadsheets/d/e/2PACX-1vTXUlq43pz87Wd3S9GZD-fZR3LJh3fJjNG37Zdppajun6JTG-O0DsJ4n8DnOXQC-Ek2d9FbbsH9RZs8/pub?output=csv";
let messages = [];
let currentIndex = 0;




// Fetch messages from Google Sheets
async function fetchMessages() {
    try {
        const response = await fetch(sheetURL);
        const csvData = await response.text();

        Papa.parse(csvData, {
            header: false, // Set to false if no column headers
            skipEmptyLines: true,
            complete: function(results) {
                const rows = results.data.slice(1); // Skip header row
                messages = rows.map(row => {
                    const name = row[1]?.trim(); // Name
                    const surname = row[2]?.trim(); // Surname
                    const message = row[3]?.trim(); // Message
                    return message ? `'${message}' - ${name} ${surname}` : null;
                }).filter(msg => msg !== null);

                displayMessage(); // Show the first message
            }
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        consoleElement.innerText = "Failed to load messages.";
    }
}


// Display Message Immediately
function displayMessage() {
    if (messages.length > 0) {
        typewriterEffect(messages[currentIndex]);
    } else {
        consoleElement.textContent = "No messages available.";
    }
}

let typewriterInterval; // Declare the interval globally

function typewriterEffect(message) {
    // Clear any existing interval before starting a new one
    if (typewriterInterval) {
        clearInterval(typewriterInterval);
    }

    consoleElement.textContent = ""; // Clear previous message
    let i = 0;

    // Start the typewriter effect
    typewriterInterval = setInterval(() => {
        consoleElement.textContent += message.charAt(i);
        consoleElement.scrollTop = consoleElement.scrollHeight; // Auto-scroll
        i++;
        if (i === message.length) {
            clearInterval(typewriterInterval); // Clear the interval when done
        }
    }, 30);
}

// Next Button Logic
nextButton.addEventListener('click', () => {
    if (messages.length > 0) {
        // Stop current typewriter effect if any
        if (typewriterInterval) {
            clearInterval(typewriterInterval);
        }
        // Show the next message
        currentIndex = (currentIndex + 1) % messages.length; // Loop back to start
        displayMessage();
    }
});

// Dynamically create the Previous button
if (!document.getElementById("prevButton")) { // Check if button already exists
    const prevButton = document.createElement("button");
    prevButton.id = "prevButton";
    prevButton.textContent = "Previous";

    // Insert the Previous button before the Next button
    nextButton.parentNode.insertBefore(prevButton, nextButton);

    // Previous button logic
    prevButton.addEventListener("click", () => {
        if (messages.length > 0) {
            currentIndex = (currentIndex - 1 + messages.length) % messages.length; // Wrap to the last if at the first message
            displayMessage();
        }
    });
}


// Insert the Previous button before the Next button
nextButton.parentNode.insertBefore(prevButton, nextButton);

// Prevent overlapping typewriter effects
let typingInterval = null;

// Update the typewriter effect to clear old intervals
function typewriterEffect(message) {
    consoleElement.textContent = ""; 
    let i = 0;

    clearInterval(typingInterval); // Clear any previous typing effect

    typingInterval = setInterval(() => {
        consoleElement.textContent += message.charAt(i);
        i++;
        if (i === message.length) clearInterval(typingInterval);
    }, 30);
}

// Previous button logic
prevButton.addEventListener("click", () => {
    if (messages.length > 0) {
        currentIndex = (currentIndex - 1 + messages.length) % messages.length; // Wrap to the last if at the first message
        displayMessage();
    }
});

// Update the existing displayMessage function
function displayMessage() {
    if (messages.length > 0) {
        typewriterEffect(messages[currentIndex]);
    } else {
        consoleElement.textContent = "No messages available.";
    }
}



// Fetch messages on page load
fetchMessages();

