
function addPulseScript() {
    const script = document.createElement('script');
    script.id = 'pulse_id'; 
    script.type = 'application/javascript';
    script.src = 'https://medront.s3.amazonaws.com/fileuploads/pulse.js';
    script.setAttribute('pulseId', '8ebbb07f-2660-4eec-a24e-7ba9b0883ed1');
    script.async = true; 
    document.head.appendChild(script);
}

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

// Export as a global variable or module
window.pulseUtils = {
    addPulseScript,
    generateUniqueId,
    getVisitorId,
    getSessionId
};