// ==UserScript==
// @name         Remove YouTube Startpage
// @description  Redirect to Subscriptions Page
// @version      0.3
// @author       hyperacuity
// @match        https://www.youtube.com/*
// @namespace    https://github.com/hyperacuity/userscripts
// @icon         https://github.com/hyperacuity/userscripts/raw/main/assets/youtube.png
// @updateURL    https://github.com/hyperacuity/userscripts/raw/main/youtube/remove-youtube-startpage.user.js
// @downloadURL  https://github.com/hyperacuity/userscripts/raw/main/youtube/remove-youtube-startpage.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    function mobs_cb(muts, obs) {
        if(window.location.pathname === "/"){
            window.location.pathname = "/feed/subscriptions";
        }
    }

    mobs_cb(null, null);

    window.addEventListener('load', (event) => {
        console.info(`Loaded ${Date.now()}`);
        mobs_cb(null, null);

        const start_mobs = new MutationObserver(mobs_cb);
        start_mobs.observe( document.querySelector("body"), {childList: true, subtree: true})
    });

})();