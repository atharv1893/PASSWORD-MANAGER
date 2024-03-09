
function checkPasswordStrength(password) {
    const strength = calculatePasswordStrength(password);
    const progress = document.getElementById('progress-bar');
    progress.style.width = strength + '%';
    progress.className = getProgressColor(strength);
}

// Function to calculate password strength
function calculatePasswordStrength(password) {
    // Base strength based on password length
    let strength = Math.min(password.length * 10, 100);
    
    // Additional strength for each type of character
    const categories = [
        /[a-z]/, // Lowercase letter
        /[A-Z]/, // Uppercase letter
        /[0-9]/, // Digit
        /[\W_]/  // Special character
    ];

    // Increase strength for each fulfilled category
    categories.forEach(category => {
        if (category.test(password)) {
            strength += 25;
        }
    });
    
    return Math.min(strength, 100); // Cap strength at 100%
}

// Function to get progress color
function getProgressColor(strength) {
    if (strength <= 40) {
        return 'progress-weak';
    } else if (strength <= 70) {
        return 'progress-moderate';
    } else {
        return 'progress-strong';
    }
}

// Function to show pop-up
document.getElementById('popButton').addEventListener('click',function(){
    document.getElementById('card').style.display = "block";
    document.getElementById('overlay').style.display = "block";
});

// Function to cancel pop-up
document.getElementById("cancel").addEventListener("click", function(event) {
    event.preventDefault(); 
    cancelForm(); 
});

function cancelForm() {
    document.getElementById("card").style.display = "none";
    document.getElementById("overlay").style.display = "none"; 
    document.getElementById("myForm").reset(); 
}
document.addEventListener('DOMContentLoaded', function() {
    var cards = document.querySelectorAll('.appcard');
    
    cards.forEach(function(card) {
        var image = card.querySelector('img');
        var details = card.querySelector('.details');

        // Initially hide the details
        details.style.display = 'none';

        // Add event listener for mouseenter
        card.addEventListener('mouseenter', function() {
            image.style.display = 'none';
            details.style.display = 'flex';
            details.style.flexDirection = 'column';
            details.style.alignItems = 'center';
            details.style.justifyContent = 'center';
            details.style.textAlign = 'left';
        });

        // Add event listener for mouseleave
        card.addEventListener('mouseleave', function() {
            image.style.display = 'block';
            details.style.display = 'none';
        });
    });
    setInterval(function(){
       5000; 
    })
});
function searchApplications(keyword) {
    var input, filter, cards, card, appName, i, txtValue;
    filter = keyword.toUpperCase();
    cards = document.getElementsByClassName('appcard');

    noResultsMessage = document.getElementById('noResultsMessage');

    var resultsFound = false;

    for (i = 0; i < cards.length; i++) {
        card = cards[i];
        appName = card.querySelector('.details p:first-child').textContent.trim();
        txtValue = appName.toUpperCase();
        if (txtValue.indexOf(filter) > -1) {
            card.style.display = '';
            resultsFound = true;
        } else {
            card.style.display = 'none';
        }
    }

    if (resultsFound) {
        noResultsMessage.style.display = 'none';
    } else {
        noResultsMessage.style.display = '';
    }

}
