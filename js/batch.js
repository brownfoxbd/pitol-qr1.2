/*
===========================================
PITOL QR PRO v1.2
batch.js
Part 1
===========================================
*/

"use strict";

/* =========================================
   Elements
========================================= */

const batchInput =
    document.getElementById("batchInput");

const batchGenerateBtn =
    document.getElementById("batchGenerate");

const batchList =
    document.getElementById("batchList");

const batchProgress =
    document.getElementById("batchProgress");

/* =========================================
   State
========================================= */

let batchResults = [];

/* =========================================
   Parse Input
========================================= */

function getBatchItems(){

    return batchInput.value

        .split("\n")

        .map(item => item.trim())

        .filter(item => item.length);

}

/* =========================================
   Generate One QR
========================================= */

async function generateBatchQR(text){

    const canvas = document.createElement("canvas");

    await QRCode.toCanvas(

        canvas,

        text,

        {

            width:300,

            margin:2,

            errorCorrectionLevel:"M",

            color:{

                dark:"#000000",

                light:"#ffffff"

            }

        }

    );

    return {

        text,

        image:canvas.toDataURL("image/png")

    };

}

/* =========================================
   Generate Batch
========================================= */

async function generateBatch(){

    const items = getBatchItems();

    batchResults = [];

    batchList.innerHTML = "";

    if(items.length===0){

        showToast(

            "Enter at least one item",

            "warning"

        );

        return;

    }

    for(let i=0;i<items.length;i++){

        const qr = await generateBatchQR(items[i]);

        batchResults.push(qr);

        renderBatchItem(qr);

        updateBatchProgress(

            i+1,

            items.length

        );

    }

    showToast(

        "Batch Complete",

        "success"

    );

}

/* =========================================
   Render Card
========================================= */

function renderBatchItem(item){

    const card=document.createElement("div");

    card.className="batch-card";

    card.innerHTML=`

        <img src="${item.image}">

        <p>${item.text}</p>

        <button
            class="download-single"
            data-text="${item.text}">
            Download
        </button>

    `;

    batchList.appendChild(card);

}

/* =========================================
   Progress
========================================= */

function updateBatchProgress(done,total){

    if(!batchProgress) return;

    batchProgress.textContent=

        done+" / "+total+

        " Generated";

}

/* =========================================
   Events
========================================= */

if(batchGenerateBtn){

batchGenerateBtn.addEventListener(

"click",

generateBatch

);

}

/* =========================================
   Public API
========================================= */

window.generateBatch = generateBatch;
window.batchResults = batchResults;
/*
===========================================
PITOL QR PRO v1.2
batch.js
Part 2
Download & Export
===========================================
*/

"use strict";

/* =========================================
   Download One QR
========================================= */

function downloadBatchQR(index){

    const item = batchResults[index];

    if(!item) return;

    const a = document.createElement("a");

    a.href = item.image;

    a.download = item.text + ".png";

    a.click();

}

/* =========================================
   Download Button Event
========================================= */

batchList.addEventListener("click",(event)=>{

    if(!event.target.classList.contains("download-single")){

        return;

    }

    const cards = [...batchList.children];

    const card = event.target.closest(".batch-card");

    const index = cards.indexOf(card);

    downloadBatchQR(index);

});

/* =========================================
   Download ZIP
========================================= */

async function downloadBatchZip(){

    if(batchResults.length===0){

        showToast("Nothing to download","warning");

        return;

    }

    const zip = new JSZip();

    batchResults.forEach(item=>{

        const base64 = item.image.split(",")[1];

        zip.file(

            item.text + ".png",

            base64,

            {base64:true}

        );

    });

    const blob = await zip.generateAsync({

        type:"blob"

    });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "pitol-batch.zip";

    a.click();

}

/* =========================================
   Export PDF
========================================= */

function exportBatchPDF(){

    if(batchResults.length===0){

        showToast("No QR Codes","warning");

        return;

    }

    const pdf = new jspdf.jsPDF();

    let y = 20;

    batchResults.forEach((item,index)=>{

        pdf.text(

            `${index+1}. ${item.text}`,

            15,

            y

        );

        y += 10;

        if(y>270){

            pdf.addPage();

            y=20;

        }

    });

    pdf.save("batch-list.pdf");

}

/* =========================================
   Import CSV
========================================= */

function importBatchCSV(file){

    const reader = new FileReader();

    reader.onload = function(event){

        batchInput.value = event.target.result;

        showToast(

            "CSV Imported",

            "success"

        );

    };

    reader.readAsText(file);

}

/* =========================================
   Statistics
========================================= */

function batchStatistics(){

    return{

        total:batchResults.length,

        generated:new Date().toLocaleString()

    };

}

/* =========================================
   Public API
========================================= */

window.downloadBatchZip = downloadBatchZip;

window.exportBatchPDF = exportBatchPDF;

window.importBatchCSV = importBatchCSV;

window.batchStatistics = batchStatistics;
