const surah_num = document.getElementById("surah_num");
const ayah_num = document.getElementById("ayah_num");
const load__btn = document.getElementById("load__btn");
const next_num = document.getElementById("next__btn");
const prev__btn = document.getElementById("prev__btn");
let ayat__list = document.getElementById("ayat__list");
let surah_list = document.getElementById("surah_list");
const title__eng = document.getElementById("title__eng");
const title__arb = document.getElementById("title__arb");
const surah_info = document.getElementById("surah_info");
const language = document.getElementById("language");
const searchBox = document.getElementById('surah_search');
const suggestions = document.getElementById('suggestions');

let surahNumber = surah_num.value;
let ayahNumber = ayah_num.value;

let quran = null;

window.onload = async () => {
    await loadQuran();
    showSurahList();
    loadAndShow(surahNumber, ayahNumber);

    // ------------------- Search Box ---------------------------------------

    // 🔹 Load surah data into an array on page load
    const surahList = Object.values(quran).map(surah => ({
        id: surah.number,
        name: surah.number + " . " + surah.englishName
    }));

    // Search input listener
    searchBox.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        suggestions.innerHTML = ''; // clear old suggestions

        if (query.length === 0) {
            suggestions.style.display = 'none';
            return;
        }

        // Filter surahs
        const matches = surahList.filter(surah =>
            surah.name.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            suggestions.style.display = 'none';
            return;
        }

        // Show matches
        matches.forEach(surah => {
            const li = document.createElement('li');
            li.textContent = surah.name;
            li.dataset.id = surah.id;
            li.onclick = function () {
                console.log(surah.id)
                loadAndShow(surah.id);
                surah_num.value = surah.id;
                searchBox.value = ''; // clear search box
                suggestions.style.display = 'none'; // hide suggestions
            };
            suggestions.appendChild(li);
        });

        suggestions.style.display = 'block';
    });

    // ------------------------ End ---------------------------------
    // ---------------------- Surah Side Bar ------------------------
    function showSurahList() {
        for (let surah of Object.values(quran)) {
            let li = document.createElement("li");
            li.innerText = surah.number + " . " + surah.englishName;
            li.dataset.id = surah.number;

            li.onclick = function (e) {
                loadAndShow(surah.number);
                surah_num.value = surah.number;
            }

            surah_list.append(li);
        }
    }

    // ------------------------ End -------------------------------------
}

async function loadQuran() {
    const response = await fetch("assets/quran.json");
    quran = await response.json();
}

load__btn.onclick = (e) => {
    let surahNumber = surah_num.value;
    let ayahNumber = ayah_num.value;

    if (surahNumber === "" || surahNumber <= 0 || surahNumber > 114) {
        alert("Invalid Surah Number! please input from 1 to 114.")
        return
    }

    loadAndShow(surahNumber, ayahNumber);
}

next_num.onclick = () => {

    surahNumber = surah_num.value;
    ayahNumber = ayah_num.value;

    if (surahNumber == 114) {
        surahNumber = 0;
    }
    surah_num.value = ++surahNumber;
    loadAndShow(surahNumber, ayahNumber);
}

prev__btn.onclick = () => {

    surahNumber = surah_num.value;
    ayahNumber = ayah_num.value;

    if (surahNumber == 1) {
        surahNumber = 115;
    }
    surah_num.value = --surahNumber;
    loadAndShow(surahNumber, ayahNumber);
}

function loadAndShow(surahNumber, ayahNumber) {
    let lang = language.value;
    let surah = quran[surahNumber];

    title__eng.innerText = surah.englishName + " (" + surah.englishNameTranslation + ")";
    title__arb.innerText = surah.name;
    surah_info.innerText = Object.keys(surah.ayahs).length + " Ayahs, " + surah.revelationType

    if (ayahNumber < 1 || ayahNumber > Object.keys(surah.ayahs).length) {
        alert("Invalid Ayah Number!")
    }

    if (ayahNumber > 1) {
        let ayah = surah.ayahs[ayahNumber];
        showAyah(ayah, lang);
    } else {
        showAyah(surah, lang);
    }
}

function showAyah(data, lang) {
    console.log(data)
    ayat__list.innerHTML = "";

    // Normalize: wrap single ayah in an array
    const ayahs = data.ayahs ? Object.values(data.ayahs) : [data];

    ayahs.forEach(ayah => {
        const text = lang === "arb" ? ayah.text : ayah.engText;
        const tag = createLiTag("li", lang === 'eng' ? "eng__ayah" : "arb__ayah", text, ayah.number, lang);

        if (lang === "arb" && ayah.audio) {
            tag.append(createAudioTag(ayah.audio));
        }

        ayat__list.append(tag);
    });
}

// 🔹 Helper for audio creation
let currentAudio = null; // keep track of the playing audio

function createAudioTag(src) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("audio");

    const audio = document.createElement("audio");
    audio.src = src;

    const btn = document.createElement("button");
    btn.innerText = "▶️";
    btn.classList.add("play-btn");

    // toggle play/pause
    btn.addEventListener("click", () => {
        // stop any currently playing audio
        if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
            currentAudio.parentElement.querySelector(".play-btn").innerText = "▶️";
        }

        if (audio.paused) {
            audio.play();
            btn.innerText = "⏸"; // change to pause icon
            wrapper.classList.add("playing");
            currentAudio = audio;
        } else {
            audio.pause();
            btn.innerText = "▶️"; // back to play icon
            wrapper.classList.remove("playing");
            currentAudio = null;
        }
    });

    // when audio finishes, reset
    audio.addEventListener("ended", () => {
        btn.innerText = "▶️";
        wrapper.classList.remove("playing");
        if (currentAudio === audio) currentAudio = null;
    });

    wrapper.append(btn, audio);
    return wrapper;
}

function createLiTag(name, className, content, number, lang) {
    let liTag = createTag(name, className);

    let text;
    if (lang === 'eng') {
        text = `<span class='ayah_num'>${number}.</span> ${content}`;
    } else {
        text = `${content}`;
    }

    liTag.innerHTML = text;
    return liTag;
}

function createTag(name, className) {
    let tag = document.createElement(name);

    if (className.length !== 0) {
        tag.classList.add(className)
    }
    return tag;
}


// ----------------------------- Older Version -------------------------------


// function getUrl(language, surahNumber, ayahNumber) {
//     let url;
//     if (ayahNumber > 1) {
//         url = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/en.asad`;
//     } else {
//         if (language === "eng") {
//             url = `https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`;
//         } else {
//             url = `https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`;
//         }
//     }
//
//     return url;
// }

// async function loadAndShow(surahNumber, ayahNumber) {
//
//     let lang = language.value;
//     let data = await loadSurah(lang, surahNumber, ayahNumber);
//     title__eng.innerText = data.englishName + " (" + data.englishNameTranslation + ")";
//     title__arb.innerText = data.name;
//     surah_info.innerText = data.numberOfAyahs + " Ayahs, " + "Revelation Type " + data.revelationType
//     showAyat(data, lang);
// }
//
// async function loadSurah(lang, surahNumber, ayahNumber) {
//
//     let data;
//     let url = getUrl(lang, surahNumber, ayahNumber);
//     let engResponse = await fetch(url);
//     data = await engResponse.json();
//
//     return data.data;
// }
