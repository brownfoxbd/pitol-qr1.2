/*
===========================================
PITOL QR PRO v1.2
utils.js
Part 1
===========================================
*/

"use strict";

/* =========================================
   Toast Notification
========================================= */

function showToast(message, type = "success") {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.className = "";
    toast.classList.add(type);
    toast.classList.add("show");

    toast.textContent = message;

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

/* =========================================
   Date Formatter
========================================= */

function formatDate(date) {

    return new Intl.DateTimeFormat("en-US", {

        year: "numeric",

        month: "short",

        day: "numeric",

        hour: "2-digit",

        minute: "2-digit"

    }).format(new Date(date));

}

/* =========================================
   Clipboard Copy
========================================= */

async function copyText(text) {

    try {

        await navigator.clipboard.writeText(text);

        showToast("Copied to clipboard", "success");

    }

    catch {

        showToast("Clipboard failed", "error");

    }

}

/* =========================================
   Download DataURL
========================================= */

function downloadDataURL(dataURL, filename) {

    const a = document.createElement("a");

    a.href = dataURL;

    a.download = filename;

    a.click();

}

/* =========================================
   UUID Generator
========================================= */

function uuid() {

    if (window.crypto && crypto.randomUUID) {

        return crypto.randomUUID();

    }

    return Date.now() + "-" + Math.random().toString(36).substring(2);

}

/* =========================================
   File Reader
========================================= */

function readFile(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}

/* =========================================
   Debounce
========================================= */

function debounce(callback, delay = 300) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}

/* =========================================
   Validate URL
========================================= */

function isURL(value) {

    try {

        new URL(value);

        return true;

    }

    catch {

        return false;

    }

}

/* =========================================
   Validate Email
========================================= */

function isEmail(value) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

}

/* =========================================
   Validate Phone
========================================= */

function isPhone(value) {

    return /^\+?[0-9]{7,15}$/.test(value);

}

/* =========================================
   Empty Check
========================================= */

function isEmpty(value) {

    return value.trim().length === 0;

}

/* =========================================
   Public API
========================================= */

window.showToast = showToast;

window.formatDate = formatDate;

window.copyText = copyText;

window.downloadDataURL = downloadDataURL;

window.uuid = uuid;

window.readFile = readFile;

window.debounce = debounce;

window.isURL = isURL;

window.isEmail = isEmail;

window.isPhone = isPhone;

window.isEmpty = isEmpty;
