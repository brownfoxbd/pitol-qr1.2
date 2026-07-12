const textInput = document.getElementById("text");
const qrContainer = document.getElementById("qrcode");
const historyDiv = document.getElementById("history");

let currentText = "";

loadHistory();

document.getElementById("generate").addEventListener("click", generateQR);

async function generateQR() {

const text = textInput.value.trim();

if (!text) {
alert("Please enter text.");
return;
}

currentText = text;

qrContainer.innerHTML = "";

new QRCode(qrContainer, {
text: text,
width: 250,
height: 250
});

saveHistory(text);
}

async function saveFile(blob, filename, mimeType) {

try {

if (window.showSaveFilePicker) {

const handle = await window.showSaveFilePicker({

suggestedName: filename,

types: [{
description: mimeType,
accept: {
[mimeType]: [
filename.endsWith(".png")
? ".png"
: ".jpg"
]
}
}]

});

const writable = await handle.createWritable();

await writable.write(blob);

await writable.close();

} else {

const a = document.createElement("a");

a.href = URL.createObjectURL(blob);

a.download = filename;

a.click();

}

} catch (e) {
console.log(e);
}
}

document.getElementById("downloadPNG").addEventListener("click", async () => {

const canvas = qrContainer.querySelector("canvas");

if (!canvas) {
alert("Generate QR first.");
return;
}

canvas.toBlob(async(blob)=>{

await saveFile(
blob,
"QRCode.png",
"image/png"
);

});
});

document.getElementById("downloadJPG").addEventListener("click", async () => {

const canvas = qrContainer.querySelector("canvas");

if (!canvas) {
alert("Generate QR first.");
return;
}

const jpgCanvas = document.createElement("canvas");

jpgCanvas.width = canvas.width;
jpgCanvas.height = canvas.height;

const ctx = jpgCanvas.getContext("2d");

ctx.fillStyle = "#ffffff";

ctx.fillRect(
0,
0,
jpgCanvas.width,
jpgCanvas.height
);

ctx.drawImage(canvas,0,0);

jpgCanvas.toBlob(async(blob)=>{

await saveFile(
blob,
"QRCode.jpg",
"image/jpeg"
);

},"image/jpeg",1);

});

function saveHistory(text){

let history =
JSON.parse(
localStorage.getItem("qrHistory")
) || [];

if(history.includes(text)) return;

history.unshift(text);

localStorage.setItem(
"qrHistory",
JSON.stringify(history)
);

loadHistory();
}

function loadHistory(){

historyDiv.innerHTML="";

let history=
JSON.parse(
localStorage.getItem("qrHistory")
) || [];

history.forEach((item,index)=>{

const div=document.createElement("div");

div.className="history-item";

div.innerHTML=`

<p>${item}</p>

<button onclick="reuseQR(${index})">

Generate Again

</button>

<button onclick="deleteQR(${index})">

Delete

</button>

`;

historyDiv.appendChild(div);

});
}

window.reuseQR=function(index){

let history=
JSON.parse(
localStorage.getItem("qrHistory")
) || [];

textInput.value=history[index];

generateQR();

}

window.deleteQR=function(index){

let history=
JSON.parse(
localStorage.getItem("qrHistory")
) || [];

history.splice(index,1);

localStorage.setItem(
"qrHistory",
JSON.stringify(history)
);

loadHistory();

}

document.getElementById("clearHistory").addEventListener("click",()=>{

if(confirm("Clear all history?")){

localStorage.removeItem("qrHistory");

loadHistory();

}

});