/* ============================================================
   PORTFOLIO TERMINAL — terminal.js
   ============================================================ */

import { CONFIG, DATA } from "./data.js";

// ── FILESYSTEM ───────────────────────────────────────────────
const FS = {
  [CONFIG.homePath]: {
    type: 'dir',
    children: {
      'about.txt':   { type: 'file', content: DATA.about },
      'skills.txt':  { type: 'file', content: DATA.skills },
      'contact.txt': { type: 'file', content: DATA.contact },
      'resume.pdf':  {
        type: 'file',
        isDownload: true,
        url: 'assets/resume.pdf',
        content: '  Opening resume...\n  → assets/resume.pdf\n',
      },
      'projects': {
        type: 'dir',
        children: Object.fromEntries(
          Object.entries(DATA.projects).map(([k, v]) => [k, { type: 'file', content: v }])
        ),
      },
    },
  },
};

// ── MOTD ─────────────────────────────────────────────────────
const MOTD = `
<span class="motd">
  ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗
  ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
  ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
  ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
  ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
  ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝
</span>
<span class="c-dim">  ─────────────────────────────────────────────────────────────────────────</span>
<span class="c-white">  Welcome to my portfolio terminal.</span>
<span class="c-dim">  Type <span class="c-cyan bold">help</span> to see available commands.</span>
`;

// ── STATE ─────────────────────────────────────────────────────
let state = {
  cwd: CONFIG.homePath,
  history: [],
  histIndex: -1,
  histDraft: '',
  booting: false,
};

// ── DOM ───────────────────────────────────────────────────────
const output     = document.getElementById('output');
const inputRow   = document.getElementById('input-row');
const cmdInput   = document.getElementById('cmd-input');
const mirror     = document.getElementById('input-mirror');
const cursor     = document.getElementById('cursor');
const promptLbl  = document.getElementById('prompt-label');
const titlebar   = document.getElementById('titlebar-text');

// ── UTILITIES ─────────────────────────────────────────────────
function resolvePath(target) {
  if (!target || target === '~') return CONFIG.homePath;
  if (target.startsWith('/')) return target;
  if (target === '.') return state.cwd;
  if (target === '..') {
    const parts = state.cwd.split('/').filter(Boolean);
    parts.pop();
    return '/' + parts.join('/') || '/';
  }
  return state.cwd.replace(/\/$/, '') + '/' + target;
}

function getNode(path) {
  const parts = path.split('/').filter(Boolean);
  let node = FS['/'];

  if (path === CONFIG.homePath || path.startsWith(CONFIG.homePath)) {
    node = FS[CONFIG.homePath];
    const rel = parts.slice(CONFIG.homePath.split('/').filter(Boolean).length);
    for (const p of rel) {
      if (!node || node.type !== 'dir' || !node.children[p]) return null;
      node = node.children[p];
    }
    return node;
  }
  return null;
}

function displayPath(p) {
  return p === CONFIG.homePath ? '~' : p.replace(CONFIG.homePath, '~');
}

function updatePrompt() {
  const path = displayPath(state.cwd);
  promptLbl.innerHTML =
    `<span class="prompt-user">${CONFIG.user}</span>` +
    `<span class="prompt-at">@</span>` +
    `<span class="prompt-host">${CONFIG.hostname}</span>` +
    `<span class="prompt-sep">:</span>` +
    `<span class="prompt-path">${path}</span>` +
    `<span class="prompt-sym">$&nbsp;</span>`;
  titlebar.textContent = `${CONFIG.user}@${CONFIG.hostname}: ${path}`;
}

export function append(html) {
  const span = document.createElement('span');
  span.innerHTML = html;
  output.appendChild(span);
  scrollBottom();
}

function appendLine(html, cls = '') {
  append(`<span class="line ${cls}">${html}</span>\n`);
}

function appendBlank() {
  output.appendChild(document.createTextNode('\n'));
}

function scrollBottom() {
  const body = document.getElementById('terminal-body');
  body.scrollTop = body.scrollHeight;
}

function echoCommand(cmd) {
  appendLine(
    `<span class="prompt-user">${CONFIG.user}</span>` +
    `<span class="prompt-at">@</span>` +
    `<span class="prompt-host">${CONFIG.hostname}</span>` +
    `<span class="prompt-sep">:</span>` +
    `<span class="prompt-path">${displayPath(state.cwd)}</span>` +
    `<span class="prompt-sym">$&nbsp;</span>` +
    `<span class="c-white">${escHtml(cmd)}</span>`
  );
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

let formState = null;

function startContactForm() {
    append(`      
 ██████╗ ██████╗ ███╗   ██╗████████╗ █████╗  ██████╗████████╗
██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝
██║     ██║   ██║██╔██╗ ██║   ██║   ███████║██║        ██║   
██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██║██║        ██║   
╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╗   ██║   
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝   ╚═╝ 

 Control + C to exit out of form
 Control + Z to go back to previous step
 \n\n`)
    formState = { step: 'name', name: '', email: '', message: '' };
    append('what\'s your name?\n');
}

function handleFormInput(input) {
    if (formState.step === 'name') {
        formState.name = input;
        formState.step = 'email';
        append(`What's your email?\n`);

    } else if (formState.step === 'email') {
        formState.email = input;
        formState.step = 'message';
        append(`what's your message?\n`);

    } else if (formState.step === 'message') {
        formState.message = input;
        formState.step = null;
        append('sending...\n');

        fetch('http://localhost:8080/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formState)
        })
        .then(() => {
            append('Message sent\n');
            formState = null; 
        })
        .catch(() => {
            append('Something went wrong\n');
            formState = null;
        });
    }
}

// ── COMMANDS ──────────────────────────────────────────────────
const COMMANDS = {

  help() {
    append(`
<span class="c-cyan bold">  Available commands</span>
<span class="c-dim">  ─────────────────────────────────────────</span>
  <span class="c-bright">about</span>         <span class="c-dim">show who I am</span>
  <span class="c-bright">ls</span>            <span class="c-dim">list files in current directory</span>
  <span class="c-bright">ls projects/</span>  <span class="c-dim">list projects</span>
  <span class="c-bright">cat &lt;file&gt;</span>    <span class="c-dim">read a file</span>
  <span class="c-bright">cd &lt;dir&gt;</span>     <span class="c-dim">change directory</span>
  <span class="c-bright">pwd</span>           <span class="c-dim">print current path</span>
  <span class="c-bright">skills</span>        <span class="c-dim">view my tech stack</span>
  <span class="c-bright">contact</span>       <span class="c-dim">get in touch</span>
  <span class="c-bright">resume</span>        <span class="c-dim">download my resume</span>
  <span class="c-bright">clear</span>         <span class="c-dim">clear the terminal</span>
  <span class="c-bright">uname -a</span>      <span class="c-dim">system info</span>
\n`);
  },

  about() {
    append(`<span class="c-white">${escHtml(DATA.about)}</span>\n`);
  },

  whoami() {
    COMMANDS.about();
  },

  skills() {
    append(`<span class="c-cyan">${escHtml(DATA.skills)}</span>\n`);
  },

  contact() {
    startContactForm();
  },

  resume() {
    appendLine(`  <span class="c-dim">Opening resume...</span>`);
    appendLine(`  <span class="c-green">→</span> <a href="assets/resume.pdf" target="_blank" download style="color:var(--cyan)">assets/resume.pdf</a>`);
    appendBlank();
    window.open('assets/resume.pdf', '_blank');
  },

  clear() {
    output.innerHTML = '';
  },

  pwd() {
    appendLine(`  ${escHtml(state.cwd)}`);
    appendBlank();
  },

  'uname'(args) {
    if (args.includes('-a')) {
      appendLine(`  <span class="c-dim">PortfolioOS 6.1.0-portfolio #1 SMP PREEMPT x86_64 GNU/Linux</span>`);
    } else {
      appendLine(`  PortfolioOS`);
    }
    appendBlank();
  },

  echo(args) {
    appendLine(`  ${escHtml(args.join(' '))}`);
    appendBlank();
  },

  ls(args) {
    const target = args[0] ? resolvePath(args[0]) : state.cwd;
    const node = getNode(target);

    if (!node) {
      appendLine(`  <span class="c-red">ls: cannot access '${escHtml(args[0])}': No such file or directory</span>`);
      appendBlank();
      return;
    }
    if (node.type !== 'dir') {
      appendLine(`  ${escHtml(args[0])}`);
      appendBlank();
      return;
    }

    const entries = Object.entries(node.children);
    const grid = document.createElement('div');
    grid.className = 'ls-grid';

    entries.forEach(([name, child]) => {
      const el = document.createElement('span');
      if (child.type === 'dir') {
        el.className = 'ls-dir';
        el.textContent = name + '/';
      } else if (child.isDownload) {
        el.className = 'ls-link';
        el.textContent = name;
      } else {
        el.className = 'ls-file';
        el.textContent = name;
      }
      grid.appendChild(el);
    });

    output.appendChild(document.createTextNode('\n  '));
    output.appendChild(grid);
    output.appendChild(document.createTextNode('\n'));
    scrollBottom();
  },

  cd(args) {
    const target = args[0] ? resolvePath(args[0]) : CONFIG.homePath;
    const node = getNode(target);
    if (!node) {
      appendLine(`  <span class="c-red">cd: ${escHtml(args[0])}: No such file or directory</span>`);
    } else if (node.type !== 'dir') {
      appendLine(`  <span class="c-red">cd: ${escHtml(args[0])}: Not a directory</span>`);
    } else {
      state.cwd = target;
      updatePrompt();
    }
    appendBlank();
  },

  cat(args) {
    if (!args.length) {
      appendLine(`  <span class="c-red">cat: missing operand</span>`);
      appendBlank();
      return;
    }
    const target = resolvePath(args[0]);
    const node = getNode(target);
    if (!node) {
      appendLine(`  <span class="c-red">cat: ${escHtml(args[0])}: No such file or directory</span>`);
      appendBlank();
      return;
    }
    if (node.type === 'dir') {
      appendLine(`  <span class="c-red">cat: ${escHtml(args[0])}: Is a directory</span>`);
      appendBlank();
      return;
    }
    if (node.isDownload) {
      COMMANDS.resume();
      return;
    }
    append(`<span class="c-white">${escHtml(node.content)}</span>\n`);
  },
};

// ── COMMAND RUNNER ────────────────────────────────────────────
function runCommand(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return;

  state.history.unshift(trimmed);
  state.histIndex = -1;
  state.histDraft = '';

  echoCommand(trimmed);

  const [cmd, ...args] = trimmed.split(/\s+/);
  const handler = COMMANDS[cmd];

  if (handler) {
    handler(args);
  } else {
    appendLine(`  <span class="c-red">command not found: ${escHtml(cmd)}</span>  <span class="c-dim">(try <span class="c-cyan">help</span>)</span>`);
    appendBlank();
  }
}

// ── TAB COMPLETION ────────────────────────────────────────────
function tabComplete(input) {
  const parts = input.split(/\s+/);
  if (parts.length === 1) {
    const prefix = parts[0];
    const matches = Object.keys(COMMANDS).filter(c => c.startsWith(prefix));
    if (matches.length === 1) return matches[0];
    if (matches.length > 1) {
      appendBlank();
      appendLine('  ' + matches.map(m => `<span class="c-bright">${m}</span>`).join('  '));
      appendBlank();
    }
    return input;
  }

  // path completion for last arg
  const lastArg = parts[parts.length - 1];
  const dir = lastArg.includes('/') ? resolvePath(lastArg.replace(/\/[^/]*$/, '')) : state.cwd;
  const prefix = lastArg.split('/').pop();
  const node = getNode(dir);
  if (!node || node.type !== 'dir') return input;

  const matches = Object.keys(node.children).filter(n => n.startsWith(prefix));
  if (matches.length === 1) {
    const completed = matches[0] + (node.children[matches[0]].type === 'dir' ? '/' : '');
    parts[parts.length - 1] = lastArg.replace(/[^/]*$/, completed);
    return parts.join(' ');
  }
  if (matches.length > 1) {
    appendBlank();
    appendLine('  ' + matches.map(m => `<span class="c-bright">${m}</span>`).join('  '));
    appendBlank();
  }
  return input;
}

// ── INPUT HANDLING ────────────────────────────────────────────
cmdInput.addEventListener('input', () => {
  mirror.textContent = cmdInput.value;
  scrollBottom();
});

cmdInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = cmdInput.value;
    cmdInput.value = '';
    mirror.textContent = '';
    if (formState){
      handleFormInput(val)
    } else {
      runCommand(val);
    }

  } else if (e.key === 'Tab') {
    e.preventDefault();
    const completed = tabComplete(cmdInput.value);
    cmdInput.value = completed;
    mirror.textContent = completed;

  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (state.histIndex === -1) state.histDraft = cmdInput.value;
    if (state.histIndex < state.history.length - 1) state.histIndex++;
    const val = state.history[state.histIndex] ?? state.histDraft;
    cmdInput.value = val;
    mirror.textContent = val;

  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (state.histIndex > -1) state.histIndex--;
    const val = state.histIndex === -1 ? state.histDraft : state.history[state.histIndex];
    cmdInput.value = val;
    mirror.textContent = val;

  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    COMMANDS.clear();

  } else if (e.key === 'c' && e.ctrlKey) {
    e.preventDefault();

    if (formState){
      formState = null;
      append('Form cancelled\n')
    }
    appendLine(
      `<span class="prompt-user">${CONFIG.user}</span>` +
      `<span class="prompt-at">@</span>` +
      `<span class="prompt-host">${CONFIG.hostname}</span>` +
      `<span class="prompt-sep">:</span>` +
      `<span class="prompt-path">${displayPath(state.cwd)}</span>` +
      `<span class="prompt-sym">$&nbsp;</span>` +
      `<span class="c-white">${escHtml(cmdInput.value)}</span><span class="c-dim">^C</span>`
    );
    cmdInput.value = '';
    mirror.textContent = '';
  } else if (e.key === 'z' && e.ctrlKey) {
    e.preventDefault();
    if (formState){
      elseif (formState.step === 'email')
        formState.step = 'name'
        formState.name = ''
        append('Name: ')
    } else if (formState.step === 'message'){
        formState.step = 'email'
        formState.email = ''
        append('Email: ')
    } else if (formState.step === 'name') {
        append('CTRL + C to exit the form!')
    }
  }
});

// Click anywhere on terminal body to refocus input
document.getElementById('terminal-body').addEventListener('click', () => {
  cmdInput.focus();
});

// ── BOOT ──────────────────────────────────────────────────────
function boot() {
  updatePrompt();
  append(MOTD + '\n');
  cmdInput.focus();
}

boot();
