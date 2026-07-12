/*
===========================================
PITOL QR PRO v1.2
app.js
Part 1
Application Bootstrap
===========================================
*/

"use strict";

/* =========================================
   App Configuration
========================================= */

const APP = {

    name: "PITOL QR PRO",

    version: "1.2.0",

    initialized: false

};

/* =========================================
   Initialize Theme
========================================= */

function initializeThemeModule(){

    if(typeof initializeTheme==="function"){

        initializeTheme();

    }

}

/* =========================================
   Initialize History
========================================= */

function initializeHistoryModule(){

    if(typeof renderHistory==="function"){

        renderHistory();

    }

}

/* =========================================
   Restore Last Settings
========================================= */

function restoreSettings(){

    const settings = getSettings();

    if(!settings) return;

    if(settings.foreground){

        fgColor.value=settings.foreground;

    }

    if(settings.background){

        bgColor.value=settings.background;

    }

    if(settings.size){

        qrSize.value=settings.size;

    }

    if(settings.correction){

        errorLevel.value=settings.correction;

    }

}

/* =========================================
   Save Settings
========================================= */

function saveCurrentSettings(){

    saveSettings({

        foreground:fgColor.value,

        background:bgColor.value,

        size:qrSize.value,

        correction:errorLevel.value

    });

}

/* =========================================
   Auto Save
========================================= */

[
    fgColor,
    bgColor,
    qrSize,
    errorLevel

].forEach(control=>{

    if(!control) return;

    control.addEventListener(

        "change",

        saveCurrentSettings

    );

});

/* =========================================
   Welcome
========================================= */

function welcome(){

    console.log(

        APP.name+

        " v"+

        APP.version+

        " Loaded"

    );

}

/* =========================================
   Application Start
========================================= */

function initializeApplication(){

    if(APP.initialized){

        return;

    }

    welcome();

    initializeThemeModule();

    initializeHistoryModule();

    restoreSettings();

    APP.initialized=true;

    showToast(

        "Application Ready",

        "success"

    );

}

/* =========================================
   DOM Ready
========================================= */

document.addEventListener(

    "DOMContentLoaded",

    initializeApplication

);

/* =========================================
   Public API
========================================= */

window.APP=APP;

window.initializeApplication=

initializeApplication;
