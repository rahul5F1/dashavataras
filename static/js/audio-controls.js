// Create a singleton <audio> element if not already created
if (!window.bgAudio) {
    window.bgAudio = document.createElement('audio');
    bgAudio.src = "/static/Background_score.mp3";
    bgAudio.loop = true;
    bgAudio.volume = 0.6;
    bgAudio.muted = false;

    // Restore last state
    const savedTime = localStorage.getItem('bgAudioTime');
    const savedVolume = localStorage.getItem('bgAudioVolume');
    const savedMuted = localStorage.getItem('bgAudioMuted') === 'true';
    const savedPaused = localStorage.getItem('bgAudioPaused') === 'true';

    if (savedTime) bgAudio.currentTime = parseFloat(savedTime);
    if (savedVolume) bgAudio.volume = parseFloat(savedVolume);
    if (savedMuted) bgAudio.muted = true;
    if (savedPaused) bgAudio.pause();

    document.body.appendChild(bgAudio);

    // Try to play immediately (unmuted autoplay might be blocked)
    bgAudio.play().catch((err) => {
        console.warn("Autoplay blocked:", err);
    });
}

// Save state before unload
window.addEventListener('beforeunload', () => {
    localStorage.setItem('bgAudioTime', bgAudio.currentTime);
    localStorage.setItem('bgAudioVolume', bgAudio.volume);
    localStorage.setItem('bgAudioMuted', bgAudio.muted);
    localStorage.setItem('bgAudioPaused', bgAudio.paused);
});

// Audio UI injection
window.addEventListener("DOMContentLoaded", () => {
    const controlHTML = `
        <div class="audio-controls" onmouseenter="showControls()" onmouseleave="hideControls()">
            <div class="control-main">
                <span id="toggle-mute" title="Mute/Unmute">${bgAudio.muted ? "🔇" : "🔊"}</span>
            </div>
            <div class="control-expanded" style="display: none;">
                <input type="range" id="volume-bar" min="0" max="100" value="${bgAudio.volume * 100}" title="Volume: ${Math.round(bgAudio.volume * 100)}%">
                <div class="control-buttons">
                    <button id="toggle-play" title="Pause/Play">${bgAudio.paused ? "▶️" : "⏸️"}</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", controlHTML);

    // Mute/unmute toggle
    document.getElementById("toggle-mute").addEventListener("click", () => {
        bgAudio.muted = !bgAudio.muted;
        document.getElementById("toggle-mute").textContent = bgAudio.muted ? "🔇" : "🔊";
    });

    // Play/pause toggle
    document.getElementById("toggle-play").addEventListener("click", () => {
        if (bgAudio.paused) {
            bgAudio.play();
            document.getElementById("toggle-play").textContent = "⏸️";
        } else {
            bgAudio.pause();
            document.getElementById("toggle-play").textContent = "▶️";
        }
    });

    // Volume slider
    document.getElementById("volume-bar").addEventListener("input", (e) => {
        const val = e.target.value;
        bgAudio.volume = val / 100;
        document.getElementById("volume-bar").title = `Volume: ${val}%`;
    });
});

// Hover effect for controls
function showControls() {
    document.querySelector(".control-expanded").style.display = "flex";
}
function hideControls() {
    document.querySelector(".control-expanded").style.display = "none";
}

// ===== Handle TTS volume interaction across all pages =====
const originalVolume = localStorage.getItem('bgAudioVolume') ? parseFloat(localStorage.getItem('bgAudioVolume')) : 0.6;

function lowerBGVolumeDuringTTS() {
    if (!bgAudio.paused && bgAudio.volume > 0.15) {
        bgAudio.volume = 0.15;
        document.getElementById("volume-bar").value = 15;
    }
}

function restoreBGVolumeAfterTTS() {
    if (!bgAudio.paused) {
        const restore = originalVolume >= 0.15 ? originalVolume : 0.6;
        bgAudio.volume = restore;
        document.getElementById("volume-bar").value = restore * 100;
    }
}

// Listen for speech synthesis events
if ('speechSynthesis' in window) {
    const originalSpeak = window.speechSynthesis.speak;
    window.speechSynthesis.speak = function (utterance) {
        lowerBGVolumeDuringTTS();

        utterance.onend = () => {
            restoreBGVolumeAfterTTS();
        };

        utterance.onerror = () => {
            restoreBGVolumeAfterTTS();
        };

        originalSpeak.call(window.speechSynthesis, utterance);
    };
}
