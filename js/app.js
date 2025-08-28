const surah_num = document.getElementById("surah_num");
const ayah_num = document.getElementById("ayah_num");
const load__btn = document.getElementById("load__btn");
const next_num = document.getElementById("next__btn");
const prev__btn = document.getElementById("prev__btn");
let ayat__list = document.getElementById("ayat__list");
const title__eng = document.getElementById("title__eng");
const title__arb = document.getElementById("title__arb");
const surah_info = document.getElementById("surah_info");
const language = document.getElementById("language");
const surahNames = document.querySelectorAll('#surah_list > li');

let surahNumber = surah_num.value;
let ayahNumber = ayah_num.value;

let quran = null;

window.onload = async () => {
    await loadQuran();
    loadAndShow(surahNumber, ayahNumber);
}

async function loadQuran() {
    const response = await fetch("assets/quran.json");
    quran = await response.json();
}

load__btn.onclick = async (e) => {
    let surahNumber = surah_num.value;
    let ayahNumber = ayah_num.value;

    if (surahNumber === "" || surahNumber <= 0 || surahNumber > 114) {
        alert("Invalid Surah Number! please input from 1 to 114.")
        return
    }

    await loadAndShow(surahNumber, ayahNumber);
}

next_num.onclick = async () => {

    surahNumber = surah_num.value;
    ayahNumber = ayah_num.value;

    if (surahNumber == 114) {
        surahNumber = 0;
    }
    surah_num.value = ++surahNumber;
    await loadAndShow(surahNumber, ayahNumber);
}

prev__btn.onclick = async () => {

    surahNumber = surah_num.value;
    ayahNumber = ayah_num.value;

    if (surahNumber == 1) {
        surahNumber = 115;
    }
    surah_num.value = --surahNumber;
    await loadAndShow(surahNumber, ayahNumber);
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
    ayat__list.innerHTML = "";

    // Normalize: wrap single ayah in an array
    const ayahs = data.ayahs ? Object.values(data.ayahs) : [data];

    ayahs.forEach(ayah => {
        const text = lang === "arb" ? ayah.text : ayah.engText;
        const tag = createLiTag("li", "ayah", text, ayah.number);

        if (lang === "arb" && ayah.audio) {
            tag.append(createAudioTag(ayah.audio));
        }

        ayat__list.append(tag);
    });
}

// 🔹 Helper for audio creation
function createAudioTag(src) {
    const audio = createTag("audio", "");
    audio.controls = true;
    audio.classList.add("audio");

    const source = createTag("source", "");
    source.src = src;
    source.type = "audio/mp3";

    audio.append(source);
    return audio;
}

function createLiTag(name, className, content, number) {
    let liTag = createTag(name, className);
    liTag.innerText = `${number}. ${content}`;
    return liTag;
}

function createTag(name, className) {
    let tag = document.createElement(name);

    if (className.length !== 0) {
        tag.classList.add(className)
    }
    return tag;
}

//----------------------------------------------------------------------------//

for (let i = 0; i < surahNames.length; i++) {
    surahNames[i].onclick = async function (e) {
        let num = surahNames[i].dataset.id;
        await loadAndShow(num);
        surah_num.value = num;
    }
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
