/*
===========================================
PITOL QR PRO v1.2
generator.js
Part 1
===========================================
*/

"use strict";

/* -----------------------------
   DOM Elements
------------------------------ */

const qrText = document.getElementById("qrText");
const qrCanvas = document.getElementById("qrCanvas");

const generateBtn = document.getElementById("generateBtn");

const fgColor = document.getElementById("fgColor");
const bgColor = document.getElementById("bgColor");

const qrSize = document.getElementById("qrSize");

const errorLevel = document.getElementById("errorLevel");

const logoInput = document.getElementById("logoInput");

/* -----------------------------
   Generator State
------------------------------ */

const qrState = {

    text: "",

    size: 256,

    foreground: "#000000",

    background: "#ffffff",

    correction: "M",

    logo: null,

    canvas: qrCanvas

};

/* -----------------------------
   Validation
------------------------------ */

function validateInput(value){

    if(!value) return false;

    if(value.trim()==="") return false;

    return true;

}

/* -----------------------------
   Read Controls
------------------------------ */

function updateState(){

    qrState.text = qrText.value.trim();

    qrState.size = Number(qrSize.value);

    qrState.foreground = fgColor.value;

    qrState.background = bgColor.value;

    qrState.correction = errorLevel.value;

}

/* -----------------------------
   Generate QR
------------------------------ */

async function generateQRCode(){

    updateState();

    if(!validateInput(qrState.text)){

        showToast("Please enter text or URL","warning");

        qrText.focus();

        return;

    }

    try{

        await QRCode.toCanvas(

            qrState.canvas,

            qrState.text,

            {

                width:qrState.size,

                margin:2,

                errorCorrectionLevel:qrState.correction,

                color:{

                    dark:qrState.foreground,

                    light:qrState.background

                }

            }

        );

        currentQRData = qrState.canvas.toDataURL("image/png");

        showToast("QR Code Generated","success");

    }

    catch(error){

        console.error(error);

        showToast("QR Generation Failed","error");

    }

}

/* -----------------------------
   Event
------------------------------ */

generateBtn.addEventListener(

    "click",

    generateQRCode

);

/* -----------------------------
   Live Enter Key
------------------------------ */

qrText.addEventListener(

    "keydown",

    e=>{

        if(e.key==="Enter"){

            generateQRCode();

        }

    }

);

/* -----------------------------
   Live Update
------------------------------ */

fgColor.addEventListener("change",generateQRCode);

bgColor.addEventListener("change",generateQRCode);

qrSize.addEventListener("change",generateQRCode);

errorLevel.addEventListener("change",generateQRCode);

/* -----------------------------
   Global
------------------------------ */

window.generateQRCode = generateQRCode;
window.qrState = qrState;
/*
===========================================
PITOL QR PRO v1.2
generator.js
Part 2
Logo Upload & Embedding
===========================================
*/

let logoImage = null;

/* -----------------------------
   Load Logo
------------------------------ */

logoInput.addEventListener("change", handleLogoUpload);

function handleLogoUpload(event){

    const file = event.target.files[0];

    if(!file) return;

    if(!file.type.startsWith("image/")){

        showToast("Please select an image file","warning");
        return;

    }

    const reader = new FileReader();

    reader.onload = function(e){

        const img = new Image();

        img.onload = function(){

            logoImage = img;

            qrState.logo = img;

            generateQRCode();

            showToast("Logo Loaded","success");

        };

        img.src = e.target.result;

    };

    reader.readAsDataURL(file);

}

/* -----------------------------
   Draw Logo
------------------------------ */

function drawLogo(){

    if(!logoImage) return;

    const ctx = qrCanvas.getContext("2d");

    const canvasSize = qrCanvas.width;

    const logoSize = canvasSize * 0.22;

    const x = (canvasSize - logoSize)/2;

    const y = (canvasSize - logoSize)/2;

    const padding = 10;

    ctx.fillStyle = "#ffffff";

    roundRect(
        ctx,
        x-padding,
        y-padding,
        logoSize+(padding*2),
        logoSize+(padding*2),
        16
    );

    ctx.fill();

    ctx.save();

    ctx.beginPath();

    roundRect(
        ctx,
        x,
        y,
        logoSize,
        logoSize,
        12
    );

    ctx.clip();

    ctx.drawImage(
        logoImage,
        x,
        y,
        logoSize,
        logoSize
    );

    ctx.restore();

}

/* -----------------------------
   Rounded Rectangle
------------------------------ */

function roundRect(ctx,x,y,w,h,r){

    ctx.beginPath();

    ctx.moveTo(x+r,y);

    ctx.arcTo(x+w,y,x+w,y+h,r);

    ctx.arcTo(x+w,y+h,x,y+h,r);

    ctx.arcTo(x,y+h,x,y,r);

    ctx.arcTo(x,y,x+w,y,r);

    ctx.closePath();

}

/* -----------------------------
   Override Generator
------------------------------ */

const originalGenerate = generateQRCode;

generateQRCode = async function(){

    await originalGenerate();

    if(logoImage){

        drawLogo();

        currentQRData = qrCanvas.toDataURL("image/png");

    }

}

/* -----------------------------
   Remove Logo
------------------------------ */

function clearLogo(){

    logoInput.value = "";

    logoImage = null;

    qrState.logo = null;

    generateQRCode();

}

/* -----------------------------
   Drag & Drop
------------------------------ */

const preview = document.querySelector(".preview");

preview.addEventListener("dragover",e=>{

    e.preventDefault();

    preview.classList.add("dragging");

});

preview.addEventListener("dragleave",()=>{

    preview.classList.remove("dragging");

});

preview.addEventListener("drop",e=>{

    e.preventDefault();

    preview.classList.remove("dragging");

    const file = e.dataTransfer.files[0];

    if(!file) return;

    if(!file.type.startsWith("image/")){

        showToast("Invalid image","warning");

        return;

    }

    const reader = new FileReader();

    reader.onload=function(ev){

        const img=new Image();

        img.onload=function(){

            logoImage=img;

            qrState.logo=img;

            generateQRCode();

        }

        img.src=ev.target.result;

    }

    reader.readAsDataURL(file);

});

/* -----------------------------
   Public API
------------------------------ */

window.clearLogo = clearLogo;
window.drawLogo = drawLogo;
/*
===========================================
generator.js
Part 3A
Smart Input
===========================================
*/

let debounceTimer = null;

/* -----------------------------
   Character Counter
------------------------------ */

const counter = document.createElement("small");
counter.id = "charCounter";

qrText.parentNode.appendChild(counter);

function updateCounter(){

    const len = qrText.value.length;

    counter.textContent = `${len} Characters`;

}

qrText.addEventListener("input",updateCounter);

updateCounter();

/* -----------------------------
   Debounce
------------------------------ */

function debounce(callback,delay=300){

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(callback,delay);

}

/* -----------------------------
   Live Generate
------------------------------ */

qrText.addEventListener("input",()=>{

    updateCounter();

    debounce(()=>{

        if(qrText.value.trim()!=""){

            generateQRCode();

        }

    });

});

/* -----------------------------
   Sanitize
------------------------------ */

function sanitize(text){

    return text

    .replace(/\s+/g," ")

    .trim();

}

/* -----------------------------
   Detect Type
------------------------------ */

function detectType(value){

    value=value.trim();

    if(/^https?:\/\//i.test(value)){

        return "url";

    }

    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){

        return "email";

    }

    if(/^\+?[0-9]{7,15}$/.test(value)){

        return "phone";

    }

    if(value.startsWith("WIFI:")){

        return "wifi";

    }

    if(value.startsWith("BEGIN:VCARD")){

        return "vcard";

    }

    return "text";

}

/* -----------------------------
   Badge
------------------------------ */

const badge=document.createElement("div");

badge.className="badge primary mt-10";

qrText.parentNode.appendChild(badge);

function updateBadge(){

    const type=detectType(qrText.value);

    badge.innerHTML=

    "Detected: "+type.toUpperCase();

}

qrText.addEventListener(

"input",

updateBadge

);

updateBadge();

/* -----------------------------
   Override State
------------------------------ */

const previousUpdateState=updateState;

updateState=function(){

    previousUpdateState();

    qrState.text=sanitize(qrState.text);

}
/*
===========================================
generator.js
Part 3B
Advanced Generator Controls
===========================================
*/

/* -----------------------------
   Generator Options
------------------------------ */

qrState.margin = 2;
qrState.theme = "default";

/* -----------------------------
   Margin Slider
------------------------------ */

const marginContainer = document.createElement("div");
marginContainer.className = "mt-20";

marginContainer.innerHTML = `
<label>QR Margin</label>
<input type="range" id="marginSlider" min="0" max="8" value="2">
<small id="marginValue">2</small>
`;

qrSize.parentNode.parentNode.appendChild(marginContainer);

const marginSlider = document.getElementById("marginSlider");
const marginValue = document.getElementById("marginValue");

marginSlider.addEventListener("input", () => {

    qrState.margin = Number(marginSlider.value);

    marginValue.textContent = qrState.margin;

    generateQRCode();

});

/* -----------------------------
   Theme Presets
------------------------------ */

const presets = {

    default:{
        fg:"#000000",
        bg:"#ffffff"
    },

    ocean:{
        fg:"#1565C0",
        bg:"#E3F2FD"
    },

    forest:{
        fg:"#1B5E20",
        bg:"#F1F8E9"
    },

    sunset:{
        fg:"#D84315",
        bg:"#FFF3E0"
    },

    dark:{
        fg:"#FFFFFF",
        bg:"#111827"
    }

};

const presetSelect = document.createElement("select");

presetSelect.innerHTML = `
<option value="default">Default</option>
<option value="ocean">Ocean</option>
<option value="forest">Forest</option>
<option value="sunset">Sunset</option>
<option value="dark">Dark</option>
`;

const presetLabel = document.createElement("label");
presetLabel.textContent = "Theme Preset";

const presetWrapper = document.createElement("div");
presetWrapper.className = "mt-20";

presetWrapper.appendChild(presetLabel);
presetWrapper.appendChild(presetSelect);

qrSize.parentNode.parentNode.appendChild(presetWrapper);

/* -----------------------------
   Apply Preset
------------------------------ */

presetSelect.addEventListener("change", () => {

    const theme = presets[presetSelect.value];

    qrState.theme = presetSelect.value;

    fgColor.value = theme.fg;
    bgColor.value = theme.bg;

    generateQRCode();

});

/* -----------------------------
   High Quality Render
------------------------------ */

async function renderQR(){

    await QRCode.toCanvas(

        qrCanvas,

        qrState.text,

        {

            width: qrState.size,

            margin: qrState.margin,

            errorCorrectionLevel: qrState.correction,

            color:{

                dark: qrState.foreground,

                light: qrState.background

            }

        }

    );

}

/* -----------------------------
   Override Generator
------------------------------ */

const oldGenerator = generateQRCode;

generateQRCode = async function(){

    updateState();

    if(!validateInput(qrState.text)){

        return;

    }

    await renderQR();

    if(logoImage){

        drawLogo();

    }

    currentQRData = qrCanvas.toDataURL("image/png");

    showToast("QR Updated","success");

};

/* -----------------------------
   Public API
------------------------------ */

window.renderQR = renderQR;
/*
===========================================
generator.js
Part 3C
Optimization Engine
===========================================
*/

qrState.exportScale = 1;
qrState.logoScale = 0.22;
qrState.autoOptimize = true;

/* -----------------------------
   Auto Optimize
------------------------------ */

function optimizeSettings(){

    if(!qrState.autoOptimize) return;

    const length = qrState.text.length;

    if(length < 50){

        qrState.size = 256;
        qrState.correction = "H";

    }else if(length < 200){

        qrState.size = 512;
        qrState.correction = "Q";

    }else{

        qrState.size = 1024;
        qrState.correction = "M";

    }

    qrSize.value = qrState.size;
    errorLevel.value = qrState.correction;

}

/* -----------------------------
   Logo Scale
------------------------------ */

function setLogoScale(value){

    value = Math.max(0.10, Math.min(value,0.35));

    qrState.logoScale = value;

}

/* -----------------------------
   Improved Logo Drawing
------------------------------ */

const previousDrawLogo = drawLogo;

drawLogo = function(){

    if(!logoImage) return;

    const ctx = qrCanvas.getContext("2d");

    const canvasSize = qrCanvas.width;

    const logoSize = canvasSize * qrState.logoScale;

    const x = (canvasSize-logoSize)/2;
    const y = (canvasSize-logoSize)/2;

    const padding = 10;

    ctx.fillStyle="#ffffff";

    roundRect(
        ctx,
        x-padding,
        y-padding,
        logoSize+padding*2,
        logoSize+padding*2,
        18
    );

    ctx.fill();

    ctx.save();

    roundRect(ctx,x,y,logoSize,logoSize,12);

    ctx.clip();

    ctx.drawImage(
        logoImage,
        x,
        y,
        logoSize,
        logoSize
    );

    ctx.restore();

}

/* -----------------------------
   Scanability Check
------------------------------ */

function scanability(){

    if(qrState.logoScale>0.30){

        showToast(
            "Large logo may reduce scan accuracy",
            "warning"
        );

    }

}

/* -----------------------------
   Export Mode
------------------------------ */

function enableExportQuality(){

    qrState.exportScale = 2;

}

function disableExportQuality(){

    qrState.exportScale = 1;

}

/* -----------------------------
   Performance
------------------------------ */

async function renderOptimized(){

    optimizeSettings();

    const start = performance.now();

    await renderQR();

    if(logoImage){

        drawLogo();

    }

    const end = performance.now();

    console.log(
        "QR Render:",
        (end-start).toFixed(2),
        "ms"
    );

    scanability();

}

/* -----------------------------
   Override Generate
------------------------------ */

generateQRCode = async function(){

    updateState();

    if(!validateInput(qrState.text)){

        showToast(
            "Input Required",
            "warning"
        );

        return;

    }

    await renderOptimized();

    currentQRData =
        qrCanvas.toDataURL("image/png");

}

/* -----------------------------
   Public API
------------------------------ */

window.enableExportQuality = enableExportQuality;
window.disableExportQuality = disableExportQuality;
window.setLogoScale = setLogoScale;
window.renderOptimized = renderOptimized;
