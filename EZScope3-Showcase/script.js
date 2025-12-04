/* =========================================
   === EZSCOPE3 MASTER SCRIPT (GSAP + THREE.JS) ===
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INITIALIZE LIBRARIES ---
    initHero3D();
    initScrollAnimations();
    initTiltEffect();
    initChartAnimation();
    
    // --- 2. THREE.JS HERO ANIMATION (The "Data Sphere") ---
    function initHero3D() {
        const canvas = document.querySelector('#hero-canvas');
        if (!canvas) return;

        // Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Create Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1200;
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15; // Spread particles
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        // Material (Blue Glowing Dots)
        const material = new THREE.PointsMaterial({
            size: 0.03,
            color: 0x3b82f6, // Electric Blue
            transparent: true,
            opacity: 0.8,
        });

        // Mesh
        const particlesMesh = new THREE.Points(particlesGeometry, material);
        scene.add(particlesMesh);

        // Connecting Lines (Optional for network effect)
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.05 });
        const linesGeometry = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(6, 2));
        const linesMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
        scene.add(linesMesh);

        // Positioning
        camera.position.z = 4;
        
        // Mouse Interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });

        // Animation Loop
        const clock = new THREE.Clock();

        function animate() {
            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;

            const elapsedTime = clock.getElapsedTime();

            // Rotate entire system
            particlesMesh.rotation.y = .1 * elapsedTime;
            linesMesh.rotation.y = .1 * elapsedTime;
            linesMesh.rotation.x += 0.05 * (targetY - linesMesh.rotation.x);
            linesMesh.rotation.y += 0.05 * (targetX - linesMesh.rotation.y);

            // Gentle Wave Motion
            particlesMesh.rotation.x += 0.001;
            particlesMesh.rotation.y += 0.001;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- 3. GSAP SCROLL ANIMATIONS ---
    function initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Nav Bar Glass Effect on Scroll
        const nav = document.querySelector('.ez-nav');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        });

        // Hero Content Reveal
        const tl = gsap.timeline();
        tl.from('.ez-badge', { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" })
          .from('.ez-title', { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .from('.ez-subtitle', { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .from('.ez-cta-wrapper', { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");

        // Bento Grid Reveal (Staggered)
        gsap.from('.bento-card', {
            scrollTrigger: {
                trigger: '.bento-grid',
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });

        // Section Headers
        gsap.utils.toArray('.ez-section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                },
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        });
    }

    // --- 4. VANILLA TILT (3D Card Effect) ---
    function initTiltEffect() {
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll(".bento-card"), {
                max: 10,           // Max tilt rotation (degrees)
                speed: 400,        // Speed of the enter/exit transition
                glare: true,       // Add glare effect
                "max-glare": 0.1,  // Opacity of glare
                scale: 1.02        // Slight zoom on hover
            });
        }
    }

    // --- 5. DYNAMIC CHART SIMULATION (JS Animation) ---
    function initChartAnimation() {
        const chartContainer = document.getElementById('chart-viz');
        if (!chartContainer) return;

        // Create simple bars
        for (let i = 0; i < 15; i++) {
            const bar = document.createElement('div');
            bar.style.width = '6px';
            bar.style.backgroundColor = '#3b82f6';
            bar.style.borderRadius = '4px';
            bar.style.position = 'absolute';
            bar.style.bottom = '0';
            bar.style.left = `${i * 15 + 10}px`;
            bar.style.height = '10%'; // Initial height
            bar.style.opacity = '0.7';
            bar.style.transition = 'height 0.5s ease';
            chartContainer.appendChild(bar);
        }

        // Animate Bars Randomly to simulate live data
        setInterval(() => {
            const bars = chartContainer.children;
            for (let bar of bars) {
                const randomHeight = Math.floor(Math.random() * 80) + 10;
                bar.style.height = `${randomHeight}%`;
                // Change color based on height for effect
                bar.style.backgroundColor = randomHeight > 60 ? '#34D399' : '#3b82f6'; 
            }
        }, 800);
    }

});
