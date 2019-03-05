var xhr = new XMLHttpRequest();
xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
        console.log(JSON.parse(xhr.responseText));
    } else {
        console.log(JSON.parse(xhr.responseText));
    }

};

xhr.open('GET', './info.json'); // This file is the local json copy of https://files.liferay.com/public/support/patching-tool-info.xml
xhr.send();
