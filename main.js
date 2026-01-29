const overlay = document.querySelector(".mainOverlay");
const bottomSheet = document.querySelector(".info-banner");
const howToBtn = document.querySelector(".howToUse-btn");

/* ---------------- PWA VARIABLES ---------------- */
let deferredPrompt;
let isPWAInstalled = false;

// Check if app is already installed
window.addEventListener('appinstalled', () => {
  isPWAInstalled = true;
  localStorage.setItem('pwa-installed', 'true');
  console.log('PWA was installed');
});

// Check if running as PWA
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
  isPWAInstalled = true;
  localStorage.setItem('pwa-installed', 'true');
}

// Check localStorage on load
if (localStorage.getItem('pwa-installed') === 'true') {
  isPWAInstalled = true;
}

/* ---------------- CONFIG ---------------- */

const asideConfigs = {
  onboarding: {
    id: "onboarding",
    image: "/assets/imgs/20260126_151700.jpg",
    title: "Stay in the loop with the IOTA app",
    text: `Try the desktop experience to make designs on the go!
Offline, Accessible and Free`,
    app: {
      icon: "/assets/imgs/20260126_160735.png",
      name: "IOTA app",
      desc: "For making UI/UX designs on the go!",
      actionText: "Get"
    },
    dismissible: true,
    onboarding: true
  },
  installPrompt: {
    id: "installPrompt",
    image: "/assets/imgs/20260126_151700.jpg",
    title: "Install IOTA App",
    text: `Get the full experience! Install IOTA on your device for:
• Offline access
• Faster loading
• Easy access from home screen
• Native app experience`,
    app: {
      icon: "/assets/imgs/20260126_160735.png",
      name: "IOTA app",
      desc: "Works offline · Fast · Lightweight",
      actionText: "Install Now"
    },
    dismissible: true,
    installPrompt: true
  },
  newProject: {
    id: "newProject",
    title: "Create New Project",
    text: "Choose what you'd like to create",
    dismissible: false,
    newProjectBtn: true
  }
};

/* ---------------- RENDER ---------------- */

function renderAside(config) {
  const sheetContent = document.querySelector(".sheet-content");
  
  if (!sheetContent) {
    console.error('Sheet content element not found');
    return;
  }
  
  if (config.newProjectBtn) {
    // Render menu layout
    sheetContent.innerHTML = `
      <div class="sheet-divOfText">
        <h3 class="sheet-title">${config.title}</h3>
        <p class="sheet-text">${config.text}</p>
      </div>
      
      <br />
      
      <div class="menu-options flex-col diff2">
        <div class="menu-option flex-row ai-c diff2" data-action="ui-ux">
          <div class="option-icon notAligned">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 3v18"/>
              <path d="M9 9h12"/>
            </svg>
          </div>
          <div class="flex-col diff1">
            <b>Create UI/UX Design</b>
            <span class="appDisplayText">Design interfaces and user experiences</span>
          </div>
        </div>
        
        <div class="menu-option flex-row ai-c diff2" data-action="photo-edit">
          <div class="option-icon notAligned">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
          </div>
          <div class="flex-col diff1">
            <b>Edit Photo</b>
            <span class="appDisplayText">Edit and enhance your images</span>
          </div>
        </div>
      </div>
    `;
  }
  else if (config.onboarding || config.installPrompt) {
    // Render original layout
    sheetContent.innerHTML = `
      <div class="imgPrnt">
        <img class="aside-image" src="${config.image}" alt="IOTA App" />
      </div>

      <div class="sheet-divOfText">
        <h3 class="sheet-title">${config.title}</h3>
        <p class="sheet-text" style="white-space: pre-line;">${config.text}</p>
      </div>

      <br />
      <hr class="line" />
      <br />

      <div class="appDisplay flex-col diff1 diff4">
        <div class="flex-row ai-c diff2 diff4">
          <div class="appIcon notAligned noShaking">
            <img class="aside-app-icon" src="${config.app.icon}" alt="${config.app.name}" />
          </div>

          <div class="flex-col jc-c diff1">
            <b class="aside-app-name">${config.app.name}</b>
            <span class="appDisplayText aside-app-desc">${config.app.desc}</span>
          </div>

          <button class="button-General noShaking aside-app-action ${config.installPrompt ? 'install-action' : ''}" type="button">
            ${config.app.actionText}
          </button>
        </div>

        <br /><br />

        <div class="flex-row diff2 dismiss-row" style="display: ${config.dismissible ? 'flex' : 'none'}">
          <button class="notAligned dismiss-toggle" type="button" aria-label="Don't show again">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-circle">
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </button>
          <span class="font-light">Don't show me this again</span>
        </div>
      </div>
    `;
    
    // Re-attach dismiss toggle listener
    if (config.dismissible) {
      const dismissBtn = document.querySelector(".dismiss-toggle");
      if (dismissBtn) {
        dismissBtn.addEventListener("click", () => {
          localStorage.setItem(`aside-dismissed-${config.id}`, "true");
          if (config.installPrompt) {
            localStorage.setItem('install-prompt-dismissed-time', Date.now().toString());
          }
          closeSheet();
        });
      }
    }
    
    // Attach install action listener
    if (config.installPrompt) {
      const installBtn = document.querySelector(".install-action");
      if (installBtn) {
        installBtn.addEventListener("click", installApp);
      }
    }
  }
}

/* ---------------- SHEET CONTROL ---------------- */

function openSheet() {
  if (overlay && bottomSheet) {
    overlay.classList.add("active");
    bottomSheet.classList.add("active");
  }
}

function closeSheet() {
  if (overlay && bottomSheet) {
    overlay.classList.remove("active");
    bottomSheet.classList.remove("active");
  }
}

function openAside(type) {
  const config = asideConfigs[type];
  if (!config) {
    console.error(`Invalid aside type: ${type}`);
    return;
  }
  
  if (localStorage.getItem(`aside-dismissed-${config.id}`)) {
    console.log(`Aside ${config.id} was previously dismissed`);
    return;
  }
  
  renderAside(config);
  openSheet();
}

/* ---------------- PWA INSTALL FUNCTIONS ---------------- */

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        localStorage.setItem('aside-dismissed-installPrompt', 'true');
        localStorage.setItem('pwa-installed', 'true');
        isPWAInstalled = true;
        closeSheet();
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  } else {
    // Fallback message
    console.log('Install prompt not available');
    alert('App is already installed or install prompt is not available. You can install it from your browser menu.');
  }
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('PWA install prompt available');
});

/* ---------------- EVENTS ---------------- */

if (overlay) {
  overlay.addEventListener("click", closeSheet);
}

if (howToBtn) {
  howToBtn.addEventListener("click", () => {
    openAside("onboarding");
  });
}

// New button click handler
const newProjectBtn = document.querySelector(".button-General-v2");
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    openAside("newProject");
  });
}

// Handle menu option clicks (use event delegation)
document.addEventListener("click", (e) => {
  const menuOption = e.target.closest(".menu-option");
  if (menuOption) {
    const action = menuOption.dataset.action;
    
    if (action === "ui-ux") {
      console.log("Creating UI/UX design...");
      // Add your UI/UX creation logic here
      closeSheet();
    } else if (action === "photo-edit") {
      console.log("Opening photo editor...");
      // Add your photo editor logic here
      closeSheet();
    }
  }
});

/* ---------------- AUTO OPEN ---------------- */

// Wait for DOM to be ready
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // Check if already installed or dismissed
    const hasSeenOnboarding = localStorage.getItem('aside-dismissed-onboarding');
    const hasSeenInstallPrompt = localStorage.getItem('aside-dismissed-installPrompt');
    const isInstalled = localStorage.getItem('pwa-installed') === 'true' || isPWAInstalled;
    
    if (!hasSeenOnboarding) {
      // Show onboarding first
      openAside("onboarding");
    } else if (!hasSeenInstallPrompt && !isInstalled && deferredPrompt) {
      // Show install prompt if onboarding was seen and app not installed
      openAside("installPrompt");
    }
  }, 500);

  // Show install prompt again after 3 days if dismissed
  setTimeout(() => {
    const hasSeenInstallPrompt = localStorage.getItem('aside-dismissed-installPrompt');
    const isInstalled = localStorage.getItem('pwa-installed') === 'true' || isPWAInstalled;
    
    if (hasSeenInstallPrompt && !isInstalled && deferredPrompt) {
      const dismissedTime = localStorage.getItem('install-prompt-dismissed-time');
      const threeDays = 3 * 24 * 60 * 60 * 1000;
      
      if (dismissedTime && (Date.now() - parseInt(dismissedTime)) > threeDays) {
        localStorage.removeItem('aside-dismissed-installPrompt');
        openAside("installPrompt");
      }
    }
  }, 10000); // Check after 10 seconds
});

/* ---------------- SERVICE WORKER REGISTRATION ---------------- */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[App] ServiceWorker registered:', registration.scope);
        
        // Check for updates every time the page loads
        registration.update();
        
        // Listen for new service worker waiting
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[App] New version available! Reloading...');
              // Automatically activate new service worker
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          });
        });
      })
      .catch((error) => {
        console.log('[App] ServiceWorker registration failed:', error);
      });
  });
}

/* ---------------- CANVAS & PROJECT LOGIC ---------------- */

let projects = JSON.parse(localStorage.getItem('iota-projects')) || [];
let currentProject = null;

// Project structure
function createProject(type) {
  const project = {
    id: Date.now(),
    type: type, // 'ui-ux' or 'photo-edit'
    name: `Untitled ${type === 'ui-ux' ? 'Design' : 'Photo'}`,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    data: type === 'ui-ux' ? { elements: [], artboard: { width: 375, height: 812 } } : { image: null, edits: [] }
  };
  
  projects.push(project);
  saveProjects();
  return project;
}

function saveProjects() {
  localStorage.setItem('iota-projects', JSON.stringify(projects));
}

function deleteProject(id) {
  projects = projects.filter(p => p.id !== id);
  saveProjects();
  renderProjectsList();
}

function renderProjectsList() {
  const main = document.querySelector('main');
  const nothingText = document.querySelector('h2.muted');
  const worm = document.querySelector('.worm');
  const foundNothing = document.querySelector('.found_nothin');
  
  if (projects.length === 0) {
    worm.style.display = 'block';
    foundNothing.style.display = 'block';
    nothingText.style.display = 'block';
    main.innerHTML = `
      <img class="worm" src="/assets/imgs/output-onlinegiftools.gif" alt="" />
      <img class="found_nothin" src="/assets/imgs/image-3.png" alt="" />
    `;
  } else {
    worm.style.display = 'none';
    foundNothing.style.display = 'none';
    nothingText.style.display = 'none';
    
    main.innerHTML = `
      <div class="projects-grid">
        ${projects.map(project => `
          <div class="project-card" data-id="${project.id}">
            <div class="project-thumbnail">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                ${project.type === 'ui-ux' 
                  ? '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M9 9h12"/>'
                  : '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>'
                }
              </svg>
            </div>
            <div class="project-info">
              <h3>${project.name}</h3>
              <p class="font-light">${new Date(project.modified).toLocaleDateString()}</p>
            </div>
            <button class="delete-project" data-id="${project.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// Update menu option clicks handler
document.addEventListener("click", (e) => {
  const menuOption = e.target.closest(".menu-option");
  if (menuOption) {
    const action = menuOption.dataset.action;
    
    if (action === "ui-ux") {
      const project = createProject('ui-ux');
      openEditor(project);
      closeSheet();
    } else if (action === "photo-edit") {
      const project = createProject('photo-edit');
      openPhotoEditor(project);
      closeSheet();
    }
  }
  
  // Handle project card clicks
  const projectCard = e.target.closest(".project-card");
  if (projectCard && !e.target.closest(".delete-project")) {
    const projectId = parseInt(projectCard.dataset.id);
    const project = projects.find(p => p.id === projectId);
    if (project) {
      if (project.type === 'ui-ux') {
        openEditor(project);
      } else {
        openPhotoEditor(project);
      }
    }
  }
  
  // Handle delete button
  const deleteBtn = e.target.closest(".delete-project");
  if (deleteBtn) {
    e.stopPropagation();
    const projectId = parseInt(deleteBtn.dataset.id);
    if (confirm('Delete this project?')) {
      deleteProject(projectId);
    }
  }
});

function openEditor(project) {
  currentProject = project;
  document.body.innerHTML = `
    <div class="editor-container">
      <header class="editor-header flex-row ai-c jc-sb">
        <button class="back-btn notAligned">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <input type="text" class="project-name-input" value="${project.name}" />
        <button class="save-btn button-General noShaking">Save</button>
      </header>
      
      <div class="editor-workspace">
        <canvas id="artboard" width="${project.data.artboard.width}" height="${project.data.artboard.height}"></canvas>
      </div>
      
      <div class="toolbar flex-row ai-c jc-c">
        <button class="tool-btn" data-tool="rectangle">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
          </svg>
        </button>
        <button class="tool-btn" data-tool="circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </button>
        <button class="tool-btn" data-tool="text">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  initializeCanvas();
}

function openPhotoEditor(project) {
  currentProject = project;
  document.body.innerHTML = `
    <div class="editor-container">
      <header class="editor-header flex-row ai-c jc-sb">
        <button class="back-btn notAligned">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <input type="text" class="project-name-input" value="${project.name}" />
        <button class="save-btn button-General noShaking">Save</button>
      </header>
      
      <div class="editor-workspace">
        <canvas id="photo-canvas"></canvas>
        <input type="file" id="photo-upload" accept="image/*" style="display: none;" />
      </div>
      
      <div class="toolbar flex-row ai-c jc-c">
        <button class="tool-btn" id="upload-photo-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  initializePhotoEditor();
}

function initializeCanvas() {
  const canvas = document.getElementById('artboard');
  const ctx = canvas.getContext('2d');
  
  // Basic canvas setup
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Back button
  document.querySelector('.back-btn').addEventListener('click', () => {
    location.reload();
  });
  
  // Save button
  document.querySelector('.save-btn').addEventListener('click', () => {
    currentProject.name = document.querySelector('.project-name-input').value;
    currentProject.modified = new Date().toISOString();
    saveProjects();
    alert('Project saved!');
  });
  
  // Tool buttons
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tool = btn.dataset.tool;
      alert(`${tool} tool selected! (Drawing functionality to be implemented)`);
    });
  });
}

function initializePhotoEditor() {
  document.querySelector('.back-btn').addEventListener('click', () => {
    location.reload();
  });
  
  document.querySelector('.save-btn').addEventListener('click', () => {
    currentProject.name = document.querySelector('.project-name-input').value;
    currentProject.modified = new Date().toISOString();
    saveProjects();
    alert('Project saved!');
  });
  
  document.getElementById('upload-photo-btn').addEventListener('click', () => {
    document.getElementById('photo-upload').click();
  });
  
  document.getElementById('photo-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.getElementById('photo-canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
}

// Update "Open previous projects" button
document.querySelector('.view_doc.CA61C3').addEventListener('click', () => {
  renderProjectsList();
});

// Initialize on load
renderProjectsList();

