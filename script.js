  // Data Models
        const PROJECTS = [
            { id: 'IMP-001', title: 'The weight of a thousand silent conversations we never actually had.', date: '2026.05.22', video: 'videos/IMP-001.mp4' },
            { id: 'IMP-002', title: 'Finding the frequency where the hum of the world finally stops.', date: '2026.05.22', video: 'videos/IMP-002.mp4' },
            { id: 'IMP-003', title: 'The physical sensation of leaving a place that was never really home.', date: '2026.05.22', video: 'videos/IMP-003.mp4' },
            { id: 'IMP-004', title: 'What remains after the light fades and the memory begins to distort.', date: '2026.05.22', video: 'videos/IMP-004.mp4' },
            { id: 'IMP-005', title: 'A quiet insistence that there is still more road left to travel.', date: '2026.05.22', video: 'videos/IMP-005.mp4' },
            { id: 'IMP-006', title: 'Counting the fragments of a broken clock at three in the morning.', date: '2026.05.22', video: 'videos/IMP-006.mp4' },
            { id: 'IMP-007', title: 'The way color bleeds through the edges of a monochromatic frame.', date: '2026.05.22', video: 'videos/IMP-007.mp4' },
            { id: 'IMP-008', title: 'Listening to the resonance of an empty room reflecting your own thoughts.', date: '2026.05.22', video: 'videos/IMP-008.mp4' },
            { id: 'IMP-009', title: 'Tracing the impossible patterns found within fractured layers of history.', date: '2026.05.22', video: 'videos/IMP-009.mp4' }
        ];

        const CLOTHING_PIECES = [
            { id: 'C-01', name: 'STRUCTURAL DISSOLVE', price: '240', desc: 'Hand-dyed cotton, asymmetric drape with exposed raw edges.' },
            { id: 'C-02', name: 'VOID OVERLAY', price: '180', desc: 'Recycled technical fiber, modular sleeve structure for variable silhouette.' },
            { id: 'C-03', name: 'SILENT WEAVE', price: '310', desc: 'Raw heavy-gauge linen, reinforced high-tension stress points.' },
            { id: 'C-04', name: 'FRACTURED FRAME', price: '215', desc: 'Heavyweight loopback jersey, custom oxidized metal hardware.' },
            { id: 'C-05', name: 'STASIS LAYER', price: '275', desc: 'Densely woven nylon, heat-sealed seams, boxy architectural cut.' },
            { id: 'C-06', name: 'ECHOED SURFACE', price: '195', desc: 'Garment-washed poplin, elongated length, frayed hem detail.' }
        ];

        const ART_SLIDES = [
            { title: "Dion", desc: "The Art of listening", bg: "bg-neutral-800", video: "videos/Dion.mp4" },
            { title: "Jayrock", desc: "A Remedy For Love Is language", bg: "bg-stone-900", video: "videos/Jayrock.mp4" },
            { title: "P.", desc: "Love yours and stay down", bg: "bg-zinc-900", video: "videos/P.mp4" },
            { title: "", desc: "On My Side Music Video", bg: "bg-slate-900", video: "videos/StayDown.mp4" },
            { title: "Love Yours", desc: "Listen now", bg: "bg-stone-800", video: "videos/LoveYours.mp4" },
            { title: "Family", desc: "22", bg: "bg-neutral-900", video: "videos/Family.mp4" }
        ];

        // State variables
        let activeTab = 'projects';
        let expandedProject = null;
        let slideIndex = 0;
        let slideInterval = null;

        // Initialize App
        function init() {
            renderClothing();
            renderProjects();
            lucide.createIcons();
            
            // Header scroll effect
            window.addEventListener('scroll', () => {
                const header = document.getElementById('header');
                if (window.scrollY > 50) {
                    header.classList.remove('py-6');
                    header.classList.add('py-4');
                } else {
                    header.classList.add('py-6');
                    header.classList.remove('py-4');
                }
            });
        }

        // --- Navigation Logic ---
        function switchTab(tab) {
            activeTab = tab;
            
            // Hide all tabs
            ['projects', 'clothing', 'artist', 'about'].forEach(t => {
                document.getElementById(`tab-${t}`).classList.add('hidden');
            });
            
            // Show target tab
            document.getElementById(`tab-${tab}`).classList.remove('hidden');

            // Handle background & header text colors
            const app = document.getElementById('app');
            const header = document.getElementById('header');
            
            if (tab === 'artist') {
                app.classList.remove('bg-[#88786f]');
                app.classList.add('bg-black');
                header.classList.remove('text-black');
                header.classList.add('text-white');
                startSlideShow();
                updateArtistSlide();
            } else {
                app.classList.add('bg-[#88786f]');
                app.classList.remove('bg-black');
                header.classList.add('text-black');
                header.classList.remove('text-white');
                stopSlideShow();
            }
        }

        // --- Projects Logic ---
        function renderProjects() {
            const container = document.getElementById('projects-container');
            container.innerHTML = PROJECTS.map(item => `
                <div class="flex flex-col mb-6">
                    <button onclick="handleExpandProject('${item.id}')" class="flex flex-col items-start gap-1 py-2 text-left w-full group">
                        <span class="text-[10px] text-black/50 font-mono tracking-widest uppercase">${item.date}</span>
                        <span id="title-${item.id}" class="text-[14px] font-medium transition-colors text-black/60 group-hover:text-black">
                            ${item.title}
                        </span>
                    </button>
                   
                    <div id="grid-${item.id}" class="grid grid-rows-0fr transition-all duration-500 ease-in-out">
                        <div class="overflow-hidden">
                            <div class="pt-1">
                                <div class="w-full aspect-video bg-black relative group overflow-hidden cursor-pointer" onclick="toggleProjectPlay('${item.id}')">
                                    <video id="video-${item.id}" class="w-full h-full object-cover" playsinline ontimeupdate="updateProjectProgress('${item.id}')" onended="onVideoEnded('${item.id}')">
                                        <source src="${item.video}" type="video/mp4" />
                                    </video>
                                   
                                    <div id="play-overlay-${item.id}" class="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none transition-opacity">
                                        <i data-lucide="play" class="w-12 h-12 text-white fill-white opacity-90 stroke-1"></i>
                                    </div>

                                    <button onclick="toggleProjectMute(event, '${item.id}')" class="absolute bottom-3 right-3 z-30 text-white p-1 hover:opacity-70 transition-opacity">
                                        <div class="relative w-[16px] h-[16px] flex items-center justify-center" id="mute-icon-${item.id}">
                                            <i data-lucide="volume-2" class="w-4 h-4"></i>
                                        </div>
                                    </button>

                                    <div class="absolute bottom-0 left-0 w-full h-[4px] bg-white/30 z-20" onclick="seekProjectVideo(event, '${item.id}')">
                                        <div id="progress-${item.id}" class="h-full bg-white transition-all duration-75 ease-linear pointer-events-none" style="width: 0%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function handleExpandProject(id) {
            // Close currently expanded if any
            if (expandedProject && expandedProject !== id) {
                document.getElementById(`grid-${expandedProject}`).classList.replace('grid-rows-1fr', 'grid-rows-0fr');
                document.getElementById(`title-${expandedProject}`).classList.remove('text-black', 'underline');
                document.getElementById(`title-${expandedProject}`).classList.add('text-black/60');
                const oldVideo = document.getElementById(`video-${expandedProject}`);
                if (oldVideo) {
                    oldVideo.pause();
                    document.getElementById(`play-overlay-${expandedProject}`).style.opacity = '1';
                }
            }

            const grid = document.getElementById(`grid-${id}`);
            const title = document.getElementById(`title-${id}`);
            const video = document.getElementById(`video-${id}`);
            
            if (expandedProject === id) {
                // Collapse
                grid.classList.replace('grid-rows-1fr', 'grid-rows-0fr');
                title.classList.remove('text-black', 'underline');
                title.classList.add('text-black/60');
                if (video) {
                    video.pause();
                    document.getElementById(`play-overlay-${id}`).style.opacity = '1';
                }
                expandedProject = null;
            } else {
                // Expand
                grid.classList.replace('grid-rows-0fr', 'grid-rows-1fr');
                title.classList.remove('text-black/60');
                title.classList.add('text-black', 'underline');
                expandedProject = id;
                
                setTimeout(() => {
                    if (video) {
                        video.play().catch(e => console.log("Autoplay blocked:", e));
                        document.getElementById(`play-overlay-${id}`).style.opacity = '0';
                    }
                }, 100);
            }
        }

        function toggleProjectPlay(id) {
            const video = document.getElementById(`video-${id}`);
            const overlay = document.getElementById(`play-overlay-${id}`);
            if (!video) return;
            
            if (video.paused) {
                video.play();
                overlay.style.opacity = '0';
            } else {
                video.pause();
                overlay.style.opacity = '1';
            }
        }

        function onVideoEnded(id) {
            document.getElementById(`play-overlay-${id}`).style.opacity = '1';
        }

        function toggleProjectMute(e, id) {
            e.stopPropagation();
            const video = document.getElementById(`video-${id}`);
            const iconContainer = document.getElementById(`mute-icon-${id}`);
            
            if (video) {
                video.muted = !video.muted;
                iconContainer.innerHTML = video.muted 
                    ? '<i data-lucide="volume-x" class="w-4 h-4"></i>'
                    : '<i data-lucide="volume-2" class="w-4 h-4"></i>';
                lucide.createIcons(); // re-init icons for this specific change
            }
        }

        function updateProjectProgress(id) {
            const video = document.getElementById(`video-${id}`);
            const progress = document.getElementById(`progress-${id}`);
            if (video && video.duration) {
                const percent = (video.currentTime / video.duration) * 100;
                progress.style.width = `${percent}%`;
            }
        }

        function seekProjectVideo(e, id) {
            e.stopPropagation();
            const video = document.getElementById(`video-${id}`);
            if (!video) return;
            
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = x / rect.width;
            
            video.currentTime = percent * video.duration;
            document.getElementById(`progress-${id}`).style.width = `${percent * 100}%`;
        }

        // --- Clothing Logic ---
        function renderClothing() {
            const container = document.getElementById('clothing-container');
            container.innerHTML = CLOTHING_PIECES.map(item => `
                <div class="group cursor-pointer">
                    <div class="aspect-[3/4] bg-black/10 mb-4 flex items-center justify-center border border-black/10 group-hover:bg-black/20 transition-all">
                        <span class="text-[10px] tracking-widest text-black/30 font-mono">[CONCEPTUAL_PIECE]</span>
                    </div>
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-bold text-sm tracking-tight">${item.name}</h3>
                            <p class="text-[11px] text-black/60 mt-1 leading-tight">${item.desc}</p>
                        </div>
                        <span class="text-xs font-mono pl-4">$${item.price}</span>
                    </div>
                </div>
            `).join('');
        }

        // --- Artist Slideshow Logic ---
      function updateArtistSlide() {
    const slide = ART_SLIDES[slideIndex];
    const bgElement = document.getElementById('artist-bg');
    const titleElement = document.getElementById('artist-title');
    const descElement = document.getElementById('artist-desc');
    const videoElement = document.getElementById('artist-video');

    // Remove old bg class, add new
    bgElement.className = `absolute inset-0 ${slide.bg} transition-colors duration-1000 flex items-center justify-center overflow-hidden`;

    titleElement.innerText = slide.title;
    descElement.innerText = slide.desc;
    videoElement.src = slide.video;

   // IMPORTANT: control via CSS class only
    videoElement.classList.remove("dion");
    if (slide.title === "Dion") {
        videoElement.classList.add("dion");
    }
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % ART_SLIDES.length;
    updateArtistSlide();
    resetSlideShow();
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + ART_SLIDES.length) % ART_SLIDES.length;
    updateArtistSlide();
    resetSlideShow();
}

function startSlideShow() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        slideIndex = (slideIndex + 1) % ART_SLIDES.length;
        updateArtistSlide();
    }, 6000);
}

function stopSlideShow() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

function resetSlideShow() {
    if (activeTab === 'artist') {
        startSlideShow();
    }
}

// --- About Tiles Logic ---
function toggleTile(btn) {
    const letter = btn;
    const grid = btn.nextElementSibling;
    
    if (grid.classList.contains('grid-rows-0fr')) {
        grid.classList.replace('grid-rows-0fr', 'grid-rows-1fr');
        letter.classList.remove('font-normal', 'text-black/50');
        letter.classList.add('font-bold', 'text-black');
    } else {
        grid.classList.replace('grid-rows-1fr', 'grid-rows-0fr');
        letter.classList.add('font-normal', 'text-black/50');
        letter.classList.remove('font-bold', 'text-black');
    }
}
        // Boot
        window.onload = init;