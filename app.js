var model = {//Load data locally or remotely

    getLiferayData: function () {
        var liferayData;
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                liferayData = JSON.parse(xhr.responseText);

                model.getLiferayVersions(liferayData);
                
            } else {//throw error
                console.log("There was an error fetching the data");
            }
        };

        xhr.open('GET', './info.json'); // This file is the local json copy of https://files.liferay.com/public/support/patching-tool-info.xml
        xhr.send();
    },

    getLiferayVersions: function (liferayData) {

        liferayVersions = [];
        
        // Find all versions equal or > 6.2
        for (var i = 1; i < liferayData["service-packs"].length; i++) {
            liferayVersions.push(liferayData["service-packs"][i].version);
        }
        console.log("array of versions is: " + liferayVersions);
    },

};

var commander = {//Actual logic
    initData: function () {
        model.getLiferayData();
    }
};

var view = {//Render data on the interface

};

commander.initData();//Ignite the app !