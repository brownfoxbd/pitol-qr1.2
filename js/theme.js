/*
===========================================
PITOL QR PRO v1.2
theme.js
===========================================
*/

"use strict";

/* =========================================
   Elements
========================================= */

const themeToggle = document.getElementById("themeToggle");

const THEME_KEY = "pitol_theme";

/* =========================================
   Current Theme
========================================= */

function getCurrentTheme(){

    return document.body.classList.contains("dark")
        ? "dark"
        : "light";

}

/* =========================================
   Apply Theme
========================================= */

function applyTheme(theme){

    if(theme==="dark"){

        document.body.classList.add("dark");

    }else{

        document.body.classList.remove("dark");

    }

    updateThemeIcon();

    localStorage.setItem(THEME_KEY,theme);

}

/* =========================================
   Toggle Theme
========================================= */

function toggleTheme(){

    if(getCurrentTheme()==="dark"){

        applyTheme("light");

    }else{

        applyTheme("dark");

    }

}

/* =========================================
   Theme Icon
========================================= */

function updateThemeIcon(){

    if(!themeToggle) return;

    const icon=themeToggle.querySelector("i");

    if(!icon) return;

    if(getCurrentTheme()==="dark"){

        icon.className="fa-solid fa-sun";

    }else{

        icon.className="fa-solid fa-moon";

    }

}

/* =========================================
   System Theme
========================================= */

function systemTheme(){

    return window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches
        ? "dark"
        : "light";

}

/* =========================================
   Initialize
========================================= */

function initializeTheme(){

    const saved=

        localStorage.getItem(THEME_KEY);

    if(saved){

        applyTheme(saved);

    }

    else{

        applyTheme(systemTheme());

    }

}

/* =========================================
   Watch System Theme
========================================= */

window.matchMedia(

"(prefers-color-scheme: dark)"

).addEventListener(

"change",

event=>{

if(!localStorage.getItem(THEME_KEY)){

applyTheme(

event.matches

? "dark"

: "light"

);

}

}

);

/* =========================================
   Smooth Transition
========================================= */

function enableTransitions(){

    document.body.classList.add(

        "theme-transition"

    );

    setTimeout(()=>{

        document.body.classList.remove(

            "theme-transition"

        );

    },400);

}

/* =========================================
   Event
========================================= */

if(themeToggle){

themeToggle.addEventListener(

"click",

()=>{

enableTransitions();

toggleTheme();

}

);

}

/* =========================================
   Startup
========================================= */

initializeTheme();

/* =========================================
   Public API
========================================= */

window.toggleTheme=toggleTheme;

window.applyTheme=applyTheme;

window.initializeTheme=initializeTheme;
