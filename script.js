// Fetch and display the files when the subject changes
document.getElementById('subject').addEventListener('change', function () {
    const subject = this.value;
    fetchFiles(subject);
});

// Function to fetch files for the selected subject
function fetchFiles(subject) {
    fetch(`files/${subject}/`)
        .then(response => response.json())
        .then(files => {
            const fileList = document.getElementById('file-list');
            fileList.innerHTML = ''; // Clear previous file list
            files.forEach(file => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="file-name">${file}</span>
                    <a class="download-link" href="files/${subject}/${file}" download>Download</a>
                    <button onclick="deleteFile('${subject}', '${file}')">Delete</button>
                `;
                fileList.appendChild(li);
            });
        });
}

// Function to delete a file
function deleteFile(subject, filename) {
    fetch('/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, filename }),
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        fetchFiles(subject); // Refresh file list after deletion
    });
}

// Handle the file upload
document.getElementById('notes-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(this);
    
    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        const subject = document.getElementById('subject').value;
        fetchFiles(subject); // Refresh file list after upload
    });
});