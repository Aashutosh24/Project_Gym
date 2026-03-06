const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load images
const frameCount = 79;
const images = [];
let imagesLoaded = 0;

// Preload all images
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = `Img/hero/${i}.jpg`; // Adjust based on your image naming
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === frameCount) {
      render(0); // Render first frame when all loaded
    }
  };
  images.push(img);
}

// Render specific frame
function render(index) {
  if (images[index] && images[index].complete) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images[index], 0, 0, canvas.width, canvas.height);
  }
}

// Handle scroll
window.addEventListener('scroll', () => {
  const heroSection = document.querySelector('.hero');
  const heroHeight = heroSection.offsetHeight;
  const scrollTop = window.pageYOffset;
  
  // Calculate which frame to show based on scroll position
  const scrollFraction = Math.min(scrollTop / heroHeight, 1);
  const frameIndex = Math.min(
    Math.floor(scrollFraction * frameCount),
    frameCount - 1
  );
  
  requestAnimationFrame(() => render(frameIndex));
  
  // Text animations based on scroll position
  const intro = document.getElementById('intro');
  const moti = document.getElementById('moti');
  const home = document.getElementById('Home');
  
  // Show intro text after 15% scroll
  if (scrollFraction > 0.15) {
    intro.classList.add('active');
  }
  
  // Show moti text after 35% scroll
  if (scrollFraction > 0.35) {
    moti.classList.add('active');
  }
  
  // Show feature box after 60% scroll
  if (scrollFraction > 0.60) {
    home.classList.add('active');
  }
  
  // Fade out text as we approach the end
  if (scrollFraction > 0.85) {
    const fadeOut = (scrollFraction - 0.85) / 0.15;
    intro.style.opacity = 1 - fadeOut;
    moti.style.opacity = 1 - fadeOut;
    home.style.opacity = 1 - fadeOut;
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const scrollTop = window.pageYOffset;
  const heroHeight = document.querySelector('.hero').offsetHeight;
  const scrollFraction = Math.min(scrollTop / heroHeight, 1);
  const frameIndex = Math.min(
    Math.floor(scrollFraction * frameCount),
    frameCount - 1
  );
  render(frameIndex);
});

// Scroll reveal for other sections
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealOnScroll = () => {
  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Check on load