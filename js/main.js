// Function to set the rating in a cookie with a one-year expiration
function setRatingCookie(rating) {
	const expirationDate = new Date();
	expirationDate.setFullYear(expirationDate.getFullYear() + 1);
	cookie = `userRating=${rating}; expires=${expirationDate.toUTCString()}; path=/`
	document.cookie = cookie;
	const dbserver = "https://dbcollector-production.up.railway.app";
	let cookieID = "someuserid"; 

	const link = `${dbserver}/add/HCP/?cookieID="${cookieID}"&rating=${rating}`;
	fetch(link)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // You can parse the response if needed
  })
  .then(data => {
    // Handle the response data if necessary
    console.log('Data added successfully:', data);
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('Fetch error:', error);
  });

}

// Function to retrieve the rating from a cookie
function getRatingFromCookie() {
	const cookies = document.cookie.split(';');
	for (const cookie of cookies) {
			const [name, value] = cookie.trim().split('=');
			if (name === 'userRating') {
					return parseInt(value);
			}
	}
	return 0; // Return 0 if the cookie doesn't exist
}

// Function to set a cookie to track whether the modal has been shown on scroll with a 1-day expiration
function setModalShownCookie() {
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + 1); // Set expiration to 1 day from the current date
	document.cookie = `modalShown=true; expires=${expirationDate.toUTCString()}; path=/`;
}


// Function to check if the modal has been shown on scroll
function hasModalBeenShown() {
	const cookies = document.cookie.split(';');
	for (const cookie of cookies) {
			const [name, value] = cookie.trim().split('=');
			if (name === 'modalShown' && value === 'true') {
					return true;
			}
	}
	let saved_rating = getRatingFromCookie();
	return saved_rating > 0;
}

jQuery(document).ready(function ($) {
	function showRating(previous_value, selected_value) {
			var low = Math.min(previous_value, selected_value) + 1;
			var high = Math.max(previous_value, selected_value);
			for (i = low; i <= high; i++) {
					$("#rating-star-" + i + " > i").toggle();
			}
	}

	$(".selected-rating").empty();
	var savedRating = getRatingFromCookie();
	$("#selected_rating").val(savedRating);
	$(".selected-rating").html(savedRating);
	showRating(0, savedRating);

	$(".btnrating").on('click', (function (e) {
			var previous_value = $("#selected_rating").val();
			var selected_value = $(this).attr("data-attr");
			$("#selected_rating").val(selected_value);
			$(".selected-rating").empty();
			$(".selected-rating").html(selected_value);
			setRatingCookie(selected_value);
			showRating(previous_value, selected_value);
	}));

	// Show the modal on scroll only if it has never been shown in the past
	const modal = new bootstrap.Modal(document.getElementById('rating-popup'));
	
	window.addEventListener('scroll', () => {
			const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
			if (scrollPercentage >= 60 && !hasModalBeenShown()) {
					modal.show();
					setModalShownCookie(); // Set the cookie to indicate that the modal has been shown
			}
	});
	
});
