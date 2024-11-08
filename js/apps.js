// Initialize Firebase Firestore
const db = firebase.firestore();

// Get references to DOM elements
const createAppBtn = document.getElementById('create-app-btn');
const modal = document.getElementById('create-app-modal');
const closeModal = document.getElementById('close-modal');
const createAppForm = document.getElementById('create-app-form');
const formTitle = document.getElementById('form-title');
const appTableBody = document.getElementById('appTableBody');
let editingAppId = null; // Store the ID of the app being edited

// Open modal when the "Create App" button is clicked
createAppBtn.addEventListener('click', () => {
    formTitle.innerText = 'Create a New App';
    createAppForm.reset();
    editingAppId = null;
    modal.style.display = 'block'; // Show the modal
});

// Close modal when the close button is clicked
closeModal.addEventListener('click', () => {
    modal.style.display = 'none'; // Hide the modal
});

// Close modal if the user clicks outside the modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none'; // Hide the modal
    }
});

// Handle form submission
createAppForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const appName = document.getElementById('app-name').value;
    const module = document.getElementById('module').value;
    const platform = document.getElementById('platform').value;
    const version = document.getElementById('version').value;
    const downloadLink = document.getElementById('download-link').value;

    const appData = {
        appName: appName,
        module: module,
        platform: platform,
        version: version,
        downloadURL: downloadLink
    };

    if (editingAppId) {
        // Update existing app in Firestore
        db.collection('apps').doc(editingAppId).update(appData).then(() => {
            console.log('App updated successfully!');
            modal.style.display = 'none'; // Close the modal
            fetchAndDisplayApps(); // Refresh the table
        }).catch((error) => {
            console.error('Error updating app:', error);
        });
    } else {
        // Add new app to Firestore
        db.collection('apps').add(appData).then(() => {
            console.log('App added successfully!');
            modal.style.display = 'none'; // Close the modal
            fetchAndDisplayApps(); // Refresh the table
        }).catch((error) => {
            console.error('Error adding app:', error);
        });
    }
});

// Function to fetch and display apps in the table
function fetchAndDisplayApps() {
    appTableBody.innerHTML = ''; // Clear the table before displaying updated data
    db.collection('apps').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const app = doc.data();
            addAppToTable(doc.id, app.appName, app.module, app.platform, app.version, app.downloadURL);
        });
    });
}

// Function to dynamically add app data to the table
function addAppToTable(id, appName, module, platform, version, downloadURL) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${appName}</td>
        <td>${module}</td>
        <td>${platform}</td>
        <td>${version}</td>
        <td>
            <a href="${downloadURL}" class="btn btn-secondary" target="_blank"><i class="fas fa-download"></i></a>
            <button class="btn btn-secondary" onclick="copyToClipboard('${downloadURL}')"><i class="fas fa-copy"></i></button>
            <button class="btn btn-secondary" onclick="editApp('${id}')"><i class="fas fa-edit"></i></button>
        </td>
    `;
    appTableBody.appendChild(row);
}

// Function to copy the download URL to clipboard
function copyToClipboard(url) {
    const tempInput = document.createElement('input');
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Download link copied to clipboard!');
}

// Function to edit an existing app
function editApp(id) {
    db.collection('apps').doc(id).get().then((doc) => {
        const app = doc.data();
        formTitle.innerText = 'Edit App';
        document.getElementById('app-name').value = app.appName;
        document.getElementById('module').value = app.module;
        document.getElementById('platform').value = app.platform;
        document.getElementById('version').value = app.version;
        document.getElementById('download-link').value = app.downloadURL;
        editingAppId = id; // Set the app ID for editing
        modal.style.display = 'block'; // Show the modal
    }).catch((error) => {
        console.error('Error getting app for edit:', error);
    });
}

// Fetch and display apps on page load
fetchAndDisplayApps();
