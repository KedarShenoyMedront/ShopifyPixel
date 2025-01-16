
// function addPulseScript() {
//     const script = document.createElement('script');
//     script.id = 'pulse_id'; 
//     script.type = 'application/javascript';
//     script.src = 'https://medront.s3.amazonaws.com/fileuploads/pulse.js';
//     script.setAttribute('pulseId', '8ebbb07f-2660-4eec-a24e-7ba9b0883ed1');
//     script.async = true; 
//     document.head.appendChild(script);
// }

// function generateUniqueId() {
//     return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//         const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
//         return v.toString(16);
//     });
// }

// function getVisitorId() {
//     let visitorId = localStorage.getItem('visitorId');
//     if (!visitorId) {
//         visitorId = generateUniqueId();
//         localStorage.setItem('visitorId', visitorId);
//     }
//     return visitorId;
// }

// function getSessionId() {
//     let sessionId = sessionStorage.getItem('sessionId');
//     if (!sessionId) {
//         sessionId = generateUniqueId();
//         sessionStorage.setItem('sessionId', sessionId);
//     }
//     return sessionId;
// }

// // Export as a global variable or module
// window.pulseUtils = {
//     addPulseScript,
//     generateUniqueId,
//     getVisitorId,
//     getSessionId
// };


var navigatorAlias = navigator,
windowAlias = window,
screenAlias = window.screen,
locationAlias = window.location;

// Helper function to determine if the device is mobile
function isMobile() {
return /Mobi|Android/i.test(navigatorAlias.userAgent);
}

// Function to get the device dimensions (width and height of the screen)
const getDeviceDimensions = () => {
return {
  width: screenAlias.width,
  height: screenAlias.height
};
};

// Example event object with device details
let device = {
  brands: navigatorAlias.userAgentData && navigatorAlias.userAgentData.brands? navigatorAlias.userAgentData.brands : navigatorAlias.appCodeName,
  platform: navigatorAlias.userAgentData && navigatorAlias.userAgentData.platform ? navigatorAlias.userAgentData.platform : navigatorAlias.platform,
  deviceDimensions: getDeviceDimensions(),
  device: isMobile() ? "Mobile" : "Desktop"
};

function generateUniqueId() {
    return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


function getVisitorId() {
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
        visitorId = generateUniqueId();
        localStorage.setItem('visitorId', visitorId);
    }
    return visitorId;
}

function getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = generateUniqueId();
        sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

// async function enrichAndSendEvent(event) {
//     try {
//         const navigatorAlias = navigator, screenAlias = window.screen;

//         // Check if device is mobile
//         const isMobile = () => /Mobi|Android/i.test(navigatorAlias.userAgent);

//         // Get device dimensions
//         const getDeviceDimensions = () => ({
//             width: screenAlias.width,
//             height: screenAlias.height,
//         });

//         // Device details
//         const device = {
//             brands: navigatorAlias.userAgentData?.brands || navigatorAlias.appCodeName,
//             platform: navigatorAlias.userAgentData?.platform || navigatorAlias.platform,
//             deviceDimensions: getDeviceDimensions(),
//             device: isMobile() ? "Mobile" : "Desktop",
//         };

//         // Get visitor and session IDs
//         const visitorId = getVisitorId();
//         const sessionId = getSessionId();

//         // Enrich the event
//         const enrichedEvent = {
//             ...event,
//             PulseSource: 'Shopify',
//             visitorId,
//             sessionId,
//             fingerprint: 'testing', // Replace with ThumbmarkJS logic if required
//             device,
//             pixel_id: "052908a0-0a37-44ee-bab7-a34fe5cb0b17",
//         };

//         console.log("Sending enriched event to server:", enrichedEvent);

//         // Send enriched event to the server
//         const response = await fetch('https://devserver.booleanmaths.com/node/pixel/trackevents', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(enrichedEvent),
//             keepalive: true,
//         });

//         console.log("Event sent, response:", response);
//     } catch (err) {
//         console.error("Error enriching or sending event:", err);
//     }
// }

async function enrichAndSendEvent(event,pixelID) {
    // if (typeof analytics === "undefined") {
    //     console.warn("Analytics is undefined. Cannot process event:", event);
    //     return;
    // }
    const fpjsScript = await import(
    "https://cdn.jsdelivr.net/npm/@thumbmarkjs/thumbmarkjs/dist/thumbmark.umd.js"
);

const fpjsRes = await ThumbmarkJS.getFingerprint();
console.log("fpjsRes", fpjsRes);
    console.log("Processing event with analytics:", event);

    try {
        // Enrich the event with visitorId and sessionId
        const visitorId = getVisitorId();
        const sessionId = getSessionId();

        const enrichedEvent = {
            ...event,
            PulseSource: "Shopify",
            visitorId,
            sessionId,
            pixel_id:pixelID,
            fingerprint: fpjsRes,
            device:device,
        };

        console.log("Enriched Event:", enrichedEvent);

        // Send the enriched event to the server
        fetch("https://devserver.booleanmaths.com/node/pixel/trackevents", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(enrichedEvent),
            keepalive: true,
        }).then((response) => {
            console.log("Event sent, response:", response);
        }).catch((error) => {
            console.error("Error sending event:", error);
        });
    } catch (err) {
        console.error("Error processing event:", err);
    }
}

// Export functions as part of pulseUtils
window.pulseUtils = {
    generateUniqueId,
    getVisitorId,
    getSessionId,
    enrichAndSendEvent,
};
