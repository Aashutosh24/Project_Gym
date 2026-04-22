const canvas = document.getElementById('heroCanvas');
let cachedCanvasRect = { width: 0, height: 0 };
let cachedHomeHeight = 0;
const ctx = canvas.getContext('2d', { alpha: false }); 

// Animation state with smooth interpolation
let animationState = {
  images: [],
  imagesLoaded: 0,
  currentFrame: 0,
  targetFrame: 0,
  isReady: false,
  lastScrollTime: 0,
  animationDelay: 300,
  smoothness: 0.10, // Optimized for performance
  lastRenderedFrame: -1
};

// const frameCount = 50;

// Frame mapping
// const frameMap = [];
// for (let i = 0; i <= 47; i++) {
//   frameMap.push(i);
// }
// frameMap.push(57);

// Replace your frameMap block with this:
const frameMap = [];

// Frames 0–30: normal speed
for (let i = 0; i <= 30; i++) {
  frameMap.push(i);
}

// Frames 31–48: 2.5× slower (each frame appears ~2-3 times)
for (let i = 31; i <= 48; i++) {
  frameMap.push(i);
  frameMap.push(i);       // duplicate
  if (i % 3 === 0) frameMap.push(i); // every 3rd gets a triple
}

// Frames 49: normal end
frameMap.push(49);

// IMPORTANT: frameCount must match frameMap length now
const frameCount = frameMap.length; // ~97 entries, 50 unique frames

// Lerp (Linear Interpolation) for smooth frame transitions
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

// Optimized easing functions
const easings = {
  easeOutCubic: t => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutQuart: t => 1 - Math.pow(1 - t, 4),
  easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
};

// Set canvas dimensions with retina support
function setCanvasSize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2); 
  const rect = canvas.getBoundingClientRect();
  
  // Cache the dimensions
  cachedCanvasRect.width = rect.width;
  cachedCanvasRect.height = rect.height;
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  ctx.scale(dpr, dpr);
  
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';

  // Cache home height
  const homeSection = document.getElementById('home');
  if (homeSection) {
    cachedHomeHeight = homeSection.offsetHeight;
  }
}

setCanvasSize();

// Preload images with progress
function preloadImages() {
  console.log('🎬 Loading cinematic sequence...');
  
  let loadedCount = 0;
  
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    const actualFrameNumber = frameMap[i];
    
        img.onload = async () => {
      // Force decode the image so it's ready for the GPU immediately
      if (img.decode) {
        try {
          await img.decode();
        } catch(e) { console.log(e) }
      }
      
      loadedCount++;
      const progress = Math.round((loadedCount / frameCount) * 100);
      
      if (loadedCount === frameCount) {
        console.log('✨ All frames loaded - Animation ready!');
        animationState.isReady = true;
        animationState.imagesLoaded = frameCount;
        animationState.lastScrollTime = Date.now();
        render(0);
        startSmoothAnimation();
      }
    };
    
    img.onerror = () => {
      console.error(`❌ Failed to load: ${actualFrameNumber}.jpg`);
    };
    
    img.src = `Img/hero/${actualFrameNumber}.jpg`;
    animationState.images[i] = img;
  }
}

// Optimized rendering with frame skipping
function render(frameIndex) {
  frameIndex = Math.max(0, Math.min(Math.floor(frameIndex), frameCount - 1));
  
  if (frameIndex === animationState.lastRenderedFrame) return;
  
  const img = animationState.images[frameIndex];
  if (!img || !img.complete || img.naturalWidth === 0) return;
  
  const rect = cachedCanvasRect; 
  
  // REMOVED clearRect, fillRect is enough and much faster
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, rect.width, rect.height);
  
  const canvasAspect = rect.width / rect.height;
  const imgAspect = img.naturalWidth / img.naturalHeight;
  
  let drawWidth, drawHeight, drawX, drawY;
  
  if (canvasAspect > imgAspect) {
    drawWidth = rect.width;
    drawHeight = rect.width / imgAspect;
    drawX = 0;
    drawY = (rect.height - drawHeight) / 2;
  } else {
    drawHeight = rect.height;
    drawWidth = rect.height * imgAspect;
    drawX = (rect.width - drawWidth) / 2;
    drawY = 0;
  }
  
  // | 0 converts decimals to integers for faster rendering
  ctx.drawImage(img, drawX | 0, drawY | 0, drawWidth | 0, drawHeight | 0);
  
  animationState.lastRenderedFrame = frameIndex;
}
// Smooth animation loop with lerp
let animationFrameId = null;

function startSmoothAnimation() {
  function animate() {
    if (!animationState.isReady) return;
    
    // Smoothly interpolate current frame towards target frame
    const diff = Math.abs(animationState.targetFrame - animationState.currentFrame);
    
    // Only animate if difference is significant (optimization)
    if (diff > 0.01) {
      animationState.currentFrame = lerp(
        animationState.currentFrame,
        animationState.targetFrame,
        animationState.smoothness
      );
      
      // Render the interpolated frame
      render(animationState.currentFrame);
    }
    
    // Continue animation loop
    animationFrameId = requestAnimationFrame(animate);
  }
  
  animate();
}

// Handle scroll with smooth calculation
let scrollTimeout;
let lastScrollTop = 0;

function handleScroll() {
  if (!animationState.isReady) return;
  
  clearTimeout(scrollTimeout);
  
  const timeSinceLoad = Date.now() - animationState.lastScrollTime;
  if (timeSinceLoad < animationState.animationDelay) {
    return;
  }
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // USE CACHED HEIGHT HERE
  if (!cachedHomeHeight) return; 
  
  let rawFraction = scrollTop / cachedHomeHeight;
  rawFraction = Math.max(0, Math.min(rawFraction, 1));
  
  const easedFraction = easings.easeOutQuart(rawFraction);
  animationState.targetFrame = easedFraction * (frameCount - 1);
  
  handleTextAnimations(rawFraction, scrollTop);
  handleNavbarVisibility(rawFraction, scrollTop);
  
  lastScrollTop = scrollTop;
  
  scrollTimeout = setTimeout(() => {
    animationState.currentFrame = animationState.targetFrame;
  }, 100);
}

// Navbar visibility control
function handleNavbarVisibility(scrollFraction, scrollPos) {
  const header = document.querySelector('.header');
  if (!header) return;
  
  // Hide navbar during hero section (first 90% of hero)
  if (scrollFraction < 0.90) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
}

// Progressive text animations with stagger - OPTIMIZED
function handleTextAnimations(scrollFraction, scrollPos) {
  const intro = document.getElementById('intro');
  const moti = document.getElementById('moti');
  const home = document.getElementById('Home');
  
  if (!intro || !moti || !home) return;
  
  // No requestAnimationFrame here since handleScroll is already throttled
  
  // Intro text
  if (scrollFraction > 0.15 && scrollPos > 80) {
    const introProgress = Math.min((scrollFraction - 0.15) / 0.15, 1);
    const opacity = easings.easeOutCubic(introProgress);
    intro.style.opacity = opacity;
    intro.style.transform = `translateY(${(1 - opacity) * 30}px)`;
  } else {
    intro.style.opacity = 0;
    intro.style.transform = 'translateY(30px)';
  }
  
  // Moti text
  if (scrollFraction > 0.35 && scrollPos > 80) {
    const motiProgress = Math.min((scrollFraction - 0.35) / 0.15, 1);
    const opacity = easings.easeOutCubic(motiProgress);
    moti.style.opacity = opacity;
    moti.style.transform = `translateY(${(1 - opacity) * 30}px)`;
  } else {
    moti.style.opacity = 0;
    moti.style.transform = 'translateY(30px)';
  }
  
  // Feature box
  if (scrollFraction > 0.60) {
    const homeProgress = Math.min((scrollFraction - 0.60) / 0.15, 1);
    const opacity = easings.easeOutCubic(homeProgress);
    home.style.opacity = opacity;
    home.style.transform = `translate(-50%, ${(1 - opacity) * 20}px)`;
  } else {
    home.style.opacity = 0;
    home.style.transform = 'translate(-50%, 20px)';
  }
  
  // Elegant fade out near end
  if (scrollFraction > 0.88) {
    const fadeOut = Math.min((scrollFraction - 0.88) / 0.08, 1);
    const opacity = Math.max(0, 1 - easings.easeInOutCubic(fadeOut));
    intro.style.opacity = opacity;
    moti.style.opacity = opacity;
    home.style.opacity = opacity;
  }
}

// Throttled scroll listener - OPTIMIZED
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
  }
}, { passive: true });

// Handle resize elegantly
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    setCanvasSize();
    animationState.lastRenderedFrame = -1; // Force re-render
    render(animationState.currentFrame);
  }, 150);
});

// Visibility change handler
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && animationState.isReady) {
    animationState.lastRenderedFrame = -1;
    render(animationState.currentFrame);
  }
});

// Initialize on load
window.addEventListener('load', () => {
  console.log('🚀 Initializing premium experience...');
  animationState.lastScrollTime = Date.now();
  handleScroll();
});

// Start preloading
preloadImages();

// Smooth scroll reveal for sections - OPTIMIZED
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const observedElements = new Set();

// Use Intersection Observer for better performance
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observedElements.add(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px'
});

revealElements.forEach(element => {
  revealObserver.observe(element);
});

// ===== ENHANCED ABOUT SECTION SLIDER =====

const slider = document.getElementById('slider');
const facilContainer = document.querySelector('.facil');
const cards = document.querySelectorAll('.equi-card');
const dots = document.querySelectorAll('.dot');
const leftArrow = document.querySelector('.scroll-arrow.left');
const rightArrow = document.querySelector('.scroll-arrow.right');

if (facilContainer && cards.length > 0) {
  let currentSlide = 0;
  let isAnimating = false;
  const cardWidth = 352; // 320px + 32px gap
  const visibleCards = Math.floor(window.innerWidth / cardWidth);
  const totalSlides = Math.max(cards.length - visibleCards + 1, 1);

  function updateSlider(smooth = true) {
    if (isAnimating && smooth) return;
    isAnimating = true;
    
    const offset = -currentSlide * cardWidth;
    facilContainer.style.transition = smooth ? 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
    facilContainer.style.transform = `translateX(${offset}px)`;
    
    if (dots) {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }
    
    setTimeout(() => {
      isAnimating = false;
    }, smooth ? 700 : 0);
  }

  function scrollSlider(direction) {
    if (isAnimating) return;
    
    currentSlide += direction;
    
    if (currentSlide < 0) {
      currentSlide = 0;
    } else if (currentSlide >= totalSlides) {
      currentSlide = totalSlides - 1;
    }
    
    updateSlider();
  }

  function goToSlide(index) {
    if (isAnimating) return;
    currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
    updateSlider();
  }

  if (leftArrow) {
    leftArrow.addEventListener('click', () => scrollSlider(-1));
  }
  
  if (rightArrow) {
    rightArrow.addEventListener('click', () => scrollSlider(1));
  }

  if (dots) {
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });
  }

  updateSlider(false);

  let sliderResizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(sliderResizeTimeout);
    sliderResizeTimeout = setTimeout(() => {
      updateSlider(false);
    }, 150);
  });
}