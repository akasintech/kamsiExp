// Track Page JavaScript

// API Configuration - Update this if your backend is on a different URL
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000' 
    : 'https://kamsiexp.onrender.com'; // Update with your production backend URL

// DOM Elements
const trackingForm = document.getElementById('trackingFormContainer');
const trackingInput = document.getElementById('trackingInput');
const trackButton = document.getElementById('trackButton');
const loaderContainer = document.getElementById('loaderContainer');
const errorContainer = document.getElementById('errorContainer');
const errorText = document.getElementById('errorText');
const retryButton = document.getElementById('retryButton');
const packageDetailsContainer = document.getElementById('packageDetailsContainer');

// Leaflet Map
let map;
let marker;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {

    // Handle form submission
    trackButton.addEventListener('click', handleTrack);
    trackingInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleTrack();
        }
    });

    // Retry button
    retryButton.addEventListener('click', handleTrack);
});

// Handle tracking request
async function handleTrack() {
    const trackingId = trackingInput.value.trim();
    
    if (!trackingId) {
        showError('Please enter a tracking number');
        return;
    }

    // Hide error and package details
    hideError();
    hidePackageDetails();
    
    // Show loader
    showLoader();
    
    // Disable button
    trackButton.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/api/track/${trackingId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to track package');
        }

        if (data.success && data.data) {
            // Hide loader
            hideLoader();
            
            // Display package details
            displayPackageDetails(data.data);
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        console.error('Tracking error:', error);
        hideLoader();
        
        // Better error messages
        let errorMessage = 'Failed to track package. Please try again.';
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showError(errorMessage);
    } finally {
        trackButton.disabled = false;
    }
}

// Show loader
function showLoader() {
    loaderContainer.style.display = 'block';
    trackingForm.style.display = 'none';
}

// Hide loader
function hideLoader() {
    loaderContainer.style.display = 'none';
    trackingForm.style.display = 'block';
}

// Show error
function showError(message) {
    errorText.textContent = message;
    errorContainer.style.display = 'block';
    trackingForm.style.display = 'block';
}

// Hide error
function hideError() {
    errorContainer.style.display = 'none';
}

// Hide package details
function hidePackageDetails() {
    packageDetailsContainer.style.display = 'none';
}

// Display package details
function displayPackageDetails(packageData) {
    // Fill in all the package information
    document.getElementById('displayTrackingId').textContent = packageData.trackingId || 'N/A';
    document.getElementById('senderName').textContent = packageData.senderName || 'N/A';
    document.getElementById('senderEmail').textContent = packageData.senderEmail || 'N/A';
    document.getElementById('senderContact').textContent = packageData.senderContact || 'N/A';
    document.getElementById('senderAddress').textContent = packageData.senderAddress || 'N/A';
    
    document.getElementById('receiverName').textContent = packageData.receiverName || 'N/A';
    document.getElementById('receiverEmail').textContent = packageData.receiverEmail || 'N/A';
    document.getElementById('receiverContact').textContent = packageData.receiverContact || 'N/A';
    document.getElementById('receiverAddress').textContent = packageData.receiverAddress || 'N/A';
    
    document.getElementById('packageDesc').textContent = packageData.packageDesc || 'N/A';
    document.getElementById('packageStatus').textContent = packageData.status || 'N/A';
    document.getElementById('dispatchLocation').textContent = packageData.dispatchLocation || 'N/A';
    
    // Format dates
    const dispatchDate = packageData.dispatchDate ? formatDate(packageData.dispatchDate) : 'N/A';
    const estimatedArrival = packageData.estimatedArrivalDate ? formatDate(packageData.estimatedArrivalDate) : 'N/A';
    
    document.getElementById('dispatchDate').textContent = dispatchDate;
    document.getElementById('estimatedArrival').textContent = estimatedArrival;

    // Show package details
    packageDetailsContainer.style.display = 'block';

    // Initialize or update map
    initializeMap(packageData);
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

// Initialize Leaflet map with Nominatim geocoding
async function initializeMap(packageData) {
    const locationString = packageData.dispatchLocation || 
                          packageData.receiverAddress || 
                          packageData.senderAddress || 
                          'New York, NY';

    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map element not found');
        return;
    }

    // Create map if not exists
    if (!map) {
        map = L.map(mapElement).setView([40.7128, -74.0060], 12); // NYC default
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    }

    // Geocode with Nominatim
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationString)}`;
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });
        const results = await res.json();

        let lat = 40.7128;
        let lon = -74.0060;

        if (Array.isArray(results) && results.length > 0) {
            lat = parseFloat(results[0].lat);
            lon = parseFloat(results[0].lon);
        }

        map.setView([lat, lon], 14);

        if (marker) {
            map.removeLayer(marker);
        }

        marker = L.marker([lat, lon]).addTo(map);
        const popupHtml = `
            <div style="padding: 6px 2px;">
                <h3 style="margin: 0 0 6px 0; color: #1e3a8a; font-size: 14px;">Package Location</h3>
                <p style="margin: 0 0 2px 0; font-size: 12px;"><strong>Status:</strong> ${packageData.status || 'N/A'}</p>
                <p style="margin: 0 0 2px 0; font-size: 12px;"><strong>Location:</strong> ${locationString}</p>
                <p style="margin: 0; font-size: 12px;"><strong>Tracking ID:</strong> ${packageData.trackingId || 'N/A'}</p>
            </div>
        `;
        marker.bindPopup(popupHtml).openPopup();
    } catch (e) {
        console.error('Geocoding error', e);
    }
}

