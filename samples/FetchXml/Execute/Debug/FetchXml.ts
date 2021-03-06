﻿/// <reference path="JSBridge.d.ts"/>

function executeFromXml(resultFormat: string) {
    var xmlFetch = "<fetch resultformat='" + resultFormat + "' aggregate='false'>" +
        "<entity name='salesorder'>" +
        "<attribute name='name' />" +
        "<attribute name='shipto_city' />" +
        "<attribute name='shipto_line1' />" +
        "<attribute name='totalamount' />" +
        "<filter>" +
        "<condition attribute='name' operator='like' value='Bike%'  />" +
        "<condition attribute='totalamount' operator='gt' value='1500'  />" +
        "</filter>" +
        "</entity>" +
        "</fetch>";;

    MobileCRM.FetchXml.Fetch.executeFromXML(xmlFetch, (result) => {
        if (result.length < 1) {
            MobileCRM.bridge.alert("Not any order begins with 'Bike' and total amount grater than 1500 was found");
        }
        else {
            let info = "Info [Missing ship - to address]: \n";
            switch (resultFormat) {
                case "Array":
                    for (let i in result) {
                        let entity = result[i];
                        /// Append orders what doesn't have filled 'ship to address' to info message
                        /// indexes are ordered by attributes in xml
                        let shipToCity = entity[1]
                        let shipToAddress = entity[2];
                        if (!(shipToAddress && shipToCity))
                            info += "\nName: " + entity[0] + " Total amount: " + entity[2];
                    }
                    break;
                case "JSON":
                    for (let i in result) {
                        let entity = result[i];

                        let shipToCity = entity.shipto_city
                        let shipToAddress = entity.shipto_line1;
                        if (!(shipToAddress && shipToCity))
                            info += "\nName: " + entity.name + " Total amount: " + entity.totalamount;
                    }
                    break;
                default: //DynamicEntities
                    for (let i in result) {
                        let entity = result[i] as MobileCRM.DynamicEntity;

                        let shipToCity = entity.properties.shipto_city
                        let shipToAddress = entity.properties.shipto_line1;
                        if (!(shipToAddress && shipToCity))
                            info += "\nName: " + entity.primaryName + " Total amount: " + entity.properties.totalamount;
                    }
                    break;
            }
            MobileCRM.bridge.alert(info);
        }
    }, MobileCRM.bridge.alert, null);
}


function executeFetch(online) {
    var fetchEntity = new MobileCRM.FetchXml.Entity("salesorder");
    fetchEntity.addAttribute("name");
    fetchEntity.addAttribute("shipto_city");
    fetchEntity.addAttribute("totalamount");

    var filter = new MobileCRM.FetchXml.Filter();
    filter.type = "and";

    var cond1 = new MobileCRM.FetchXml.Condition();
    cond1.attribute = "name";
    cond1.operator = "like";
    cond1.value = "Bike%";

    var cond2 = new MobileCRM.FetchXml.Condition();
    cond2.attribute = "totalamount";
    cond2.operator = "gt"
    cond2.value = "1500%";

    filter.conditions.push(cond1, cond2);

    fetchEntity.filter = filter;

    var fetch = new MobileCRM.FetchXml.Fetch(fetchEntity);
    let info = "Info [Missing ship - to address]: \n";
    if (online) {
        fetch.executeOnline("DynamicEntities", function (result) {
            if (result.length < 1) {
                MobileCRM.bridge.alert("Not any order begins with 'Bike' and total amount grater than 1500 was found");
            }
            else {
                for (var i in result) {
                    var entity = result[i];
                    var shipToCity = entity.properties.shipto_city;
                    var shipToAddress = entity.properties.shipto_line1;
                    if (!(shipToAddress && shipToCity))
                        info += "\nName: " + entity.primaryName + " Total amount: " + entity.properties.totalamount;
                }
            }
            MobileCRM.bridge.alert(info);
        }, MobileCRM.bridge.alert, null);
    }
    else {
        fetch.executeOffline("DynamicEntities", function (result) {
            if (result.length < 1) {
                MobileCRM.bridge.alert("Not any order begins with 'Bike' and total amount grater than 1500 was found");
            }
            else {
                for (var i in result) {
                    var entity = result[i];
                    var shipToCity = entity.properties.shipto_city;
                    var shipToAddress = entity.properties.shipto_line1;
                    if (!(shipToAddress && shipToCity))
                        info += "\nName: " + entity.primaryName + " Total amount: " + entity.properties.totalamount;
                }
            }
            MobileCRM.bridge.alert(info);   
        }, MobileCRM.bridge.alert, null);
    }
}


function executeAsync() {
    var fetchEntity = new MobileCRM.FetchXml.Entity("salesorder");
    fetchEntity.addAttribute("name");
    fetchEntity.addAttribute("shipto_city");
    fetchEntity.addAttribute("totalamount");

    var filter = new MobileCRM.FetchXml.Filter();
    filter.type = "and";

    var cond1 = new MobileCRM.FetchXml.Condition();
    cond1.attribute = "name";
    cond1.operator = "like";
    cond1.value = "Bike%";

    var cond2 = new MobileCRM.FetchXml.Condition();
    cond2.attribute = "totalamount";
    cond2.operator = "gt"
    cond2.value = "1500%";

    filter.conditions.push(cond1, cond2);

    fetchEntity.filter = filter;

    var fetch = new MobileCRM.FetchXml.Fetch(fetchEntity);

    var info = "Info [Missing ship - to address]: \n";

    fetch.executeAsync(null).then((result) => { // "null" stands for default "DynamicEntities" result format
        if (result.length < 1) {
            MobileCRM.bridge.alert("Not any order begins with 'Bike' and total amount grater than 1500 was found");
        }
        else {
            for (var i in result) {
                var entity = result[i];
                var shipToCity = entity.properties.shipto_city;
                var shipToAddress = entity.properties.shipto_line1;
                if (!(shipToAddress && shipToCity))
                    info += "\nName: " + entity.primaryName + " Total amount: " + entity.properties.totalamount;
            }
        }
        MobileCRM.bridge.alert(info); 
    }).catch((err) => {
        MobileCRM.bridge.alert(err);
    });
}