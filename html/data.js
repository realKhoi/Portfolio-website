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
  Name    : Khoi Le
  Role    : DIGSEC Student
  Based   : Gjøvik, Norway
  Status  : Open to opportunities

  Hi! I'm a student studying Digital Infrastructure and Cybersecurity 
  at NTNU Gjøvik. I enjoy the infrastructure part of the courses where we learn 
  how to build robust and scalable services and run cloud infrastrucure.
  I have also grown to like operating systems in general where we can automate 
  our workflows using tools like cronjobs. 
  
  In short I enjoy making abstract things come to life!

  Type  ls        to browse files
        cat <file> to read a file
        help       for all commands
`,

  skills: `
  ── Languages ──────────────────────────────────
    Python · JavaScript · Go · Bash · C/C++

  ── Frontend ───────────────────────────────────
    Javascript · HTML · CSS 

  ── Backend & Infra ────────────────────────────
    Go · Nginx · Docker

  ── Tools ──────────────────────────────────────
    Git · GitHub actions · Linux 
`,

  contact: `
  ── Get in touch ───────────────────────────────

    Email   : you@example.com
    GitHub  : https://github.com/yourusername
    LinkedIn: https://linkedin.com/in/yourusername
    Twitter : @yourhandle
`,

  projects: {
    'PortfolioSite.md': `
  ── Project site ────────────────────────────────
  This is my first project, a terminal based portfolio site. I wanted a site
  that reflects me and what I enjoy doing. After some inspiration from the internet
  I ended up with this. I have learnt alot from this project like how to safely host a server
  myself using my own hardware. That way I am providing my own IaaS :)
  
  My JavaScript and HTML was really rusty so Claude Code helped me make the baseline,
  intigrating claude code into my workflow have been interesting and suprising.
  For the backend I have done mostly myself, although I had to look up quite a bit.

  If you want to know more check out the repository!

  Stack  : JavaScript, HTML, CSS, Go, Docker, Nginx
  Status : In progress
  Repo   : https://github.com/you/project1
`,
    'project2.md': `
  ── Project Two ────────────────────────────────
  Planning to make an anonymous email delivery system! 
  It is aimed to be easy to use, no login required, just write your message and send!

  Stack  : Un-decided
  Status : Planning
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