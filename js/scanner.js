/*
===========================================
PITOL QR PRO v1.2
scanner.js
Part 1
===========================================
*/

"use strict";

/* =========================================
   Elements
========================================= */

const scannerElement =
    document.getElementById("reader");

const scannerResult =
    document.getElementById("scannerResult");

const startScannerBtn =
    document.getElementById("startScanner");

const stopScannerBtn =
    document.getElementById("stopScanner");

const copyScannerBtn =
    document.getElementById("copyScanner");

const openScannerBtn =
    document.getElementById("openScanner");

/* =========================================
   Scanner
========================================= */

let html5QrScanner = null;

let scannedText = "";

/* =========================================
   Start Scanner
========================================= */

async function startScanner(){

    if(html5QrScanner){

        return;

    }

    html5QrScanner = new Html5Qrcode("reader");

    try{

        await html5QrScanner.start(

            {

                facingMode:"environment"

            },

            {

                fps:10,

                qrbox:250

            },

            onScanSuccess,

            onScanFailure

        );

        showToast(

            "Scanner Started",

            "success"

        );

    }

    catch(error){

        console.error(error);

        showToast(

            "Camera Permission Denied",

            "error"

        );

    }

}

/* =========================================
   Stop Scanner
========================================= */

async function stopScanner(){

    if(!html5QrScanner){

        return;

    }

    await html5QrScanner.stop();

    await html5QrScanner.clear();

    html5QrScanner = null;

    showToast(

        "Scanner Stopped",

        "success"

    );

}

/* =========================================
   Scan Success
========================================= */

function onScanSuccess(decodedText){

    scannedText = decodedText;

    if(scannerResult){

        scannerResult.textContent = decodedText;

    }

    showToast(

        "QR Code Detected",

        "success"

    );

}

/* =========================================
   Scan Failure
========================================= */

function onScanFailure(){

    /* Ignore continuous scan failures */

}

/* =========================================
   Copy Result
========================================= */

async function copyScannedText(){

    if(!scannedText){

        showToast(

            "Nothing to copy",

            "warning"

        );

        return;

    }

    await navigator.clipboard.writeText(

        scannedText

    );

    showToast(

        "Copied",

        "success"

    );

}

/* =========================================
   Open URL
========================================= */

function openScannedText(){

    if(!scannedText){

        return;

    }

    if(isURL(scannedText)){

        window.open(

            scannedText,

            "_blank"

        );

    }

    else{

        showToast(

            "Scanned content is not a URL",

            "warning"

        );

    }

}

/* =========================================
   Events
========================================= */

if(startScannerBtn){

    startScannerBtn.addEventListener(

        "click",

        startScanner

    );

}

if(stopScannerBtn){

    stopScannerBtn.addEventListener(

        "click",

        stopScanner

    );

}

if(copyScannerBtn){

    copyScannerBtn.addEventListener(

        "click",

        copyScannedText

    );

}

if(openScannerBtn){

    openScannerBtn.addEventListener(

        "click",

        openScannedText

    );

}

/* =========================================
   Public API
========================================= */

window.startScanner = startScanner;
window.stopScanner = stopScanner;
window.copyScannedText = copyScannedText;
window.openScannedText = openScannedText;
/*
===========================================
PITOL QR PRO v1.2
scanner.js
Part 2
Advanced Scanner
===========================================
*/

"use strict";

/* =========================================
   Elements
========================================= */

const imageScanner =
    document.getElementById("scanImage");

const cameraSelect =
    document.getElementById("cameraSelect");

const torchButton =
    document.getElementById("toggleTorch");

/* =========================================
   Scanner Settings
========================================= */

let currentCamera = null;

let torchEnabled = false;

let autoStopAfterScan = true;

/* =========================================
   Load Cameras
========================================= */

async function loadCameras(){

    if(!cameraSelect) return;

    try{

        const devices =
            await Html5Qrcode.getCameras();

        cameraSelect.innerHTML = "";

        devices.forEach(camera=>{

            const option =
                document.createElement("option");

            option.value = camera.id;

            option.textContent = camera.label;

            cameraSelect.appendChild(option);

        });

    }

    catch(error){

        console.error(error);

    }

}

/* =========================================
   Camera Change
========================================= */

if(cameraSelect){

cameraSelect.addEventListener(

"change",

async ()=>{

currentCamera = cameraSelect.value;

if(html5QrScanner){

await stopScanner();

startScanner();

}

}

);

}

/* =========================================
   Image Scan
========================================= */

if(imageScanner){

imageScanner.addEventListener(

"change",

async event=>{

const file =
event.target.files[0];

if(!file) return;

try{

const scanner =
new Html5Qrcode("reader");

const result =
await scanner.scanFile(file,true);

scannerResult.textContent=result;

scannedText=result;

showToast(

"QR Image Decoded",

"success"

);

scanner.clear();

}

catch{

showToast(

"Unable to read image",

"error"

);

}

}

);

}

/* =========================================
   Torch
========================================= */

async function toggleTorch(){

    if(!html5QrScanner){

        return;

    }

    try{

        torchEnabled=!torchEnabled;

        await html5QrScanner.applyVideoConstraints({

            advanced:[

                {

                    torch:torchEnabled

                }

            ]

        });

        showToast(

            torchEnabled

            ? "Torch Enabled"

            : "Torch Disabled",

            "success"

        );

    }

    catch{

        showToast(

            "Torch Unsupported",

            "warning"

        );

    }

}

if(torchButton){

torchButton.addEventListener(

"click",

toggleTorch

);

}

/* =========================================
   Save Scan
========================================= */

function saveScanToHistory(){

    if(!scannedText){

        return;

    }

    const history = getHistory();

    history.unshift({

        id: uuid(),

        text: scannedText,

        image: "",

        size: 0,

        foreground: "#000",

        background: "#fff",

        correction: "M",

        created: new Date().toISOString(),

        favorite: false,

        source: "scanner"

    });

    saveHistory(history);

}

/* =========================================
   Override Success
========================================= */

const previousSuccess = onScanSuccess;

onScanSuccess = function(text){

    previousSuccess(text);

    saveScanToHistory();

    if(autoStopAfterScan){

        stopScanner();

    }

}

/* =========================================
   Startup
========================================= */

document.addEventListener(

"DOMContentLoaded",

()=>{

loadCameras();

}

);

/* =========================================
   Public API
========================================= */

window.loadCameras = loadCameras;
window.toggleTorch = toggleTorch;
window.saveScanToHistory = saveScanToHistory;
