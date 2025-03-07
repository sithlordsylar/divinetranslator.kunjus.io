document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('ocrImageInput');
    const resultTextArea = document.getElementById('ocrOutputText');
    const toggle = document.getElementById('ocr-toggle');
    const toggleLabel = document.getElementById('ocr-toggle-label');

    let translationMap = {};

    // Fetch and build the translation map
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                translationMap[item.english.toLowerCase()] = item.divine;
                translationMap[item.divine] = item.english;
            });
        });

    // Toggle switch functionality
    toggle.addEventListener('change', function() {
        toggleLabel.textContent = toggle.checked ? "Human → Divine" : "Divine → Human";
        if (imageInput.files[0]) {
            translateImage(); // Re-translate if image is already loaded
        }
    });

    // Handle image upload
    imageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            translateImage();
        }
    });

    // Function to perform OCR and translation
    function translateImage() {
        const file = imageInput.files[0];
        if (!file) return;

        Tesseract.recognize(file, 'eng', { logger: m => console.log(m) })
            .then(({ data: { text } }) => {
                let translatedText = '';
                for (const char of text) {
                    let key = char.toLowerCase();
                    if (toggle.checked) {
                        translatedText += translationMap[key] || char; // Human to Divine
                    } else {
                        translatedText += translationMap[char] || char; // Divine to Human
                    }
                }
                resultTextArea.value = translatedText;
            })
            .catch(error => {
                console.error('OCR Error:', error);
                resultTextArea.value = 'Error during OCR. Please try again.';
            });
    }
});