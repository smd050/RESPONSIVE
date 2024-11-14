document.addEventListener('DOMContentLoaded', () => {

  //Camera Access and Settings Section *************************************************************

    // Access the rear camera and show the feed in the video element
    const videoElement = document.getElementById('video');
    const recordSwitch = document.getElementById('recordSwitch');
    const overlayContent = document.getElementById('overlayContent'); // Your overlay div

    // Create the canvas for combining video and overlay
    const overlayCanvas = document.createElement('canvas');
    const overlayCtx = overlayCanvas.getContext('2d');

    // Variables for MediaRecorder and streams
    let mediaRecorder;
    let recordedChunks = [];
    let canvasStream;

    // Access the rear camera and display video with overlays
    async function startVideoStream() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment", width: 1500, height: 730 },
                audio: true
            });
            videoElement.srcObject = stream;

            // Wait until the video is fully loaded
            videoElement.addEventListener('loadeddata', () => {
                videoElement.play();
                console.log("Video is loaded and ready for drawing.");
                startCanvasDrawing();
            });
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    }

    // Function to start drawing video and overlays on the canvas
    function startCanvasDrawing() {
        // Set the canvas size to match the video dimensions
        overlayCanvas.width = 1500;
        overlayCanvas.height = 730;

        // Create a function that draws both video and overlay content
        function draw() {
            if (videoElement.srcObject && videoElement.readyState >= videoElement.HAVE_CURRENT_DATA) {
                const ctx = overlayCanvas.getContext('2d');
                ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height); // Clear canvas for each frame

                // Draw the video feed on the canvas
                ctx.drawImage(videoElement, 0, 0, overlayCanvas.width, overlayCanvas.height);

                // Draw the overlay content directly onto the canvas
                ctx.font = "30px Arial";
                ctx.fillStyle = "white";
                ctx.fillText("Overlay Content", 50, 50);

                // You can draw other overlay elements here like shapes, text, or gauges

                // Request the next frame
                requestAnimationFrame(draw);
            } else {
                console.log("Waiting for video to be fully ready for drawing...");
            }
        }

        // Start the drawing loop
        draw();

        // Capture the canvas as a MediaStream
        canvasStream = overlayCanvas.captureStream(30); // Capture at 30fps
        console.log("Canvas stream created:", canvasStream instanceof MediaStream);
    }

    // Start recording when record switch is checked
    function startRecording() {
        recordedChunks = [];
        if (canvasStream instanceof MediaStream) { // Verify canvasStream is a MediaStream
            mediaRecorder = new MediaRecorder(canvasStream, { mimeType: 'video/webm; codecs=vp8,opus' });

            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = saveRecording;
            mediaRecorder.start();
            console.log("Recording started...");
        } else {
            console.error("Error: canvasStream is not a valid MediaStream");
        }
    }

    // Stop recording and save file
    function stopRecording() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            console.log("Recording stopped...");
        }
    }

    // Save the recorded video to the user's device
    function saveRecording() {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'recording.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    // Toggle recording on recordSwitch click
    recordSwitch.addEventListener('change', () => {
        if (recordSwitch.checked) {
            startRecording();
        } else {
            stopRecording();
        }
    });

    // Initialize video stream on page load
    startVideoStream();

    // Toggle the red border on the main container based on the switch state
    document.getElementById('recordSwitch').addEventListener('change', function() {
        const videoContainer = document.getElementById('video-container');
        videoContainer.style.borderColor = this.checked ? 'red' : 'transparent';
    });



    //Speedometer widget function **********************************************************************

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




    //Lean Angle Section **********************************************************************************

    // Get the value of the <h5> element
    const angleValue = document.getElementById("leanAngle").textContent;

    // Get the slider element
    const leanSlider = document.getElementById("LeanSlider");

    // Set the slider value to the h5 value
    leanSlider.value = angleValue;
    leanSlider.addEventListener('input', function() {
        angleValue.textContent = this.value; // Update the label text with the current value of the slider
    });


    // Function to update h5 with a random number between 0 and 180
    function updateRandomNumber() {
        const randomNum = Math.floor(Math.random() * 120); // Generates a random number between 0 and 180
        angleValue.textContent = randomNum;
    }

    // Update the h5 text every 500 milliseconds (adjust as needed)
    setInterval(updateRandomNumber, 500);
    
    document.getElementById('speedSwitch').addEventListener('change', function() {
        const overlaySection = document.querySelector('.overlaySection1');
        // Toggle the hidden class based on the checkbox state
        if (this.checked) {
            overlaySection.classList.remove('hidden'); // Show content
        } else {
            overlaySection.classList.add('hidden'); // Hide content
        }
    });

    document.getElementById('LeanSwitch').addEventListener('change', function() {
        const overlaySection = document.querySelector('.overlaySection2');
        // Toggle the hidden class based on the checkbox state
        if (this.checked) {
            overlaySection.classList.remove('hidden'); // Show content
        } else {
            overlaySection.classList.add('hidden'); // Hide content
        }
    });

    document.getElementById('telemetrySwitch').addEventListener('change', function() {
        const overlaySection = document.querySelector('.overlaySection3');
        // Toggle the hidden class based on the checkbox state
        if (this.checked) {
            overlaySection.classList.remove('hidden'); // Show content
        } else {
            overlaySection.classList.add('hidden'); // Hide content
        }
    });




    //SOME MORE FUNCTIONS **************************************************************************************************************
    function updateLocation(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const speed = position.coords.speed; // Speed in meters per second (null if not available)
    
        // Displaying the latitude and longitude on the page
        document.getElementById("longitude").textContent = `Long: ${longitude.toFixed(3)}`;
        document.getElementById("latitude").textContent = `Lat: ${latitude.toFixed(3)}`;
        // Displaying the speed on the page (if available)
        if (speed !== null) {
            document.getElementById("speed").textContent = `Speed: ${speed.toFixed(2)} m/s`;
        } else {
            document.getElementById("speed").textContent = "Speed: Not available";
        }
    }
    
    function errorHandler(error) {
        document.getElementById("longitude").textContent = "Long:";
        document.getElementById("speed").textContent = "Speed: Not available";
    }
    
    // Check if geolocation is supported
    if (navigator.geolocation) {
        // Use watchPosition to get continuous location updates
        navigator.geolocation.watchPosition(updateLocation, errorHandler, {
            enableHighAccuracy: true, // Request more accurate results
            maximumAge: 0,            // Always get the latest position
            timeout: 5000             // Timeout after 5 seconds if no position is available
        });
    } else {
        document.getElementById("longitude").textContent = "Geolocation is not supported by this browser.";
        document.getElementById("speed").textContent = "Speed: Not available";
    }
    
    // Check if DeviceOrientation is supported
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
            const alpha = event.alpha || 0; // Rotation around z-axis
            const beta = event.beta || 0;   // Rotation around x-axis
            const gamma = event.gamma || 0; // Rotation around y-axis
    
            // Displaying the orientation data in XYZ format
            document.getElementById("Xaxis").textContent = `X: ${beta.toFixed(2)}`;
            document.getElementById("Yaxis").textContent = `Y: ${gamma.toFixed(2)}`;
            document.getElementById("Zaxis").textContent = `Z: ${alpha.toFixed(2)}`;


        }, false);
    } else {
        document.getElementById("Xaxis").textContent = `...`;
            document.getElementById("Yaxis").textContent = `...`;
            document.getElementById("Zaxis").textContent = `...`;
    }
    

});