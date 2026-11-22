import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Customized,
} from "recharts";

/* ============================== DATA ============================== */

const NOTES = Array.from({ length: 88 }, (_, i) => i + 1);

const STANWOOD_NAMES = ["Bottom Low","1/4 Low","1/2 Low","3/4 Low","Top Low","1/4 Medium","3/4 Medium (a)","3/4 Medium","Top medium","1/4 High","1/2 High","3/4 High","Top High"];

const S1=[8,8,8,7.9,7.9,7.9,7.9,7.8,7.8,7.8,7.8,7.7,7.7,7.7,7.6,7.6,7.6,7.6,7.5,7.5,7.5,7.4,7.4,7.4,7.3,7.3,7.3,7.2,7.2,7.1,7.1,7.1,7,7,6.9,6.9,6.8,6.8,6.7,6.7,6.6,6.6,6.6,6.5,6.4,6.4,6.3,6.3,6.2,6.2,6.1,6.1,6,6,5.9,5.8,5.8,5.7,5.7,5.6,5.5,5.5,5.4,5.3,5.3,5.2,5.1,5.1,5,4.9,4.8,4.8,4.7,4.6,4.5,4.5,4.4,4.3,4.2,4.1,4.1,4,3.9,3.8,3.7,3.7,3.6,3.5];
const S2=[8.6,8.5,8.5,8.5,8.5,8.4,8.4,8.4,8.4,8.3,8.3,8.3,8.2,8.2,8.2,8.2,8.1,8.1,8.1,8,8,8,7.9,7.9,7.8,7.8,7.8,7.7,7.7,7.6,7.6,7.6,7.5,7.5,7.4,7.4,7.3,7.3,7.2,7.2,7.1,7.1,7,7,6.9,6.9,6.8,6.8,6.7,6.6,6.6,6.5,6.5,6.4,6.3,6.3,6.2,6.1,6.1,6,5.9,5.9,5.8,5.7,5.6,5.6,5.5,5.4,5.3,5.3,5.2,5.1,5,5,4.9,4.8,4.7,4.6,4.5,4.5,4.4,4.3,4.2,4.1,4,3.9,3.9,3.8];
const S3=[9.1,9.1,9.1,9.1,9,9,9,8.9,8.9,8.9,8.8,8.8,8.8,8.7,8.7,8.7,8.6,8.6,8.6,8.5,8.5,8.5,8.4,8.4,8.4,8.3,8.3,8.2,8.2,8.1,8.1,8.1,8,8,7.9,7.9,7.8,7.8,7.7,7.7,7.6,7.6,7.5,7.4,7.4,7.3,7.3,7.2,7.2,7.1,7,7,6.9,6.8,6.8,6.7,6.6,6.6,6.5,6.4,6.3,6.3,6.2,6.1,6,5.9,5.9,5.8,5.7,5.6,5.5,5.5,5.4,5.3,5.2,5.1,5,4.9,4.9,4.8,4.7,4.6,4.5,4.4,4.3,4.2,4.1,4];
const S4=[9.7,9.7,9.7,9.6,9.6,9.6,9.5,9.5,9.5,9.4,9.4,9.4,9.3,9.3,9.2,9.2,9.2,9.1,9.1,9.1,9,9,8.9,8.9,8.9,8.8,8.8,8.7,8.7,8.6,8.6,8.6,8.5,8.5,8.4,8.4,8.3,8.3,8.2,8.2,8.1,8,8,7.9,7.9,7.8,7.7,7.7,7.6,7.5,7.5,7.4,7.3,7.3,7.2,7.1,7,7,6.9,6.8,6.7,6.7,6.6,6.5,6.4,6.3,6.2,6.2,6.1,6,5.9,5.8,5.7,5.6,5.5,5.4,5.4,5.3,5.2,5.1,5,4.9,4.8,4.7,4.6,4.5,4.4,4.3];
const S5=[10.3,10.3,10.2,10.2,10.2,10.1,10.1,10,10,10,9.9,9.9,9.9,9.8,9.8,9.7,9.7,9.7,9.6,9.6,9.5,9.5,9.5,9.4,9.4,9.3,9.3,9.2,9.2,9.2,9.1,9.1,9,9,8.9,8.9,8.8,8.8,8.7,8.6,8.6,8.5,8.5,8.4,8.3,8.3,8.2,8.1,8.1,8,7.9,7.9,7.8,7.7,7.6,7.5,7.5,7.4,7.3,7.2,7.1,7,7,6.9,6.8,6.7,6.6,6.5,6.4,6.3,6.2,6.2,6.1,6,5.9,5.8,5.7,5.6,5.5,5.4,5.3,5.2,5.1,5,4.9,4.8,4.7,4.6];
const S6=[10.8,10.8,10.8,10.7,10.7,10.6,10.6,10.6,10.5,10.5,10.4,10.4,10.4,10.3,10.3,10.2,10.2,10.2,10.1,10.1,10,10,10,9.9,9.9,9.8,9.8,9.7,9.7,9.6,9.6,9.5,9.5,9.4,9.4,9.3,9.3,9.2,9.2,9.1,9,9,8.9,8.8,8.8,8.7,8.6,8.6,8.5,8.4,8.4,8.3,8.2,8.1,8.1,8,7.9,7.8,7.7,7.6,7.5,7.5,7.4,7.3,7.2,7.1,7,6.9,6.8,6.7,6.6,6.5,6.4,6.3,6.2,6.1,6,5.9,5.8,5.7,5.6,5.5,5.4,5.3,5.2,5.1,5,4.9];
const S7=[11.3,11.3,11.3,11.2,11.2,11.2,11.1,11.1,11,11,11,10.9,10.9,10.8,10.8,10.8,10.7,10.7,10.6,10.6,10.5,10.5,10.5,10.4,10.4,10.3,10.3,10.2,10.2,10.1,10.1,10,10,9.9,9.9,9.8,9.7,9.7,9.6,9.6,9.5,9.4,9.4,9.3,9.2,9.2,9.1,9,8.9,8.9,8.8,8.7,8.6,8.6,8.5,8.4,8.3,8.2,8.1,8.1,8,7.9,7.8,7.7,7.6,7.5,7.4,7.3,7.2,7.1,7,6.9,6.8,6.7,6.6,6.5,6.4,6.3,6.2,6.1,6,5.9,5.7,5.6,5.5,5.4,5.3,5.2];
const S8=[11.9,11.8,11.8,11.8,11.7,11.7,11.6,11.6,11.6,11.5,11.5,11.4,11.4,11.4,11.3,11.3,11.2,11.2,11.1,11.1,11,11,11,10.9,10.9,10.8,10.8,10.7,10.7,10.6,10.5,10.5,10.4,10.4,10.3,10.3,10.2,10.1,10.1,10,10,9.9,9.8,9.7,9.7,9.6,9.5,9.5,9.4,9.3,9.2,9.2,9.1,9,8.9,8.8,8.7,8.6,8.6,8.5,8.4,8.3,8.2,8.1,8,7.9,7.8,7.7,7.6,7.5,7.4,7.3,7.2,7.1,7,6.9,6.7,6.6,6.5,6.4,6.3,6.2,6.1,6,5.8,5.7,5.6,5.5];
const S9=[12.4,12.4,12.3,12.3,12.2,12.2,12.2,12.1,12.1,12,12,12,11.9,11.9,11.8,11.8,11.7,11.7,11.6,11.6,11.5,11.5,11.5,11.4,11.4,11.3,11.2,11.2,11.1,11.1,11,11,10.9,10.9,10.8,10.7,10.7,10.6,10.5,10.5,10.4,10.3,10.3,10.2,10.1,10.1,10,9.9,9.8,9.7,9.7,9.6,9.5,9.4,9.3,9.2,9.2,9.1,9,8.9,8.8,8.7,8.6,8.5,8.4,8.3,8.2,8.1,8,7.9,7.8,7.7,7.5,7.4,7.3,7.2,7.1,7,6.9,6.7,6.6,6.5,6.4,6.3,6.2,6,5.9,5.8];
const S10=[13,13,12.9,12.9,12.8,12.8,12.7,12.7,12.7,12.6,12.6,12.5,12.5,12.4,12.4,12.3,12.3,12.2,12.2,12.2,12.1,12,12,11.9,11.9,11.8,11.8,11.7,11.7,11.6,11.6,11.5,11.4,11.4,11.3,11.2,11.2,11.1,11,11,10.9,10.8,10.7,10.7,10.6,10.5,10.4,10.4,10.3,10.2,10.1,10,9.9,9.9,9.8,9.7,9.6,9.5,9.4,9.3,9.2,9.1,9,8.9,8.8,8.7,8.6,8.5,8.3,8.2,8.1,8,7.9,7.8,7.7,7.5,7.4,7.3,7.2,7.1,6.9,6.8,6.7,6.6,6.4,6.3,6.2,6.1];
const S11=[13.6,13.6,13.5,13.5,13.4,13.4,13.3,13.3,13.2,13.2,13.1,13.1,13.1,13,13,12.9,12.9,12.8,12.8,12.7,12.7,12.6,12.5,12.5,12.4,12.4,12.3,12.3,12.2,12.1,12.1,12,11.9,11.9,11.8,11.7,11.7,11.6,11.5,11.5,11.4,11.3,11.2,11.1,11.1,11,10.9,10.8,10.7,10.6,10.6,10.5,10.4,10.3,10.2,10.1,10,9.9,9.8,9.7,9.6,9.5,9.4,9.3,9.2,9,8.9,8.8,8.7,8.6,8.5,8.4,8.2,8.1,8,7.9,7.7,7.6,7.5,7.4,7.2,7.1,7,6.9,6.7,6.6,6.5,6.3];
const S12=[14.2,14.2,14.1,14.1,14,14,13.9,13.9,13.8,13.8,13.7,13.7,13.6,13.6,13.5,13.5,13.4,13.4,13.3,13.3,13.2,13.1,13.1,13,13,12.9,12.9,12.8,12.7,12.7,12.6,12.5,12.5,12.4,12.3,12.2,12.2,12.1,12,11.9,11.9,11.8,11.7,11.6,11.5,11.5,11.4,11.3,11.2,11.1,11,10.9,10.8,10.7,10.6,10.5,10.4,10.3,10.2,10.1,10,9.9,9.8,9.7,9.5,9.4,9.3,9.2,9.1,8.9,8.8,8.7,8.6,8.5,8.3,8.2,8.1,7.9,7.8,7.7,7.6,7.4,7.3,7.2,7,6.9,6.8,6.6];
const S13=[14.8,14.8,14.7,14.7,14.6,14.6,14.5,14.5,14.4,14.4,14.3,14.3,14.2,14.1,14.1,14,14,13.9,13.9,13.8,13.8,13.7,13.6,13.6,13.5,13.5,13.4,13.3,13.3,13.2,13.1,13,13,12.9,12.8,12.8,12.7,12.6,12.5,12.4,12.4,12.3,12.2,12.1,12,11.9,11.8,11.7,11.6,11.5,11.4,11.3,11.2,11.1,11,10.9,10.8,10.7,10.6,10.5,10.4,10.3,10.2,10,9.9,9.8,9.7,9.6,9.4,9.3,9.2,9,8.9,8.8,8.7,8.5,8.4,8.3,8.1,8,7.9,7.7,7.6,7.4,7.3,7.2,7,6.9];

const STANWOOD_CURVES = [S1,S2,S3,S4,S5,S6,S7,S8,S9,S10,S11,S12,S13].map((data, i) => ({ num: i + 1, name: STANWOOD_NAMES[i], data }));
const HIGHLIGHT_NUMS = new Set([1, 5, 9, 13]);

const LOVE_FW_MAX = [40.95,40.8,40.64,40.47,40.3,40.13,39.94,39.76,39.56,39.36,39.16,38.95,38.73,38.51,38.28,38.04,37.8,37.56,37.31,37.05,36.78,36.52,36.24,35.96,35.67,35.38,35.09,34.78,34.47,34.16,33.84,33.51,33.18,32.84,32.5,32.15,31.79,31.43,31.06,30.69,30.31,29.93,29.54,29.14,28.74,28.34,27.92,27.5,27.08,26.65,26.21,25.77,25.33,24.87,24.41,23.95,23.48,23,22.52,22.03,21.54,21.04,20.53,20.02,19.51,18.98,18.46,17.92,17.38,16.84,16.29,15.73,15.17,14.6,14.03,13.45,12.86,12.27,11.67,11.07,10.46,9.84,9.22,8.6,7.97,7.33,6.69,6.04];

const DEFAULT_SW = [10.9,10.6,10.6,10.8,10.5,11.1,11.4,11,10.7,10.8,10.9,10.8,10.6,10.4,11,10.8,10.6,10.8,10.6,10.5,10.5,10.1,10,10,10,9.7,9.7,9.8,9.6,9.5,9.5,9.4,9.5,9.3,9.3,9.2,9.7,9.7,9.6,9.8,9.7,9.5,9.3,9.5,8.9,8.9,8.9,9,8.9,8.8,8.8,8.9,8.9,8.9,9.1,8.8,8.8,8.5,8.7,8.4,8,8.2,7.6,7.6,8.1,7.6,7.6,7.6,7.5,7.2,7.4,7.4,7.1,7.2,7.1,7.3,7,7,6.9,6.8,6.9,6.7,6.9,6.4,6.5,6.3,6.2,6.2];

const EMPTY_88 = () => Array(88).fill(null);

/* ============================== NOTE / KEYBOARD GEOMETRY ============================== */

const PITCH_CLASSES = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];
const WHITE_W = 24, WHITE_H = 96, BLACK_W = 15, BLACK_H = 58;

const NOTE_META = (() => {
  let whiteCount = 0;
  return NOTES.map((n) => {
    const i = n - 1;
    const pc = PITCH_CLASSES[i % 12];
    const octave = Math.floor((i + 9) / 12);
    const isSharp = pc.includes("#");
    let x;
    if (isSharp) { x = whiteCount * WHITE_W - BLACK_W / 2; }
    else { x = whiteCount * WHITE_W; whiteCount += 1; }
    return { note: n, name: pc + octave, isSharp, x };
  });
})();
const KEYBOARD_WIDTH = NOTE_META.filter((m) => !m.isSharp).length * WHITE_W;

// Love's landmark sample notes: all Cs, all Gs, plus note 1 — his standard spread for extrapolating the SW curve
const LANDMARK_NOTES = Array.from(new Set([
  1,
  ...NOTE_META.filter((m) => !m.isSharp && (m.name[0] === "C" || m.name[0] === "G")).map((m) => m.note),
])).sort((a, b) => a - b);

/* ============================== DESIGN TOKENS ============================== */

const C = {
  shell: "#1E1B17", shellInk: "#EDE4D2", shellInkDim: "#B9AD97",
  paper: "#EFE8D6", paperGrid: "#D9CFB2",
  ink: "#2A241C", inkDim: "#6B6152",
  brass: "#B8863B", brassDeep: "#8E661F",
  copper: "#A6552F", felt: "#3E6B4E", graphite: "#33312C", plum: "#7A4B6B",
  warnOrange: "#C97A2E", warnRed: "#B23A3A",
  keyWhite: "#FBF7EC", keyWhiteEdge: "#D9CFB2", keyBlack: "#2A2620",
  zoneHigh: "#C68A3D", zoneMed: "#8E7A4E", zoneLow: "#4E6B72",
};

/* ============================== MATH ============================== */

function quadFit(points) {
  const n = points.length;
  if (n < 3) { const mean = n ? points.reduce((s, p) => s + p.y, 0) / n : 0; return { a: 0, b: 0, c: mean, n }; }
  let Sx=0,Sx2=0,Sx3=0,Sx4=0,Sy=0,Sxy=0,Sx2y=0;
  for (const { x, y } of points) { Sx+=x; Sx2+=x*x; Sx3+=x**3; Sx4+=x**4; Sy+=y; Sxy+=x*y; Sx2y+=x*x*y; }
  const D  = n*(Sx2*Sx4-Sx3*Sx3) - Sx*(Sx*Sx4-Sx3*Sx2) + Sx2*(Sx*Sx3-Sx2*Sx2);
  const Dc = Sy*(Sx2*Sx4-Sx3*Sx3) - Sx*(Sxy*Sx4-Sx3*Sx2y) + Sx2*(Sxy*Sx3-Sx2*Sx2y);
  const Db = n*(Sxy*Sx4-Sx3*Sx2y) - Sy*(Sx*Sx4-Sx3*Sx2) + Sx2*(Sx*Sx2y-Sxy*Sx2);
  const Da = n*(Sx2*Sx2y-Sxy*Sx3) - Sx*(Sx*Sx2y-Sxy*Sx2) + Sy*(Sx*Sx3-Sx2*Sx2);
  if (D === 0) return { a: 0, b: 0, c: Sy / n, n };
  return { a: Da / D, b: Db / D, c: Dc / D, n };
}
const round1 = (v) => (v === null || v === undefined || Number.isNaN(v) ? null : Math.round(v * 10) / 10);

// Matches the spreadsheet's conditional formatting: 0.3-<0.5g deviation = orange, >=0.5g = red
function deviationColor(absDiff) {
  if (absDiff == null) return C.felt;
  if (absDiff >= 0.5) return C.warnRed;
  if (absDiff >= 0.3) return C.warnOrange;
  return C.felt;
}

/* ============================== STYLE ============================== */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,420;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
      * { box-sizing: border-box; }
      .tw-shell { background: ${C.shell}; color: ${C.shellInk}; font-family: 'IBM Plex Sans', sans-serif; min-height: 100vh; display: flex; flex-direction: column; }
      .tw-scroll { flex: 1; overflow-y: auto; padding: 24px 20px 12px; }
      .tw-wrap { max-width: 1180px; margin: 0 auto; }

      .tw-nameplate { display: flex; align-items: baseline; justify-content: space-between; border-bottom: 1px solid #3A3630; padding-bottom: 16px; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
      .tw-nameplate h1 { font-family: 'Fraunces', serif; font-weight: 600; font-size: 28px; margin: 0; color: ${C.shellInk}; }
      .tw-nameplate .accent { color: ${C.brass}; font-style: italic; font-weight: 420; }
      .tw-nameplate .sub { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.shellInkDim}; }

      .tw-globalbar { display: flex; align-items: flex-end; gap: 20px; background: #262219; border: 1px solid #3A3630; border-radius: 10px; padding: 14px 18px; margin-bottom: 16px; flex-wrap: wrap; }
      .tw-field { display: flex; flex-direction: column; gap: 5px; }
      .tw-field-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${C.shellInkDim}; }
      .tw-field-row { display: flex; align-items: baseline; gap: 5px; border-bottom: 1.5px solid #4A4438; padding-bottom: 3px; }
      .tw-field-input { background: transparent; border: none; outline: none; color: ${C.brass}; font-family: 'IBM Plex Mono', monospace; font-size: 19px; font-weight: 600; width: 68px; }
      .tw-field-suffix { color: ${C.shellInkDim}; font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
      .tw-globalbar-note { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: ${C.shellInkDim}; margin-left: auto; align-self: center; }
      .tw-demobtn { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.03em; padding: 7px 12px; border-radius: 6px; cursor: pointer; border: 1px solid #4A4438; background: #2E2A21; color: ${C.shellInk}; align-self: center; }
      .tw-demobtn:hover { border-color: ${C.brass}; }
      .tw-demobtn--clear { color: ${C.shellInkDim}; }

      .tw-panel { background: ${C.paper}; border-radius: 10px; padding: 16px 16px 10px; margin-bottom: 16px; border: 1px solid #DCD0AB; }
      .tw-panel-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 2px; flex-wrap: wrap; gap: 6px; }
      .tw-panel-title { font-family: 'Fraunces', serif; font-weight: 600; font-size: 17px; color: ${C.ink}; }
      .tw-panel-note { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: ${C.inkDim}; }

      .tw-legend-row { display: flex; flex-wrap: wrap; gap: 5px; margin: 8px 0 8px; }
      .tw-legend-chip { display: inline-flex; align-items: center; gap: 5px; border: 1px solid var(--cc); background: rgba(255,255,255,0.55); border-radius: 999px; padding: 2px 9px 2px 3px; }
      .tw-legend-num { width: 15px; height: 15px; border-radius: 50%; background: var(--cc); color: #fff; font-family: 'IBM Plex Mono', monospace; font-size: 9px; font-weight: 600; display: flex; align-items: center; justify-content: center; }
      .tw-legend-name { font-size: 11px; color: ${C.ink}; }

      .tw-tooltip { background: ${C.shell}; color: ${C.shellInk}; border: 1px solid ${C.brass}; border-radius: 6px; padding: 7px 10px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; }
      .tw-tooltip-title { color: ${C.brass}; font-weight: 600; margin-bottom: 3px; }

      .tw-swchart-row { display: flex; gap: 0; }
      .tw-zonestrip { width: 70px; flex-shrink: 0; position: relative; }
      .tw-zonestrip-band { position: absolute; left: 32px; right: 0; font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; color: #fff; display: flex; align-items: center; justify-content: center; border-radius: 3px; }
      .tw-zonestrip-tick { position: absolute; left: 0; width: 28px; text-align: right; font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: ${C.inkDim}; transform: translateY(-50%); }
      .tw-zonestrip-tickline { position: absolute; left: 30px; width: 6px; height: 1px; background: ${C.inkDim}; }

      .tw-modetabs { display: flex; gap: 4px; margin-bottom: 0; }
      .tw-modetab { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; padding: 9px 16px; border-radius: 8px 8px 0 0; cursor: pointer; border: 1px solid #3A3630; border-bottom: none; background: #262219; color: ${C.shellInkDim}; }
      .tw-modetab--active { background: ${C.paper}; color: ${C.ink}; border-color: #DCD0AB; }

      .tw-mode-panel { background: ${C.paper}; border-radius: 0 10px 10px 10px; padding: 16px; margin-bottom: 100px; border: 1px solid #DCD0AB; }
      .tw-mode-desc { font-size: 12px; color: ${C.inkDim}; line-height: 1.5; max-width: 640px; margin: 0 0 12px; }
      .tw-mode-inputs { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 4px; align-items: flex-end; }
      .tw-eww-readout { display: flex; flex-direction: column; gap: 2px; padding: 4px 12px; background: #fff; border: 1px dashed ${C.paperGrid}; border-radius: 6px; }
      .tw-eww-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.05em; text-transform: uppercase; color: ${C.inkDim}; }
      .tw-eww-value { font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 600; color: ${C.copper}; }
      .tw-eww-sub { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: ${C.inkDim}; }

      .tw-arcalc { margin-top: 18px; padding-top: 16px; border-top: 1px solid ${C.paperGrid}; }
      .tw-arcalc-head { display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 6px; margin-bottom: 4px; cursor: pointer; user-select: none; }
      .tw-arcalc-caret { display: inline-block; color: ${C.copper}; font-size: 11px; margin-right: 2px; }
      .tw-arcalc-title { font-family: 'Fraunces', serif; font-weight: 600; font-size: 14.5px; color: ${C.ink}; }
      .tw-arcalc-tag { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: ${C.inkDim}; }
      .tw-arcalc-desc { font-size: 11.5px; color: ${C.inkDim}; line-height: 1.5; max-width: 640px; margin: 0 0 10px; }
      .tw-arcalc-table { width: 100%; border-collapse: collapse; font-family: 'IBM Plex Mono', monospace; font-size: 11px; margin-bottom: 10px; }
      .tw-arcalc-table th { text-align: right; color: ${C.inkDim}; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em; padding: 2px 6px 5px; }
      .tw-arcalc-table th:first-child, .tw-arcalc-table td:first-child { text-align: left; }
      .tw-arcalc-table td { padding: 3px 6px; text-align: right; border-top: 1px solid ${C.paperGrid}; color: ${C.ink}; }
      .tw-arcalc-input { width: 56px; font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: ${C.ink}; background: #fff; border: 1px solid ${C.paperGrid}; border-radius: 4px; padding: 3px 6px; text-align: right; }
      .tw-arcalc-result { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
      .tw-arcalc-avg { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; color: ${C.ink}; }
      .tw-arcalc-avg b { color: ${C.copper}; font-size: 15px; }
      .tw-arcalc-apply { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; background: ${C.copper}; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; }
      .tw-arcalc-apply:disabled { background: ${C.paperGrid}; color: ${C.inkDim}; cursor: default; }

      .tw-table { width: 100%; border-collapse: collapse; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: ${C.ink}; }
      .tw-table th, .tw-table td { padding: 3px 7px; text-align: right; border-bottom: 1px solid ${C.paperGrid}; }
      .tw-table th { color: ${C.inkDim}; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em; }
      .tw-table td:first-child, .tw-table th:first-child { text-align: left; }
      .tw-table-scroll { max-height: 220px; overflow-y: auto; border: 1px solid ${C.paperGrid}; border-radius: 6px; }

      /* Sticky isolated keyboard box */
      .tw-kbox { position: sticky; bottom: 0; z-index: 20; background: ${C.shell}; border-top: 2px solid ${C.brass}; box-shadow: 0 -8px 24px rgba(0,0,0,0.4); padding: 10px 20px 12px; }
      .tw-kbox-inner { max-width: 1180px; margin: 0 auto; }
      .tw-kbox-controls { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 8px; }
      .tw-displaytoggles { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
      .tw-sw-legend { display: inline-flex; align-items: center; gap: 4px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: ${C.shellInkDim}; margin-left: 6px; }
      .tw-sw-legend-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin-left: 6px; }
      .tw-dtoggle { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.04em; padding: 5px 11px; border-radius: 999px; cursor: pointer; border: 1px solid #4A4438; background: #262219; color: ${C.shellInkDim}; display: inline-flex; align-items: center; gap: 6px; }
      .tw-dtoggle--on { color: #fff; border-color: var(--dc); background: var(--dc); }
      .tw-dtoggle-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--dc); }
      .tw-inputmode-switch { margin-left: auto; display: flex; align-items: center; gap: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${C.shellInkDim}; }
      .tw-switch { width: 40px; height: 22px; border-radius: 999px; background: #4A4438; position: relative; cursor: pointer; border: none; padding: 0; flex-shrink: 0; }
      .tw-switch--on { background: ${C.brass}; }
      .tw-switch-knob { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform 0.15s; }
      .tw-switch--on .tw-switch-knob { transform: translateX(18px); }

      .tw-editor { display: flex; align-items: flex-end; gap: 14px; flex-wrap: wrap; background: #262219; border-radius: 8px; padding: 10px 14px; margin-bottom: 8px; }
      .tw-editor-note { font-family: 'Fraunces', serif; font-size: 20px; color: ${C.brass}; min-width: 58px; }
      .tw-editor-field { display: flex; flex-direction: column; gap: 3px; }
      .tw-editor-field label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; color: ${C.shellInkDim}; }
      .tw-editor-field input { width: 66px; font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: ${C.shellInk}; background: #1E1B17; border: 1px solid #4A4438; border-radius: 4px; padding: 4px 7px; }
      .tw-editor-field input:disabled { color: ${C.shellInkDim}; opacity: 0.6; }
      .tw-editor-derived { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: ${C.shellInkDim}; display: flex; flex-direction: column; gap: 2px; }
      .tw-editor-derived b { color: ${C.shellInk}; }
      .tw-editor-nav { display: flex; gap: 4px; margin-left: auto; }
      .tw-editor-nav button { font-family: 'IBM Plex Mono', monospace; font-size: 12px; background: ${C.brass}; color: #fff; border: none; border-radius: 5px; padding: 5px 11px; cursor: pointer; }
      .tw-editor-nav button:disabled { opacity: 0.3; cursor: default; }

      .tw-keyboard-wrap { overflow-x: auto; overflow-y: hidden; border-radius: 6px; border: 1px solid #4A4438; background: #16140F; padding: 8px 8px 4px; }
      .tw-keyboard { position: relative; height: ${WHITE_H}px; }
      .tw-key-white { position: absolute; top: 0; width: ${WHITE_W - 1.5}px; height: ${WHITE_H}px; background: ${C.keyWhite}; border: 1px solid ${C.keyWhiteEdge}; border-radius: 0 0 4px 4px; cursor: pointer; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 5px; }
      .tw-key-white--octave { border-left: 2px solid #B8A87C; }
      .tw-key-white--selected { background: #FDF0D2; border-color: ${C.brass}; border-width: 2px; }
      .tw-key-num { position: absolute; top: ${BLACK_H + 4}px; left: 0; width: 100%; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 9px; line-height: 1; color: ${C.inkDim}; pointer-events: none; user-select: none; }
      .tw-key-num--landmark { color: ${C.copper}; font-weight: 700; font-size: 10px; }
      .tw-key-black { position: absolute; top: 0; width: ${BLACK_W}px; height: ${BLACK_H}px; background: ${C.keyBlack}; border-radius: 0 0 3px 3px; cursor: pointer; z-index: 2; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 4px; }
      .tw-key-black--selected { background: ${C.brassDeep}; }
      .tw-key-dot { width: 4px; height: 4px; border-radius: 50%; }

      .tw-grid-panel { background: #262219; border: 1px solid #3A3630; border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; }
      .tw-grid-head { display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 8px; cursor: pointer; user-select: none; }
      .tw-grid-title { font-family: 'Fraunces', serif; font-size: 18px; color: ${C.brass}; }
      .tw-grid-hint { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: ${C.shellInkDim}; }
      .tw-grid-cols { display: flex; gap: 6px; flex-wrap: wrap; margin: 10px 0; }
      .tw-grid-scroll { max-height: 340px; overflow: auto; border: 1px solid #3A3630; border-radius: 6px; -webkit-overflow-scrolling: touch; }
      .tw-grid-table { border-collapse: collapse; width: 100%; font-family: 'IBM Plex Mono', monospace; font-size: 13px; }
      .tw-grid-table th { position: sticky; top: 0; background: #1E1B17; color: ${C.shellInkDim}; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; padding: 6px 8px; text-align: left; z-index: 1; }
      .tw-grid-table td { padding: 0; border-top: 1px solid #332E26; }
      .tw-grid-table td.tw-grid-note { padding: 0 10px; color: ${C.brass}; white-space: nowrap; width: 90px; }
      .tw-grid-table td.tw-grid-calc { padding: 0 8px; color: ${C.shellInkDim}; white-space: nowrap; }
      .tw-grid-table tr.tw-grid-row--sel td { background: #3A3223; }
      .tw-grid-cell { width: 100%; min-width: 64px; box-sizing: border-box; background: transparent; border: none; color: ${C.shellInk}; font: inherit; padding: 10px 8px; }
      .tw-grid-cell:focus { outline: 2px solid ${C.brass}; outline-offset: -2px; background: #1E1B17; }

      input:focus-visible, button:focus-visible { outline: 2px solid ${C.brass}; outline-offset: 2px; }
    `}</style>
  );
}

/* ============================== SHARED UI ============================== */

function NumberField({ label, value, onChange, step, suffix }) {
  return (
    <label className="tw-field">
      <span className="tw-field-label">{label}</span>
      <span className="tw-field-row">
        <input type="number" className="tw-field-input" value={value} step={step} onChange={(e) => onChange(parseFloat(e.target.value))} />
        {suffix && <span className="tw-field-suffix">{suffix}</span>}
      </span>
    </label>
  );
}

function ZoneLabelsOverlay({ xAxisMap, yAxisMap }) {
  const xAxis = xAxisMap ? Object.values(xAxisMap)[0] : null;
  const yAxis = yAxisMap ? Object.values(yAxisMap)[0] : null;
  if (!xAxis || !yAxis) return null;
  const { scale: xScale } = xAxis;
  const { scale: yScale } = yAxis;
  const noteX = 3; // pinned near the left edge of the plot, tracks real curve data
  const idx = noteX - 1;
  const bands = [
    { text: "HIGH", y: (S9[idx] + S13[idx]) / 2 },
    { text: "MEDIUM", y: (S5[idx] + S9[idx]) / 2 },
    { text: "LOW", y: (S1[idx] + S5[idx]) / 2 },
  ];
  const px = xScale(noteX) + 8;
  return (
    <g style={{ pointerEvents: "none" }}>
      {bands.map((b) => (
        <text key={b.text} x={px} y={yScale(b.y)} dy={4}
          fontFamily="'IBM Plex Mono', monospace" fontSize={11} fontWeight={600}
          letterSpacing="0.09em" fill={C.inkDim}>
          {b.text}
        </text>
      ))}
    </g>
  );
}

function SWTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const m = payload.find((p) => p.dataKey === "sw"), s = payload.find((p) => p.dataKey === "smoothed");
  const diff = m && m.payload ? m.payload.diffFromSmoothed : null;
  const absDiff = diff != null ? Math.abs(diff) : null;
  const diffColor = deviationColor(absDiff);
  return (
    <div className="tw-tooltip">
      <div className="tw-tooltip-title">Note {label}</div>
      {s && s.value != null && <div>Smoothed SW: <b>{s.value.toFixed(1)}g</b></div>}
      {m && m.value != null && <div>Measured SW: <b>{m.value.toFixed(1)}g</b></div>}
      {diff != null && (
        <div style={{ color: diffColor, fontWeight: 600 }}>
          Diff: {diff > 0 ? "+" : ""}{diff.toFixed(1)}g
        </div>
      )}
    </div>
  );
}
function FWTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const get = (k) => payload.find((p) => p.dataKey === k);
  const rows = [
    ["Target FW (Smoothed)", get("fwSmoothed")], ["Target FW (from SW)", get("fwMeasured")],
    ["Orig FW (measured)", get("origFW")], ["New FW (Love's Method)", get("newFW")],
    ["FW Max Target (Buffered)", get("fwMaxBuffered")], ["FW Max Ceiling (100%)", get("fwMaxCeiling")],
  ];
  return (
    <div className="tw-tooltip">
      <div className="tw-tooltip-title">Note {label}</div>
      {rows.map(([lbl, p]) => p && p.value != null && <div key={lbl}>{lbl}: <b>{p.value.toFixed(1)}g</b></div>)}
    </div>
  );
}

/* ============================== ACTION RATIO CALCULATOR (Love's Method) ============================== */
/* Per the FW Modification Sheet instructions: measure BW, clip 5g onto the strike weight,
   remeasure BW, and the delta divided by 5 is the action ratio. Averaged across sample notes. */

function ActionRatioCalc({ rows, setRows, onApply, currentAR, open, onToggle }) {
  const setCell = (i, key, val) => setRows((prev) => { const next = [...prev]; next[i] = { ...next[i], [key]: val }; return next; });

  const computed = rows.map((r) => {
    const delta = r.bw1 != null && r.bw2 != null ? Math.abs(r.bw2 - r.bw1) : null;
    const ar = delta != null ? delta / 5 : null;
    return { ...r, delta, ar };
  });
  const valid = computed.filter((r) => r.ar != null);
  const avg = valid.length ? valid.reduce((s, r) => s + r.ar, 0) / valid.length : null;

  return (
    <div className="tw-arcalc">
      <div className="tw-arcalc-head" onClick={onToggle} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onToggle(); }}>
        <div className="tw-arcalc-title">
          <span className="tw-arcalc-caret">{open ? "▾" : "▸"}</span> Determine Action Ratio
        </div>
        <div className="tw-arcalc-tag">
          Love's Method{!open && avg != null ? ` · avg ${avg.toFixed(2)}:1` : ""}
        </div>
      </div>
      {open && (
        <>
          <p className="tw-arcalc-desc">
            Measure BW on a sample note. Clip 5g onto the hammer (adding to strike weight), then remeasure BW.
            The change in BW divided by 5 gives the action ratio at that note. Sample a few notes across the
            scale and average for a more reliable figure.
          </p>
          <table className="tw-arcalc-table">
            <thead>
              <tr><th>Note</th><th>BW (g)</th><th>BW +5g SW (g)</th><th>ΔBW (g)</th><th>Action Ratio</th></tr>
            </thead>
            <tbody>
              {computed.map((r, i) => (
                <tr key={i}>
                  <td>
                    <input className="tw-arcalc-input" style={{ width: 42 }} type="number" min={1} max={88} value={r.note ?? ""} placeholder="—"
                      onChange={(e) => setCell(i, "note", e.target.value === "" ? null : parseInt(e.target.value, 10))} />
                  </td>
                  <td>
                    <input className="tw-arcalc-input" type="number" step={0.1} value={r.bw1 ?? ""} placeholder="—"
                      onChange={(e) => setCell(i, "bw1", e.target.value === "" ? null : parseFloat(e.target.value))} />
                  </td>
                  <td>
                    <input className="tw-arcalc-input" type="number" step={0.1} value={r.bw2 ?? ""} placeholder="—"
                      onChange={(e) => setCell(i, "bw2", e.target.value === "" ? null : parseFloat(e.target.value))} />
                  </td>
                  <td>{r.delta != null ? r.delta.toFixed(1) : "—"}</td>
                  <td>{r.ar != null ? r.ar.toFixed(2) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="tw-arcalc-result">
            <span className="tw-arcalc-avg">
              Average: <b>{avg != null ? avg.toFixed(2) : "—"}</b>{avg != null && <span style={{ color: C.inkDim, fontSize: 11 }}> : 1</span>}
              {avg != null && <span style={{ color: C.inkDim, fontSize: 10.5, marginLeft: 8 }}>current field: {currentAR}</span>}
            </span>
            <button className="tw-arcalc-apply" disabled={avg == null} onClick={() => onApply(Math.round(avg * 100) / 100)}>
              Apply to Action Ratio
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================== SW CURVE — LANDMARK SAMPLES (Love's Method) ============================== */
/* Per the FW Modification Sheet: preset the landmark keys' front weight to the buffered FW Max target,
   then mix and match hammers until the balance weight matches Target BW. Record the resulting strike
   weight here — it writes directly into the same SW dataset that drives the curve above. */

function LandmarkSWSamples({ rows, setField, fwBuffer, setFwBuffer, open, onToggle }) {
  const landmarkRows = rows.filter((r) => LANDMARK_NOTES.includes(r.note));
  const filledCount = landmarkRows.filter((r) => r.sw != null).length;

  return (
    <div className="tw-arcalc">
      <div className="tw-arcalc-head" onClick={onToggle} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onToggle(); }}>
        <div className="tw-arcalc-title">
          <span className="tw-arcalc-caret">{open ? "▾" : "▸"}</span> Determine SW Curve — Landmark Samples
        </div>
        <div className="tw-arcalc-tag">
          Love's Method{!open ? ` · ${filledCount}/${landmarkRows.length} recorded` : ""}
        </div>
      </div>
      {open && (
        <>
          <p className="tw-arcalc-desc">
            For each landmark note below (all Cs, all Gs, and note 1 — {landmarkRows.length} notes total), preset
            the key's front weight to the Preset FW Target shown, then mix and match hammers or shanks until the
            balance weight matches your Target BW. Record the resulting strike weight as the SW Sample. Values
            entered here write directly into the same SW dataset behind the Strike Weight Design chart above —
            it will refit live as you go. Smoothed SW shows "—" until at least 3 SW values exist anywhere on the
            keyboard (a quadratic fit needs 3 points minimum) — fill in a few landmarks to get it started.
          </p>
          <div className="tw-arcalc-result" style={{ marginBottom: 10 }}>
            <NumberField label="FW Max %" value={fwBuffer} step={1} suffix="%" onChange={setFwBuffer} />
            <span style={{ color: C.inkDim, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}>
              same buffer used by the What-If tab's FW Max Target line
            </span>
          </div>
          <div className="tw-table-scroll" style={{ maxHeight: 260 }}>
            <table className="tw-table">
              <thead><tr><th>Note</th><th>Preset FW Target (g)</th><th>SW Sample (g)</th><th>Smoothed SW (g)</th></tr></thead>
              <tbody>
                {landmarkRows.map((r) => (
                  <tr key={r.note}>
                    <td>{NOTE_META[r.note - 1].name}</td>
                    <td>{r.fwMaxBuffered ?? "—"}</td>
                    <td>
                      <input className="tw-arcalc-input" type="number" step={0.1} value={r.sw ?? ""} placeholder="—"
                        style={{ color: r.sw != null ? C.copper : C.ink, fontWeight: r.sw != null ? 600 : 400 }}
                        onChange={(e) => setField(r.note - 1, "sw", e.target.value === "" ? null : parseFloat(e.target.value))} />
                    </td>
                    <td>{r.smoothed ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================== PIANO LIBRARY (persistent storage) ============================== */
/* Saves/loads full working snapshots (all 88 notes + settings) as named piano records.
   Uses Claude's artifact persistent storage (personal scope — private to each visitor) when
   available (requires the artifact to be published, and Pro/Max/Team/Enterprise). Export/Import
   as a real .json file always works regardless of plan or publish state, and is the safer
   long-term backup since unpublishing the artifact permanently deletes all stored data. */

const LIBRARY_KEY = "pianoLibrary";

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function PianoLibrary({ getSnapshot, applySnapshot }) {
  const [open, setOpen] = useState(false);
  const [pianos, setPianos] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | unavailable
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await window.storage.get(LIBRARY_KEY, false);
        if (cancelled) return;
        const parsed = result && result.value ? JSON.parse(result.value) : [];
        setPianos(Array.isArray(parsed) ? parsed : []);
        setStatus("ok");
      } catch {
        if (!cancelled) { setPianos([]); setStatus("unavailable"); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const persist = async (next) => {
    setPianos(next);
    try {
      const result = await window.storage.set(LIBRARY_KEY, JSON.stringify(next), false);
      if (!result) throw new Error("storage write failed");
      setStatus("ok");
    } catch {
      setStatus("unavailable");
      setMessage("Couldn't save to Claude's storage — this only works on a published artifact (Pro/Max/Team/Enterprise). Use Export instead to keep a local backup.");
    }
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) { setMessage("Give this piano a name first (e.g. \"Steinway O — Smith residence\")."); return; }
    const record = { id: Date.now(), name: trimmed, savedAt: new Date().toISOString(), ...getSnapshot() };
    persist([record, ...pianos]);
    setName(""); setMessage(`Saved "${trimmed}".`);
  };

  const handleLoad = (record) => { applySnapshot(record); setMessage(`Loaded "${record.name}".`); };
  const handleDelete = (id) => {
    const rec = pianos.find((p) => p.id === id);
    persist(pianos.filter((p) => p.id !== id));
    setMessage(rec ? `Deleted "${rec.name}".` : "Deleted.");
  };

  const handleExportLibrary = () => {
    if (pianos.length === 0) { setMessage("No saved pianos to export yet."); return; }
    downloadJSON(pianos, `touchweight-piano-library-${new Date().toISOString().slice(0, 10)}.json`);
  };
  const handleExportCurrent = () => {
    const trimmed = name.trim() || "untitled";
    downloadJSON({ id: Date.now(), name: trimmed, savedAt: new Date().toISOString(), ...getSnapshot() },
      `touchweight-${trimmed.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`);
  };
  const handleImportFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (Array.isArray(parsed)) {
          persist([...parsed, ...pianos]);
          setMessage(`Imported ${parsed.length} piano(s) into your library.`);
        } else if (parsed && parsed.notesData) {
          applySnapshot(parsed);
          setMessage(`Loaded "${parsed.name || "imported piano"}" — save it below to add it to your library.`);
        } else {
          setMessage("That file doesn't look like a Touchweight Workbench export.");
        }
      } catch {
        setMessage("Couldn't read that file — make sure it's a .json export from this app.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="tw-panel">
      <div className="tw-panel-head" onClick={() => setOpen((o) => !o)} role="button" tabIndex={0} style={{ cursor: "pointer" }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen((o) => !o); }}>
        <div className="tw-panel-title"><span className="tw-arcalc-caret">{open ? "▾" : "▸"}</span> Piano Library</div>
        <div className="tw-panel-note">
          {status === "unavailable" ? "cloud storage unavailable — use export/import" : `${pianos.length} saved`}
        </div>
      </div>
      {open && (
        <div style={{ marginTop: 8 }}>
          <div className="tw-arcalc-result" style={{ marginBottom: 8, flexWrap: "wrap" }}>
            <input className="tw-arcalc-input" style={{ width: 220 }} type="text" placeholder="Piano name — e.g. Steinway O, Smith residence"
              value={name} onChange={(e) => setName(e.target.value)} />
            <button className="tw-demobtn" onClick={handleSave}>Save current as new</button>
            <button className="tw-demobtn" onClick={handleExportCurrent}>Download current (.json)</button>
          </div>
          <div className="tw-arcalc-result" style={{ marginBottom: 10 }}>
            <button className="tw-demobtn" onClick={handleExportLibrary}>Export library (.json)</button>
            <button className="tw-demobtn" onClick={() => fileInputRef.current && fileInputRef.current.click()}>Import (.json)</button>
            <input ref={fileInputRef} type="file" accept="application/json" style={{ display: "none" }} onChange={handleImportFile} />
          </div>
          {message && <p className="tw-arcalc-desc" style={{ color: C.copper }}>{message}</p>}
          <div className="tw-table-scroll" style={{ maxHeight: 200 }}>
            <table className="tw-table">
              <thead><tr><th>Name</th><th>Saved</th><th></th><th></th></tr></thead>
              <tbody>
                {pianos.map((p) => (
                  <tr key={p.id}>
                    <td style={{ textAlign: "left" }}>{p.name}</td>
                    <td>{new Date(p.savedAt).toLocaleDateString()}</td>
                    <td><button className="tw-demobtn" style={{ padding: "3px 9px", fontSize: 9.5 }} onClick={() => handleLoad(p)}>Load</button></td>
                    <td><button className="tw-demobtn tw-demobtn--clear" style={{ padding: "3px 9px", fontSize: 9.5 }} onClick={() => handleDelete(p.id)}>Delete</button></td>
                  </tr>
                ))}
                {pianos.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", color: C.inkDim, padding: "14px 0" }}>No saved pianos yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== KEYBOARD BOX ============================== */

const DISPLAY_FIELDS = [
  { key: "sw", label: "SW", color: C.felt },
  { key: "dw", label: "DW", color: C.copper },
  { key: "uw", label: "UW", color: C.brass },
  { key: "origFW", label: "Orig FW", color: C.plum },
];

function KeyboardBox({ notesData, rows, setField, selected, onSelect, activeDisplay, toggleDisplay, inputMode, setInputMode }) {
  const sel = selected;
  const rec = notesData[sel];
  const meta = NOTE_META[sel];
  const go = (delta) => onSelect(Math.max(0, Math.min(87, sel + delta)));
  const bw = rec.dw != null && rec.uw != null ? (rec.dw + rec.uw) / 2 : null;
  const friction = rec.dw != null && rec.uw != null ? (rec.dw - rec.uw) / 2 : null;

  return (
    <div className="tw-kbox">
      <div className="tw-kbox-inner">
        <div className="tw-kbox-controls">
          <div className="tw-displaytoggles">
            {DISPLAY_FIELDS.map((f) => (
              <button key={f.key} className={"tw-dtoggle" + (activeDisplay.has(f.key) ? " tw-dtoggle--on" : "")} style={{ "--dc": f.color }} onClick={() => toggleDisplay(f.key)}>
                <span className="tw-dtoggle-dot" />{f.label}
              </button>
            ))}
            {activeDisplay.has("sw") && (
              <span className="tw-sw-legend">
                <span className="tw-sw-legend-dot" style={{ background: C.felt }} /> ok
                <span className="tw-sw-legend-dot" style={{ background: C.warnOrange }} /> ≥0.3g
                <span className="tw-sw-legend-dot" style={{ background: C.warnRed }} /> ≥0.5g off curve
              </span>
            )}
          </div>
          <div className="tw-inputmode-switch">
            Input Mode
            <button className={"tw-switch" + (inputMode ? " tw-switch--on" : "")} onClick={() => setInputMode(!inputMode)} aria-label="Toggle input mode">
              <span className="tw-switch-knob" />
            </button>
          </div>
        </div>

        <div className="tw-editor">
          <div className="tw-editor-note">{meta.name}</div>
          {DISPLAY_FIELDS.map((f) => (
            <div className="tw-editor-field" key={f.key}>
              <label>{f.label} (g)</label>
              <input
                type="number" step={0.1} disabled={!inputMode}
                value={rec[f.key] ?? ""} placeholder="—"
                onChange={(e) => setField(sel, f.key, e.target.value === "" ? null : parseFloat(e.target.value))}
                onKeyDown={(e) => { if (e.key === "Enter") go(1); }}
              />
            </div>
          ))}
          <div className="tw-editor-derived">
            <div>BW: <b>{bw != null ? bw.toFixed(1) : "—"}</b>g</div>
            <div>Friction: <b>{friction != null ? friction.toFixed(1) : "—"}</b>g</div>
          </div>
          <div className="tw-editor-nav">
            <button onClick={() => go(-1)} disabled={sel === 0}>←</button>
            <button onClick={() => go(1)} disabled={sel === 87}>→</button>
          </div>
        </div>

        <div className="tw-keyboard-wrap">
          <div className="tw-keyboard" style={{ width: KEYBOARD_WIDTH }}>
            {NOTE_META.filter((m) => !m.isSharp).map((m) => {
              const r = notesData[m.note - 1];
              const rowInfo = rows[m.note - 1];
              const dots = DISPLAY_FIELDS.filter((f) => activeDisplay.has(f.key) && r[f.key] != null);
              return (
                <div key={m.note} className={"tw-key-white" + (m.note - 1 === sel ? " tw-key-white--selected" : "") + (m.name.startsWith("C") ? " tw-key-white--octave" : "")}
                  style={{ left: m.x }} onClick={() => onSelect(m.note - 1)}>
                  <span className={"tw-key-num" + (LANDMARK_NOTES.includes(m.note) ? " tw-key-num--landmark" : "")}>{m.note}</span>
                  <div style={{ display: "flex", gap: 2 }}>
                    {dots.map((f) => (
                      <span key={f.key} className="tw-key-dot"
                        style={{ background: f.key === "sw" ? deviationColor(rowInfo && rowInfo.diffFromSmoothed != null ? Math.abs(rowInfo.diffFromSmoothed) : null) : f.color }} />
                    ))}
                  </div>
                </div>
              );
            })}
            {NOTE_META.filter((m) => m.isSharp).map((m) => {
              const r = notesData[m.note - 1];
              const rowInfo = rows[m.note - 1];
              const dots = DISPLAY_FIELDS.filter((f) => activeDisplay.has(f.key) && r[f.key] != null);
              return (
                <div key={m.note} className={"tw-key-black" + (m.note - 1 === sel ? " tw-key-black--selected" : "")} style={{ left: m.x }} onClick={() => onSelect(m.note - 1)}>
                  <div style={{ display: "flex", gap: 1.5 }}>
                    {dots.map((f) => (
                      <span key={f.key} className="tw-key-dot"
                        style={{ background: f.key === "sw" ? deviationColor(rowInfo && rowInfo.diffFromSmoothed != null ? Math.abs(rowInfo.diffFromSmoothed) : null) : f.color, width: 3, height: 3 }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== ENTRY GRID (spreadsheet-style input) ============================== */

const fmtCell = (v) => (v == null || Number.isNaN(v) ? "" : String(v));

function GridCell({ value, onCommit, cellRef, onKeyDown, onFocus, onPaste }) {
  const [txt, setTxt] = useState(fmtCell(value));
  const focused = useRef(false);
  // Follow outside changes (paste, demo data, clear all) unless the user is typing in this cell.
  useEffect(() => { if (!focused.current) setTxt(fmtCell(value)); }, [value]);
  return (
    <input
      ref={cellRef} className="tw-grid-cell" type="text" inputMode="decimal" enterKeyHint="next"
      autoComplete="off" autoCorrect="off" value={txt} placeholder="—"
      onChange={(e) => {
        const v = e.target.value;
        setTxt(v);
        if (v.trim() === "") onCommit(null);
        else if (/^-?\d*\.?\d+$/.test(v.trim())) onCommit(parseFloat(v));
      }}
      onFocus={(e) => { focused.current = true; e.target.select(); onFocus(); }}
      onBlur={() => { focused.current = false; setTxt(fmtCell(value)); }}
      onKeyDown={onKeyDown} onPaste={onPaste}
    />
  );
}

function EntryGrid({ notesData, setField, selected, onSelect, open, onToggle }) {
  const [cols, setCols] = useState(["dw"]);
  const cellRefs = useRef({});
  const scrollRef = useRef(null);
  const colList = DISPLAY_FIELDS.filter((f) => cols.includes(f.key));
  const toggleCol = (k) => setCols([k]); // one measurement per pass: picking a button swaps the column

  // When a piano key is tapped, bring that note's row into view inside the grid (not the whole page).
  useEffect(() => {
    if (!open || !scrollRef.current) return;
    const row = scrollRef.current.querySelector(`[data-note="${selected}"]`);
    if (!row) return;
    const box = scrollRef.current;
    const top = row.offsetTop, bottom = top + row.offsetHeight;
    if (top < box.scrollTop + 30 || bottom > box.scrollTop + box.clientHeight) box.scrollTop = top - box.clientHeight / 2;
  }, [selected, open]);

  const focusCell = (i, k) => {
    const el = cellRefs.current[`${i}-${k}`];
    if (el) el.focus();
  };

  const onKey = (e, i, k, ci) => {
    if (e.key === "Enter" || e.key === "ArrowDown") { e.preventDefault(); if (i < 87) focusCell(i + 1, k); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (i > 0) focusCell(i - 1, k); }
    else if (e.key === "ArrowRight" && ci < colList.length - 1 && e.target.selectionStart === e.target.value.length) { e.preventDefault(); focusCell(i, colList[ci + 1].key); }
    else if (e.key === "ArrowLeft" && ci > 0 && e.target.selectionStart === 0) { e.preventDefault(); focusCell(i, colList[ci - 1].key); }
  };

  // Paste a column (or block) copied from Excel / Sheets: fills down from this cell, and across the shown columns.
  const onPaste = (e, i, ci) => {
    const text = e.clipboardData.getData("text");
    if (!/[\n\t]/.test(text.trim())) return; // single value: let normal paste happen
    e.preventDefault();
    text.trim().split(/\r?\n/).forEach((line, dr) => {
      line.split("\t").forEach((cell, dc) => {
        const f = colList[ci + dc], n = i + dr;
        if (!f || n > 87) return;
        const v = parseFloat(cell);
        setField(n, f.key, Number.isNaN(v) ? null : v);
      });
    });
  };

  return (
    <div className="tw-grid-panel">
      <div className="tw-grid-head" onClick={onToggle}>
        <span className="tw-grid-title">{open ? "▾" : "▸"} Entry Grid</span>
        <span className="tw-grid-hint">type a number, press Enter or Next → drops to the next note</span>
      </div>
      {open && (
        <>
          <div className="tw-grid-cols">
            <span className="tw-grid-hint" style={{ alignSelf: "center" }}>This pass:</span>
            {DISPLAY_FIELDS.map((f) => (
              <button key={f.key} className={"tw-dtoggle" + (cols.includes(f.key) ? " tw-dtoggle--on" : "")} style={{ "--dc": f.color }} onClick={() => toggleCol(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="tw-grid-scroll" ref={scrollRef}>
            <table className="tw-grid-table">
              <thead>
                <tr>
                  <th>Note</th>
                  {colList.map((f) => <th key={f.key}>{f.label} (g)</th>)}
                  <th>BW</th><th>Friction</th>
                </tr>
              </thead>
              <tbody>
                {NOTE_META.map((m, i) => {
                  const rec = notesData[i];
                  const bw = rec.dw != null && rec.uw != null ? ((rec.dw + rec.uw) / 2).toFixed(1) : "—";
                  const fr = rec.dw != null && rec.uw != null ? ((rec.dw - rec.uw) / 2).toFixed(1) : "—";
                  return (
                    <tr key={i} data-note={i} className={i === selected ? "tw-grid-row--sel" : ""}>
                      <td className="tw-grid-note">{m.note} · {m.name}</td>
                      {colList.map((f, ci) => (
                        <td key={f.key}>
                          <GridCell
                            value={rec[f.key]}
                            onCommit={(v) => setField(i, f.key, v)}
                            cellRef={(el) => { cellRefs.current[`${i}-${f.key}`] = el; }}
                            onFocus={() => onSelect(i)}
                            onKeyDown={(e) => onKey(e, i, f.key, ci)}
                            onPaste={(e) => onPaste(e, i, ci)}
                          />
                        </td>
                      ))}
                      <td className="tw-grid-calc">{bw}</td>
                      <td className="tw-grid-calc">{fr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================== MAIN APP ============================== */

export default function TouchweightWorkbench() {
  // Best-effort iOS "Add to Home Screen" polish — sets a proper title, touch icon, and
  // full-screen-capable meta tags on the page. Whether this actually reaches the outer document
  // (vs. an Anthropic-controlled wrapper) isn't guaranteed, but it's harmless to try.
  React.useEffect(() => {
    document.title = "Touchweight Workbench";
    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("apple-mobile-web-app-capable", "yes");
    setMeta("apple-mobile-web-app-status-bar-style", "black-translucent");
    setMeta("apple-mobile-web-app-title", "Touchweight");
    setMeta("theme-color", "#1E1B17");
    const iconSvg = encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="18" fill="#1E1B17"/>
        <rect x="14" y="30" width="72" height="46" rx="4" fill="#EFE8D6"/>
        <rect x="14" y="30" width="10" height="46" fill="#2A2620"/>
        <rect x="76" y="30" width="10" height="46" fill="#2A2620"/>
        <rect x="30" y="30" width="7" height="28" fill="#2A2620"/>
        <rect x="46" y="30" width="7" height="28" fill="#2A2620"/>
        <rect x="62" y="30" width="7" height="28" fill="#2A2620"/>
        <circle cx="50" cy="18" r="7" fill="#B8863B"/>
      </svg>`
    );
    let link = document.querySelector('link[rel="apple-touch-icon"]');
    if (!link) { link = document.createElement("link"); link.setAttribute("rel", "apple-touch-icon"); document.head.appendChild(link); }
    link.setAttribute("href", `data:image/svg+xml,${iconSvg}`);
  }, []);

  const [targetBW, setTargetBW] = useState(37);
  const [actionRatio, setActionRatio] = useState(4.7);
  const [fwBuffer, setFwBuffer] = useState(85);
  const [wippenWeight, setWippenWeight] = useState(18);
  const [keyRatio, setKeyRatio] = useState(0.5);

  const [notesData, setNotesData] = useState(() => NOTES.map(() => ({ sw: null, dw: null, uw: null, origFW: null })));
  const [arCalcRows, setArCalcRows] = useState(() => [
    { note: null, bw1: null, bw2: null },
    { note: null, bw1: null, bw2: null },
    { note: null, bw1: null, bw2: null },
  ]);
  const setField = (i, key, val) => setNotesData((prev) => { const next = [...prev]; next[i] = { ...next[i], [key]: val }; return next; });

  const [mode, setMode] = useState("stanwood");
  const [arCalcOpen, setArCalcOpen] = useState(false);
  const [landmarkOpen, setLandmarkOpen] = useState(true);
  const [selected, setSelected] = useState(0);
  const [activeDisplay, setActiveDisplay] = useState(new Set(["sw"]));
  const [inputMode, setInputMode] = useState(false);
  const [gridOpen, setGridOpen] = useState(true);
  const toggleDisplay = (key) => setActiveDisplay((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const fit = useMemo(() => {
    const pts = NOTES.map((n, i) => ({ x: n, y: notesData[i].sw })).filter((p) => typeof p.y === "number" && !Number.isNaN(p.y));
    return quadFit(pts);
  }, [notesData]);

  const effectiveWippenWeight = wippenWeight * keyRatio;

  const getSnapshot = () => ({
    notesData,
    settings: { actionRatio, keyRatio, wippenWeight, targetBW, fwBuffer },
  });
  const applySnapshot = (snap) => {
    if (!snap || !snap.notesData) return;
    setNotesData(snap.notesData);
    if (snap.settings) {
      if (snap.settings.actionRatio != null) setActionRatio(snap.settings.actionRatio);
      if (snap.settings.keyRatio != null) setKeyRatio(snap.settings.keyRatio);
      if (snap.settings.wippenWeight != null) setWippenWeight(snap.settings.wippenWeight);
      if (snap.settings.targetBW != null) setTargetBW(snap.settings.targetBW);
      if (snap.settings.fwBuffer != null) setFwBuffer(snap.settings.fwBuffer);
    }
  };

  const rows = useMemo(() => NOTES.map((note, i) => {
    const rec = notesData[i];
    const hasFit = fit.n >= 3;
    const smoothedRaw = fit.a * note * note + fit.b * note + fit.c;
    const smoothed = hasFit ? round1(smoothedRaw) : null;
    const fwSmoothed = hasFit ? round1(smoothedRaw * actionRatio + effectiveWippenWeight - targetBW) : null;
    const fwMeasured = rec.sw != null ? round1(rec.sw * actionRatio + effectiveWippenWeight - targetBW) : null;
    const ceiling = LOVE_FW_MAX[i];
    const bw = rec.dw != null && rec.uw != null ? (rec.dw + rec.uw) / 2 : null;
    const friction = rec.dw != null && rec.uw != null ? (rec.dw - rec.uw) / 2 : null;
    const delta = bw != null ? round1(bw - targetBW) : null;
    const newFW = rec.origFW != null && delta != null ? round1(rec.origFW + delta) : null;
    const diffFromSmoothed = rec.sw != null && hasFit ? round1(rec.sw - smoothedRaw) : null;
    const row = {
      note, sw: rec.sw, smoothed, fwSmoothed, fwMeasured, newFW, diffFromSmoothed,
      fwMaxCeiling: round1(ceiling), fwMaxBuffered: round1(ceiling * (fwBuffer / 100)),
      dw: rec.dw, uw: rec.uw, bw: bw != null ? round1(bw) : null, friction: friction != null ? round1(friction) : null,
      origFW: rec.origFW, delta,
    };
    for (const c of STANWOOD_CURVES) row["s" + c.num] = c.data[i];
    return row;
  }), [fit, actionRatio, effectiveWippenWeight, targetBW, fwBuffer, notesData]);

  const fwModRows = rows.filter((r) => r.dw != null || r.uw != null || r.origFW != null);

  return (
    <div className="tw-shell">
      <GlobalStyle />
      <div className="tw-scroll">
        <div className="tw-wrap">
          <div className="tw-nameplate">
            <h1>Touchweight <span className="accent">Workbench</span></h1>
            <div className="sub">88 Notes · Draft v3 — Unified</div>
          </div>

          <div className="tw-globalbar">
            <NumberField label="Target BW" value={targetBW} step={0.5} suffix="g" onChange={setTargetBW} />
            <div className="tw-globalbar-note">shared by both methods below</div>
            <button className="tw-demobtn" onClick={() => setNotesData(NOTES.map((_, i) => ({ sw: DEFAULT_SW[i], dw: null, uw: null, origFW: null })))}>
              Load demo SW curve
            </button>
            <button className="tw-demobtn tw-demobtn--clear" onClick={() => setNotesData(NOTES.map(() => ({ sw: null, dw: null, uw: null, origFW: null })))}>
              Clear all data
            </button>
          </div>

          <PianoLibrary getSnapshot={getSnapshot} applySnapshot={applySnapshot} />

          {/* PERSISTENT CHARTS — always visible regardless of mode */}
          <div className="tw-panel">
            <div className="tw-panel-head">
              <div className="tw-panel-title">Strike Weight Design</div>
              <div className="tw-panel-note">fit n={fit.n}</div>
            </div>
            <ResponsiveContainer width="100%" height={340}>
              <ComposedChart data={rows} margin={{ top: 8, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={C.paperGrid} strokeWidth={1} />
                <XAxis dataKey="note" type="number" domain={[1, 88]} tick={{ fontFamily: "IBM Plex Mono", fontSize: 10, fill: C.inkDim }} stroke={C.paperGrid} />
                <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 10, fill: C.inkDim }} stroke={C.paperGrid} />
                <Tooltip content={<SWTooltip />} />
                {STANWOOD_CURVES.map((c) => (
                  <Line
                    key={c.num}
                    dataKey={"s" + c.num}
                    stroke={HIGHLIGHT_NUMS.has(c.num) ? C.inkDim : C.paperGrid}
                    strokeWidth={HIGHLIGHT_NUMS.has(c.num) ? 1.3 : 1}
                    strokeOpacity={HIGHLIGHT_NUMS.has(c.num) ? 0.65 : 0.55}
                    dot={false}
                    isAnimationActive={false}
                  />
                ))}
                <Line dataKey="smoothed" stroke={C.brass} strokeWidth={3.2} dot={false} isAnimationActive={false} />
                <Line
                  dataKey="sw" stroke={C.felt} strokeWidth={0} isAnimationActive={false} connectNulls={false}
                  dot={(props) => {
                    const { cx, cy, payload, index } = props;
                    if (payload.sw == null) return null;
                    const color = deviationColor(payload.diffFromSmoothed != null ? Math.abs(payload.diffFromSmoothed) : null);
                    return <circle key={`sw-dot-${payload.note ?? index}`} cx={cx} cy={cy} r={2.6} fill={color} stroke="none" />;
                  }}
                />
                <Customized component={ZoneLabelsOverlay} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="tw-panel">
            <div className="tw-panel-head">
              <div className="tw-panel-title">Front Weight — Both Methods</div>
              <div className="tw-panel-note">buffer {fwBuffer}%</div>
            </div>
            <div className="tw-legend-row">
              <span className="tw-legend-chip" style={{ "--cc": C.brass }}><span className="tw-legend-num" style={{ background: C.brass }}>·</span><span className="tw-legend-name">Target FW (Smoothed)</span></span>
              <span className="tw-legend-chip" style={{ "--cc": C.felt }}><span className="tw-legend-num" style={{ background: C.felt }}>·</span><span className="tw-legend-name">Target FW (from SW)</span></span>
              <span className="tw-legend-chip" style={{ "--cc": C.plum }}><span className="tw-legend-num" style={{ background: "transparent", border: `2px solid ${C.plum}`, boxSizing: "border-box" }}>·</span><span className="tw-legend-name">Orig FW (measured, key)</span></span>
              <span className="tw-legend-chip" style={{ "--cc": C.plum }}><span className="tw-legend-num" style={{ background: C.plum }}>·</span><span className="tw-legend-name">New FW (Love's Method)</span></span>
              <span className="tw-legend-chip" style={{ "--cc": C.copper }}><span className="tw-legend-num" style={{ background: C.copper }}>·</span><span className="tw-legend-name">FW Max Target (Buffered)</span></span>
              <span className="tw-legend-chip" style={{ "--cc": C.graphite }}><span className="tw-legend-num" style={{ background: C.graphite }}>·</span><span className="tw-legend-name">FW Max Ceiling (100%)</span></span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={rows} margin={{ top: 8, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={C.paperGrid} strokeWidth={1} />
                <XAxis dataKey="note" type="number" domain={[1, 88]} tick={{ fontFamily: "IBM Plex Mono", fontSize: 10, fill: C.inkDim }} stroke={C.paperGrid} />
                <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 10, fill: C.inkDim }} stroke={C.paperGrid} />
                <Tooltip content={<FWTooltip />} />
                <ReferenceLine y={0} stroke={C.paperGrid} />
                <Line dataKey="fwMaxCeiling" stroke={C.graphite} strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line dataKey="fwMaxBuffered" stroke={C.copper} strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line dataKey="fwSmoothed" stroke={C.brass} strokeWidth={3} dot={false} isAnimationActive={false} />
                <Line dataKey="fwMeasured" stroke={C.felt} strokeWidth={0} dot={{ r: 2.4, fill: C.felt, strokeWidth: 0 }} isAnimationActive={false} connectNulls={false} />
                <Line dataKey="origFW" stroke={C.plum} strokeWidth={0} dot={{ r: 3.2, fill: "#fff", stroke: C.plum, strokeWidth: 1.6 }} isAnimationActive={false} connectNulls={false} />
                <Line dataKey="newFW" stroke={C.plum} strokeWidth={0} dot={{ r: 3, fill: C.plum, strokeWidth: 0 }} isAnimationActive={false} connectNulls={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* MODE TOGGLE — switches only the control panel below, never the charts above */}
          <div className="tw-modetabs">
            <div className={"tw-modetab" + (mode === "love" ? " tw-modetab--active" : "")} onClick={() => setMode("love")}>FW Modification (Love)</div>
            <div className={"tw-modetab" + (mode === "stanwood" ? " tw-modetab--active" : "")} onClick={() => setMode("stanwood")}>What-If (Stanwood)</div>
          </div>

          {mode === "stanwood" ? (
            <div className="tw-mode-panel">
              <p className="tw-mode-desc">
                Target FW derived from the SW curve via Stanwood's Equation of Balance:
                FW = (SW × Action Ratio) + (Key Ratio × Wippen Weight) − Target BW.
              </p>
              <div className="tw-mode-inputs">
                <NumberField label="Action Ratio" value={actionRatio} step={0.1} suffix=":1" onChange={setActionRatio} />
                <NumberField label="FW Max Buffer" value={fwBuffer} step={1} suffix="%" onChange={setFwBuffer} />
                <NumberField label="Wippen Weight" value={wippenWeight} step={0.5} suffix="g" onChange={setWippenWeight} />
                <NumberField label="Key Ratio" value={keyRatio} step={0.01} suffix=":1" onChange={setKeyRatio} />
                <div className="tw-eww-readout">
                  <span className="tw-eww-label">Effective Wippen Weight</span>
                  <span className="tw-eww-value">{effectiveWippenWeight.toFixed(2)}g</span>
                  <span className="tw-eww-sub">{wippenWeight} × {keyRatio}</span>
                </div>
              </div>
              <ActionRatioCalc
                rows={arCalcRows} setRows={setArCalcRows} onApply={setActionRatio} currentAR={actionRatio}
                open={arCalcOpen} onToggle={() => setArCalcOpen((o) => !o)}
              />
            </div>
          ) : (
            <div className="tw-mode-panel">
              <p className="tw-mode-desc">
                Love's field method: measure Downweight and Upweight (BW and Friction derive automatically), record the
                key's Orig FW, and Delta = BW − Target BW shifts it directly. No Action Ratio, Wippen Weight, or
                Key Ratio needed — this is a differential correction, not the Stanwood equation.
              </p>
              <div className="tw-table-scroll">
                <table className="tw-table">
                  <thead><tr><th>Note</th><th>DW</th><th>UW</th><th>BW</th><th>Friction</th><th>Orig FW</th><th>Delta</th><th>New FW</th></tr></thead>
                  <tbody>
                    {fwModRows.map((r) => (
                      <tr key={r.note}>
                        <td>{NOTE_META[r.note - 1].name}</td>
                        <td>{r.dw ?? "—"}</td><td>{r.uw ?? "—"}</td><td>{r.bw ?? "—"}</td><td>{r.friction ?? "—"}</td>
                        <td>{r.origFW ?? "—"}</td><td>{r.delta ?? "—"}</td><td>{r.newFW ?? "—"}</td>
                      </tr>
                    ))}
                    {fwModRows.length === 0 && <tr><td colSpan={8} style={{ textAlign: "center", color: C.inkDim, padding: "14px 0" }}>No DW, UW, or Orig FW entered yet for any note — use the keyboard below (this table doesn't track SW).</td></tr>}
                  </tbody>
                </table>
              </div>
              <LandmarkSWSamples
                rows={rows} setField={setField} fwBuffer={fwBuffer} setFwBuffer={setFwBuffer}
                open={landmarkOpen} onToggle={() => setLandmarkOpen((o) => !o)}
              />
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <EntryGrid
          notesData={notesData} setField={setField} selected={selected} onSelect={setSelected}
          open={gridOpen} onToggle={() => setGridOpen((o) => !o)}
        />
      </div>

      {/* ISOLATED, ALWAYS-VISIBLE KEYBOARD */}
      <KeyboardBox
        notesData={notesData} rows={rows} setField={setField} selected={selected} onSelect={setSelected}
        activeDisplay={activeDisplay} toggleDisplay={toggleDisplay} inputMode={inputMode} setInputMode={setInputMode}
      />
    </div>
  );
}
