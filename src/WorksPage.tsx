import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function WorksPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Video Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeBvid, setActiveBvid] = useState("");

  // Video Data State
  const [videosInfo, setVideosInfo] = useState([
    {
      bvid: "BV1T3czzGE2V",
      title: "Loading...",
      author: "",
      category: "",
      cover: ""
    },
    {
      bvid: "BV1cXwtzBE48",
      title: "Loading...",
      author: "",
      category: "",
      cover: ""
    },
    {
      bvid: "BV1FXwtzBEzx",
      title: "Loading...",
      author: "",
      category: "",
      cover: ""
    },
    {
      bvid: "BV1XuwbzdEsX",
      title: "Loading...",
      author: "",
      category: "",
      cover: ""
    },
    {
      bvid: "BV1XuwbzdEUn",
      title: "Loading...",
      author: "",
      category: "",
      cover: ""
    },
    {
      bvid: "BV1XuwbzdEmu",
      title: "Loading...",
      author: "",
      category: "",
      cover: ""
    },
    {
      bvid: "BV1QuwbzdE1m",
      title: "Loading...",
      author: "",
      category: "",
      cover: ""
    },
    {
      bvid: "BV1hMPjzdEM6",
      title: "Loading...",
      author: "",
      category: "",
      cover: ""
    },
    {
      bvid: "BV1t3Pjz9E1i",
      title: "Loading...",
      author: "",
      category: "",
      cover: ""
    }
  ]);

  useEffect(() => {
    const fetchBilibiliInfo = async () => {
      const bvids = ["BV1T3czzGE2V", "BV1cXwtzBE48", "BV1FXwtzBEzx", "BV1XuwbzdEsX", "BV1XuwbzdEUn", "BV1XuwbzdEmu", "BV1QuwbzdE1m", "BV1hMPjzdEM6", "BV1t3Pjz9E1i"];
      
      try {
        const results = await Promise.all(bvids.map(async (bvid) => {
          const apiUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
          const response = await fetch(`https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(apiUrl)}`);
          const data = await response.json();
          
          if (data && data.code === 0) {
            const pubDate = new Date(data.data.pubdate * 1000);
            let coverUrl = data.data.pages?.[0]?.first_frame || data.data.pic;
            if (coverUrl.startsWith('http://')) {
              coverUrl = coverUrl.replace('http://', 'https://');
            }
            
            return {
              bvid,
              title: data.data.title,
              author: data.data.owner.name,
              category: `${data.data.tname || "科技"} / ${pubDate.getFullYear()}`,
              cover: coverUrl
            };
          }
          return null;
        }));
        
        const validResults = results.filter(r => r !== null);
        if (validResults.length > 0) {
          setVideosInfo(prev => prev.map(p => validResults.find(r => r.bvid === p.bvid) || p));
        }
      } catch (error) {
        // Silently fail and use initial state if fetch fails
      }
    };
    fetchBilibiliInfo();
  }, []);
  
  // Physics state
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const maxScrollRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const calculateMaxScroll = () => {
      if (galleryRef.current) {
        // Total width of gallery minus viewport width
        maxScrollRef.current = Math.max(0, galleryRef.current.scrollWidth - window.innerWidth);
      }
    };

    // Small delay to ensure layout is complete before calculating max scroll
    setTimeout(calculateMaxScroll, 100);
    window.addEventListener('resize', calculateMaxScroll);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Adjust scroll speed multiplier
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      targetRef.current += delta * 1.5;
      targetRef.current = Math.max(0, Math.min(targetRef.current, maxScrollRef.current));
    };

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      startXRef.current = e.touches[0].clientX;
      scrollLeftRef.current = targetRef.current;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const x = e.touches[0].clientX;
      if (Math.abs(startXRef.current - x) > 5) {
        hasDraggedRef.current = true;
      }
      const walk = (startXRef.current - x) * 2.5; // Touch scroll speed multiplier
      targetRef.current = scrollLeftRef.current + walk;
      targetRef.current = Math.max(0, Math.min(targetRef.current, maxScrollRef.current));
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 50);
    };

    // Mouse events for desktop dragging
    let isMouseDragging = false;
    let startMouseX = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDragging = true;
      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      startMouseX = e.clientX;
      scrollLeftRef.current = targetRef.current;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDragging) return;
      e.preventDefault();
      const x = e.clientX;
      if (Math.abs(startMouseX - x) > 5) {
        hasDraggedRef.current = true;
      }
      const walk = (startMouseX - x) * 2.5; // Mouse scroll speed multiplier
      targetRef.current = scrollLeftRef.current + walk;
      targetRef.current = Math.max(0, Math.min(targetRef.current, maxScrollRef.current));
    };

    const handleMouseUp = () => {
      isMouseDragging = false;
      // Small delay to prevent click event after drag
      setTimeout(() => {
        isDraggingRef.current = false;
        hasDraggedRef.current = false;
      }, 50);
    };

    const handleMouseLeave = () => {
      if (isMouseDragging) {
        handleMouseUp();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mousemove', handleMouseMove, { passive: false });
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mouseleave', handleMouseLeave);
      
      // Set initial cursor
      container.style.cursor = 'grab';
    }

    let animationFrameId: number;

    const update = () => {
      // Lerp for smooth inertia
      currentRef.current += (targetRef.current - currentRef.current) * 0.08;
      
      // Round to avoid infinite tiny updates
      if (Math.abs(targetRef.current - currentRef.current) < 0.01) {
        currentRef.current = targetRef.current;
      }

      const current = currentRef.current;

      // 1. Move the gallery
      if (galleryRef.current) {
        galleryRef.current.style.transform = `translate3d(${-current}px, 0, 0)`;
      }

      // 3. 3D Visual Enhancement for cards
      const windowWidth = window.innerWidth;
      const center = windowWidth / 2;

      let activeIndex = 0;
      let minDist = Infinity;

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(center - cardCenter);
        
        if (dist < minDist) {
          minDist = dist;
          activeIndex = index;
        }
        
        // The distance at which the card reaches minimum scale/opacity
        const maxDist = windowWidth * 0.5; 
        const progress = Math.min(dist / maxDist, 1);
        
        // Smooth easing for the scale/opacity transition
        const easeProgress = 1 - Math.pow(1 - progress, 2);
        
        const scale = 1 + (1 - easeProgress) * 0.15; // Scale up to 1.15 at center, 1 at edges
        const opacity = 1 - easeProgress * 0.6; // Opacity down to 0.4 at edges
        const zIndex = Math.round((1 - progress) * 100);
        
        card.style.transform = `scale(${scale})`;
        card.style.opacity = Math.max(0.2, opacity).toString();
        card.style.zIndex = zIndex.toString();
      });

      // 2. Move the ruler proportionally and center the active tick
      if (rulerRef.current && maxScrollRef.current > 0) {
        const scrollPercentage = current / maxScrollRef.current;
        const rulerContainerWidth = 400;
        const centerOffset = rulerContainerWidth / 2;
        const totalRulerWidth = rulerRef.current.scrollWidth;
        
        // Smoothly interpolate the ruler position based on the continuous scroll percentage
        const continuousTickPosition = scrollPercentage * (totalRulerWidth - 1);
        
        rulerRef.current.style.transform = `translate3d(${centerOffset - continuousTickPosition}px, 0, 0)`;
        
        // Highlight active tick
        const ticks = rulerRef.current.children;
        for (let i = 0; i < ticks.length; i++) {
          const tick = ticks[i] as HTMLElement;
          if (i === activeIndex) {
            tick.style.opacity = '1';
            tick.style.height = '100%';
            tick.style.backgroundColor = '#ffffff';
          } else {
            tick.style.opacity = '0.2';
            tick.style.height = '50%';
            tick.style.backgroundColor = '#ffffff';
          }
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', calculateMaxScroll);
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [videosInfo]); // Re-run when videosInfo changes to recalculate maxScroll

  const handleCardClick = (index: number, bvid: string) => {
    if (hasDraggedRef.current) return;
    
    const card = cardsRef.current[index];
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const windowCenter = window.innerWidth / 2;
    const dist = Math.abs(windowCenter - cardCenter);
    
    if (dist < 50) {
      // Already centered, open video
      setActiveBvid(bvid);
      setIsVideoModalOpen(true);
    } else {
      // Scroll to center
      targetRef.current += (cardCenter - windowCenter);
      targetRef.current = Math.max(0, Math.min(targetRef.current, maxScrollRef.current));
    }
  };

  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    targetRef.current = percentage * maxScrollRef.current;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      ref={containerRef}
      className="h-screen w-full bg-[#050505] text-white overflow-hidden fixed inset-0 font-sans select-none"
    >
      {/* Top Nav */}
      <nav className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-30 mix-blend-difference pointer-events-auto">
        <Link to="/" className="flex items-center gap-2 cursor-pointer transition-opacity duration-500 ease-in-out opacity-80 hover:opacity-100">
          <img 
            src="/logo.jpg" 
            alt="文子双汐" 
            className="h-8 md:h-10 w-auto object-contain"
          />
          <div className="flex items-center h-8 md:h-10 ml-1">
            <span className="text-white font-black tracking-[0.3em] text-xs md:text-sm uppercase border-y-[1.5px] border-white py-[3px] leading-none">
              STUDIO
            </span>
          </div>
        </Link>
        
        <div className="absolute left-1/2 -translate-x-1/2 text-lg md:text-xl tracking-[0.3em] uppercase opacity-60 font-medium px-6 py-2">
          作品集
        </div>

        <Link to="/" state={{ scrollTo: 'work' }} className="text-base md:text-lg tracking-[0.1em] uppercase opacity-60 hover:opacity-100 transition-opacity cursor-pointer px-6 py-2">
          关闭
        </Link>
      </nav>

      {/* Ruler Indicator */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[400px] overflow-hidden z-20">
        <div 
          className="w-full h-8 cursor-pointer relative"
          onClick={handleRulerClick}
        >
          <div ref={rulerRef} className="absolute top-0 left-0 flex items-end h-full gap-4 will-change-transform">
            {videosInfo.map((work, i) => (
              <div 
                key={`ruler-${work.bvid}`} 
                className={`w-[1px] bg-white flex-shrink-0 transition-all duration-300 cursor-pointer hover:opacity-100 ${
                  i === 0 ? 'h-full opacity-100' : 'h-1/2 opacity-20'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(i, work.bvid);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="h-full w-full flex items-center pt-12">
        <div 
          ref={galleryRef} 
          // Padding left/right ensures the first and last items can be centered
          className="flex gap-[4vw] px-[50vw] will-change-transform items-center h-full"
          style={{ paddingLeft: 'calc(50vw - 10vw)', paddingRight: 'calc(50vw - 10vw)' }} // Adjust based on card width
        >
          {videosInfo.map((work, index) => (
            <div 
              key={work.bvid}
              ref={(el) => (cardsRef.current[index] = el)}
              className="relative flex-shrink-0 w-[45vw] md:w-[25vw] lg:w-[20vw] aspect-[3/4] will-change-transform group cursor-pointer"
              style={{ transformOrigin: 'center center' }}
              onClick={() => handleCardClick(index, work.bvid)}
            >
              <div className="w-full h-full overflow-hidden bg-white/5 rounded-sm relative shadow-2xl shadow-black/50">
                {work.cover ? (
                  <img 
                    src={work.cover} 
                    alt={work.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    draggable={false}
                  />
                ) : null}
                
                {/* Video Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20 backdrop-blur-[2px]">
                  <span className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center bg-black/40 text-white backdrop-blur-md transform scale-90 group-hover:scale-100 transition-transform duration-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              </div>
              
              {/* Card Info */}
              <div className="absolute -bottom-10 left-0 w-full flex flex-col gap-2 opacity-90">
                <h3 className="text-xs md:text-sm font-semibold tracking-wide truncate">{work.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Gallery */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10">
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white z-[101] transition-colors"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
            <iframe 
              src={`//player.bilibili.com/player.html?bvid=${activeBvid}&page=1&high_quality=1&danmaku=0&autoplay=1`}
              className="w-full h-full border-0"
              scrolling="no"
              frameBorder="no"
              allowFullScreen={true}
            ></iframe>
          </div>
        </div>
      )}
    </motion.div>
  );
}
