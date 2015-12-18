/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    deviceId: '',
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        var buttons = $('.buttons');
        buttons.removeClass('buttons');
        buttons.addClass('buttons-show');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        var push = PushNotification.init(
            { 
                "android":
                {
                    "senderID": "595110986700"
                },
                "ios": 
                {
                    "alert": "true", 
                    "badge": "true", 
                    "sound": "true"
                }, 
                "windows": 
                {} 
            });
        console.log('PushNotification started');

        push.on('registration', function(data) {
            app.deviceId = data.registrationId;
            console.log(data.registrationId);
            document.getElementById('gcm_id').innerHTML = data.registrationId;
        });

        push.on('notification', function(data) {
            console.log(data);
            var dataToWrite = '';
            dataToWrite = data.message + '.<br />Redirecting to: '+data.additionalData.customData.redirectAction+'<br /><br />Raw data: '+JSON.stringify(data);
            
            $('.feedback').html(dataToWrite);
            //alert(data.title+" Message: " +data.message);
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
        });

        push.on('error', function(e) {
            console.log(e);
        });
    },
    registerWithPupil: function(pupilId){

        $.ajax({
            type: 'POST',
            url: 'http://push.dev.asgeiru.org/Register/Add',
            data: JSON.stringify({pupilId: pupilId, deviceId: app.deviceId, deviceType: device.platform }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(){
                app.addNotification('pupil '+pupilId+' registered to device.');
                console.log('pupil '+pupilId+' registered to device.');
            },
            error: function(e, s, error){
                app.addNotification("Error: "+error, "error");
                console.log('pupil '+pupilId+' not registered to device.');
            }
        });
    },
    disconnectDevice: function(){

        $.ajax({
            type: 'POST',
            url: 'http://push.dev.asgeiru.org/Register/Remove',
            data: JSON.stringify({deviceId: app.deviceId}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(){
                app.addNotification('Device has been disconnected');
                console.log('Device has been disconnected');
            },
            error: function(e, s, error){
                app.addNotification("Error: "+error, "error");
                console.log('Device has not been disconnected');
            }
        });
    },
    addNotification: function(textcontent, typeofnotification){
        if(typeof typeofnotification === 'undefined'){
            typeofnotification = 'success';
        }
        $('#deviceready').notify(textcontent,typeofnotification,{ position:"top center" });
    }
};