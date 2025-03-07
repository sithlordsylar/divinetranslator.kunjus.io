document.addEventListener('DOMContentLoaded', function() {
  let translationData = [];
  let englishToDivine = {};
  let divineToEnglish = {};

  // Fetch the translation data from data.json
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      translationData = data;
      buildTranslationMappings();
      populateTranslationTable(); // Optional: displays the mapping table if present
    })
    .catch(error => console.error('Error loading translation data:', error));

  const inputTextArea = document.getElementById('inputText');
  const outputTextArea = document.getElementById('outputText');
  const toggle = document.getElementById('toggle');
  const toggleLabel = document.getElementById('toggle-label');

  // Listen for changes in the input and toggle switch
  inputTextArea.addEventListener('input', translateText);
  
  toggle.addEventListener('change', function() {
    toggleLabel.textContent = toggle.checked ? "Human → Divine" : "Divine → Human";
    translateText();
  });

  // Build mapping objects for fast lookup
  function buildTranslationMappings() {
    translationData.forEach(item => {
      // Ensure English mapping is case-insensitive
      englishToDivine[item.english.toLowerCase()] = item.divine;
      divineToEnglish[item.divine] = item.english;
    });
  }

  // Optional: Populate the translation table on the page
  function populateTranslationTable() {
    const tableBody = document.querySelector('#translationTable tbody');
    if (!tableBody) return;
    translationData.forEach(item => {
      const row = document.createElement('tr');
      const englishCell = document.createElement('td');
      englishCell.textContent = item.english;
      const divineCell = document.createElement('td');
      divineCell.textContent = item.divine;
      row.appendChild(englishCell);
      row.appendChild(divineCell);
      tableBody.appendChild(row);
    });
  }

  // Translate text letter-by-letter
  function translateText() {
    const inputText = inputTextArea.value;
    const isHumanToDivine = toggle.checked;
    let translated = "";

    for (let char of inputText) {
      if (isHumanToDivine) {
        // Convert to lowercase for English matching
        const mapped = englishToDivine[char.toLowerCase()];
        translated += (mapped !== undefined ? mapped : char);
      } else {
        // For divine-to-English translation
        const mapped = divineToEnglish[char];
        translated += (mapped !== undefined ? mapped : char);
      }
    }
    outputTextArea.value = translated;
  }
});
