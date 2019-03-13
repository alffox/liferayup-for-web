var liferayData;// Initialize empty variable. These data will be fetched once to prevent duplicate calls and reused in the app
var databaseVendors;
var documentStoreTypes;

var $liferayServicePackFormSelect;
var $liferayApplicationServerFormSelect;
var $liferayDatabaseFormSelect;
var $liferaySettingsFormSelect;
var submitButton;

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

            var selectedLiferayVersion = event.target.value;

            if (selectedLiferayVersion == 6210) {
                selectedLiferayVersionIndex = 1;

                appServers = ["tomcat", "jboss", "glassfish"];
            }
            else if (selectedLiferayVersion == 7010) {
                selectedLiferayVersionIndex = 2;

                appServers = ["tomcat", "jboss", "wildfly"];
            }
            else if (selectedLiferayVersion == 7110) {
                selectedLiferayVersionIndex = 3;
                appServers = ["tomcat", "wildfly"];
            }

            databaseVendors = ["hsql", "mysql", "oracle", "ms sql", "postgresql", "db2", "sysbase", "mariadb"];
            documentStoreTypes = ["fs", "adfs", "db", "cmis", "s3", "jcr"];

            commander.filterLiferayVersionServicePacks(selectedLiferayVersionIndex, appServers);
        };
    },

    filterLiferayVersionServicePacks: function (selectedLiferayVersionIndex, appServers) {
        LiferayVersionServicePacks = [];

        for (var i = 0; i < liferayData["service-packs"][selectedLiferayVersionIndex]["service-pack"].length; i++) {
            LiferayVersionServicePacks.push(liferayData["service-packs"][selectedLiferayVersionIndex]["service-pack"][i].name);
            
        }

        view.init();
        view.renderLiferayServicePacks(LiferayVersionServicePacks);
        view.renderLiferayappServers(appServers);
        view.renderLiferayDatabaseVendors(databaseVendors);
        view.renderLiferaydocumentStoreTypes(documentStoreTypes);
        commander.getData();
    },

    getData: function () {
        document.getElementById('form-submit').addEventListener("click", function (event) {
            event.preventDefault();

            var LiferayVersion = document.getElementById('liferayVersionFormSelect');
            var selectedLiferayVersion = LiferayVersion.options[LiferayVersion.selectedIndex].value;

            var selectedLiferayServicePack = $liferayServicePackFormSelect.options[$liferayServicePackFormSelect.selectedIndex].value;
            var selectedLiferayApplicationServer = $liferayApplicationServerFormSelect.options[$liferayApplicationServerFormSelect.selectedIndex].value;
            var selectedLiferayDatabase = $liferayDatabaseFormSelect.options[$liferayDatabaseFormSelect.selectedIndex].value;
            var selectedliferaySettingsFormSelect = $liferaySettingsFormSelect.options[$liferaySettingsFormSelect.selectedIndex].value;

            alert("The selected Liferay version is: " + selectedLiferayVersion + '\n'
                + "The selected Liferay Service Pack: " + selectedLiferayServicePack + '\n'
                + "The selected Liferay Application Server is: " + selectedLiferayApplicationServer + '\n'
                + "The selected Liferay Database is: " + selectedLiferayDatabase + '\n'
                + "The selected Liferay Document Store Type is: " + selectedliferaySettingsFormSelect + '\n');
        });
    }

};

var view = {// Render data on the interface

    init: function () {
        $liferayServicePackFormSelect = document.getElementById('liferayServicePackFormSelect');
        $liferayApplicationServerFormSelect = document.getElementById('liferayApplicationServerFormSelect');
        $liferayDatabaseFormSelect = document.getElementById('liferayDatabaseFormSelect');
        $liferaySettingsFormSelect = document.getElementById('liferaySettingsFormSelect');
        submitButton = document.getElementById('form-submit');

        disabledFields = [$liferayServicePackFormSelect, $liferayApplicationServerFormSelect, $liferayDatabaseFormSelect, $liferaySettingsFormSelect, submitButton];

        for (var i = 0; i < disabledFields.length; i++) {
            disabledFields[i].removeAttribute("disabled");
        }

    },

    renderLiferayVersions: function (liferayVersions) {
        var $liferayVersionFormSelect = document.getElementById('liferayVersionFormSelect');

        for (var i = 0; i < liferayVersions.length; i++) {
            var optionNode = document.createElement("option");
            $liferayVersionFormSelect.appendChild(optionNode);
            optionNode.value = liferayVersions[i];
            optionNode.textContent = liferayVersions[i];
        }
        commander.getLiferayVersion();// Correct values stored in DOM, now let's call commander.getLiferayVersion() method to bind change listener event and get the selected data
    },

    cleanPreviousSelection: function(DOMElement) {
        while (DOMElement.firstChild) {
            DOMElement.removeChild(DOMElement.firstChild);
        }
    },

    renderLiferayServicePacks: function (LiferayVersionServicePacks) {
        view.cleanPreviousSelection($liferayServicePackFormSelect);

        for (var i = 0; i < LiferayVersionServicePacks.length; i++) {
            var optionNode = document.createElement("option");
            $liferayServicePackFormSelect.appendChild(optionNode);
            optionNode.value = "SP" + LiferayVersionServicePacks[i];
            optionNode.textContent = "SP" + LiferayVersionServicePacks[i];
        }

    },

    renderLiferayappServers: function (appServers) {
        view.cleanPreviousSelection($liferayApplicationServerFormSelect);

        for (var i = 0; i < appServers.length; i++) {
            var optionNode = document.createElement("option");
            $liferayApplicationServerFormSelect.appendChild(optionNode);
            optionNode.value = appServers[i];
            optionNode.textContent = appServers[i];
        }
    },

    renderLiferayDatabaseVendors: function (databaseVendors) {

        view.cleanPreviousSelection($liferayDatabaseFormSelect);

        for (var i = 0; i < databaseVendors.length; i++) {
            var optionNode = document.createElement("option");
            $liferayDatabaseFormSelect.appendChild(optionNode);
            optionNode.value = databaseVendors[i];
            optionNode.textContent = databaseVendors[i];
        }
    },

    renderLiferaydocumentStoreTypes: function (documentStoreTypes) {

        view.cleanPreviousSelection($liferaySettingsFormSelect);
        
        for (var i = 0; i < documentStoreTypes.length; i++) {
            var optionNode = document.createElement("option");
            $liferaySettingsFormSelect.appendChild(optionNode);
            optionNode.value = documentStoreTypes[i];
            optionNode.textContent = documentStoreTypes[i];
        }
    }

};