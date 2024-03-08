
function fetchLogo() {
    var searchQuery = document.getElementById('searchInput').value;
    fetch('/fetch_logo/' + searchQuery)
        .then(response => response.text())
        .then(data => {
            var logoContainer = document.getElementById('logoContainer');
            if (data) {
                logoContainer.innerHTML = `<img src="${data}" alt="Company Logo" style="max-width: 100%; height: auto;">`;
            } else {
                logoContainer.innerHTML = `<p>No logo found for ${searchQuery}</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching logo:', error);
            var logoContainer = document.getElementById('logoContainer');
            logoContainer.innerHTML = `<p>Error fetching logo</p>`;
        });
}

function checkPasswordStrength(password) {
    const minLength = 8;
    const specialCharRegex = /[\W_]/;
    const capitalLetterRegex = /[A-Z]/;
    const lowercaseLetterRegex = /[a-z]/;
    const numberRegex = /[0-9]/;

    // Check each condition and update color
    document.getElementById('lengthCondition').className = password.length >= minLength ? 'condition satisfied' : 'condition';
    document.getElementById('specialCharCondition').className = specialCharRegex.test(password) ? 'condition satisfied' : 'condition';
    document.getElementById('capitalLetterCondition').className = capitalLetterRegex.test(password) ? 'condition satisfied' : 'condition';
    document.getElementById('lowercaseLetterCondition').className = lowercaseLetterRegex.test(password) ? 'condition satisfied' : 'condition';
    document.getElementById('numberCondition').className = numberRegex.test(password) ? 'condition satisfied' : 'condition';
}


document.getElementById('popButton').addEventListener('click',function(){
    console.log("pop button clifcked");
    document.getElementById('card').style.display = "block";
    document.getElementById('overlay').style.display = "block";

});

// Add an event listener to the cancel button
document.getElementById("cancel").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    cancelForm(); // Call the cancelForm function
});

function cancelForm() {
    document.getElementById("card").style.display = "none"; // Hide the form
    document.getElementById("overlay").style.display = "none"; // Hide the overlay
    document.getElementById("myForm").reset(); // Reset the form fields
}
