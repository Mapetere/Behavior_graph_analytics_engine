(function () {
    const API_URL = "http://localhost:8000/event";
    let userId = localStorage.getItem("analytics_user_id");

    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("analytics_user_id", userId);
    }

    const events = [];
    const BATCH_SIZE = 5;
    let lastMouseMove = Date.now();
    let currentUrl = window.location.href;

    // Helper to send events
    function sendEvent(type, details = {}) {
        const payload = {
            user_id: userId,
            type: type,
            url: window.location.href, // Always send current URL
            timestamp: Date.now() / 1000,
            details: details
        };

        // Immediate send for critical events, queue for high-frequency
        if (type === 'pageview' || type === 'leave') {
            fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }).catch(console.error);
        } else {
            // For simplicity in this demo, sending individual clicks immediately is fine
            // In prod, you'd batch.
            fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }).catch(console.error);
        }
    }

    // Track Pageview
    sendEvent("pageview");

    // Track Clicks
    document.addEventListener("click", (e) => {
        sendEvent("click", {
            x: e.clientX,
            y: e.clientY,
            target: e.target.tagName + (e.target.id ? '#' + e.target.id : '')
        });
    });

    // Hesitation Detection (Idle/Dwell)
    let idleTimer;
    const IDLE_THRESHOLD = 3000; // 3 seconds

    document.addEventListener("mousemove", () => {
        clearTimeout(idleTimer);
        lastMouseMove = Date.now();
        idleTimer = setTimeout(() => {
            // User has been idle for 3 seconds
            sendEvent("hesitation", { reason: "idle", duration: 3 });
        }, IDLE_THRESHOLD);
    });

    // Detect Rage Clicks (simple)
    let clickCount = 0;
    let clickTimer;
    document.addEventListener("click", () => {
        clickCount++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            if (clickCount >= 3) {
                sendEvent("hesitation", { reason: "rage_click", count: clickCount });
            }
            clickCount = 0;
        }, 1000);
    });

    // Detect URL changes (SPA support)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            sendEvent("pageview");
        }
    }).observe(document, { subtree: true, childList: true });

    console.log("Behavior Analytics Initialized for User:", userId);

})();
