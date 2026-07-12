/*
===========================================
PITOL QR PRO v1.2
storage.js
Part 1
Core Storage Manager
===========================================
*/

"use strict";

/* =========================================
   Storage Keys
========================================= */

const STORAGE_KEYS = {

    HISTORY: "pitol_qr_history",

    FAVORITES: "pitol_qr_favorites",

    SETTINGS: "pitol_qr_settings",

    VERSION: "pitol_qr_version"

};

/* =========================================
   Storage Manager
========================================= */

class StorageManager{

    constructor(){

        this.version = "1.2.0";

        this.initialize();

    }

    initialize(){

        if(!localStorage.getItem(STORAGE_KEYS.VERSION)){

            localStorage.setItem(

                STORAGE_KEYS.VERSION,

                this.version

            );

        }

    }

    save(key,data){

        try{

            localStorage.setItem(

                key,

                JSON.stringify(data)

            );

            return true;

        }

        catch(error){

            console.error(error);

            return false;

        }

    }

    load(key){

        try{

            const data = localStorage.getItem(key);

            return data ? JSON.parse(data) : null;

        }

        catch(error){

            console.error(error);

            return null;

        }

    }

    remove(key){

        localStorage.removeItem(key);

    }

    clear(){

        localStorage.clear();

    }

    exists(key){

        return localStorage.getItem(key)!==null;

    }

}

/* =========================================
   Instance
========================================= */

const storage = new StorageManager();

/* =========================================
   History
========================================= */

function getHistory(){

    return storage.load(

        STORAGE_KEYS.HISTORY

    ) || [];

}

function saveHistory(history){

    storage.save(

        STORAGE_KEYS.HISTORY,

        history

    );

}

/* =========================================
   Favorites
========================================= */

function getFavorites(){

    return storage.load(

        STORAGE_KEYS.FAVORITES

    ) || [];

}

function saveFavorites(data){

    storage.save(

        STORAGE_KEYS.FAVORITES,

        data

    );

}

/* =========================================
   Settings
========================================= */

function getSettings(){

    return storage.load(

        STORAGE_KEYS.SETTINGS

    ) || {};

}

function saveSettings(settings){

    storage.save(

        STORAGE_KEYS.SETTINGS,

        settings

    );

}

/* =========================================
   Public API
========================================= */

window.storage = storage;

window.getHistory = getHistory;
window.saveHistory = saveHistory;

window.getFavorites = getFavorites;
window.saveFavorites = saveFavorites;

window.getSettings = getSettings;
window.saveSettings = saveSettings;
/*
===========================================
PITOL QR PRO v1.2
storage.js
Part 2
History & Favorites
===========================================
*/

const MAX_HISTORY = 100;

/* =========================================
   Create Record
========================================= */

function createHistoryRecord(dataURL){

    return{

        id:crypto.randomUUID(),

        text:qrState.text,

        image:dataURL,

        size:qrState.size,

        foreground:qrState.foreground,

        background:qrState.background,

        correction:qrState.correction,

        created:new Date().toISOString(),

        favorite:false

    };

}

/* =========================================
   Duplicate Check
========================================= */

function historyExists(text){

    return getHistory().some(item=>item.text===text);

}

/* =========================================
   Add History
========================================= */

function addHistory(dataURL){

    const history=getHistory();

    if(historyExists(qrState.text)){

        return;

    }

    history.unshift(createHistoryRecord(dataURL));

    if(history.length>MAX_HISTORY){

        history.length=MAX_HISTORY;

    }

    saveHistory(history);

}

/* =========================================
   Delete Item
========================================= */

function deleteHistory(id){

    const history=getHistory()

    .filter(item=>item.id!==id);

    saveHistory(history);

}

/* =========================================
   Clear
========================================= */

function clearHistory(){

    saveHistory([]);

}

/* =========================================
   Search
========================================= */

function searchHistory(keyword){

    keyword=keyword.toLowerCase();

    return getHistory().filter(item=>

        item.text

        .toLowerCase()

        .includes(keyword)

    );

}

/* =========================================
   Favorites
========================================= */

function toggleFavorite(id){

    const history=getHistory();

    const item=history.find(i=>i.id===id);

    if(!item) return;

    item.favorite=!item.favorite;

    saveHistory(history);

}

function getFavoriteItems(){

    return getHistory()

    .filter(item=>item.favorite);

}

/* =========================================
   Export JSON
========================================= */

function exportHistory(){

    const data=

    JSON.stringify(

        getHistory(),

        null,

        2

    );

    const blob=

    new Blob(

        [data],

        {

            type:"application/json"

        }

    );

    const url=

    URL.createObjectURL(blob);

    const a=

    document.createElement("a");

    a.href=url;

    a.download="pitol-history.json";

    a.click();

    URL.revokeObjectURL(url);

}

/* =========================================
   Import JSON
========================================= */

function importHistory(file){

    const reader=

    new FileReader();

    reader.onload=function(e){

        try{

            const data=

            JSON.parse(e.target.result);

            if(Array.isArray(data)){

                saveHistory(data);

                showToast(

                    "History Imported",

                    "success"

                );

            }

        }

        catch{

            showToast(

                "Invalid JSON",

                "error"

            );

        }

    };

    reader.readAsText(file);

}

/* =========================================
   Public API
========================================= */

window.addHistory=addHistory;
window.deleteHistory=deleteHistory;
window.clearHistory=clearHistory;
window.searchHistory=searchHistory;
window.toggleFavorite=toggleFavorite;
window.getFavoriteItems=getFavoriteItems;
window.exportHistory=exportHistory;
window.importHistory=importHistory;
