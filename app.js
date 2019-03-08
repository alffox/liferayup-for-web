var liferayData;// Initialize empty variable. These data will be fetched once to prevent duplicate calls and reused in the app

var xhr = new XMLHttpRequest();// Fetch data asynchronously with this plain XMLHttpRequest to preserve IE11 compatibility 
xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
        liferayData = JSON.parse(xhr.responseText);// Store data globally

        commander.initData(liferayData);
    } else {//throw error
        console.log("There was an error fetching the data");
    }
};

xhr.open('GET', './info.json');// This file is the local json copy of https://files.liferay.com/public/support/patching-tool-info.xml
xhr.send();

var commander = {// Actual logic

    initData: function () {
        console.log(liferayData);
        commander.filterLiferayVersions(liferayData);
    },

    filterLiferayVersions: function (liferayData) {

        liferayVersions = [];// Initializes empty versions array

        for (var i = 1; i < liferayData["service-packs"].length; i++) {
            liferayVersions.push(liferayData["service-packs"][i].version);// Populates liferayVersions empty array with 6.2+ Liferay versions
        }
        view.renderLiferayVersions(liferayVersions);// Delegate the rendering
    },

    getLiferayVersion: function () {// Listen to change event on Liferay version select fields and get the value upon choosing
        document.querySelector('select[id="liferayVersionFormSelect"]').onchange = function (event) {
            alert(event.target.value);
        }
    }

};

var view = {// Render data on the interface

    renderLiferayVersions: function (liferayVersions) {
        var $liferayVersionFormSelect = document.getElementById('liferayVersionFormSelect');

        for (var i = 0; i < liferayVersions.length; i++) {
            var optionNode = document.createElement("option");
            optionNode.setAttribute("class", "portal-version");
            $liferayVersionFormSelect.appendChild(optionNode);
            optionNode.textContent = liferayVersions[i];
        }
        commander.getLiferayVersion();// Correct values stored in DOM, now let's call commander.getLiferayVersion() method to bind change listener event and get the selected data
    }

};