const FigmaAPI = window.FIGMA_API_KEY;
const Google_sheet_API = window.GOOGLE_SHEET_API_KEY;

// float effect
window.addEventListener('load', function () {
    document.querySelector('.content').classList.add('show');
});


// scroll more 
window.addEventListener('scroll', function() {
    document.querySelector('.go-for-more').classList.add('hidden');
});

// typing animation 
document.addEventListener('DOMContentLoaded', function() {
    const texts = [
        "Frontend Developer",
        "UX/UI Designer",
        "Web Developer",
    ];

    let index = 0;
    let charIndex = 0;
    const typingSpeed = 50; // Adjust typing speed
    const erasingSpeed = 40; // Adjust erasing speed
    const newTextDelay = 1000; // Delay between texts
    const typingText = document.getElementById('typing-text');

    function type() {
        if (charIndex < texts[index].length) {
            typingText.textContent += texts[index].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typingText.textContent = texts[index].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            index++;
            if (index >= texts.length) index = 0;
            setTimeout(type, typingSpeed + 1100);
        }
    }

    setTimeout(type, newTextDelay + 250);
});


// thoughts of the day by google sheets
// Replace with your Google Sheets API key and Sheet ID

const SHEET_ID = '12HX0YN16Y6IKaH3edSjX26lwdxWPPutc_BeaMqZpCHU';
const RANGE = 'Sheet1!A2:A16'; // Adjust the range to the entire column containing quotes

async function fetchSheetData() {
    try {
        // Fetch all data from the specified column
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${Google_sheet_API}`);
        const data = await response.json();
        
        // Extract all values from the response
        const values = data.values;
        if (values && values.length > 0) {
            // Randomly select a value from the column
            const randomIndex = Math.floor(Math.random() * values.length);
            const randomValue = values[randomIndex][0];

            // Display the randomly selected value in the paragraph tag
            document.getElementById('sheet-data').textContent = randomValue;
        } else {
            document.getElementById('sheet-data').textContent = 'No data found.';
        }
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        document.getElementById('sheet-data').textContent = 'Error fetching data.';
    }
}

document.addEventListener('DOMContentLoaded', fetchSheetData);

// pdf show button function
function openPDF() {
    // URL of your PDF file
    var pdfUrl = 'images/resume.pdf';
    
    // Open a new window/tab with the PDF
    window.open(pdfUrl, '_blank');
}

// hire me button pop up and close
document.getElementById('hireMeBtn').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'flex';
});

document.getElementById('closeBtn').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
});

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Thank you for your submission!');
    document.getElementById('popup').style.display = 'none';
});


// CARD MOVEEMTNS IN THIRD PAGE

let currentCardIndex = 0;

async function likeCard(button) {
    const card = button.closest('.card');
    const cardId = card.dataset.id;
    const likesCount = card.querySelector('.likes-count');

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzY_tJ-7GNuHm_M0e2FdZbe3CrOfjHH5nAuvs_iOkv-v0vwvzKIvHpN9Hy-xUe1jLppAg/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cardId }),
        });

        const result = await response.json();
        if (result.status === 'success') {
            let count = parseInt(likesCount.textContent, 10);
            likesCount.textContent = ++count;
            button.disabled = true; // Disable the like button after clicking
        } else {
            console.error('Failed to record like');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function moveCards(direction) {
    const cards = document.querySelector('.cards');
    const cardWidth = document.querySelector('.card').offsetWidth;
    const containerWidth = document.querySelector('.cards').offsetWidth;

    if (direction === 'left') {
        currentCardIndex = Math.max(currentCardIndex - 1, 0);
    } else {
        const maxIndex = cards.children.length - Math.floor(containerWidth / cardWidth);
        currentCardIndex = Math.min(currentCardIndex + 1, maxIndex);
    }

    const newScrollPosition = currentCardIndex * cardWidth;
    cards.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
    });
}

document.querySelector('.cards').addEventListener('touchstart', handleTouchStart, false);
document.querySelector('.cards').addEventListener('touchmove', handleTouchMove, false);

let xDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
}

function handleTouchMove(evt) {
    if (!xDown) {
        return;
    }

    let xUp = evt.touches[0].clientX;
    let xDiff = xDown - xUp;

    if (xDiff > 0) {
        moveCards('right');
    } else {
        moveCards('left');
    }

    xDown = null;
}

function toggleMenu() {
    var menu = document.getElementById('menu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}




function getFigmaThumb(fileID, elementID) {
    async function fetchFigmaThumbnail() {
        const response = await fetch(`https://api.figma.com/v1/files/${fileID}`, {
            method: 'GET',
            headers: {
                'X-Figma-Token': FigmaAPI
            }
        });

        const data = await response.json();
        const thumbnailUrl = data.thumbnailUrl;

        const thumbnailContainer = document.getElementById(elementID);
        const thumbnailImg = document.createElement('img');
        thumbnailImg.src = thumbnailUrl;
        thumbnailImg.alt = 'Figma Project Thumbnail';
        thumbnailImg.className = 'thumbnail';
        thumbnailImg.onclick = openFigmaModal;
        thumbnailContainer.appendChild(thumbnailImg);
    }

    function openFigmaModal() {
        const figmaModal = document.getElementById('figmaModal');
        const figmaIframe = document.getElementById('figma-iframe');
        figmaIframe.src = `https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/${fileID}`;
        figmaModal.style.display = 'block';
    }

    document.addEventListener('DOMContentLoaded', fetchFigmaThumbnail);
}

const JalanTech = 'NFoV9L17zpsSevLnzWBqRX'; // element id = jalan
const momRest = 'hQt4uMsCLeuh4tZUA2T2Nq'; // element id = mom
const bvm = 'cImPfKpLEBn4B4zsPO53Mn'; // element id = bvm
const smartBoot = 'mhPEHkUWrRGyd6Fi8v0n1t'; // element id = smartBoot

getFigmaThumb(JalanTech, "jalan");
getFigmaThumb(momRest, "mom");
getFigmaThumb(bvm, "bvm");
getFigmaThumb(smartBoot, "smartBoot");

function closeFigmaModal() {
    document.getElementById('figmaModal').style.display = 'none';
}