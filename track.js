// Track Page JavaScript

// API Configuration - Update this if your backend is on a different URL
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000' 
    : 'https://your-backend-domain.com'; // Update with your production backend URL

// DOM Elements
const trackingForm = document.getElementById('trackingFormContainer');
const trackingInput = document.getElementById('trackingInput');
const trackButton = document.getElementById('trackButton');
const loaderContainer = document.getElementById('loaderContainer');
const errorContainer = document.getElementById('errorContainer');
const errorText = document.getElementById('errorText');
const retryButton = document.getElementById('retryButton');
const packageDetailsContainer = document.getElementById('packageDetailsContainer');

// Google Maps
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

// Initialize Google Map
function initializeMap(packageData) {
    // Get the location to display on map
    // Priority: dispatchLocation > receiverAddress > senderAddress
    const locationString = packageData.dispatchLocation || 
                          packageData.receiverAddress || 
                          packageData.senderAddress || 
                          'New York, NY';

    // Check if map is already initialized
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map element not found');
        return;
    }

    // Initialize map if not already done
    if (!map) {
        // Default center (can be changed based on geocoding)
        const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York City
        
        map = new google.maps.Map(mapElement, {
            zoom: 12,
            center: defaultCenter,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true
        });
    }

    // Geocode the address to get coordinates
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address: locationString }, function(results, status) {
        if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            
            // Center map on location
            map.setCenter(location);
            map.setZoom(14);
            
            // Remove existing marker if any
            if (marker) {
                marker.setMap(null);
            }
            
            // Add marker
            marker = new google.maps.Marker({
                position: location,
                map: map,
                title: packageData.packageDesc || 'Package Location',
                animation: google.maps.Animation.DROP
            });

            // Add info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="padding: 10px;">
                        <h3 style="margin: 0 0 8px 0; color: #1e3a8a;">Package Location</h3>
                        <p style="margin: 0 0 4px 0;"><strong>Status:</strong> ${packageData.status || 'N/A'}</p>
                        <p style="margin: 0 0 4px 0;"><strong>Location:</strong> ${locationString}</p>
                        <p style="margin: 0;"><strong>Tracking ID:</strong> ${packageData.trackingId || 'N/A'}</p>
                    </div>
                `
            });

            marker.addListener('click', function() {
                infoWindow.open(map, marker);
            });

            // Open info window by default
            infoWindow.open(map, marker);
        } else {
            console.error('Geocoding failed:', status);
            // Fallback to default location if geocoding fails
            const defaultCenter = { lat: 40.7128, lng: -74.0060 };
            map.setCenter(defaultCenter);
            
            if (marker) {
                marker.setMap(null);
            }
            
            marker = new google.maps.Marker({
                position: defaultCenter,
                map: map,
                title: 'Package Location',
                animation: google.maps.Animation.DROP
            });
        }
    });
}

// Global function for Google Maps callback
function initMap() {
    // This function is called by Google Maps API KEY when it loads
    // The map will be initialized when package details are displayed
    console.log('Google Maps API loaded');
}

