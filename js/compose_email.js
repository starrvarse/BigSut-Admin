document.addEventListener("DOMContentLoaded", function() {
    const db = firebase.firestore();
    const storage = firebase.storage();  // Initialize Firebase Storage

    // Populate the "To" dropdown with emails from Firebase Firestore
    const toDropdown = document.getElementById('to');
    db.collection('contacts').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const contact = doc.data();
            const option = document.createElement('option');
            option.value = contact.email;
            option.textContent = contact.email;
            toDropdown.appendChild(option);
        });
    });

    // Handle file attachment
    const attachBtn = document.getElementById('attachBtn');
    const fileInput = document.getElementById('fileInput');
    const selectedFilesDiv = document.getElementById('selectedFiles');
    let attachedFiles = []; // Array to hold the attached files

    if (attachBtn && fileInput) {
        attachBtn.addEventListener('click', function () {
            fileInput.click();
        });

        fileInput.addEventListener('change', function () {
            selectedFilesDiv.innerHTML = ''; // Clear previous file list
            attachedFiles = Array.from(fileInput.files); // Store selected files

            attachedFiles.forEach((file, index) => {
                const fileItem = document.createElement('div');
                fileItem.textContent = `${index + 1}. ${file.name}`;
                selectedFilesDiv.appendChild(fileItem);
            });
        });
    }

    // Event listener for the send button
    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', async function() {
            const toEmail = toDropdown.value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('emailContent').value;

            if (!toEmail || !subject || !message) {
                alert("Please fill in all fields before sending.");
                return;
            }

            // Get current date and time
            const timestamp = new Date().toISOString();

            try {
                // Mailgun API configuration
                const apiKey = 'api:07c3abb939b6a6838ba8be492c7be367-5dcb5e36-43d3b712'; // Your Mailgun API key
                const domain = 'bigsur.in'; // Your Mailgun domain
                const fromEmail = 'notifications@bigsur.in'; // Sender email address

                // Prepare form data for attachments and email content
                const formData = new FormData();
                formData.append("from", fromEmail);
                formData.append("to", toEmail);
                formData.append("subject", subject);
                formData.append("html", message);  // Send email as HTML content

                // Append each attached file to formData
                attachedFiles.forEach(file => {
                    formData.append("attachment", file); // Attach each file
                });

                // Send email with attachments using Mailgun API
                const requestOptions = {
                    method: "POST",
                    headers: {
                        'Authorization': 'Basic ' + btoa(apiKey),
                    },
                    body: formData // Send formData with attachments
                };

                const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, requestOptions);
                const result = await response.json();

                if (result.message) {
                    // Store sent email in Firestore
                    await db.collection('emails').add({
                        to: toEmail,
                        subject: subject,
                        body: message,
                        date: timestamp,
                        attachments: attachedFiles.map(file => file.name) // Store attachment names
                    });

                    alert("Email sent successfully!");

                    // Refresh the page to clear the form
                    window.location.reload();
                } else {
                    alert("Failed to send email. Error: " + result.error);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Error sending email: " + error.message);
            }
        });
    }
});

// Redirect to inbox page
document.addEventListener("DOMContentLoaded", function() {
    const inboxBtn = document.getElementById("inboxBtn");

    if (inboxBtn) {
        inboxBtn.addEventListener("click", function() {
            window.location.href = "email.html";  // Redirect to email.html
        });
    }

    // Other existing code...
});
