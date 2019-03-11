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

                appServers = ["Tomcat","JBoss","Glassfish"];
            }
            else if (selectedLiferayVersion == 7010) {
                selectedLiferayVersionIndex = 2;

                appServers = ["Tomcat","JBoss","WildFly"];
            }
            else if (selectedLiferayVersion == 7110) {
                selectedLiferayVersionIndex = 3;
                appServers = ["Tomcat","WildFly"];
            }

            databaseVendors = ["HSQL","MySQL","Oracle","MS SQL","PostgreSQL","DB2","Sysbase","MariaDB"];
            documentStoreTypes = ["FS","ADFS","DB","CMIS","S3","JCR"];
    
            commander.filterLiferayVersionServicePacks(selectedLiferayVersionIndex,appServers);
        }
    },

    filterLiferayVersionServicePacks: function (selectedLiferayVersionIndex,appServers) {
        LiferayVersionServicePacks = [];

        for (var i = 0; i < liferayData["service-packs"][selectedLiferayVersionIndex]["service-pack"].length; i++) {

            LiferayVersionServicePacks.push({
            "name": (liferayData["service-packs"][selectedLiferayVersionIndex]["service-pack"][i].name),
            "fixpacks": (liferayData["service-packs"][selectedLiferayVersionIndex]["service-pack"][i]["fix-packs"])
            });
        }

        view.init();
        view.renderLiferayServicePacks(LiferayVersionServicePacks);
        view.renderLiferayappServers(appServers);
        view.renderLiferayDatabaseVendors(databaseVendors);
        view.renderLiferaydocumentStoreTypes(documentStoreTypes);
        commander.getData();
    },

    getData: function () {
        document.getElementById('form-submit').addEventListener("click", function(event){
            event.preventDefault();

            var LiferayVersion = document.getElementById('liferayVersionFormSelect');
            var selectedLiferayVersion = LiferayVersion.options[LiferayVersion.selectedIndex].text;

            var selectedLiferayServicePackNumberName = $liferayServicePackFormSelect.options[$liferayServicePackFormSelect.selectedIndex].text;
            var selectedLiferayApplicationServer = $liferayApplicationServerFormSelect.options[$liferayApplicationServerFormSelect.selectedIndex].text;
            var selectedLiferayDatabase = $liferayDatabaseFormSelect.options[$liferayDatabaseFormSelect.selectedIndex].text;
            var selectedliferaySettingsFormSelect = $liferaySettingsFormSelect.options[$liferaySettingsFormSelect.selectedIndex].text;

            alert("The selected Liferay version is: " + selectedLiferayVersion + '\n'
            + "The selected Liferay Service Pack number and name are: " + selectedLiferayServicePackNumberName + '\n'
            + "The selected Liferay Application Server is: " + selectedLiferayApplicationServer + '\n'
            + "The selected Liferay Database is: " + selectedLiferayDatabase + '\n'
            + "The selected Liferay Document Store Type is: " + selectedliferaySettingsFormSelect + '\n')
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

        disabledFields = [$liferayServicePackFormSelect,$liferayApplicationServerFormSelect,$liferayDatabaseFormSelect,$liferaySettingsFormSelect,submitButton];

        for (var i = 0; i < disabledFields.length; i++) {
            disabledFields[i].removeAttribute("disabled");
        }

    },

    renderLiferayVersions: function (liferayVersions) {
        var $liferayVersionFormSelect = document.getElementById('liferayVersionFormSelect');

        for (var i = 0; i < liferayVersions.length; i++) {
            var optionNode = document.createElement("option");
            $liferayVersionFormSelect.appendChild(optionNode);
            optionNode.textContent = liferayVersions[i];
        }
        commander.getLiferayVersion();// Correct values stored in DOM, now let's call commander.getLiferayVersion() method to bind change listener event and get the selected data
    },

    renderLiferayServicePacks: function(LiferayVersionServicePacks) {

        while ($liferayServicePackFormSelect.firstChild) {
            $liferayServicePackFormSelect.removeChild($liferayServicePackFormSelect.firstChild);
        }

        for (var i = 0; i < LiferayVersionServicePacks.length; i++) {
            var optionNode = document.createElement("option");
            $liferayServicePackFormSelect.appendChild(optionNode);
            optionNode.textContent = "Service Pack " + LiferayVersionServicePacks[i].name + ' - ' + 'Name: ' + LiferayVersionServicePacks[i].fixpacks;
        }

    },

    renderLiferayappServers: function (appServers) {

        while ($liferayApplicationServerFormSelect.firstChild) {
            $liferayApplicationServerFormSelect.removeChild($liferayApplicationServerFormSelect.firstChild);
        }

        for (var i = 0; i < appServers.length; i++) {
            var optionNode = document.createElement("option");
            $liferayApplicationServerFormSelect.appendChild(optionNode);
            optionNode.textContent = appServers[i];
        }
    },
    
    renderLiferayDatabaseVendors: function (databaseVendors) {

        while ($liferayDatabaseFormSelect.firstChild) {
            $liferayDatabaseFormSelect.removeChild($liferayDatabaseFormSelect.firstChild);
        }

        for (var i = 0; i < databaseVendors.length; i++) {
            var optionNode = document.createElement("option");
            $liferayDatabaseFormSelect.appendChild(optionNode);
            optionNode.textContent = databaseVendors[i];
        }
    },

    renderLiferaydocumentStoreTypes: function (documentStoreTypes) {

        while ($liferaySettingsFormSelect.firstChild) {
            $liferaySettingsFormSelect.removeChild($liferaySettingsFormSelect.firstChild);
        }

        for (var i = 0; i < documentStoreTypes.length; i++) {
            var optionNode = document.createElement("option");
            $liferaySettingsFormSelect.appendChild(optionNode);
            optionNode.textContent = documentStoreTypes[i];
        }
        }

};