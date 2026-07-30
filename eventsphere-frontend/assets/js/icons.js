/* ============================================================
   EventSphere — Icon Library
   Inline SVG icons (stroke = currentColor) used in place of emoji
   throughout the app. Usage: ICONS.calendar, or iconHTML('calendar','icon-sm')
   ============================================================ */

const ICONS = {
  // Brand mark — three orbiting nodes around a core, referencing "Sphere"
  logo: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="4" r="1.6" fill="currentColor" stroke="none"/><circle cx="19.5" cy="16" r="1.6" fill="currentColor" stroke="none"/><circle cx="4.5" cy="16" r="1.6" fill="currentColor" stroke="none"/><path d="M12 8v-2.4M14.6 13.5l4.4 1.6M9.4 13.5l-4.4 1.6"/></svg>`,

  calendar: `<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M16 2.5v4M8 2.5v4M3 9.5h18"/></svg>`,
  clock: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`,
  ticket: `<svg viewBox="0 0 24 24"><path d="M3 8.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.7a1.7 1.7 0 0 0 0 3.6v1.7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.7a1.7 1.7 0 0 0 0-3.6z"/><path d="M12 6.5v11" stroke-dasharray="2 2"/></svg>`,
  shield: `<svg viewBox="0 0 24 24"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>`,
  checkCircle: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.3 2.3L15.5 9.5"/></svg>`,
  xCircle: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>`,
  info: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none"/></svg>`,
  search: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20.5 20.5l-4.3-4.3"/></svg>`,
  eye: `<svg viewBox="0 0 24 24"><path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24"><path d="M3.5 3.5l17 17"/><path d="M10.6 5.2A10.8 10.8 0 0 1 12 5c6.2 0 10 7 10 7a17.6 17.6 0 0 1-3.4 4.3M6.7 6.7C4.1 8.4 2 12 2 12s3.8 7 10 7a10 10 0 0 0 3.3-.6"/><path d="M9.9 10a3 3 0 0 0 4.2 4.2"/></svg>`,
  dot: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="currentColor" stroke="none"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24"><path d="M4 12h16M14 6l6 6-6 6"/></svg>`,
  arrowLeft: `<svg viewBox="0 0 24 24"><path d="M20 12H4M10 6l-6 6 6 6"/></svg>`,
  mapPin: `<svg viewBox="0 0 24 24"><path d="M12 21s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
  barChart: `<svg viewBox="0 0 24 24"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>`,
  target: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none"/></svg>`,
  home: `<svg viewBox="0 0 24 24"><path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/></svg>`,
  plus: `<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>`,
  alertTriangle: `<svg viewBox="0 0 24 24"><path d="M12 3.5L22 20.5H2z"/><path d="M12 9.5v5"/><circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none"/></svg>`,
  users: `<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2"/><path d="M16 4.3a3.2 3.2 0 0 1 0 6.2M21.5 20c0-3-1.9-5.4-4.8-6"/></svg>`,
  x: `<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  rocket: `<svg viewBox="0 0 24 24"><path d="M12 2.5c3 1.2 5 4.2 5 8 0 2-1 4.5-2 6l-3 3-3-3c-1-1.5-2-4-2-6 0-3.8 2-6.8 5-8z"/><circle cx="12" cy="10" r="2"/><path d="M8 16l-3 5M16 16l3 5"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>`,
  lock: `<svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>`,
  user: `<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c0-4 3.4-6.8 7.5-6.8s7.5 2.8 7.5 6.8"/></svg>`,
  edit: `<svg viewBox="0 0 24 24"><path d="M4 20l.9-4L16.5 4.4a1.9 1.9 0 0 1 2.7 0l.4.4a1.9 1.9 0 0 1 0 2.7L8 19.1z"/><path d="M14.5 6.5l3 3"/></svg>`,
  settings: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3H9.8l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2l.4 2.6h4.4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"/></svg>`,
  wrench: `<svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-3-3z"/></svg>`,
  mic: `<svg viewBox="0 0 24 24"><rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>`,
  award: `<svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="5.5"/><path d="M8.3 13.2L7 21l5-2.5L17 21l-1.3-7.8"/></svg>`,
  briefcase: `<svg viewBox="0 0 24 24"><rect x="2.5" y="7.5" width="19" height="12" rx="2"/><path d="M8 7.5V5.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2.5 13h19"/></svg>`,
  pin: `<svg viewBox="0 0 24 24"><path d="M12 2.5l3 3-4.5 4.5L12 12l2 2-7.5 7.5L8 14l2-2-2.2-2.2L12.3 5.3z"/></svg>`,
  link: `<svg viewBox="0 0 24 24"><path d="M9.5 14.5l5-5"/><path d="M8 17l-2.5 2.5a3.5 3.5 0 0 1-5-5L3 12M16 7l2.5-2.5a3.5 3.5 0 0 1 5 5L21 12"/></svg>`,
  trash: `<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7M18 7l-.8 12.2A2 2 0 0 1 15.2 21H8.8a2 2 0 0 1-2-1.8L6 7"/><path d="M10 11v6M14 11v6"/></svg>`,
  laptop: `<svg viewBox="0 0 24 24"><rect x="4" y="4.5" width="16" height="10.5" rx="1.5"/><path d="M2 19.5h20l-1.5-3h-17z"/></svg>`,
  clipboard: `<svg viewBox="0 0 24 24"><rect x="5" y="4.5" width="14" height="17" rx="2"/><rect x="9" y="2.5" width="6" height="3.5" rx="1"/><path d="M8.5 11h7M8.5 15h7"/></svg>`,
  activity: `<svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 8-6-16-3 8H2"/></svg>`,
  tag: `<svg viewBox="0 0 24 24"><path d="M12.6 3.5H5.5a2 2 0 0 0-2 2v7.1c0 .5.2 1 .6 1.4l9 9a2 2 0 0 0 2.8 0l6.6-6.6a2 2 0 0 0 0-2.8l-9-9a2 2 0 0 0-1.4-.6z"/><circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" stroke="none"/></svg>`,
  wave: `<svg viewBox="0 0 24 24"><path d="M8 12.5V6a1.5 1.5 0 0 1 3 0v5M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V6a1.5 1.5 0 0 1 3 0v7"/><path d="M17 12.5V9a1.5 1.5 0 0 1 3 0v6c0 3.6-2.7 6.5-6.5 6.5-2 0-3.4-.7-4.6-2.1L5 14.8a1.4 1.4 0 0 1 2-2l1.8 1.7"/></svg>`,
  image: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M21 16l-5.5-5.5a2 2 0 0 0-2.8 0L4 19"/></svg>`,
  upload: `<svg viewBox="0 0 24 24"><path d="M12 15.5V4M7.5 8.5L12 4l4.5 4.5"/><path d="M4.5 15.5V18a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5v-2.5"/></svg>`,
  loader: `<svg viewBox="0 0 24 24"><path d="M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" opacity="0.9"/></svg>`,
};

/** Returns icon markup wrapped in a sized/classed span, ready to drop into innerHTML. */
function iconHTML(name, extraClass) {
  const svg = ICONS[name] || '';
  return `<span class="icon${extraClass ? ' ' + extraClass : ''}">${svg}</span>`;
}
