document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // 1. HERO SECTION (THREE.JS)
    // ===================================
    (() => {
        if (typeof THREE === 'undefined') {
            console.warn("Three.js not loaded.");
            return;
        }
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        const container = document.getElementById('canvas-container-v4');
        if (!container) return;

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.IcosahedronGeometry(1.6, 5);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff, metalness: 0.6, roughness: 0.3, wireframe: true, transparent: true, opacity: 0.25
        });
        const orb = new THREE.Mesh(geometry, material);
        scene.add(orb);

        const coreGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xF58220 });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        scene.add(core);

        const pointLight = new THREE.PointLight(0xF58220, 3, 12);
        pointLight.position.set(0, 0, 0);
        scene.add(pointLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);
        camera.position.z = 5;

        const mouse = { x: 0, y: 0 };
        document.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }, false);

        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            orb.rotation.y = elapsedTime * 0.1;
            orb.rotation.x = elapsedTime * 0.05;
            const pulse = Math.sin(elapsedTime * 1.2) * 0.15 + 0.9;
            core.scale.set(pulse, pulse, pulse);
            pointLight.intensity = pulse * 3;
            camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04;
            camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.04;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        }
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        animate();
    })();

    // ===================================
    // 2. HEADER & MOBILE MENU
    // ===================================
    const header = document.getElementById('bff-aurora-header');
    const nav = document.getElementById('bff-main-nav');
    const menuToggle = document.getElementById('bff-menu-toggle');
    const navLinks = document.querySelectorAll('.bff-nav-link');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            nav.classList.toggle('open');
        });
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                nav.classList.remove('open');
            });
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // ===================================
    // 3. ACCORDION
    // ===================================
    const accordionItems = document.querySelectorAll('.bff-accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.bff-accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            accordionItems.forEach(other => {
                other.classList.remove('active');
                other.querySelector('.bff-accordion-content').style.maxHeight = null;
                other.querySelector('.bff-accordion-icon').textContent = '+';
            });
            if (!isActive) {
                item.classList.add('active');
                const content = item.querySelector('.bff-accordion-content');
                content.style.maxHeight = content.scrollHeight + "px";
                item.querySelector('.bff-accordion-icon').textContent = '−';
            }
        });
    });

    // ===================================
    // 4. LIGHTBOX
    // ===================================
    const galleryItems = document.querySelectorAll('.gallery-item-v2');
    const lightbox = document.getElementById('bff-lightbox-v2');
    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = document.getElementById('lightbox-v2-img');
        const lightboxTitle = document.getElementById('lightbox-v2-title');
        const closeBtn = document.getElementById('lightbox-v2-close');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                lightbox.classList.add('active');
                lightboxImg.src = item.getAttribute('data-src');
                lightboxTitle.textContent = item.getAttribute('data-title');
            });
        });

        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.remove('active');
        });
    }

    // ===================================
    // 5. VANILLA TILT INIT
    // ===================================
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 15, speed: 400, glare: true, "max-glare": 0.2
        });
    }

});
