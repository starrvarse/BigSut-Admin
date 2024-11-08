// Firebase initialization (ensure firebase-config.js is correctly configured and loaded)
const db = firebase.firestore();

// DOM elements
const createContactBtn = document.getElementById('createContactBtn');
const popupForm = document.getElementById('popupForm');
const closePopup = document.getElementById('closePopup');
const contactForm = document.getElementById('contactForm');
const contactTableBody = document.getElementById('contactTableBody');

// Open popup form
createContactBtn.addEventListener('click', function () {
    popupForm.style.display = 'block';
});

// Close popup form
closePopup.addEventListener('click', function () {
    popupForm.style.display = 'none';
});

// Fetch and display existing contacts from Firestore when the page loads
db.collection('contacts').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const contact = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `<td>${contact.name}</td><td>${contact.email}</td>`;
        contactTableBody.appendChild(row);
    });
}).catch(function(error) {
    console.error("Error fetching contacts: ", error);
});

// Submit form and save to Firestore
contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    // Save to Firestore database
    db.collection('contacts').add({
        name: name,
        email: email
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);

        // Add contact to table dynamically
        const row = document.createElement('tr');
        row.innerHTML = `<td>${name}</td><td>${email}</td>`;
        contactTableBody.appendChild(row);

        // Clear form and close popup
        contactForm.reset();
        popupForm.style.display = 'none';
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
});
