/*
===========================================
PITOL QR PRO v1.2
history.js
Part 1
===========================================
*/

"use strict";

/* =========================================
   Elements
========================================= */

const historyContainer =
    document.getElementById("historyList");

const historySearch =
    document.getElementById("historySearch");

const historyCount =
    document.getElementById("historyCount");

/* =========================================
   Render History
========================================= */

function renderHistory(list = getHistory()) {

    if (!historyContainer) return;

    historyContainer.innerHTML = "";

    if (list.length === 0) {

        historyContainer.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-clock-rotate-left"></i>

            <h3>No QR History</h3>

            <p>Your generated QR codes will appear here.</p>

        </div>

        `;

        updateHistoryStats();

        return;

    }

    list.forEach(item => {

        const card = document.createElement("div");

        card.className = "history-item";

        card.dataset.id = item.id;

        card.innerHTML = `

        <img src="${item.image}" alt="QR">

        <div class="history-content">

            <h4>${escapeHTML(item.text)}</h4>

            <p>${formatDate(item.created)}</p>

        </div>

        <div class="history-actions">

            <button class="restore-btn">
                Restore
            </button>

            <button class="favorite-btn">
                ${item.favorite ? "★" : "☆"}
            </button>

            <button class="delete-btn">
                Delete
            </button>

        </div>

        `;

        historyContainer.appendChild(card);

    });

    updateHistoryStats();

}

/* =========================================
   Restore QR
========================================= */

function restoreHistory(id){

    const item = getHistory()

        .find(q => q.id === id);

    if(!item) return;

    qrText.value = item.text;

    fgColor.value = item.foreground;

    bgColor.value = item.background;

    qrSize.value = item.size;

    errorLevel.value = item.correction;

    generateQRCode();

    showToast("QR Restored","success");

}

/* =========================================
   Delete
========================================= */

function removeHistory(id){

    deleteHistory(id);

    renderHistory();

    showToast("Deleted","success");

}

/* =========================================
   Search
========================================= */

if(historySearch){

historySearch.addEventListener(

"input",

e=>{

const keyword=e.target.value.trim();

if(keyword===""){

renderHistory();

return;

}

renderHistory(

searchHistory(keyword)

);

}

);

}

/* =========================================
   Statistics
========================================= */

function updateHistoryStats(){

    if(!historyCount) return;

    historyCount.textContent=

    getHistory().length+

    " QR Codes";

}

/* =========================================
   Events
========================================= */

historyContainer.addEventListener(

"click",

e=>{

const card=

e.target.closest(".history-item");

if(!card) return;

const id=card.dataset.id;

if(e.target.classList.contains("restore-btn")){

restoreHistory(id);

}

if(e.target.classList.contains("delete-btn")){

removeHistory(id);

}

if(e.target.classList.contains("favorite-btn")){

toggleFavorite(id);

renderHistory();

}

}

/* =========================================
   Escape HTML
========================================= */

function escapeHTML(str){

const div=document.createElement("div");

div.textContent=str;

return div.innerHTML;

}

/* =========================================
   Initial Render
========================================= */

document.addEventListener(

"DOMContentLoaded",

()=>{

renderHistory();

}

/* =========================================
   Public API
========================================= */

window.renderHistory=renderHistory;

window.restoreHistory=restoreHistory;
/*
===========================================
PITOL QR PRO v1.2
history.js
Part 2
===========================================
*/

"use strict";

/* =========================================
   Pagination
========================================= */

const PAGE_SIZE = 12;

let currentPage = 1;

let filteredHistory = [];

/* =========================================
   Get Current List
========================================= */

function getCurrentHistory(){

    return filteredHistory.length
        ? filteredHistory
        : getHistory();

}

/* =========================================
   Render Page
========================================= */

function renderPage(page = 1){

    currentPage = page;

    const list = getCurrentHistory();

    const start = (page - 1) * PAGE_SIZE;

    const end = start + PAGE_SIZE;

    renderHistory(list.slice(start, end));

}

/* =========================================
   Next Page
========================================= */

function nextHistoryPage(){

    const max = Math.ceil(
        getCurrentHistory().length / PAGE_SIZE
    );

    if(currentPage < max){

        renderPage(currentPage + 1);

    }

}

/* =========================================
   Previous Page
========================================= */

function previousHistoryPage(){

    if(currentPage > 1){

        renderPage(currentPage - 1);

    }

}

/* =========================================
   Favorite Filter
========================================= */

function showFavorites(){

    filteredHistory = getFavoriteItems();

    renderPage(1);

}

function showAllHistory(){

    filteredHistory = [];

    renderPage(1);

}

/* =========================================
   Sort
========================================= */

function sortHistory(mode = "newest"){

    const history = [...getCurrentHistory()];

    switch(mode){

        case "oldest":

            history.sort((a,b)=>

                new Date(a.created) -

                new Date(b.created)

            );

            break;

        case "alphabet":

            history.sort((a,b)=>

                a.text.localeCompare(b.text)

            );

            break;

        default:

            history.sort((a,b)=>

                new Date(b.created) -

                new Date(a.created)

            );

    }

    filteredHistory = history;

    renderPage(1);

}

/* =========================================
   Multi Select
========================================= */

const selectedHistory = new Set();

function toggleSelection(id){

    if(selectedHistory.has(id)){

        selectedHistory.delete(id);

    }else{

        selectedHistory.add(id);

    }

}

/* =========================================
   Bulk Delete
========================================= */

function deleteSelectedHistory(){

    let history = getHistory();

    history = history.filter(item=>

        !selectedHistory.has(item.id)

    );

    saveHistory(history);

    selectedHistory.clear();

    renderPage(1);

    showToast(

        "Selected history deleted",

        "success"

    );

}

/* =========================================
   Export Selected
========================================= */

function exportSelectedHistory(){

    const data = getHistory().filter(item=>

        selectedHistory.has(item.id)

    );

    const blob = new Blob(

        [

            JSON.stringify(

                data,

                null,

                2

            )

        ],

        {

            type:"application/json"

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "selected-history.json";

    a.click();

    URL.revokeObjectURL(url);

}

/* =========================================
   Public API
========================================= */

window.renderPage = renderPage;

window.nextHistoryPage = nextHistoryPage;

window.previousHistoryPage = previousHistoryPage;

window.showFavorites = showFavorites;

window.showAllHistory = showAllHistory;

window.sortHistory = sortHistory;

window.toggleSelection = toggleSelection;

window.deleteSelectedHistory = deleteSelectedHistory;

window.exportSelectedHistory = exportSelectedHistory;
