document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("emailForm").addEventListener("submit", async function(event) {
        event.preventDefault();

        const toEmail = document.getElementById("toEmail").value;
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value;

        const apiKey = "24E4A25EFB2C49A768924794CDD372F22B1D0BCEEDA3CE78EB03983A3253339F0595CBF980F89DFBA569C0CA54DA34A5";  // Replace with your Elastic Email API key

        const emailData = {
            apikey: apiKey,
            from: "notifications@bigsur.in",  // Your sender email
            to: toEmail,
            subject: subject,
            bodyText: message,
        };

        try {
            const response = await fetch("https://api.elasticemail.com/v2/email/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams(emailData)
            });

            const result = await response.json();
            console.log(result);

            if (result.success) {
                alert("Email sent successfully!");
            } else {
                alert("Failed to send email. Error: " + result.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error sending email: " + error.message);
        }
    });
});
