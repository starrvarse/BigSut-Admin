document.addEventListener("DOMContentLoaded", function() {
    const db = firebase.firestore();
    const storage = firebase.storage();

    const mailList = document.getElementById('mail-list');
    const filterInput = document.getElementById('filter-input');
    const composeButton = document.querySelector('.compose');

    if (!mailList) {
        console.error("Element with ID 'mail-list' not found.");
        return;
    }

    function populateEmails() {
        db.collection('emails').get().then((querySnapshot) => {
            mailList.innerHTML = ''; // Clear existing emails
            querySnapshot.forEach((doc) => {
                const email = doc.data();
                const mailItem = document.createElement('div');
                mailItem.classList.add('mail-item');

                mailItem.innerHTML = `
                    <div><strong>To:</strong> ${email.to}</div>
                    <div><strong>Subject:</strong> ${email.subject || 'No Subject'}</div>
                    <div><strong>Date:</strong> ${email.date || 'No Date'}</div>
                `;

                mailItem.addEventListener('click', () => loadEmail(email));
                mailList.appendChild(mailItem);
            });
        }).catch((error) => {
            console.error("Error fetching emails:", error);
        });
    }

    function loadEmail(email) {
        document.getElementById('email-to').textContent = email.to;
        document.getElementById('email-date').textContent = email.date || 'No Date';

        const emailBodyElement = document.getElementById('email-body');
        
        // Check if the body contains HTML or plain text
        if (isHTML(email.body)) {
            // Handle HTML content inside an iframe for proper rendering and apply custom styles
            emailBodyElement.innerHTML = `
                <iframe id="email-iframe" frameborder="0" style="width: 100%; height: 300px;"></iframe>
            `;
            const iframe = document.getElementById('email-iframe');
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

            iframeDocument.open();
            iframeDocument.write(email.body);  // Write the HTML content to the iframe
            iframeDocument.close();

            // Adjust the iframe size dynamically
            iframe.onload = function() {
                iframe.style.height = iframeDocument.body.scrollHeight + 'px'; // Auto-adjust height
                iframeDocument.body.style.fontSize = "14px";  // Reduce font size inside the iframe
                iframeDocument.body.style.padding = "10px";  // Reduce padding
            };
        } else {
            // Handle plain text emails
            emailBodyElement.textContent = email.body || 'No content available';
        }

        const attachmentIcons = document.getElementById('attachment-icons');
        attachmentIcons.innerHTML = '';
        if (email.attachments && email.attachments.length > 0) {
            email.attachments.forEach(attachmentUrl => {
                const attachmentItem = document.createElement('a');
                attachmentItem.href = attachmentUrl;
                attachmentItem.textContent = 'Download';
                attachmentItem.target = '_blank';
                attachmentIcons.appendChild(attachmentItem);
            });
        }
    }

    // Helper function to detect if a string contains HTML tags
    function isHTML(str) {
        const doc = new DOMParser().parseFromString(str, 'text/html');
        return Array.from(doc.body.childNodes).some(node => node.nodeType === 1); // Check if any child is an HTML element
    }

    function setupFilterFunctionality() {
        filterInput.addEventListener('keyup', function() {
            const filter = filterInput.value.toLowerCase();
            const mailItems = document.querySelectorAll('.mail-item');
            mailItems.forEach(mail => {
                if (mail.textContent.toLowerCase().includes(filter)) {
                    mail.style.display = '';
                } else {
                    mail.style.display = 'none';
                }
            });
        });
    }

    function setupComposeButton() {
        composeButton.addEventListener('click', function () {
            window.location.href = 'compose_email.html';
        });
    }

    function setupSidebarButtons() {
        const buttons = document.querySelectorAll('.menu button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                console.log(`${button.textContent.trim()} clicked`);
                // Implement functionality for each button
            });
        });
    }

    function initEmailDashboard() {
        populateEmails();
        setupFilterFunctionality();
        setupComposeButton();
        setupSidebarButtons();
    }

    initEmailDashboard();
});
