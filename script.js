document.addEventListener('DOMContentLoaded', () => {
    // Access the rear camera and show the feed in the video element
    function startVideo() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(stream => {
                const video = document.getElementById('video');
                video.srcObject = stream;
            })
            .catch(err => {
                console.error("Error accessing camera: ", err);
                alert("Camera permission is required for the app to function.");
            });
    }

    // Toggle the red border on the main container based on the switch state
    document.getElementById('recordSwitch').addEventListener('change', function() {
        const videoContainer = document.getElementById('video-container');
        videoContainer.style.borderColor = this.checked ? 'red' : 'transparent';
    });

    // Start the video stream when the page loads
    startVideo();
});

// Function to calculate the current speed based on the stroke-dashoffset
function calculateSpeed() {
    // Get the element
    let meterBar = document.getElementById("meter-bg-bar");
    // Get the current stroke-dashoffset
    let strokeDashoffset = parseFloat(
      window.getComputedStyle(meterBar).getPropertyValue("stroke-dashoffset")
    );
    // Calculate the current speed based on the stroke-dashoffset
    // The maximum stroke-dashoffset is 615, which corresponds to a speed of 0 km/h
    // The minimum stroke-dashoffset is 0, which corresponds to a speed of 180 km/h
    let speed = ((615 - strokeDashoffset) / 615) * 180;
    // Round the speed to the nearest integer
    speed = Math.round(speed);
    return speed;
  }
  // Function to update the speed display
  function updateSpeedDisplay() {
    // Calculate the current speed
    let speed = calculateSpeed();
    // Get the speed display element
    let speedDisplay = document.getElementById("speed");
    // Update the text content of the speed display element
    speedDisplay.textContent = speed;
    // speedDisplay.textContent = speed + ' km/h';
  }
  // Call the updateSpeedDisplay function every 100 milliseconds
  setInterval(updateSpeedDisplay, 100);
