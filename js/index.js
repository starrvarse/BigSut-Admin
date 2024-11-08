// No need to import firebase-config.js, it's automatically available
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Use Firebase Auth for authentication
    firebase.auth().signInWithEmailAndPassword(username, password)
    .then((userCredential) => {
        // Successful login
        window.location.href = "dashboard.html";
    })
    .catch((error) => {
        // Handle login errors
        errorMessage.textContent = error.message;
    });
});
