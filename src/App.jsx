import React, { useState, useEffect, useRef } from 'react';
import { Shirt, Eye, ChevronUp, Info, ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from 'lucide-react';


const PROJECTS = [
  { id: 'IMP-001', title: 'The weight of a thousand silent conversations we never actually had.', date: '2026.05.22', video: '/videos/IMP-001.mp4' },
  { id: 'IMP-002', title: 'Finding the frequency where the hum of the world finally stops.', date: '2026.05.22', video: '/videos/IMP-002.mp4' },
  { id: 'IMP-003', title: 'The physical sensation of leaving a place that was never really home.', date: '2026.05.22', video: '/videos/IMP-003.mp4' },
  { id: 'IMP-004', title: 'What remains after the light fades and the memory begins to distort.', date: '2026.05.22', video: '/videos/IMP-004.mp4' },
  { id: 'IMP-005', title: 'A quiet insistence that there is still more road left to travel.', date: '2026.05.22', video: '/videos/IMP-005.mp4' },
  { id: 'IMP-006', title: 'Counting the fragments of a broken clock at three in the morning.', date: '2026.05.22', video: '/videos/IMP-006.mp4' },
  { id: 'IMP-007', title: 'The way color bleeds through the edges of a monochromatic frame.', date: '2026.05.22', video: 'IMP-007.mp4' },
  { id: 'IMP-008', title: 'Listening to the resonance of an empty room reflecting your own thoughts.', date: '2026.05.22', video: 'IMP-008.mp4' },
  { id: 'IMP-009', title: 'Tracing the impossible patterns found within fractured layers of history.', date: '2026.05.22', video: 'IMP-009.mp4' },
];


const CLOTHING_PIECES = [
  { id: 'C-01', name: 'STRUCTURAL DISSOLVE', price: '240', desc: 'Hand-dyed cotton, asymmetric drape with exposed raw edges.' },
  { id: 'C-02', name: 'VOID OVERLAY', price: '180', desc: 'Recycled technical fiber, modular sleeve structure for variable silhouette.' },
  { id: 'C-03', name: 'SILENT WEAVE', price: '310', desc: 'Raw heavy-gauge linen, reinforced high-tension stress points.' },
  { id: 'C-04', name: 'FRACTURED FRAME', price: '215', desc: 'Heavyweight loopback jersey, custom oxidized metal hardware.' },
  { id: 'C-05', name: 'STASIS LAYER', price: '275', desc: 'Densely woven nylon, heat-sealed seams, boxy architectural cut.' },
  { id: 'C-06', name: 'ECHOED SURFACE', price: '195', desc: 'Garment-washed poplin, elongated length, frayed hem detail.' },
];


const ART_SLIDES = [
  { title: "Dion", desc: "Watch music video", bg: "bg-neutral-800", video: "/videos/Dion.mp4" },
  { title: "Jayrock", desc: "Listen to Move On", bg: "bg-stone-900", video: "/videos/Jayrock.mp4" },
  { title: "P.", desc: "Love yours and stay down", bg: "bg-zinc-900", video: "/videos/P.mp4" },
  { title: "Stay Down", desc: "Watch music video", bg: "bg-slate-900", video: "/videos/StayDown.mp4" },
  { title: "Love Yours", desc: "Listen now", bg: "bg-stone-800", video: "/videos/LoveYours.mp4" },
  { title: "Move On", desc: "Listen to Move On by Jay Rock", bg: "bg-neutral-900", video: "/videos/MoveOn.mp4" }
];


const LetterTile = ({ letter }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="w-20 h-20 md:w-28 md:h-28 flex flex-col items-center">
            <button
                onClick={() => setExpanded(!expanded)}
                className={`w-full h-full flex items-center justify-center text-4xl transition-all ${expanded ? 'font-bold' : 'font-normal text-black/50 hover:text-black'}`}
            >
                {letter}
            </button>
            <div className={`grid transition-all duration-500 w-full ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden mt-1">
                    <div className="w-full aspect-square bg-black/80" />
                </div>
            </div>
        </div>
    );
};


export default function App() {
  console.log("App is running");
  const [activeTab, setActiveTab] = useState('projects');
  const [scrolled, setScrolled] = useState(false);
 
  const [expandedProject, setExpandedProject] = useState(null);
  const videoRefs = useRef({});
  const [playingVideos, setPlayingVideos] = useState({});
  const [mutedVideos, setMutedVideos] = useState({});
  const [progressVideos, setProgressVideos] = useState({});


  const [slideIndex, setSlideIndex] = useState(0);


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    if (activeTab === 'artist') {
        const interval = setInterval(() => {
            setSlideIndex(prev => (prev + 1) % ART_SLIDES.length);
        }, 6000);
        return () => clearInterval(interval);
    }
  }, [activeTab]);


  const nextSlide = () => setSlideIndex(prev => (prev + 1) % ART_SLIDES.length);
  const prevSlide = () => setSlideIndex(prev => (prev - 1 + ART_SLIDES.length) % ART_SLIDES.length);


  const handleExpandProject = (id) => {
    if (expandedProject === id) {
        setExpandedProject(null);
        if (videoRefs.current[id]) {
            videoRefs.current[id].pause();
            setPlayingVideos(prev => ({ ...prev, [id]: false }));
        }
    } else {
        if (expandedProject && videoRefs.current[expandedProject]) {
            videoRefs.current[expandedProject].pause();
            setPlayingVideos(prev => ({ ...prev, [expandedProject]: false }));
        }
        setExpandedProject(id);
        setTimeout(() => {
            if (videoRefs.current[id]) {
                videoRefs.current[id].play().catch(e => console.log("Autoplay blocked:", e));
                setPlayingVideos(prev => ({ ...prev, [id]: true }));
            }
        }, 100);
    }
  };


  const toggleProjectPlay = (id) => {
      const video = videoRefs.current[id];
      if (!video) return;
      if (video.paused) {
          video.play();
          setPlayingVideos(prev => ({ ...prev, [id]: true }));
      } else {
          video.pause();
          setPlayingVideos(prev => ({ ...prev, [id]: false }));
      }
  };


  const toggleProjectMute = (id) => {
      setMutedVideos(prev => {
          const isMuted = !prev[id];
          if (videoRefs.current[id]) {
              videoRefs.current[id].muted = isMuted;
          }
          return { ...prev, [id]: isMuted };
      });
  };


  const updateProjectProgress = (id, e) => {
      const video = e.target;
      if (video.duration) {
          const percent = (video.currentTime / video.duration) * 100;
          setProgressVideos(prev => ({ ...prev, [id]: percent }));
      }
  };


  const seekProjectVideo = (id, e) => {
      const video = videoRefs.current[id];
      if (!video) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / rect.width;
      video.currentTime = percent * video.duration;
      setProgressVideos(prev => ({ ...prev, [id]: percent * 100 }));
  };


  return (
    <div className={`min-h-screen ${activeTab === 'artist' ? 'bg-black' : 'bg-[#88786f]'} text-white font-sans selection:bg-[#E63946] flex flex-col transition-colors duration-700`}>
     
      <header className={`fixed top-0 left-0 w-full p-6 z-50 transition-all duration-300 flex items-center justify-between ${scrolled ? 'py-4' : 'py-6'} ${activeTab === 'artist' ? 'text-white' : 'text-black'}`}>
        <button onClick={() => setActiveTab('projects')} className="text-[13px] font-medium tracking-tight hover:opacity-50 transition-opacity">
            imPFLanguage
        </button>
        <nav className="flex items-center gap-4">
          <button onClick={() => setActiveTab('artist')} className="p-1 hover:opacity-50"><span className="font-bold text-xs">A</span></button>
          <button onClick={() => setActiveTab('clothing')} className="p-1 hover:opacity-50"><Shirt size={16} /></button>
          <button onClick={() => setActiveTab('projects')} className="p-1 hover:opacity-50"><Eye size={16} /></button>
          <button onClick={() => setActiveTab('about')} className="p-1 hover:opacity-50"><Info size={16} /></button>
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="p-1 hover:opacity-50"><ChevronUp size={16} /></button>
        </nav>
      </header>


      {activeTab === 'clothing' ? (
        <main className="flex-1 flex flex-col items-center w-full px-6 pt-32 pb-24 text-black">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {CLOTHING_PIECES.map(item => (
                    <div key={item.id} className="group cursor-pointer">
                        <div className="aspect-[3/4] bg-black/10 mb-4 flex items-center justify-center border border-black/10 group-hover:bg-black/20 transition-all">
                            <span className="text-[10px] tracking-widest text-black/30 font-mono">[CONCEPTUAL_PIECE]</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-sm tracking-tight">{item.name}</h3>
                                <p className="text-[11px] text-black/60 mt-1 leading-tight">{item.desc}</p>
                            </div>
                            <span className="text-xs font-mono pl-4">${item.price}</span>
                        </div>
                    </div>
                ))}
            </div>
        </main>
      ) : activeTab === 'artist' ? (
        <main className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-black">
           
            <div className={`absolute inset-0 ${ART_SLIDES[slideIndex].bg} transition-colors duration-1000 flex items-center justify-center overflow-hidden`}>
                <video
                    src={ART_SLIDES[slideIndex].video}
                    className="absolute w-full h-full object-cover opacity-50"
                    playsInline
                    autoPlay
                    muted
                    loop
                />
            </div>
           
            <button onClick={prevSlide} className="absolute left-4 md:left-12 z-20 p-4 text-white/40 hover:text-white transition-colors">
                <ChevronLeft size={48} strokeWidth={1} />
            </button>


            <div className="z-10 text-center px-6 pointer-events-none">
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-white drop-shadow-lg">{ART_SLIDES[slideIndex].title}</h2>
                <p className="text-sm uppercase tracking-[0.4em] text-white/80 drop-shadow-md">{ART_SLIDES[slideIndex].desc}</p>
            </div>


            <button onClick={nextSlide} className="absolute right-4 md:right-12 z-20 p-4 text-white/40 hover:text-white transition-colors">
                <ChevronRight size={48} strokeWidth={1} />
            </button>
        </main>
      ) : activeTab === 'about' ? (
        <main className="flex-1 flex items-center justify-center w-full px-6 pt-32 pb-24 text-black">
            <div className="grid grid-cols-2 gap-4 items-center justify-items-center max-w-lg w-full">
                <LetterTile letter="I" />
                <LetterTile letter="M" />
                <LetterTile letter="P" />
                <LetterTile letter="F" />
            </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col items-center w-full px-6 pt-32 pb-24 text-black">
            <div className="w-full max-w-[600px] flex flex-col">
            {PROJECTS.map((item) => (
                <div key={item.id} className="flex flex-col mb-6">
                    <button
                        onClick={() => handleExpandProject(item.id)}
                        className="flex flex-col items-start gap-1 py-2 text-left"
                    >
                        <span className="text-[10px] text-black/50 font-mono tracking-widest uppercase">{item.date}</span>
                        <span className={`text-[14px] font-medium transition-colors ${expandedProject === item.id ? 'text-black underline' : 'text-black/60 hover:text-black'}`}>
                            {item.title}
                        </span>
                    </button>
                   
                    <div className={`grid transition-all duration-500 ease-in-out ${expandedProject === item.id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <div className="overflow-hidden">
                            <div className="pt-1">
                                <div
                                    className="w-full aspect-video bg-black relative group overflow-hidden cursor-pointer"
                                    onClick={() => toggleProjectPlay(item.id)}
                                >
                                    <video
                                        ref={(el) => (videoRefs.current[item.id] = el)}
                                        className="w-full h-full object-cover"
                                        playsInline
                                        muted={mutedVideos[item.id] || false}
                                        onTimeUpdate={(e) => updateProjectProgress(item.id, e)}
                                        onEnded={() => setPlayingVideos(prev => ({ ...prev, [item.id]: false }))}
                                    >
                                        <source src={item.video} type="video/mp4" />
                                    </video>
                                   
                                    {!playingVideos[item.id] && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none transition-opacity">
                                            <Play size={48} className="text-white fill-white opacity-90" strokeWidth={1} />
                                        </div>
                                    )}


                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleProjectMute(item.id); }}
                                        className="absolute bottom-3 right-3 z-30 text-white p-1 hover:opacity-70 transition-opacity"
                                    >
                                        <div className="relative w-[16px] h-[16px] flex items-center justify-center">
                                            {mutedVideos[item.id] ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                        </div>
                                    </button>


                                    <div
                                        className="absolute bottom-0 left-0 w-full h-[4px] bg-white/30 z-20"
                                        onClick={(e) => { e.stopPropagation(); seekProjectVideo(item.id, e); }}
                                    >
                                        <div
                                            className="h-full bg-white transition-all duration-75 ease-linear pointer-events-none"
                                            style={{ width: `${progressVideos[item.id] || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </main>
      )}
    </div>
  );
}







