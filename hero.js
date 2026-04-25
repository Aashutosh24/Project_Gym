// const canvas = document.getElementById('heroCanvas');
// let cachedCanvasRect = { width: 0, height: 0 };
// let cachedHomeHeight = 0;
// const ctx = canvas.getContext('2d', { alpha: false }); 

// // Animation state with smooth interpolation
// let animationState = {
//   images: [],
//   imagesLoaded: 0,
//   currentFrame: 0,
//   targetFrame: 0,
//   isReady: false,
//   lastScrollTime: 0,
//   animationDelay: 300,
//   smoothness: 0.10, // Optimized for performance
//   lastRenderedFrame: -1
// };

// // const frameCount = 50;

// // // Frame mapping
// // const frameMap = [];
// // for (let i = 0; i <= 49; i++) {
// //   frameMap.push(i);
// // }
// // frameMap.push(57);

// // Replace your frameMap block with this:
// const frameMap = [];

// // Frames 0–30: normal speed
// for (let i = 0; i <= 30; i++) {
//   frameMap.push(i);
// }

// // Frames 31–48: 2.5× slower (each frame appears ~2-3 times)
// for (let i = 31; i <= 48; i++) {
//   frameMap.push(i);
//   frameMap.push(i);       // duplicate
//   if (i % 3 === 0) frameMap.push(i); // every 3rd gets a triple
// }

// // Frames 49: normal end
// frameMap.push(49);

// // // IMPORTANT: frameCount must match frameMap length now
// const frameCount = frameMap.length; // ~97 entries, 50 unique frames

// // Lerp (Linear Interpolation) for smooth frame transitions
// function lerp(start, end, factor) {
//   return start + (end - start) * factor;
// }

// // Optimized easing functions
// const easings = {
//   easeOutCubic: t => 1 - Math.pow(1 - t, 3),
//   easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
//   easeOutQuart: t => 1 - Math.pow(1 - t, 4),
//   easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
// };

// // Set canvas dimensions with retina support
// function setCanvasSize() {
//   const dpr = Math.min(window.devicePixelRatio || 1, 2); 
//   const rect = canvas.getBoundingClientRect();
  
//   // Cache the dimensions
//   cachedCanvasRect.width = rect.width;
//   cachedCanvasRect.height = rect.height;
  
//   canvas.width = rect.width * dpr;
//   canvas.height = rect.height * dpr;
  
//   ctx.scale(dpr, dpr);
  
//   canvas.style.width = rect.width + 'px';
//   canvas.style.height = rect.height + 'px';

//   // Cache home height
//   const homeSection = document.getElementById('home');
//   if (homeSection) {
//     cachedHomeHeight = homeSection.offsetHeight;
//   }
// }

// setCanvasSize();

// // Preload images with progress
// function preloadImages() {
//   console.log('🎬 Loading cinematic sequence...');
  
//   let loadedCount = 0;
  
//   for (let i = 0; i < frameCount; i++) {
//     const img = new Image();
//     const actualFrameNumber = frameMap[i];
    
//         img.onload = async () => {
//       // Force decode the image so it's ready for the GPU immediately
//       if (img.decode) {
//         try {
//           await img.decode();
//         } catch(e) { console.log(e) }
//       }
      
//       loadedCount++;
//       const progress = Math.round((loadedCount / frameCount) * 100);
      
//       if (loadedCount === frameCount) {
//         console.log('✨ All frames loaded - Animation ready!');
//         animationState.isReady = true;
//         animationState.imagesLoaded = frameCount;
//         animationState.lastScrollTime = Date.now();
//         render(0);
//         startSmoothAnimation();
//       }
//     };
    
//     img.onerror = () => {
//       console.error(`❌ Failed to load: ${actualFrameNumber}.webp`);
//     };
    
//     img.src = `Img/hero2/${actualFrameNumber}.webp`;
//     animationState.images[i] = img;
//   }
// }

// // Optimized rendering with frame skipping
// function render(frameIndex) {
//   frameIndex = Math.max(0, Math.min(Math.floor(frameIndex), frameCount - 1));
  
//   if (frameIndex === animationState.lastRenderedFrame) return;
  
//   const img = animationState.images[frameIndex];
//   if (!img || !img.complete || img.naturalWidth === 0) return;
  
//   const rect = cachedCanvasRect; 
  
//   // REMOVED clearRect, fillRect is enough and much faster
//   ctx.fillStyle = '#000000';
//   ctx.fillRect(0, 0, rect.width, rect.height);
  
//   const canvasAspect = rect.width / rect.height;
//   const imgAspect = img.naturalWidth / img.naturalHeight;
  
//   let drawWidth, drawHeight, drawX, drawY;
  
//   if (canvasAspect > imgAspect) {
//     drawWidth = rect.width;
//     drawHeight = rect.width / imgAspect;
//     drawX = 0;
//     drawY = (rect.height - drawHeight) / 2;
//   } else {
//     drawHeight = rect.height;
//     drawWidth = rect.height * imgAspect;
//     drawX = (rect.width - drawWidth) / 2;
//     drawY = 0;
//   }
  
//   // | 0 converts decimals to integers for faster rendering
//   ctx.drawImage(img, drawX | 0, drawY | 0, drawWidth | 0, drawHeight | 0);
  
//   animationState.lastRenderedFrame = frameIndex;
// }
// // Smooth animation loop with lerp
// let animationFrameId = null;

// function startSmoothAnimation() {
//   function animate() {
//     if (!animationState.isReady) return;
    
//     // Smoothly interpolate current frame towards target frame
//     const diff = Math.abs(animationState.targetFrame - animationState.currentFrame);
    
//     // Only animate if difference is significant (optimization)
//     if (diff > 0.01) {
//       animationState.currentFrame = lerp(
//         animationState.currentFrame,
//         animationState.targetFrame,
//         animationState.smoothness
//       );
      
//       // Render the interpolated frame
//       render(animationState.currentFrame);
//     }
    
//     // Continue animation loop
//     animationFrameId = requestAnimationFrame(animate);
//   }
  
//   animate();
// }

// // Handle scroll with smooth calculation
// let scrollTimeout;
// let lastScrollTop = 0;

// function handleScroll() {
//   if (!animationState.isReady) return;
  
//   clearTimeout(scrollTimeout);
  
//   const timeSinceLoad = Date.now() - animationState.lastScrollTime;
//   if (timeSinceLoad < animationState.animationDelay) {
//     return;
//   }
  
//   const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
//   // USE CACHED HEIGHT HERE
//   if (!cachedHomeHeight) return; 
  
//   let rawFraction = scrollTop / cachedHomeHeight;
//   rawFraction = Math.max(0, Math.min(rawFraction, 1));
  
//   const easedFraction = easings.easeOutQuart(rawFraction);
//   animationState.targetFrame = easedFraction * (frameCount - 1);
  
//   handleTextAnimations(rawFraction, scrollTop);
//   handleNavbarVisibility(rawFraction, scrollTop);
  
//   lastScrollTop = scrollTop;
  
//   scrollTimeout = setTimeout(() => {
//     animationState.currentFrame = animationState.targetFrame;
//   }, 100);
// }

// // Navbar visibility control
// function handleNavbarVisibility(scrollFraction, scrollPos) {
//   const header = document.querySelector('.header');
//   if (!header) return;
  
//   // Hide navbar during hero section (first 90% of hero)
//   if (scrollFraction < 0.90) {
//     header.classList.add('hidden');
//   } else {
//     header.classList.remove('hidden');
//   }
// }

// // Progressive text animations with stagger - OPTIMIZED
// function handleTextAnimations(scrollFraction, scrollPos) {
//   const intro = document.getElementById('intro');
//   const moti = document.getElementById('moti');
//   const home = document.getElementById('Home');
  
//   if (!intro || !moti || !home) return;
  
//   // No requestAnimationFrame here since handleScroll is already throttled
  
//   // Intro text
//   if (scrollFraction > 0.15 && scrollPos > 80) {
//     const introProgress = Math.min((scrollFraction - 0.15) / 0.15, 1);
//     const opacity = easings.easeOutCubic(introProgress);
//     intro.style.opacity = opacity;
//     intro.style.transform = `translateY(${(1 - opacity) * 30}px)`;
//   } else {
//     intro.style.opacity = 0;
//     intro.style.transform = 'translateY(30px)';
//   }
  
//   // Moti text
//   if (scrollFraction > 0.35 && scrollPos > 80) {
//     const motiProgress = Math.min((scrollFraction - 0.35) / 0.15, 1);
//     const opacity = easings.easeOutCubic(motiProgress);
//     moti.style.opacity = opacity;
//     moti.style.transform = `translateY(${(1 - opacity) * 30}px)`;
//   } else {
//     moti.style.opacity = 0;
//     moti.style.transform = 'translateY(30px)';
//   }
  
//   // Feature box
//   if (scrollFraction > 0.60) {
//     const homeProgress = Math.min((scrollFraction - 0.60) / 0.15, 1);
//     const opacity = easings.easeOutCubic(homeProgress);
//     home.style.opacity = opacity;
//     home.style.transform = `translate(-50%, ${(1 - opacity) * 20}px)`;
//   } else {
//     home.style.opacity = 0;
//     home.style.transform = 'translate(-50%, 20px)';
//   }
  
//   // Elegant fade out near end
//   if (scrollFraction > 0.88) {
//     const fadeOut = Math.min((scrollFraction - 0.88) / 0.08, 1);
//     const opacity = Math.max(0, 1 - easings.easeInOutCubic(fadeOut));
//     intro.style.opacity = opacity;
//     moti.style.opacity = opacity;
//     home.style.opacity = opacity;
//   }
// }

// // Throttled scroll listener - OPTIMIZED
// let ticking = false;

// window.addEventListener('scroll', () => {
//   if (!ticking) {
//     ticking = true;
//     requestAnimationFrame(() => {
//       handleScroll();
//       ticking = false;
//     });
//   }
// }, { passive: true });

// // Handle resize elegantly
// let resizeTimeout;
// window.addEventListener('resize', () => {
//   clearTimeout(resizeTimeout);
//   resizeTimeout = setTimeout(() => {
//     setCanvasSize();
//     animationState.lastRenderedFrame = -1; // Force re-render
//     render(animationState.currentFrame);
//   }, 150);
// });

// // Visibility change handler
// document.addEventListener('visibilitychange', () => {
//   if (!document.hidden && animationState.isReady) {
//     animationState.lastRenderedFrame = -1;
//     render(animationState.currentFrame);
//   }
// });

// // Initialize on load
// window.addEventListener('load', () => {
//   console.log('🚀 Initializing premium experience...');
//   animationState.lastScrollTime = Date.now();
//   handleScroll();
// });

// // Start preloading
// preloadImages();

// // Smooth scroll reveal for sections - OPTIMIZED
// const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
// const observedElements = new Set();

// // Use Intersection Observer for better performance
// const revealObserver = new IntersectionObserver((entries) => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       entry.target.classList.add('active');
//       observedElements.add(entry.target);
//     }
//   });
// }, {
//   threshold: 0.15,
//   rootMargin: '0px 0px -100px 0px'
// });

// revealElements.forEach(element => {
//   revealObserver.observe(element);
// });

// // ===== ENHANCED ABOUT SECTION SLIDER =====

// const slider = document.getElementById('slider');
// const facilContainer = document.querySelector('.facil');
// const cards = document.querySelectorAll('.equi-card');
// const dots = document.querySelectorAll('.dot');
// const leftArrow = document.querySelector('.scroll-arrow.left');
// const rightArrow = document.querySelector('.scroll-arrow.right');

// if (facilContainer && cards.length > 0) {
//   let currentSlide = 0;
//   let isAnimating = false;
//   const cardWidth = 352; // 320px + 32px gap
//   const visibleCards = Math.floor(window.innerWidth / cardWidth);
//   const totalSlides = Math.max(cards.length - visibleCards + 1, 1);

//   function updateSlider(smooth = true) {
//     if (isAnimating && smooth) return;
//     isAnimating = true;
    
//     const offset = -currentSlide * cardWidth;
//     facilContainer.style.transition = smooth ? 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
//     facilContainer.style.transform = `translateX(${offset}px)`;
    
//     if (dots) {
//       dots.forEach((dot, index) => {
//         dot.classList.toggle('active', index === currentSlide);
//       });
//     }
    
//     setTimeout(() => {
//       isAnimating = false;
//     }, smooth ? 700 : 0);
//   }

//   function scrollSlider(direction) {
//     if (isAnimating) return;
    
//     currentSlide += direction;
    
//     if (currentSlide < 0) {
//       currentSlide = 0;
//     } else if (currentSlide >= totalSlides) {
//       currentSlide = totalSlides - 1;
//     }
    
//     updateSlider();
//   }

//   function goToSlide(index) {
//     if (isAnimating) return;
//     currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
//     updateSlider();
//   }

//   if (leftArrow) {
//     leftArrow.addEventListener('click', () => scrollSlider(-1));
//   }
  
//   if (rightArrow) {
//     rightArrow.addEventListener('click', () => scrollSlider(1));
//   }

//   if (dots) {
//     dots.forEach((dot, index) => {
//       dot.addEventListener('click', () => goToSlide(index));
//     });
//   }

//   updateSlider(false);

//   let sliderResizeTimeout;
//   window.addEventListener('resize', () => {
//     clearTimeout(sliderResizeTimeout);
//     sliderResizeTimeout = setTimeout(() => {
//       updateSlider(false);
//     }, 150);
//   });
// }


// const canvas = document.getElementById('heroCanvas');
// let cachedCanvasRect = { width: 0, height: 0 };
// let cachedHomeHeight = 0;
// const ctx = canvas.getContext('2d', { alpha: false }); 

// // Cache for drawing dimensions to avoid calculating every frame
// let drawDims = { x: 0, y: 0, w: 0, h: 0 };

// // State to track DOM updates (Dirty-checking)
// let lastTextState = {
//   introOpacity: -1,
//   motiOpacity: -1,
//   homeOpacity: -1
// };

// let animationState = {
//   images: [], // Now stores ImageBitmaps (GPU ready)
//   imagesLoaded: 0,
//   currentFrame: 0,
//   targetFrame: 0,
//   isReady: false,
//   lastScrollTime: 0,
//   animationDelay: 300,
//   smoothness: 0.10, 
//   lastRenderedFrame: -1
// };

// const frameMap = [];
// for (let i = 0; i <= 30; i++) frameMap.push(i);
// for (let i = 31; i <= 48; i++) {
//   frameMap.push(i);
//   frameMap.push(i);
//   if (i % 3 === 0) frameMap.push(i);
// }
// frameMap.push(49);
// const frameCount = frameMap.length;

// function lerp(start, end, factor) {
//   return start + (end - start) * factor;
// }

// const easings = {
//   easeOutCubic: t => 1 - Math.pow(1 - t, 3),
//   easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
//   easeOutQuart: t => 1 - Math.pow(1 - t, 4),
//   easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
// };

// function updateDrawDimensions(img) {
//   const canvasAspect = cachedCanvasRect.width / cachedCanvasRect.height;
//   const imgAspect = img.width / img.height;
  
//   if (canvasAspect > imgAspect) {
//     drawDims.w = cachedCanvasRect.width;
//     drawDims.h = cachedCanvasRect.width / imgAspect;
//     drawDims.x = 0;
//     drawDims.y = (cachedCanvasRect.height - drawDims.h) / 2;
//   } else {
//     drawDims.h = cachedCanvasRect.height;
//     drawDims.w = cachedCanvasRect.height * imgAspect;
//     drawDims.x = (cachedCanvasRect.width - drawDims.w) / 2;
//     drawDims.y = 0;
//   }
// }

// function setCanvasSize() {
//   const dpr = Math.min(window.devicePixelRatio || 1, 2); 
//   const rect = canvas.getBoundingClientRect();
  
//   cachedCanvasRect.width = rect.width;
//   cachedCanvasRect.height = rect.height;
  
//   canvas.width = rect.width * dpr;
//   canvas.height = rect.height * dpr;
//   ctx.scale(dpr, dpr);
  
//   canvas.style.width = rect.width + 'px';
//   canvas.style.height = rect.height + 'px';

//   const homeSection = document.getElementById('home');
//   if (homeSection) {
//     cachedHomeHeight = homeSection.offsetHeight;
//   }
// }

// // Preload images using ImageBitmap for maximum GPU performance
// async function preloadImages() {
//   console.log('🎬 Loading cinematic sequence...');
  
//   const loadPromises = [];
  
//   for (let i = 0; i < frameCount; i++) {
//     const actualFrameNumber = frameMap[i];
//     const imgUrl = `Img/hero2/${actualFrameNumber}.webp`;
    
//     const promise = fetch(imgUrl)
//       .then(res => res.blob())
//       .then(blob => createImageBitmap(blob)) // Decodes off-main-thread
//       .then(bitmap => {
//         animationState.images[i] = bitmap;
//         animationState.imagesLoaded++;
//         return bitmap;
//       })
//       .catch(e => console.error(`❌ Failed: ${imgUrl}`, e));
    
//     loadPromises.push(promise);
//   }
  
//   await Promise.all(loadPromises);
  
//   console.log('✨ All frames GPU-ready!');
//   animationState.isReady = true;
  
//   // Calculate dimensions once using the first bitmap
//   if (animationState.images[0]) {
//     updateDrawDimensions(animationState.images[0]);
//   }
  
//   render(0);
//   startSmoothAnimation();
// }

// function render(frameIndex) {
//   frameIndex = Math.max(0, Math.min(Math.floor(frameIndex), frameCount - 1));
//   if (frameIndex === animationState.lastRenderedFrame) return;
  
//   const img = animationState.images[frameIndex];
//   if (!img) return;
  
//   ctx.fillStyle = '#000000';
//   ctx.fillRect(0, 0, cachedCanvasRect.width, cachedCanvasRect.height);
  
//   // Using cached drawDims instead of calculating every frame
//   ctx.drawImage(img, drawDims.x | 0, drawDims.y | 0, drawDims.w | 0, drawDims.h | 0);
  
//   animationState.lastRenderedFrame = frameIndex;
// }

// function startSmoothAnimation() {
//   function animate() {
//     if (!animationState.isReady) return;
    
//     const diff = Math.abs(animationState.targetFrame - animationState.currentFrame);
//     if (diff > 0.01) {
//       animationState.currentFrame = lerp(
//         animationState.currentFrame,
//         animationState.targetFrame,
//         animationState.smoothness
//       );
//       render(animationState.currentFrame);
//     }
//     requestAnimationFrame(animate);
//   }
//   animate();
// }

// function handleScroll() {
//   if (!animationState.isReady) return;
  
//   const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//   if (!cachedHomeHeight) return; 
  
//   let rawFraction = Math.max(0, Math.min(scrollTop / cachedHomeHeight, 1));
//   const easedFraction = easings.easeOutQuart(rawFraction);
//   animationState.targetFrame = easedFraction * (frameCount - 1);
  
//   handleTextAnimations(rawFraction, scrollTop);
//   handleNavbarVisibility(rawFraction, scrollTop);
// }

// function handleNavbarVisibility(scrollFraction, scrollPos) {
//   const header = document.querySelector('.header');
//   if (!header) return;
//   if (scrollFraction < 0.90) {
//     header.classList.add('hidden');
//   } else {
//     header.classList.remove('hidden');
//   }
// }

// function handleTextAnimations(scrollFraction, scrollPos) {
//   const intro = document.getElementById('intro');
//   const moti = document.getElementById('moti');
//   const home = document.getElementById('Home');
//   if (!intro || !moti || !home) return;
  
//   // Calculate Intros
//   let introOpacity = 0;
//   let introY = 30;
//   if (scrollFraction > 0.15 && scrollPos > 80) {
//     const progress = Math.min((scrollFraction - 0.15) / 0.15, 1);
//     introOpacity = easings.easeOutCubic(progress);
//     introY = (1 - introOpacity) * 30;
//   }

//   // Calculate Moti
//   let motiOpacity = 0;
//   let motiY = 30;
//   if (scrollFraction > 0.35 && scrollPos > 80) {
//     const progress = Math.min((scrollFraction - 0.35) / 0.15, 1);
//     motiOpacity = easings.easeOutCubic(progress);
//     motiY = (1 - motiOpacity) * 30;
//   }

//   // Calculate Home
//   let homeOpacity = 0;
//   let homeY = 20;
//   if (scrollFraction > 0.60) {
//     const progress = Math.min((scrollFraction - 0.60) / 0.15, 1);
//     homeOpacity = easings.easeOutCubic(progress);
//     homeY = (1 - homeOpacity) * 20;
//   }

//   // Global Fade Out
//   if (scrollFraction > 0.88) {
//     const fadeOut = Math.min((scrollFraction - 0.88) / 0.08, 1);
//     const globalOpacity = Math.max(0, 1 - easings.easeInOutCubic(fadeOut));
//     introOpacity = Math.min(introOpacity, globalOpacity);
//     motiOpacity = Math.min(motiOpacity, globalOpacity);
//     homeOpacity = Math.min(homeOpacity, globalOpacity);
//   }

//   // --- DIRTY CHECKING: Only update DOM if value changed significantly ---
//   if (Math.abs(lastTextState.introOpacity - introOpacity) > 0.005) {
//     intro.style.opacity = introOpacity;
//     intro.style.transform = `translateY(${introY}px)`;
//     lastTextState.introOpacity = introOpacity;
//   }

//   if (Math.abs(lastTextState.motiOpacity - motiOpacity) > 0.005) {
//     moti.style.opacity = motiOpacity;
//     moti.style.transform = `translateY(${motiY}px)`;
//     lastTextState.motiOpacity = motiOpacity;
//   }

//   if (Math.abs(lastTextState.homeOpacity - homeOpacity) > 0.005) {
//     home.style.opacity = homeOpacity;
//     home.style.transform = `translate(-50%, ${homeY}px)`;
//     lastTextState.homeOpacity = homeOpacity;
//   }
// }

// // Throttled scroll listener
// window.addEventListener('scroll', () => {
//   requestAnimationFrame(handleScroll);
// }, { passive: true });

// window.addEventListener('resize', () => {
//   setCanvasSize();
//   if (animationState.images[0]) updateDrawDimensions(animationState.images[0]);
//   animationState.lastRenderedFrame = -1;
//   render(animationState.currentFrame);
// });

// document.addEventListener('visibilitychange', () => {
//   if (!document.hidden && animationState.isReady) {
//     animationState.lastRenderedFrame = -1;
//     render(animationState.currentFrame);
//   }
// });

// window.addEventListener('load', () => {
//   animationState.lastScrollTime = Date.now();
//   handleScroll();
// });

// setCanvasSize();
// preloadImages();

// // --- Reveal Elements Observer ---
// const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
// const revealObserver = new IntersectionObserver((entries) => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       entry.target.classList.add('active');
//     }
//   });
// }, { threshold: 0.15, rootMargin: '0px 0px -100px 0px' });

// revealElements.forEach(element => revealObserver.observe(element));

// // --- About Slider ---
// const facilContainer = document.querySelector('.facil');
// const cards = document.querySelectorAll('.equi-card');
// const dots = document.querySelectorAll('.dot');
// const leftArrow = document.querySelector('.scroll-arrow.left');
// const rightArrow = document.querySelector('.scroll-arrow.right');

// if (facilContainer && cards.length > 0) {
//   let currentSlide = 0;
//   let isAnimating = false;
//   const cardWidth = 352; 
//   const visibleCards = Math.floor(window.innerWidth / cardWidth);
//   const totalSlides = Math.max(cards.length - visibleCards + 1, 1);

//   function updateSlider(smooth = true) {
//     if (isAnimating && smooth) return;
//     isAnimating = true;
//     const offset = -currentSlide * cardWidth;
//     facilContainer.style.transition = smooth ? 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
//     facilContainer.style.transform = `translateX(${offset}px)`;
//     if (dots) {
//       dots.forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));
//     }
//     setTimeout(() => { isAnimating = false; }, smooth ? 700 : 0);
//   }

//   function scrollSlider(direction) {
//     if (isAnimating) return;
//     currentSlide += direction;
//     if (currentSlide < 0) currentSlide = 0;
//     else if (currentSlide >= totalSlides) currentSlide = totalSlides - 1;
//     updateSlider();
//   }

//   if (leftArrow) leftArrow.addEventListener('click', () => scrollSlider(-1));
//   if (rightArrow) rightArrow.addEventListener('click', () => scrollSlider(1));
//   if (dots) {
//     dots.forEach((dot, index) => {
//       dot.addEventListener('click', () => {
//         currentSlide = index;
//         updateSlider();
//       });
//     });
//   }
//   updateSlider(false);
// }
// ===============================
// HERO SEQUENCE - OPTIMIZED
// ===============================
(() => {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });

  // ---------- Cached layout ----------
  let cachedCanvasRect = { width: 1, height: 1 };
  let cachedHomeHeight = 1;
  let dpr = 1;

  // ---------- Animation state ----------
  const animationState = {
    images: [],
    imagesLoaded: 0,
    currentFrame: 0,
    targetFrame: 0,
    isReady: false,
    lastRenderedFrame: -1,
    smoothness: 0.22, // higher = tighter scroll sync, less laggy feel
  };

  // ---------- Frame mapping ----------
  // Keep your cinematic pacing map (0..49 with weighted repeats)
  const frameMap = [];
  for (let i = 0; i <= 30; i++) frameMap.push(i);
  for (let i = 31; i <= 48; i++) {
    frameMap.push(i);
    frameMap.push(i);
    if (i % 3 === 0) frameMap.push(i);
  }
  frameMap.push(49);

  const frameCount = frameMap.length;

  // ---------- Easing ----------
  const easings = {
    easeOutCubic: t => 1 - Math.pow(1 - t, 3),
    easeInOutCubic: t => (t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2),
    easeOutQuart: t => 1 - Math.pow(1 - t, 4)
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  // ---------- Draw cache per frame ----------
  const drawCache = new Map(); // key: frameIndex -> {x,y,w,h}

  function computeDrawDimsForFrame(img) {
    const cw = cachedCanvasRect.width;
    const ch = cachedCanvasRect.height;

    const canvasAspect = cw / ch;
    const imgAspect = img.naturalWidth / img.naturalHeight;

    let w, h, x, y;
    if (canvasAspect > imgAspect) {
      w = cw;
      h = cw / imgAspect;
      x = 0;
      y = (ch - h) / 2;
    } else {
      h = ch;
      w = ch * imgAspect;
      x = (cw - w) / 2;
      y = 0;
    }

    return {
      x: x | 0,
      y: y | 0,
      w: w | 0,
      h: h | 0
    };
  }

  // ---------- Canvas sizing ----------
  function setCanvasSize() {
    const rect = canvas.getBoundingClientRect();

    cachedCanvasRect.width = Math.max(1, Math.round(rect.width));
    cachedCanvasRect.height = Math.max(1, Math.round(rect.height));

    dpr = Math.min(window.devicePixelRatio || 1, 1.5); // capped for performance

    canvas.width = Math.round(cachedCanvasRect.width * dpr);
    canvas.height = Math.round(cachedCanvasRect.height * dpr);

    canvas.style.width = `${cachedCanvasRect.width}px`;
    canvas.style.height = `${cachedCanvasRect.height}px`;

    // IMPORTANT: reset transform each resize (avoid cumulative scale bug)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const homeSection = document.getElementById('home');
    if (homeSection) {
      cachedHomeHeight = Math.max(1, homeSection.offsetHeight);
    }

    drawCache.clear();
    animationState.lastRenderedFrame = -1;
  }

  // ---------- Progressive image preload ----------
  async function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async function preloadImagesProgressive() {
    console.log('🎬 Loading hero sequence...');

    // 1) Load first chunk quickly so animation can start ASAP
    const firstChunk = Math.min(12, frameCount);

    for (let i = 0; i < firstChunk; i++) {
      const actualFrame = frameMap[i];
      try {
        const img = await loadImage(`Img/hero2/${actualFrame}.webp`);
        animationState.images[i] = img;
        animationState.imagesLoaded++;
      } catch (e) {
        console.error(`❌ Failed to load Img/hero2/${actualFrame}.webp`, e);
      }
    }

    if (animationState.images[0]) {
      animationState.isReady = true;
      render(0);
      startSmoothAnimation();
      console.log('✨ Initial hero frames ready');
    }

    // 2) Load the rest in background
    const restPromises = [];
    for (let i = firstChunk; i < frameCount; i++) {
      const actualFrame = frameMap[i];
      const p = loadImage(`Img/hero2/${actualFrame}.webp`)
        .then(img => {
          animationState.images[i] = img;
          animationState.imagesLoaded++;
        })
        .catch(e => {
          console.error(`❌ Failed to load Img/hero2/${actualFrame}.webp`, e);
        });
      restPromises.push(p);
    }

    await Promise.all(restPromises);
    console.log('✅ All hero frames loaded');
  }

  // ---------- Render ----------
  function render(frameIndex) {
    frameIndex = clamp(Math.floor(frameIndex), 0, frameCount - 1);

    if (frameIndex === animationState.lastRenderedFrame) return;

    const img = animationState.images[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    let dims = drawCache.get(frameIndex);
    if (!dims) {
      dims = computeDrawDimsForFrame(img);
      drawCache.set(frameIndex, dims);
    }

    // Opaque clear (faster path than clearRect with alpha canvas)
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cachedCanvasRect.width, cachedCanvasRect.height);

    ctx.drawImage(img, dims.x, dims.y, dims.w, dims.h);
    animationState.lastRenderedFrame = frameIndex;
  }

  // ---------- Smooth animation loop ----------
  let rafId = null;

  function startSmoothAnimation() {
    if (rafId) cancelAnimationFrame(rafId);

    function animate() {
      if (!animationState.isReady) return;

      const diff = Math.abs(animationState.targetFrame - animationState.currentFrame);
      if (diff > 0.01) {
        animationState.currentFrame = lerp(
          animationState.currentFrame,
          animationState.targetFrame,
          animationState.smoothness
        );
        render(animationState.currentFrame);
      }

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
  }

  // ---------- UI text/nav updates ----------
  let lastTextState = {
    introOpacity: -1,
    motiOpacity: -1,
    homeOpacity: -1
  };

  function handleNavbarVisibility(scrollFraction) {
    const header = document.querySelector('.header');
    if (!header) return;
    header.classList.toggle('hidden', scrollFraction < 0.9);
  }

  // Promote text elements to their own compositor layers once
  function initTextLayers() {
    const intro = document.getElementById('intro');
    const moti = document.getElementById('moti');
    const home = document.getElementById('Home');
    if (intro) { intro.style.willChange = 'opacity, transform'; intro.style.transform = 'translate3d(0,30px,0)'; intro.style.opacity = 0; }
    if (moti)  { moti.style.willChange  = 'opacity, transform'; moti.style.transform  = 'translate3d(0,30px,0)'; moti.style.opacity  = 0; }
    if (home)  { home.style.willChange  = 'opacity, transform'; home.style.transform  = 'translate3d(-50%,20px,0)'; home.style.opacity = 0; }
  }

  function handleTextAnimations(scrollFraction, scrollPos) {
    const intro = document.getElementById('intro');
    const moti = document.getElementById('moti');
    const home = document.getElementById('Home');
    if (!intro || !moti || !home) return;

    let introOpacity = 0, introY = 30;
    if (scrollFraction > 0.15 && scrollPos > 80) {
      const p = Math.min((scrollFraction - 0.15) / 0.15, 1);
      introOpacity = easings.easeOutCubic(p);
      introY = (1 - introOpacity) * 30;
    }

    let motiOpacity = 0, motiY = 30;
    if (scrollFraction > 0.35 && scrollPos > 80) {
      const p = Math.min((scrollFraction - 0.35) / 0.15, 1);
      motiOpacity = easings.easeOutCubic(p);
      motiY = (1 - motiOpacity) * 30;
    }

    let homeOpacity = 0, homeY = 20;
    if (scrollFraction > 0.60) {
      const p = Math.min((scrollFraction - 0.60) / 0.15, 1);
      homeOpacity = easings.easeOutCubic(p);
      homeY = (1 - homeOpacity) * 20;
    }

    if (scrollFraction > 0.88) {
      const fadeOut = Math.min((scrollFraction - 0.88) / 0.08, 1);
      const globalOpacity = Math.max(0, 1 - easings.easeInOutCubic(fadeOut));
      introOpacity = Math.min(introOpacity, globalOpacity);
      motiOpacity = Math.min(motiOpacity, globalOpacity);
      homeOpacity = Math.min(homeOpacity, globalOpacity);
    }

    if (Math.abs(lastTextState.introOpacity - introOpacity) > 0.005) {
      intro.style.opacity = introOpacity;
      intro.style.transform = `translate3d(0,${introY}px,0)`;
      lastTextState.introOpacity = introOpacity;
    }

    if (Math.abs(lastTextState.motiOpacity - motiOpacity) > 0.005) {
      moti.style.opacity = motiOpacity;
      moti.style.transform = `translate3d(0,${motiY}px,0)`;
      lastTextState.motiOpacity = motiOpacity;
    }

    if (Math.abs(lastTextState.homeOpacity - homeOpacity) > 0.005) {
      home.style.opacity = homeOpacity;
      home.style.transform = `translate3d(-50%,${homeY}px,0)`;
      lastTextState.homeOpacity = homeOpacity;
    }
  }

  // ---------- Scroll handling ----------
  function handleScroll() {
    if (!animationState.isReady) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (!cachedHomeHeight) return;

    const rawFraction = clamp(scrollTop / cachedHomeHeight, 0, 1);
    const easedFraction = easings.easeOutQuart(rawFraction);

    animationState.targetFrame = easedFraction * (frameCount - 1);

    handleTextAnimations(rawFraction, scrollTop);
    handleNavbarVisibility(rawFraction);
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      handleScroll();
      scrollTicking = false;
    });
  }, { passive: true });

  // ---------- Resize / visibility ----------
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setCanvasSize();
      render(animationState.currentFrame);
    }, 120);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && animationState.isReady) {
      animationState.lastRenderedFrame = -1;
      render(animationState.currentFrame);
    }
  });

  // ---------- Init ----------
  window.addEventListener('load', () => {
    setCanvasSize();
    initTextLayers();
    preloadImagesProgressive();
    handleScroll();
  });

  // ===============================
  // Reveal Elements Observer
  // ===============================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -100px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===============================
  // ABOUT SECTION SLIDER
  // ===============================
  const facilContainer = document.querySelector('.facil');
  const cards = document.querySelectorAll('.equi-card');
  const dots = document.querySelectorAll('.dot');
  const leftArrow = document.querySelector('.scroll-arrow.left');
  const rightArrow = document.querySelector('.scroll-arrow.right');

  if (facilContainer && cards.length > 0) {
    let currentSlide = 0;
    let isAnimating = false;
    const cardWidth = 352;

    function getVisibleCards() {
      return Math.max(1, Math.floor(window.innerWidth / cardWidth));
    }

    function getTotalSlides() {
      return Math.max(cards.length - getVisibleCards() + 1, 1);
    }

    function updateSlider(smooth = true) {
      if (isAnimating && smooth) return;
      isAnimating = true;

      const totalSlides = getTotalSlides();
      currentSlide = clamp(currentSlide, 0, totalSlides - 1);

      const offset = -currentSlide * cardWidth;
      facilContainer.style.transition = smooth
        ? 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        : 'none';
      facilContainer.style.transform = `translateX(${offset}px)`;

      if (dots && dots.length) {
        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentSlide);
        });
      }

      setTimeout(() => { isAnimating = false; }, smooth ? 700 : 0);
    }

    function scrollSlider(direction) {
      if (isAnimating) return;
      currentSlide += direction;
      updateSlider(true);
    }

    if (leftArrow) leftArrow.addEventListener('click', () => scrollSlider(-1));
    if (rightArrow) rightArrow.addEventListener('click', () => scrollSlider(1));

    if (dots && dots.length) {
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          currentSlide = index;
          updateSlider(true);
        });
      });
    }

    updateSlider(false);

    let sliderResizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(sliderResizeTimer);
      sliderResizeTimer = setTimeout(() => updateSlider(false), 120);
    }, { passive: true });
  }
})();