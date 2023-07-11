// ==UserScript==
// @name          Export Saved Reddit Content
// @ description  Visit https://old.reddit.com/user/me and click on the saved tab, wait, and download json
// @ version      0.2
// @ author       hyperacuity
// @match         https://old.reddit.com/user/*/saved*
// @ namespace    https://github.com/hyperacuity/userscripts
// @ updateURL    https://github.com/hyperacuity/userscripts/raw/main/reddit/export-reddit-saved.user.js
// @ downloadURL  https://github.com/hyperacuity/userscripts/raw/main/reddit/export-reddit-saved.user.js
// @ grant        none
// ==/UserScript==


// from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
async function hashMessage(msg) {
  const msgUint8 = new TextEncoder().encode(msg); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}


(function() {
    'use strict';

  // https://old.reddit.com/user/*/saved/
  var saved = document.querySelectorAll(".saved");
  const request = indexedDB.open("us-export-saved", 2);

  request.onerror = (event) => {
      console.error(event);
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    const objectStore = db.createObjectStore("object-cache");
    objectStore.createIndex("url", "url", { unique: false });
    console.log("database created");
  };


  request.onsuccess = async () => {
    let db = request.result;

    var dbobjs = [];
    let bb = Array.from(saved);

    await Promise.all(bb.map(async (item) => {
        var perma = "https://old.reddit.com" + item.getAttribute("data-permalink");
        let hash = await hashMessage(perma);

        var sub =  item?.getAttribute("data-subreddit");
        var author = item?.getAttribute("data-author");


        if(item.classList.contains("link")) {
            var type = "link";
            var time = item?.getAttribute("data-timestamp");
            var score = item?.getAttribute("data-score");
            var op_link = item?.getAttribute("data-url");
            var op_title = item?.getElementsByClassName("title")?.[0]?.innerText;
            var content = null;
        } else {
            var type = "comment";
            var time = item?.getElementsByTagName("time")?.[0]?.getAttribute("datetime"); // todo: normalize timestamp
            var score = item?.getElementsByClassName("score likes")?.[0]?.getAttribute("title");
            var op_link = item?.getElementsByClassName("title")?.[0]?.getAttribute("href");
            var op_title = item?.getElementsByClassName("title")?.[0]?.innerText;
            var content = item?.getElementsByClassName("usertext-body")?.[0]?.innerHTML;
        }

        dbobjs.push({key: hash, url: perma, type, op_link, op_title, sub, author, time, score, content});
    }));

    //console.log(dbobjs);
    const store = db.transaction("object-cache", "readwrite").objectStore("object-cache");

    dbobjs.forEach(elem => {
        //console.log(elem);

        let req = store.put(elem, [elem.key]);
        //console.log(req);

        req.onsuccess = () => {
          console.log("added object", req.result[0]);
        };

        req.onerror = () => {
          console.log("error: ", req.error);
        };
    });

    setTimeout(()=>{
      try {
        document.querySelectorAll(".next-button")[0].getElementsByTagName("a")[0].click();
      } catch {
        alert("loading done\npress export in the sidebar");
      }
    }, 2500);

  };

  async function download_export() {
    var username = document.querySelectorAll(".user")[0].getElementsByTagName("a")[0].innerText.toLowerCase();

    const dbreq = indexedDB.open("us-export-saved", 2);

    dbreq.onsuccess = () => {
        let db = dbreq.result;

        const store = db.transaction("object-cache", "readwrite").objectStore("object-cache");

        var request = store.getAll()

        request.onsuccess = () => {
          if (request.result !== undefined) {

            var content = JSON.stringify(request.result);

            var name = "saved-content-by-"+username+'.json';
            var type = 'text/plain';
            var a = document.getElementById("download-export-saved");
            var file = new Blob([content], {type: type});
            var furl = URL.createObjectURL(file);

            a.href = furl;
            a.download = name;
            a.click();

          } else {
            console.log("no results");
          }
        };
    }
  }

  document.download_export = download_export;

  //add export button to sidebar
  var position = document.querySelectorAll(".titlebox")[0].getElementsByClassName('bottom')[0];
  var html = "<a href=\"\" id=\"download-export-saved\"></a><button class=\"karma\" onclick=\"document.download_export()\">click here to download your file</button>"
  position.insertAdjacentHTML("beforebegin", html);



  async function delete_db() {
    var req = indexedDB.deleteDatabase("us-export-saved");
    req.onsuccess = () => {
        alert("deleted database successfully\n"+req.result);
    };
    req.onerror = () => {
      alert(req.error);
    };
    req.onblocked = () => {
      alert("database blocked\ndeleting on reload");
    };
  }

  document.delete_db = delete_db;

  //add delete object cache button
  var html = "<button onclick=\"document.delete_db()\">delete object-cache</button>"
  position.insertAdjacentHTML("beforebegin", html);

})();
