// ==UserScript==
// @name         Impair YouTube Shorts
// @description  Redirect Shorts to normal YouTube Player
// @version      0.4
// @author       hyperacuity
// @match        https://www.youtube.com/*
// @namespace    https://github.com/hyperacuity/userscripts
// @icon         https://github.com/hyperacuity/userscripts/raw/main/assets/youtube.svg
// @updateURL    https://github.com/hyperacuity/userscripts/raw/main/youtube/impair-youtube-shorts.user.js
// @downloadURL  https://github.com/hyperacuity/userscripts/raw/main/youtube/impair-youtube-shorts.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    function mobs_cb(muts, mobs) {
        if(window.location.pathname.startsWith("/shorts/")) {
            const url = new URL(window.location);
            url.searchParams.set("v", url.pathname.replace("/shorts/", ""));
            url.pathname = "/watch";
            window.location = url;
        }
    }

    mobs_cb(null, null);

    window.addEventListener('load', (event) => {
        console.info("Loaded");
        mobs_cb(null, null);

        const shorts_mobs = new MutationObserver(mobs_cb);
        shorts_mobs.observe( document.querySelector("body"), {childList: true, subtree: true})
    });

})();