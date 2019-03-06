var model = {// Load data locally or remotely

    getLiferayData: function () {
        var liferayData;
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                liferayData = JSON.parse(xhr.responseText);

                console.log(liferayData);

                commander.getLiferayVersions(liferayData);

            } else {//throw error
                console.log("There was an error fetching the data");
            }
        };

        xhr.open('GET', './info.json');// This file is the local json copy of https://files.liferay.com/public/support/patching-tool-info.xml
        xhr.send();
    }

};

var commander = {// Actual logic

    initData: function () {
        model.getLiferayData();
    },

    getLiferayVersions: function (liferayData) {

        liferayVersions = [];// Initializes empty versions array

        // Populates liferayVersions empty array with value equal or major than 6.2
        for (var i = 1; i < liferayData["service-packs"].length; i++) {
            liferayVersions.push(liferayData["service-packs"][i].version);
        }
        view.renderLiferayVersions(liferayVersions);// Delegate the rendering
    }

};

var view = {// Render data on the interface

    renderLiferayVersions: function (liferayVersions) {
        var $liferayVersionFormSelect = document.getElementById('liferayVersionFormSelect');

        for (var i = 0; i < liferayVersions.length; i++) {
            var optionNode = document.createElement("option");
            $liferayVersionFormSelect.appendChild(optionNode);
            optionNode.textContent = liferayVersions[i];
        }
    }

};

commander.initData();// Ignite the app !