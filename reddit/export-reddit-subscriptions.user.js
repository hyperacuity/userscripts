// ==UserScript==
// @name         Export Subreddits
// @description  Visit your subscriptions at https://old.reddit.com/subreddits/mine/ and click on the link in the sidebar
// @version      1.0
// @author       hyperacuity
// @match        https://old.reddit.com/subreddits/mine/
// @namespace    https://github.com/hyperacuity/userscripts
// @updateURL    https://github.com/hyperacuity/userscripts/raw/main/reddit/export-reddit-subscriptions.user.js
// @downloadURL  https://github.com/hyperacuity/userscripts/raw/main/reddit/export-reddit-subscriptions.user.js
// @grant        none
// ==/UserScript==

// Adapted from this script by Fergo
// https://greasyfork.org/en/scripts/407916-multireddit-followed-users

(function() {
    'use strict';

    var subs = [];
    var position = document.querySelectorAll(".subscription-box")[0].getElementsByTagName('ul')[0].getElementsByTagName('a')[0];
    var subscribed = document.querySelectorAll(".subscription-box")[0].getElementsByTagName('ul')[0].querySelectorAll('li');
    var username = document.querySelectorAll(".user")[0].getElementsByTagName("a")[0].innerText.toLowerCase();

    subscribed.forEach((item, index) => {
    var subName = item.getElementsByClassName('title')[0].innerHTML;
      subs.push(subName);
    });

    //console.log(subs)
    var html = "<a download=\"subreddits-from-" + username + ".md\" href=\"data:text/plain;charset=utf-8," + "%23%20" + username + "%0A%0A" + subs.join("%0A") + "\" class=\"title\">download a list(" + subs.length + ") of subscribed subs</a><br><br>"
    position.insertAdjacentHTML("beforebegin", html);
})();

