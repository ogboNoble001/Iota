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