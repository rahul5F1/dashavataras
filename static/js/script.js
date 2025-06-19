// 3D tilt effect for all avatar cards
VanillaTilt.init(document.querySelectorAll(".avatar-img-container img[data-tilt]"), {
    max: 25,
    speed: 400,
    scale: 1.1,
    glare: true,
    "max-glare": 0.22,
});

// Ensure all avatar images have the same size
document.querySelectorAll(".avatar-card img").forEach(img => {
    img.style.objectFit = "cover";
    img.style.height = "220px";
    img.style.width = "220px";
    img.style.borderRadius = "20px";
});

// Modal open
function openModal(avatarName, avatarDesc, avatarBgImage) {
    document.getElementById("avatarNameText").textContent = avatarName;
    document.getElementById("modal-avatar-description").innerHTML = `<p data-raw="${avatarDesc}">${avatarDesc}</p>`;
    document.querySelector('.modal-content').style.backgroundImage = `url('/static/images/${avatarBgImage}')`;
    document.getElementById("avatarModal").style.display = "block";
}

// Modal close
function closeModal() {
    document.getElementById("avatarModal").style.display = "none";
    stopModalSpeech();
}

// Close on outside click
window.onclick = function (event) {
    if (event.target === document.getElementById("avatarModal")) {
        closeModal();
    }
};

// ===== Text-to-Speech with Polling Workaround =====
let modalChunks = [];
let modalIndex = 0;
let isModalSpeaking = false;
let modalPreviousVolume = null;
let speechPollingInterval = null;

function toggleModalSpeech() {
    const paragraphEl = document.querySelector("#modal-avatar-description p");
    const rawText = paragraphEl.getAttribute("data-raw");

    if (isModalSpeaking) {
        speechSynthesis.cancel();
        stopModalSpeech();
        return;
    }

    modalChunks = splitIntoChunks(rawText);
    modalIndex = 0;
    isModalSpeaking = true;

    // Lower background music
    if (window.bgAudio && !bgAudio.muted && bgAudio.volume > 0.15) {
        modalPreviousVolume = bgAudio.volume;
        bgAudio.volume = 0.15;
        const volBar = document.getElementById("volume-bar");
        if (volBar) {
            volBar.value = 15;
            volBar.title = "Volume: 15%";
        }
    }

    setTimeout(() => speakModalChunk(paragraphEl, rawText), 100);
    startPolling(paragraphEl, rawText);
}

function speakModalChunk(paragraphEl, fullText) {
    if (!isModalSpeaking || modalIndex >= modalChunks.length) {
        stopModalSpeech();
        return;
    }

    const chunk = modalChunks[modalIndex];
    highlightModalChunk(paragraphEl, fullText, chunk.start, chunk.end);

    const utterance = new SpeechSynthesisUtterance(chunk.text);
    utterance.rate = 0.95;
    speechSynthesis.cancel(); // Ensure clean start
    speechSynthesis.speak(utterance);
}

function startPolling(paragraphEl, fullText) {
    clearInterval(speechPollingInterval);
    speechPollingInterval = setInterval(() => {
        if (!speechSynthesis.speaking && !speechSynthesis.pending && isModalSpeaking) {
            modalIndex++;
            if (modalIndex < modalChunks.length) {
                speakModalChunk(paragraphEl, fullText);
            } else {
                stopModalSpeech();
            }
        }
    }, 500);
}

function stopModalSpeech() {
    isModalSpeaking = false;
    modalIndex = 0;
    clearInterval(speechPollingInterval);

    const paragraphEl = document.querySelector("#modal-avatar-description p");
    if (paragraphEl) {
        const raw = paragraphEl.getAttribute("data-raw");
        paragraphEl.innerHTML = raw;
        paragraphEl.setAttribute("data-raw", raw);
    }

    if (modalPreviousVolume !== null && window.bgAudio && !bgAudio.muted) {
        bgAudio.volume = modalPreviousVolume;
        const volBar = document.getElementById("volume-bar");
        if (volBar) {
            volBar.value = modalPreviousVolume * 100;
            volBar.title = `Volume: ${Math.round(modalPreviousVolume * 100)}%`;
        }
        modalPreviousVolume = null;
    }
}

function highlightModalChunk(paragraphEl, fullText, start, end) {
    const before = fullText.slice(0, start);
    const highlight = fullText.slice(start, end);
    const after = fullText.slice(end);
    paragraphEl.innerHTML = `${before}<span class="highlighted">${highlight}</span>${after}`;
    paragraphEl.setAttribute("data-raw", fullText);
}

function splitIntoChunks(text) {
    const regex = /[^.?!]+[.?!]+[\])'"`’”]*\s*/g;
    let match;
    const chunks = [];

    while ((match = regex.exec(text)) !== null) {
        chunks.push({
            start: match.index,
            end: match.index + match[0].length,
            text: match[0].trim()
        });
    }

    if (chunks.length === 0 || chunks[chunks.length - 1].end < text.length) {
        const lastStart = chunks.length ? chunks[chunks.length - 1].end : 0;
        chunks.push({
            start: lastStart,
            end: text.length,
            text: text.slice(lastStart).trim()
        });
    }

    return chunks;
}
