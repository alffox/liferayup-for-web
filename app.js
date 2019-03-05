var liferayData ;
var xhr = new XMLHttpRequest();
xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
        liferayData = JSON.parse(xhr.responseText);
        console.log(liferayData["service-packs"]);
    } else {//throw error
        console.log("There was an error fetching the data");
    }
};

xhr.open('GET', './info.json'); // This file is the local json copy of https://files.liferay.com/public/support/patching-tool-info.xml
xhr.send();