// Elements
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const translateBtn = document.getElementById("translateBtn");

const sourceLangSpecific = document.getElementById("sourceLangSpecific");
const targetLang = document.getElementById("targetLang");

const swapBtn = document.getElementById("swapBtn");
const loadingSpinner = document.getElementById("loadingSpinner");
const inputCounter = document.getElementById("inputCounter");

// -----------------------
// Character counter update
inputText.addEventListener("input", ()=>{
    inputCounter.textContent = `${inputText.value.length} / 500`;
    debounceTranslate();
});

// -----------------------
// Translation function
function translateText(){
    const text = inputText.value.trim();
    if(!text){
        outputText.value = "";
        return;
    }

    let source = sourceLangSpecific.value;
    let target = targetLang.value;

    if(source === target){
        alert("PLEASE SELECT TWO DISTINCT LANGUAGES");
        return;
    }

    // Show spinner
    loadingSpinner.style.display = "block";

    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`)
    .then(res => res.json())
    .then(data => {
        outputText.value = data.responseData.translatedText;
    })
    .catch(err => {
        console.error("Translation failed", err);
        outputText.value = "";
    })
    .finally(() => {
        // Hide spinner
        loadingSpinner.style.display = "none";
    });
}

// -----------------------
// Debounce utility
let debounceTimer;
function debounceTranslate(delay = 500){
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(translateText, delay);
}

// -----------------------
// Buttons
translateBtn.addEventListener("click", translateText);

swapBtn.addEventListener("click", ()=>{
    let temp = sourceLangSpecific.value;
    sourceLangSpecific.value = targetLang.value;
    targetLang.value = temp;
    translateText();
});

// Copy buttons
document.getElementById("copyInput").onclick = ()=>{
    navigator.clipboard.writeText(inputText.value);
};
document.getElementById("copyOutput").onclick = ()=>{
    navigator.clipboard.writeText(outputText.value);
};

// Text-to-speech
function speak(text, lang){
    if(!text.trim()) return;
    const speech = new SpeechSynthesisUtterance(text);
    let voices = speechSynthesis.getVoices();
    let voice = voices.find(v=>v.lang.startsWith(lang)) || null;
    if(voice) speech.voice = voice;
    speech.rate = 1.0;
    speech.pitch = 1.0;
    speech.lang = lang;
    speechSynthesis.speak(speech);
}

document.getElementById("listenInput").onclick = ()=>{
    speak(inputText.value, sourceLangSpecific.value);
};
document.getElementById("listenOutput").onclick = ()=>{
    speak(outputText.value, targetLang.value);
};

// Dark / Light mode toggle
const modeToggle = document.getElementById("modeToggle");
modeToggle.addEventListener("click", ()=>{
    document.body.classList.toggle("dark-mode");
    modeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// -----------------------
// On page load: default text & translation
window.onload = () => {
    inputText.value = "How are you";
    sourceLangSpecific.value = "en";
    targetLang.value = "fr";
    inputCounter.textContent = `${inputText.value.length} / 500`;
    translateText();
};