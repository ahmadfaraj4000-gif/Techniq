// Ramadan Hanging Stars - Homepage Only

class RamadanHomeStars {
    constructor() {
        this.starsCount = 12; // Number of hanging stars
        this.container = null;
        this.init();
    }

    init() {
        // Only run on homepage
        if (!document.body.classList.contains('home')) {
            return;
        }

        // Create container for hanging stars
        this.container = document.createElement('div');
        this.container.className = 'ramadan-hanging-stars';
        document.body.insertBefore(this.container, document.body.firstChild);

        // Create hanging stars
        this.createStars();

        // Handle window resize
        window.addEventListener('resize', () => this.repositionStars());
    }

    createStars() {
        const starColors = ['star', 'star-soft', 'star-warm', 'star-gold'];
        
        for (let i = 0; i < this.starsCount; i++) {
            const starContainer = document.createElement('div');
            starContainer.className = 'hanging-star';
            
            // Randomly add bounce class to some stars
            if (Math.random() > 0.7) {
                starContainer.classList.add('bounce');
            }

            // Random position across the top
            const leftPosition = (i / this.starsCount) * 100 + (Math.random() * 10 - 5);
            starContainer.style.left = Math.min(95, Math.max(5, leftPosition)) + '%';

            // Random rope length (between 40px and 100px)
            const ropeLength = 40 + Math.floor(Math.random() * 60);
            starContainer.style.setProperty('--rope-length', ropeLength + 'px');

            // Random star size (between 12px and 24px)
            const starSize = 12 + Math.floor(Math.random() * 12);
            starContainer.style.setProperty('--star-size', starSize + 'px');

            // Random swing duration (between 3s and 7s)
            const swingDuration = 3 + Math.random() * 4;
            starContainer.style.setProperty('--swing-duration', swingDuration + 's');

            // Random animation delay
            const swingDelay = Math.random() * 5;
            starContainer.style.setProperty('--swing-delay', swingDelay + 's');

            // Create rope
            const rope = document.createElement('div');
            rope.className = 'star-rope';

            // Create star
            const star = document.createElement('div');
            const starType = starColors[Math.floor(Math.random() * starColors.length)];
            star.className = `star ${starType}`;

            // Assemble
            starContainer.appendChild(rope);
            starContainer.appendChild(star);
            this.container.appendChild(starContainer);
        }
    }

    addCrescent() {
        const crescent = document.createElement('div');
        crescent.className = 'ramadan-crescent';
        crescent.innerHTML = '☪️';
        crescent.setAttribute('aria-label', 'Ramadan Crescent');
        this.container.appendChild(crescent);
    }

    repositionStars() {
        if (!this.container) return;
        
        const stars = this.container.querySelectorAll('.hanging-star');
        stars.forEach((star, index) => {
            // Reposition slightly on resize to maintain distribution
            const newLeft = (index / stars.length) * 100 + (Math.random() * 10 - 5);
            star.style.left = Math.min(95, Math.max(5, newLeft)) + '%';
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ramadanStars = new RamadanHomeStars();
});