'use strict';
const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
let W = 2000, H = 1500;              // world size
const GS = 1.5;                     // ground texture resolution multiplier
const SS = 2;                       // sprite cache resolution multiplier
let VW = 0, VH = 0, DPR = 1, ZOOM = 1;

