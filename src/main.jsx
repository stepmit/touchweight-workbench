import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TouchweightWorkbench from "./App.jsx";

/*
 * localStorage-backed polyfill for window.storage, matching the same async
 * get/set/delete/list shape the app already uses (originally written for Claude's
 * artifact persistent-storage API). This makes the Piano Library feature work as a
 * genuinely standalone app, with no Claude account or login involved at all.
 * "shared" is accepted for API compatibility but ignored — there's no server here,
 * so everything is inherently private to this browser/device.
 */
const PREFIX = "tw_";
window.storage = {
  get: async (key) => {
    const v = localStorage.getItem(PREFIX + key);
    if (v === null) throw new Error(`storage key not found: ${key}`);
    return { key, value: v, shared: false };
  },
  set: async (key, value) => {
    localStorage.setItem(PREFIX + key, value);
    return { key, value, shared: false };
  },
  delete: async (key) => {
    localStorage.removeItem(PREFIX + key);
    return { key, deleted: true, shared: false };
  },
  list: async (prefix = "") => {
    const keys = Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX + prefix))
      .map((k) => k.slice(PREFIX.length));
    return { keys };
  },
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TouchweightWorkbench />
  </StrictMode>
);
