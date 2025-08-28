const searchBox = document.getElementById('surah_search');
const suggestions = document.getElementById('suggestions');

// 🔹 Load surah data into an array on page load
const surahList = Array.from(document.querySelectorAll('#surah_list li')).map(li => ({
    id: li.dataset.id,
    name: li.textContent.trim()
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
        li.onclick = async function () {
            console.log(surah.id)
            await loadAndShow(surah.id);
            surah_num.value = surah.id;
            searchBox.value = ''; // clear search box
            suggestions.style.display = 'none'; // hide suggestions
        };
        suggestions.appendChild(li);
    });

    suggestions.style.display = 'block';
});