var model = {};//Load data locally or from a remote server

var commander = {
    initData: function () {
        commander.getLiferayVersions();
    },

    getLiferayVersions: function () {
        var liferayVersions;
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                liferayVersions = JSON.parse(xhr.responseText);
                console.log(liferayVersions["service-packs"]);
            } else {//throw error
                console.log("There was an error fetching the data");
            }
        };

        xhr.open('GET', './info.json'); // This file is the local json copy of https://files.liferay.com/public/support/patching-tool-info.xml
        xhr.send();
    };

},

var view = {};