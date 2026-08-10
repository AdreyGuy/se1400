const pageIds = ["page-home", "page-about", "page-artworks", "page-project"];
let currentPage = "page-home";
let artworksExpanded = [false, true, false, true];

// Scale logic
const canvasContainer = document.getElementById("canvas-container");
const rootCanvas = document.getElementById("root-canvas");

function updateScale() {
    const scale = window.innerWidth / 1920;
    rootCanvas.style.transform = `scale(${scale})`;
    
    const canvasHeight = computeCanvasHeight();
    canvasContainer.style.height = `${canvasHeight * scale}px`;
    rootCanvas.style.height = `${canvasHeight}px`;
}

function computeCanvasHeight() {
    if (currentPage === "page-home") return 1080;
    if (currentPage === "page-about") return 2400;
    if (currentPage === "page-project") return 7500;
    if (currentPage === "page-artworks") {
        return computeArtworksCanvasHeight();
    }
    return 1080;
}

const ROW_HEIGHTS = { horizontal: 284, tall: 604 };
const ARTWORKS_CATEGORIES = [
  { name: "Environments",     rows: ["horizontal"] },
  { name: "Props", rows: ["horizontal", "horizontal"] },
  { name: "Motion graphics",     rows: ["horizontal"] },
  { name: "Character animations", rows: ["tall"] },
];
const HEADER_H = 98;
const ROW_GAP = 40;
const SECTION_PAD = 30;
const ACCORDION_TOP = 373;
const BOTTOM_PAD = 100;

function computeArtworksCanvasHeight() {
    let h = ACCORDION_TOP + BOTTOM_PAD;
    for (let i = 0; i < ARTWORKS_CATEGORIES.length; i++) {
        h += HEADER_H;
        if (artworksExpanded[i]) {
            const rows = ARTWORKS_CATEGORIES[i].rows;
            rows.forEach((rowType, j) => {
                h += ROW_HEIGHTS[rowType];
                if (j < rows.length - 1) h += ROW_GAP;
            });
            h += SECTION_PAD;
        }
    }
    return h;
}

function navigateTo(pageId) {
    currentPage = pageId;
    pageIds.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.style.display = id === pageId ? "block" : "none";
    });
    closeMenu();
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Set background color
    document.body.style.backgroundColor = pageId === "page-home" ? "#5A4EEC" : "#ffffff";
    
    updateScale();
}

// Menu logic
const menuOverlay = document.getElementById("menu-overlay");
function toggleMenu() {
    if (menuOverlay.classList.contains("menu-open")) {
        closeMenu();
    } else {
        openMenu();
    }
}
function openMenu() {
    menuOverlay.classList.add("menu-open");
    document.body.style.overflowY = "hidden";
}
function closeMenu() {
    menuOverlay.classList.remove("menu-open");
    document.body.style.overflowY = "auto";
}

// Carousel logic
let centerIndex = 0;
const carouselLabels = [
  { title: "title", description: "Description" },
  { title: "Title1", description: "Description1" },
  { title: "Title2", description: "Description2" }
];
const carouselImages = [
  "src/imports/Slide16976-2/200ecad4d173b0315491b48996a37061346ffc49.png", // Hand
  "src/imports/Slide16976-2/b506cb7e7d6961c8a4dddbdd9c01fdce0d2a4e24.png", // Image2
  "src/imports/Slide16976-2/0836f821addd20b851f40bbe0fd775c9004a3857.png"  // Image3
];

function updateCarousel() {
    const leftIndex = (centerIndex + 2) % 3;
    const rightIndex = (centerIndex + 1) % 3;
    
    const centerImg = document.getElementById("carousel-center-img");
    const leftImg = document.getElementById("carousel-left-img");
    const rightImg = document.getElementById("carousel-right-img");
    
    if(centerImg) centerImg.src = carouselImages[centerIndex];
    if(leftImg) leftImg.src = carouselImages[leftIndex];
    if(rightImg) rightImg.src = carouselImages[rightIndex];
    
    const titleEl = document.getElementById("carousel-title");
    const descEl = document.getElementById("carousel-desc");
    
    if(titleEl) titleEl.textContent = carouselLabels[centerIndex].title;
    if(descEl) descEl.textContent = carouselLabels[centerIndex].description;
    
    const centerHitArea = document.getElementById("carousel-hit-area");
    if(centerHitArea) {
        if (centerIndex === 0) {
            centerHitArea.style.cursor = "pointer";
        } else {
            centerHitArea.style.cursor = "default";
        }
    }
}
function carouselNext() {
    centerIndex = (centerIndex + 1) % 3;
    updateCarousel();
}
function carouselPrev() {
    centerIndex = (centerIndex + 2) % 3;
    updateCarousel();
}

function handleCarouselClick() {
    if (centerIndex === 0) {
        navigateTo('page-project');
    }
}

// Hover effects for carousel center card
function handleCarouselEnter() {
    const card = document.getElementById("carousel-title-card");
    if(card) {
        card.style.top = "calc(50% - 20px)";
    }
}
function handleCarouselLeave() {
    const card = document.getElementById("carousel-title-card");
    if(card) {
        card.style.top = "calc(50% - 0.5px)";
    }
}

// Accordion Logic
function toggleAccordion(index) {
    artworksExpanded[index] = !artworksExpanded[index];
    const content = document.getElementById(`accordion-content-${index}`);
    const arrow = document.getElementById(`accordion-arrow-${index}`);
    
    if (content && arrow) {
        if (artworksExpanded[index]) {
            content.style.display = "block";
            arrow.style.transform = "rotate(0deg)";
        } else {
            content.style.display = "none";
            arrow.style.transform = "rotate(-90deg)";
        }
    }
    updateScale();
}

// Event Listeners setup on load
window.addEventListener("resize", updateScale);
window.addEventListener("DOMContentLoaded", () => {
    // Initial setup
    updateScale();
    updateCarousel();
    
    // Setup artworks accordion based on initial state
    artworksExpanded.forEach((expanded, i) => {
        const content = document.getElementById(`accordion-content-${i}`);
        const arrow = document.getElementById(`accordion-arrow-${i}`);
        if(content && arrow) {
            content.style.display = expanded ? "block" : "none";
            arrow.style.transform = expanded ? "rotate(0deg)" : "rotate(-90deg)";
        }
    });
    
    // Set initial active page
    navigateTo("page-home");
});
