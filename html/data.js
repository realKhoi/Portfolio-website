// ── CONFIG ───────────────────────────────────────────────────
export const CONFIG = {
  user:     'visitor',
  hostname: 'khoiServer',
  homePath: '/home/visitor',
};

// ── PORTFOLIO DATA ────────────────────────────────────────────
// Edit these to fill in your real info.
export const DATA = {
  about: `
  Name    : Your Name
  Role    : Software Developer
  Based   : Your City, Country
  Status  : Open to opportunities

  Hi! I'm a passionate developer who loves building things for the web.
  I specialize in [your stack here] and enjoy working on projects that
  solve real problems.

  Type  ls        to browse files
        cat <file> to read a file
        help       for all commands
`,

  skills: `
  ── Languages ──────────────────────────────────
    Python · JavaScript · TypeScript · Go · Bash

  ── Frontend ───────────────────────────────────
    React · HTML5 · CSS3 · Tailwind

  ── Backend & Infra ────────────────────────────
    Node.js · FastAPI · Nginx · Docker

  ── Tools ──────────────────────────────────────
    Git · Linux · PostgreSQL · Redis
`,

  contact: `
  ── Get in touch ───────────────────────────────

    Email   : you@example.com
    GitHub  : https://github.com/yourusername
    LinkedIn: https://linkedin.com/in/yourusername
    Twitter : @yourhandle
`,

  projects: {
    'project1.md': `
  ── Project One ────────────────────────────────
  A brief description of what this project does
  and the problem it solves.

  Stack  : Python, FastAPI, PostgreSQL, Docker
  Status : Live
  Repo   : https://github.com/you/project1
`,
    'project2.md': `
  ── Project Two ────────────────────────────────
  Another cool project description goes here.
  What makes it interesting?

  Stack  : React, Node.js, MongoDB
  Status : In progress
  Repo   : https://github.com/you/project2
`,
    'project3.md': `
  ── Project Three ──────────────────────────────
  Description of your third project.

  Stack  : Go, Redis, Nginx
  Status : Completed
  Repo   : https://github.com/you/project3
`,
  },
};