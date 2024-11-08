// pushnotification.js

// Elements for the popup form and buttons
const createBtn = document.getElementById('create-btn');
const popupForm = document.getElementById('popup-form');
const closePopupBtn = document.getElementById('close-popup');
const saveBtn = document.getElementById('save-btn');
const notificationsTable = document.getElementById('notifications-table').getElementsByTagName('tbody')[0];

// Show popup form when Create button is clicked
createBtn.addEventListener('click', () => {
    popupForm.style.display = 'block';
});

// Close popup form
closePopupBtn.addEventListener('click', () => {
    popupForm.style.display = 'none';
});

// Fetch notifications from Firestore and populate the table
function loadNotifications() {
    firebase.firestore().collection('notifications').orderBy('timestamp', 'desc')
    .get()
    .then((querySnapshot) => {
        notificationsTable.innerHTML = ''; // Clear existing table rows
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const notificationText = data.notification;

            // Create a new row in the table
            const newRow = notificationsTable.insertRow();
            const notificationCell = newRow.insertCell(0);
            const actionCell = newRow.insertCell(1);

            notificationCell.textContent = notificationText;
            actionCell.innerHTML = `<button class="delete-btn" data-id="${doc.id}">Delete</button>`;

            // Add delete functionality to the button
            newRow.querySelector('.delete-btn').addEventListener('click', function() {
                const notificationId = this.getAttribute('data-id');
                deleteNotification(notificationId, this.closest('tr'));
            });
        });
    })
    .catch((error) => {
        console.error("Error fetching notifications: ", error);
    });
}

// Function to delete a notification from Firestore
function deleteNotification(notificationId, rowElement) {
    firebase.firestore().collection('notifications').doc(notificationId).delete()
    .then(() => {
        console.log("Notification successfully deleted!");
        rowElement.remove(); // Remove the row from the table
    })
    .catch((error) => {
        console.error("Error deleting notification: ", error);
    });
}

// Save notification to Firestore
saveBtn.addEventListener('click', () => {
    const notificationText = document.getElementById('notification-text').value;

    if (notificationText.trim() !== '') {
        // Save to Firestore
        firebase.firestore().collection('notifications').add({
            notification: notificationText,
            timestamp: firebase.firestore.FieldValue.serverTimestamp() // Add a timestamp if needed
        })
        .then((docRef) => {
            console.log("Notification saved with ID: ", docRef.id);

            // Add new row to the notifications table
            const newRow = notificationsTable.insertRow();
            const notificationCell = newRow.insertCell(0);
            const actionCell = newRow.insertCell(1);

            notificationCell.textContent = notificationText;
            actionCell.innerHTML = `<button class="delete-btn" data-id="${docRef.id}">Delete</button>`;

            // Reset and close the popup form
            document.getElementById('notification-text').value = '';
            popupForm.style.display = 'none';

            // Add delete functionality to the new notification
            newRow.querySelector('.delete-btn').addEventListener('click', function() {
                const notificationId = this.getAttribute('data-id');
                deleteNotification(notificationId, this.closest('tr'));
            });
        })
        .catch((error) => {
            console.error("Error saving notification: ", error);
        });
    }
});

// Load notifications when the page loads
window.onload = loadNotifications;
