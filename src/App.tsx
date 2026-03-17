/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import WorksPage from './WorksPage';
import ChatWindow from './components/ChatWindow';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// --- ICONS ---
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const TwitterIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TiktokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.72.42-1.24 1.16-1.31 1.97-.03.18-.03.36-.03.53.01 1.46 1.06 2.8 2.51 3.07.41.06.82.06 1.23.01 1.02-.12 1.8-.76 2.13-1.72.13-.42.17-.86.17-1.31-.04-4.75-.01-9.51-.02-14.27z"/>
  </svg>
);

const XiaohongshuIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <defs>
      <mask id="xhs-mask">
        <rect width="24" height="24" fill="white" />
        <text 
          x="12" 
          y="15.5" 
          fontSize="6.5" 
          fontWeight="900" 
          textAnchor="middle" 
          fill="black" 
          style={{ fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif' }}
        >
          小红书
        </text>
      </mask>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" mask="url(#xhs-mask)" />
  </svg>
);

const WeChatIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.5 15.5c-4.5 0-8-3.2-8-7s3.5-7 8-7 8 3.2 8 7-3.5 7-8 7c-0.8 0-1.5-0.1-2.2-0.3l-2.7 1.4 0.6-2.5c-2.3-1.1-3.7-3.3-3.7-5.6 0-3.8 3.5-7 8-7s8 3.2 8 7-3.5 7-8 7z" opacity="0"/>
    <path d="M16.5 10c-3.6 0-6.5 2.2-6.5 5s2.9 5 6.5 5c0.7 0 1.4-0.1 2.1-0.3l2.4 1.4-0.5-2.2c1.6-1.1 2.5-2.4 2.5-3.9 0-2.8-2.9-5-6.5-5zm-2.5 3.5c0.6 0 1-0.4 1-1s-0.4-1-1-1-1 0.4-1 1 0.4 1 1 1zm5 0c0.6 0 1-0.4 1-1s-0.4-1-1-1-1 0.4-1 1 0.4 1 1 1z" />
    <path d="M8.5 1c-4.7 0-8.5 3.4-8.5 7.5 0 2.4 1.4 4.7 3.9 6l-1 3 3.5-1.8c1.3 0.5 2.7 0.8 4.1 0.8 4.7 0 8.5-3.4 8.5-7.5S13.2 1 8.5 1zm-2.5 6c-0.6 0-1-0.4-1-1s0.4-1 1-1 1 0.4 1 1-0.4 1-1 1zm5 0c-0.6 0-1-0.4-1-1s0.4-1 1-1 1 0.4 1 1-0.4 1-1 1z" />
  </svg>
);

// --- SHADERS ---
const vertexShader = `
  uniform float uTime;
  varying float vDistortion;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vEyeVector;
  varying vec3 vPosition;

  // Simple 3D Noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    
    // Softer, smoother noise for a rounder look
    float noise = snoise(position * 0.5 + uTime * 0.3);
    vDistortion = noise;
    
    // Reduced displacement for a more controlled, rounder shape
    vec3 newPosition = position + normal * noise * 0.35;
    vec4 worldPosition = modelMatrix * vec4(newPosition, 1.0);
    vEyeVector = normalize(worldPosition.xyz - cameraPosition);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  varying float vDistortion;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vEyeVector;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    // Softer fresnel for smoother transitions
    float fresnel = pow(1.0 + dot(vEyeVector, vNormal), 2.0);
    
    // Water colors - Muted and soft
    vec3 colorBase = vec3(0.03, 0.06, 0.12); 
    vec3 colorEdge = vec3(0.4, 0.7, 0.9);
    
    vec3 finalColor = mix(colorBase, colorEdge, fresnel * 0.4);
    
    // Softer, broader specular highlights (less "sharp")
    vec3 lightDir = normalize(vec3(5.0, 5.0, 5.0));
    vec3 reflectDir = reflect(-lightDir, vNormal);
    float spec = pow(max(0.0, dot(-vEyeVector, reflectDir)), 32.0);
    
    vec3 lightDir2 = normalize(vec3(-5.0, 2.0, 0.0));
    vec3 reflectDir2 = reflect(-lightDir2, vNormal);
    float spec2 = pow(max(0.0, dot(-vEyeVector, reflectDir2)), 16.0);
    
    finalColor += spec * 0.5 + spec2 * 0.2;
    
    // Gentle transparency
    float alpha = 0.2 + fresnel * 0.5;
    
    // Subtle surface movement
    finalColor += 0.03 * sin(uTime * 1.5 + vDistortion * 5.0);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;


function HomePage() {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });
  
  const [activeSection, setActiveSection] = useState('hero');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isWechatModalOpen, setIsWechatModalOpen] = useState(false);
  const [activeBvid, setActiveBvid] = useState("BV1T3czzGE2V");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const workSectionRef = useRef<HTMLElement>(null);
  
  // Set initial state to the actual video data to prevent blank screen while fetching
  const [videosInfo, setVideosInfo] = useState([
    {
      bvid: "BV1T3czzGE2V",
      title: "Loading...",
      author: "",
      category: "",
      year: "",
      cover: ""
    },
    {
      bvid: "BV1FXwtzBEzx",
      title: "Loading...",
      author: "",
      category: "",
      year: "",
      cover: ""
    },
    {
      bvid: "BV1XuwbzdEsX",
      title: "Loading...",
      author: "",
      category: "",
      year: "",
      cover: ""
    },
    {
      bvid: "BV1cXwtzBE48",
      title: "Loading...",
      author: "",
      category: "",
      year: "",
      cover: ""
    },
    {
      bvid: "BV1hMPjzdEM6",
      title: "Loading...",
      author: "",
      category: "",
      year: "",
      cover: ""
    },
    {
      bvid: "BV1t3Pjz9E1i",
      title: "Loading...",
      author: "",
      category: "",
      year: "",
      cover: ""
    }
  ]);

  useEffect(() => {
    const fetchBilibiliInfo = async () => {
      const bvids = ["BV1T3czzGE2V", "BV1FXwtzBEzx", "BV1XuwbzdEsX", "BV1cXwtzBE48", "BV1hMPjzdEM6", "BV1t3Pjz9E1i"];
      
      try {
        const results = await Promise.all(bvids.map(async (bvid) => {
          const apiUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
          
          // Try multiple proxies in case one is down or blocked
          const proxies = [
            `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`,
            `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`,
            `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(apiUrl)}`
          ];

          // 1. Check Cache first
          const cacheKey = `bili_v2_${bvid}`;
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (Date.now() - parsed.timestamp < 1000 * 60 * 60 * 24 * 7) { // 7 days cache
                return parsed.data;
              }
            } catch (e) {}
          }

          let data = null;
          for (const proxy of proxies) {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s strict timeout per proxy
              const response = await fetch(proxy, { signal: controller.signal });
              clearTimeout(timeoutId);
              
              if (!response.ok) continue;
              const result = await response.json();
              if (result && result.code === 0) {
                data = result;
                break; // Success, exit the proxy loop
              }
            } catch (e) {
              // Timeout or network error, silently continue to next proxy
            }
          }
          
          if (data && data.code === 0) {
            const pubDate = new Date(data.data.pubdate * 1000);
            let coverUrl = data.data.pages?.[0]?.first_frame || data.data.pic;
            if (coverUrl.startsWith('http://')) {
              coverUrl = coverUrl.replace('http://', 'https://');
            }
            
            const formattedResult = {
              bvid,
              title: data.data.title,
              author: data.data.owner.name,
              category: data.data.tname || "科技",
              year: pubDate.getFullYear().toString(),
              cover: coverUrl
            };
            
            // Save to cache
            localStorage.setItem(cacheKey, JSON.stringify({
              timestamp: Date.now(),
              data: formattedResult
            }));
            
            return formattedResult;
          }
          
          // Fallback static data if all proxies fail
          return {
            bvid,
            title: `Bilibili 视频 (${bvid})`,
            author: "文子双汐",
            category: "科技",
            year: "2024",
            cover: `https://picsum.photos/seed/${bvid}/1920/1080?blur=2`
          };
        }));
        
        const validResults = results.filter(r => r !== null);
        if (validResults.length > 0) {
          setVideosInfo(prev => prev.map(p => validResults.find(r => r.bvid === p.bvid) || p));
        }
      } catch (error) {
        console.error("Failed to fetch Bilibili info:", error);
      }
    };
    fetchBilibiliInfo();
  }, []);
  
  const isAnimating = useRef(false);
  const currentSectionIndex = useRef(0);
  const touchStartY = useRef(0);

  const goToSection = (index: number, instant = false) => {
    const container = containerRef.current;
    if (!container) return;
    
    const sectionElements = Array.from(container.querySelectorAll('section')) as HTMLElement[];
    if (index < 0 || index >= sectionElements.length) return;

    isAnimating.current = true;
    currentSectionIndex.current = index;
    
    const sectionNames = ['hero', 'work', 'about', 'contact'];
    setActiveSection(sectionNames[index]);

    if (instant) {
      gsap.set(container, { scrollTo: { y: sectionElements[index].offsetTop, autoKill: false } });
      ScrollTrigger.update();
      isAnimating.current = false;
    } else {
      gsap.to(container, {
        scrollTo: { y: sectionElements[index].offsetTop, autoKill: false },
        duration: 1.2,
        ease: "expo.inOut", // Snappier, smoother damping
        onUpdate: () => ScrollTrigger.update(),
        onComplete: () => {
          setTimeout(() => {
            isAnimating.current = false;
          }, 100); // Shorter delay
        }
      });
    }
  };

  useLayoutEffect(() => {
    if (location.state && (location.state as any).scrollTo === 'work') {
      // Set scroll position immediately before paint
      const container = containerRef.current;
      if (container) {
        const sectionElements = Array.from(container.querySelectorAll('section')) as HTMLElement[];
        if (sectionElements.length > 1) {
          gsap.set(container, { scrollTo: { y: sectionElements[1].offsetTop, autoKill: false } });
          ScrollTrigger.update();
          currentSectionIndex.current = 1;
          setActiveSection('work');
        }
      }
      // Clear the state so it doesn't re-trigger on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (activeSection !== 'hero') {
      setIsChatOpen(false);
    }
  }, [activeSection]);



  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;
      if (Math.abs(e.deltaY) < 20) return; // Ignore small trackpad movements
      
      if (e.deltaY > 0) {
        goToSection(currentSectionIndex.current + 1);
      } else {
        goToSection(currentSectionIndex.current - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;
      
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          goToSection(currentSectionIndex.current + 1);
        } else {
          goToSection(currentSectionIndex.current - 1);
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // --- SCENE SETUP HERO ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- REALISTIC WATER DROP (HERO) ---
    const geometry = new THREE.IcosahedronGeometry(1.5, 128);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
    });

    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);

    // --- CREATE ROUND PARTICLE TEXTURE ---
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const particleContext = particleCanvas.getContext('2d');
    if (particleContext) {
      const gradient = particleContext.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      particleContext.fillStyle = gradient;
      particleContext.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    // --- WORK SECTION PARTICLES ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 25;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.08,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        map: particleTexture,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    // Make particles visible everywhere
    particlesMesh.visible = true; 
    scene.add(particlesMesh);


    // --- INTERACTION ---
    const raycaster = new THREE.Raycaster();
    const clickMouse = new THREE.Vector2();

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Raycast for hover effect
      clickMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      clickMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(clickMouse, camera);
      
      // Only check if we are in the hero section (blob is visible)
      if (currentSectionIndex.current === 0) {
        const intersects = raycaster.intersectObject(blob);
        const target = e.target as HTMLElement;
        const isInteractive = target.closest('button') || target.closest('a');
        
        if (intersects.length > 0 && !isInteractive) {
          document.body.style.cursor = 'pointer';
        } else if (!isInteractive) {
          document.body.style.cursor = 'default';
        }
      } else {
        // Ensure cursor is reset when not in hero section
        const target = e.target as HTMLElement;
        const isInteractive = target.closest('button') || target.closest('a');
        if (!isInteractive) {
          document.body.style.cursor = 'default';
        }
      }
    };

    const handleMouseClick = (e: MouseEvent) => {
      if (currentSectionIndex.current !== 0) return;
      
      clickMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      clickMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(clickMouse, camera);
      
      const intersects = raycaster.intersectObject(blob);
      if (intersects.length > 0) {
        setIsChatOpen(true);
      }
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);
    window.addEventListener('resize', handleResize);

    // --- SCROLL ANIMATION ---
    const ctx = gsap.context(() => {
      // Work section elements animation
      const workElementsTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#work",
          scroller: containerRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse"
        }
      });

      const featuredLabel = containerRef.current?.querySelector('.featured-label');
      const featuredImage = containerRef.current?.querySelector('.featured-image-container');
      const featuredTitle = containerRef.current?.querySelector('.featured-title');

      if (featuredLabel && featuredImage && featuredTitle) {
        workElementsTl
          .fromTo(featuredLabel, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 0.6, duration: 1, ease: "power3.out" }
          )
          .fromTo(featuredImage,
            { y: 100, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
            "-=0.8"
          )
          .fromTo(featuredTitle,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
            "-=0.8"
          );
      }
    }, containerRef);

    // --- ANIMATION ---
    const clock = new THREE.Clock();
    let animationFrameId: number;
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Smooth mouse follow
      mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.04;
      mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.04;

      // Update uniforms
      material.uniforms.uTime.value = elapsedTime;
      material.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);

      // Rotate and move blob
      blob.rotation.y = elapsedTime * 0.3;
      blob.rotation.z = elapsedTime * 0.15;
      blob.position.x = mouse.current.x * 1.2;
      blob.position.y = mouse.current.y * 0.8;
      
      // Rotate particles
      if(particlesMesh.visible) {
          particlesMesh.rotation.y = elapsedTime * 0.05;
          particlesMesh.rotation.x = mouse.current.y * 0.1;
      }
      
      // Aggressive breathing effect
      const scale = 1 + Math.sin(elapsedTime * 1.2) * 0.12;
      if (blob.visible) {
         blob.scale.set(scale, scale, scale);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('resize', handleResize);
      document.body.style.cursor = 'default';
      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      if (particleTexture) particleTexture.dispose();
      renderer.dispose();
      ctx.revert(); // Properly clean up all GSAP animations and ScrollTriggers
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      ref={containerRef} 
      className="fixed inset-0 w-full h-screen bg-black font-sans text-white selection:bg-white/20 overflow-hidden"
    >
      {/* Background Canvas for Hero */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>

      {/* Navigation */}
      <nav 
        className="fixed top-0 left-0 w-full p-4 md:p-10 flex justify-between items-center z-20 mix-blend-difference"
      >
        <div 
          className={`flex items-center gap-1 md:gap-2 cursor-pointer transition-opacity duration-500 ease-in-out ${activeSection === 'hero' ? 'opacity-80' : 'opacity-30'} hover:opacity-100`}
          onClick={() => goToSection(0)}
        >
          <img 
            src="/logo.jpg" 
            alt="文子双汐" 
            className="h-6 md:h-10 w-auto object-contain"
          />
          <div className="flex items-center h-6 md:h-10 ml-1">
            <span className="text-white font-black tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-sm uppercase border-y-[1px] md:border-y-[1.5px] border-white py-[2px] md:py-[3px] leading-none">
              STUDIO
            </span>
          </div>
        </div>
        <div className="flex gap-4 md:gap-8 items-center">
          <div className="flex gap-4 md:gap-12 text-xs md:text-lg font-semibold tracking-[0.1em] uppercase">
            <button 
              onClick={() => goToSection(1)}
              className={`${activeSection === 'work' ? 'opacity-80' : 'opacity-40'} hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer`}
            >
              作品
            </button>
            <button 
              onClick={() => goToSection(2)}
              className={`${activeSection === 'about' ? 'opacity-80' : 'opacity-40'} hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer`}
            >
              关于
            </button>
            <button 
              onClick={() => goToSection(3)}
              className={`${activeSection === 'contact' ? 'opacity-80' : 'opacity-40'} hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer`}
            >
              联系
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 h-screen w-full flex flex-col items-center justify-center py-20">
        <div className="text-center pointer-events-none flex flex-col items-center">
          <h1 className="text-[3.5rem] sm:text-[5rem] md:text-[9rem] lg:text-[12rem] font-xiaowei antialiased tracking-widest leading-none mb-4 text-white/90 ml-[0.075em] drop-shadow-2xl">
            文子双汐
          </h1>
          <div className="text-[10px] sm:text-xs md:text-sm lg:text-base font-en font-light tracking-[0.5em] md:tracking-[1em] uppercase opacity-40 mb-8 ml-[0.5em]">
            Moonlit Twin Tides
          </div>
          <div className="text-sm sm:text-xl md:text-3xl lg:text-4xl font-serif font-light tracking-[0.4em] md:tracking-[0.8em] opacity-50 mt-2 ml-[0.4em]">
            以文载道，汐动未来
          </div>
        </div>
        
        {/* Scroll Hint */}
        <div 
          className="absolute bottom-20 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 cursor-pointer group"
          onClick={() => goToSection(1)}
        >
          <span className="text-[10px] tracking-[0.5em] font-light opacity-40 group-hover:opacity-100 transition-opacity duration-500 ml-[0.25em]">
            向下滑动
          </span>
          <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-white origin-top animate-scroll-line" />
          </div>
        </div>
      </section>

      {/* Work Section - Featured Work */}
      <section id="work" ref={workSectionRef} className="relative z-10 h-screen w-full bg-transparent flex flex-col items-center justify-center overflow-hidden">
        {videosInfo.length > 0 && (
          <div className="relative w-full max-w-6xl px-8 flex flex-row items-center justify-center gap-8 md:gap-16">
            
            {/* Left Label */}
            <div className="featured-label hidden md:flex flex-col items-center justify-center h-full opacity-80">
              <div className="w-[1px] h-12 bg-white/50 mb-6"></div>
              <span style={{ writingMode: 'vertical-rl' }} className="text-base md:text-lg tracking-[0.5em] uppercase font-medium">
                精选作品
              </span>
              <div className="w-[1px] h-12 bg-white/50 mt-6"></div>
            </div>

            {/* Main Card */}
            <div 
              className="featured-work-card relative w-[80vw] md:w-[65vw] lg:w-[55vw] max-w-5xl group cursor-pointer flex flex-col mx-auto"
              onClick={() => {
                setActiveBvid(videosInfo[0].bvid);
                setIsVideoModalOpen(true);
              }}
            >
              {/* Image Container */}
              <div className="featured-image-container w-full aspect-video overflow-hidden bg-black rounded-sm relative shadow-2xl shadow-black/50">
                {videosInfo[0].cover ? (
                  <img 
                    src={videosInfo[0].cover} 
                    alt={videosInfo[0].title}
                    className="w-full h-full object-cover opacity-100 transition-all duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    draggable={false}
                  />
                ) : null}
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20 backdrop-blur-[2px]">
                  <span className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center bg-black/40 text-white backdrop-blur-md transform scale-90 group-hover:scale-100 transition-transform duration-500">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="ml-2">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Title Outside */}
              <div className="featured-title mt-4 md:mt-6 text-left w-full">
                <h3 className="text-base md:text-2xl font-light tracking-wide text-white/90 drop-shadow-sm">{videosInfo[0].title}</h3>
              </div>
            </div>
          </div>
        )}
        
        {/* View More Button (Absolute bottom right) */}
        <div className="absolute bottom-48 md:bottom-12 right-6 md:right-12 z-20">
          <Link to="/works" className="group/btn flex items-center gap-4 text-sm md:text-base font-medium tracking-[0.2em] uppercase opacity-80 hover:opacity-100 transition-opacity duration-300">
            <span>显示更多</span>
            <span className="w-12 h-[1px] bg-white/80 group-hover/btn:w-16 transition-all duration-300"></span>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 h-screen w-full flex flex-col items-center justify-center p-6 md:p-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-2xl w-full text-center">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-8 md:mb-12 opacity-80 italic font-serif">关于工作室</h2>
          <p className="text-base md:text-xl font-light leading-relaxed opacity-60 mb-8">
            我们是一家有点抽象艺术的工作室，欢迎加入我们一起来玩呀！
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 pt-8 md:pt-12 border-t border-white/10">
            <div>
              <div className="text-2xl font-light mb-2">0</div>
              <div className="text-[10px] tracking-[0.2em] uppercase opacity-40">获得奖项</div>
            </div>
            <div>
              <div className="text-2xl font-light mb-2">0</div>
              <div className="text-[10px] tracking-[0.2em] uppercase opacity-40">完成项目</div>
            </div>
            <div>
              <div className="text-2xl font-light mb-2">0</div>
              <div className="text-[10px] tracking-[0.2em] uppercase opacity-40">从业年限</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 h-screen w-full flex flex-col items-center justify-center p-6 md:p-20 border-t border-white/5">
        <div className="max-w-4xl w-full text-center">
          <h2 className="text-4xl md:text-8xl font-light tracking-tighter mb-8 md:mb-12 opacity-90">让我们开始<br/>新的创作</h2>
          <a href="mailto:894204540@qq.com" className="inline-block text-lg md:text-2xl font-light border-b border-white/20 pb-2 hover:border-white transition-colors duration-300 mb-8">
            894204540@qq.com
          </a>
          <div className="flex gap-6 md:gap-8 justify-center mt-4">
            <a href="https://github.com/Wh1tZz" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 cursor-pointer transition-opacity">
              <GithubIcon size={24} />
            </a>
            <a href="https://x.com/xingbugengming?s=11" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 cursor-pointer transition-opacity">
              <TwitterIcon size={24} />
            </a>
            <a href="https://v.douyin.com/Qmtj2c4HbHo/" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 cursor-pointer transition-opacity">
              <TiktokIcon size={24} />
            </a>
            <a href="https://xhslink.com/m/5yvejTmCN4j" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 cursor-pointer transition-opacity">
              <XiaohongshuIcon size={24} />
            </a>
            <div onClick={() => setIsWechatModalOpen(true)} className="opacity-40 hover:opacity-100 cursor-pointer transition-opacity">
              <WeChatIcon size={24} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full p-8 flex justify-center items-center z-20 border-t border-white/5">
        <div className="text-[10px] tracking-[0.3em] uppercase opacity-30">
          © 2026 版权所有
        </div>
      </footer>

      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10"
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white z-[101] transition-colors"
              onClick={() => setIsVideoModalOpen(false)}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
            >
              <iframe 
                src={`//player.bilibili.com/player.html?bvid=${activeBvid}&page=1&high_quality=1&danmaku=0&autoplay=1`}
                className="w-full h-full border-0"
                scrolling="no"
                frameBorder="no"
                allowFullScreen={true}
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WeChat Modal */}
      <AnimatePresence>
        {isWechatModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10"
            onClick={() => setIsWechatModalOpen(false)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white z-[101] transition-colors"
              onClick={() => setIsWechatModalOpen(false)}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="relative w-full max-w-sm aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src="/wechat-qr.jpg.jpg" 
                alt="WeChat QR Code"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="text-black text-center p-8"><p class="text-xl font-bold mb-4">请上传二维码</p><p class="text-sm text-gray-500">请将您的二维码图片重命名为 <b>wechat-qr.jpg.jpg</b> 并上传到 <b>public</b> 文件夹中。</p></div>';
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Window */}
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore - key is valid for React elements but missing in RoutesProps */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/works" element={<WorksPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
