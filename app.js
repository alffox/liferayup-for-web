var model = {//Load data locally or remotely

    getLiferayVersions: function () {
        var liferayData;
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                liferayData = JSON.parse(xhr.responseText);
                liferayVersions = liferayData["service-packs"];

                // Find all versions equal or major than 6.2
                for (var i = 1; i < liferayData["service-packs"].length; i++) {
                    console.log("fetched version: " + liferayData["service-packs"][i].version);
                }

            } else {//throw error
                console.log("There was an error fetching the data");
            }
        };

        xhr.open('GET', './info.json'); // This file is the local json copy of https://files.liferay.com/public/support/patching-tool-info.xml
        xhr.send();

    }
};

var commander = {//Actual logic
    initData: function () {
        model.getLiferayVersions();
    }
};

var view = {//Render data on the interface

};

commander.initData();//Ignite the app !