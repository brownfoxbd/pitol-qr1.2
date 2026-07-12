/*
===========================================
PITOL QR PRO v1.2
download.js
Part 1
===========================================
*/

"use strict";

/* =========================================
   Elements
========================================= */

const pngBtn = document.getElementById("downloadPNG");
const jpgBtn = document.getElementById("downloadJPG");
const svgBtn = document.getElementById("downloadSVG");
const pdfBtn = document.getElementById("downloadPDF");

/* =========================================
   Get Canvas
========================================= */

function getCanvas(){

    return qrCanvas;

}

/* =========================================
   PNG
========================================= */

function downloadPNG(){

    if(!qrCanvas) return;

    const link = document.createElement("a");

    link.href = qrCanvas.toDataURL("image/png");

    link.download = "pitol-qr.png";

    link.click();

}

/* =========================================
   JPG
========================================= */

function downloadJPG(){

    if(!qrCanvas) return;

    const canvas = document.createElement("canvas");

    canvas.width = qrCanvas.width;

    canvas.height = qrCanvas.height;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.drawImage(qrCanvas,0,0);

    const link = document.createElement("a");

    link.href = canvas.toDataURL("image/jpeg",1);

    link.download = "pitol-qr.jpg";

    link.click();

}

/* =========================================
   SVG
========================================= */

async function downloadSVG(){

    if(!qrState.text){

        showToast("Generate a QR code first","warning");

        return;

    }

    try{

        const svg = await QRCode.toString(

            qrState.text,

            {

                type:"svg",

                margin:qrState.margin,

                errorCorrectionLevel:qrState.correction,

                color:{

                    dark:qrState.foreground,

                    light:qrState.background

                }

            }

        );

        const blob = new Blob(

            [svg],

            {

                type:"image/svg+xml"

            }

        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "pitol-qr.svg";

        link.click();

        URL.revokeObjectURL(url);

    }

    catch(error){

        console.error(error);

        showToast("SVG Export Failed","error");

    }

}

/* =========================================
   PDF
========================================= */

function downloadPDF(){

    if(!qrCanvas){

        return;

    }

    const pdf = new jspdf.jsPDF({

        orientation:"portrait",

        unit:"mm",

        format:"a4"

    });

    const image = qrCanvas.toDataURL("image/png");

    pdf.setFontSize(18);

    pdf.text("PITOL QR PRO",20,20);

    pdf.addImage(

        image,

        "PNG",

        40,

        35,

        130,

        130

    );

    pdf.save("pitol-qr.pdf");

}

/* =========================================
   High Resolution PNG
========================================= */

function downloadPNGHD(){

    const scale = 4;

    const canvas = document.createElement("canvas");

    canvas.width = qrCanvas.width * scale;

    canvas.height = qrCanvas.height * scale;

    const ctx = canvas.getContext("2d");

    ctx.scale(scale,scale);

    ctx.drawImage(qrCanvas,0,0);

    const link = document.createElement("a");

    link.href = canvas.toDataURL("image/png");

    link.download = "pitol-qr-hd.png";

    link.click();

}

/* =========================================
   Events
========================================= */

if(pngBtn){

    pngBtn.addEventListener("click",downloadPNG);

}

if(jpgBtn){

    jpgBtn.addEventListener("click",downloadJPG);

}

if(svgBtn){

    svgBtn.addEventListener("click",downloadSVG);

}

if(pdfBtn){

    pdfBtn.addEventListener("click",downloadPDF);

}

/* =========================================
   Public API
========================================= */

window.downloadPNG = downloadPNG;
window.downloadJPG = downloadJPG;
window.downloadSVG = downloadSVG;
window.downloadPDF = downloadPDF;
window.downloadPNGHD = downloadPNGHD;
