// ShoreSquad JavaScript - Interactive Features & App Logic

class ShoreSquadApp {
    constructor() {
        this.currentLocation = null;
        this.map = null;
        this.weatherData = null;
        this.crewData = [];
        this.events = [];

        this.init();
    }

    // Initialize the application
    async init() {
        console.log('🌊 ShoreSquad initializing...');

        // DOM Content Loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }

    // Setup main application features
    async setupApp() {
        this.setupNavigation();
        this.setupEventListeners();
        this.requestLocation();
        this.initializeMap();
        await this.loadWeatherData();
        this.loadEvents();
        this.setupScrollAnimations();

        console.log('✅ ShoreSquad ready!');
    }

    // Navigation functionality
    setupNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }

                // Close mobile menu after clicking
                if (navMenu.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(248, 251, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(248, 251, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // Setup event listeners for interactive elements
    setupEventListeners() {
        // Hero buttons
        const findCleanupBtn = document.getElementById('findCleanupBtn');
        const createEventBtn = document.getElementById('createEventBtn');

        if (findCleanupBtn) {
            findCleanupBtn.addEventListener('click', () => this.findNearbyCleanups());
        }

        if (createEventBtn) {
            createEventBtn.addEventListener('click', () => this.createNewEvent());
        }

        // Map controls
        const locateBtn = document.getElementById('locateBtn');
        const filterBtn = document.getElementById('filterBtn');

        if (locateBtn) {
            locateBtn.addEventListener('click', () => this.locateUser());
        }

        if (filterBtn) {
            filterBtn.addEventListener('click', () => this.filterEvents());
        }

        // Crew actions
        const inviteCrewBtn = document.getElementById('inviteCrewBtn');
        const shareProgressBtn = document.getElementById('shareProgressBtn');

        if (inviteCrewBtn) {
            inviteCrewBtn.addEventListener('click', () => this.inviteCrew());
        }

        if (shareProgressBtn) {
            shareProgressBtn.addEventListener('click', () => this.shareProgress());
        }

        // Event join buttons
        const joinButtons = document.querySelectorAll('.btn-join');
        joinButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.joinEvent(e.target));
        });
    }

    // Geolocation functionality
    requestLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log('📍 Location obtained:', this.currentLocation);
                    this.updateLocationDisplay();
                },
                (error) => {
                    console.warn('Location access denied:', error);
                    this.handleLocationError(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        } else {
            console.warn('Geolocation not supported');
            this.handleLocationError(new Error('Geolocation not supported'));
        }
    }

    // Handle location errors gracefully
    handleLocationError(error) {
        const locationElement = document.getElementById('currentLocation');
        if (locationElement) {
            locationElement.textContent = 'Location access needed for better experience';
        }

        // Use default location (Sydney) for demo
        this.currentLocation = { lat: -33.8688, lng: 151.2093 };
    }

    // Initialize interactive map
    initializeMap() {
        const mapElement = document.getElementById('map-view');
        if (!mapElement || typeof L === 'undefined') return;

        // Default to Sydney coordinates
        const defaultLat = this.currentLocation?.lat || -33.8688;
        const defaultLng = this.currentLocation?.lng || 151.2093;

        // Initialize Leaflet map
        this.map = L.map('map-view', {
            zoomControl: true,
            scrollWheelZoom: true
        }).setView([defaultLat, defaultLng], 12);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);

        // Add sample cleanup locations
        this.addCleanupMarkers();

        // Update map content display
        mapElement.innerHTML = '';
        mapElement.style.background = 'none';
    }

    // Add cleanup location markers to map
    addCleanupMarkers() {
        if (!this.map) return;

        const cleanupLocations = [
            { lat: -33.8915, lng: 151.2767, name: 'Bondi Beach', participants: 23, date: 'Jun 15' },
            { lat: -33.7969, lng: 151.2840, name: 'Manly Beach', participants: 18, date: 'Jun 22' },
            { lat: -33.8568, lng: 151.2153, name: 'Circular Quay', participants: 15, date: 'Jun 29' },
            { lat: -33.9185, lng: 151.2543, name: 'Coogee Beach', participants: 12, date: 'Jul 6' }
        ];

        cleanupLocations.forEach(location => {
            const marker = L.marker([location.lat, location.lng]).addTo(this.map);

            marker.bindPopup(`
                <div class="popup-content">
                    <h4>${location.name}</h4>
                    <p>📅 ${location.date}</p>
                    <p>👥 ${location.participants} participants</p>
                    <button class="btn btn-small btn-join" onclick="shoreSquad.joinEventFromMap('${location.name}')">
                        Join Cleanup
                    </button>
                </div>
            `);
        });
    }

    // Weather functionality
    async loadWeatherData() {
        try {
            // Simulate weather API call (replace with real API)
            await this.simulateWeatherData();
            this.updateWeatherDisplay();
        } catch (error) {
            console.error('Weather data error:', error);
            this.handleWeatherError();
        }
    }

    // Simulate weather data (replace with real API integration)
    async simulateWeatherData() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.weatherData = {
            current: {
                temp: 22,
                condition: 'sunny',
                description: 'Perfect for cleanup!',
                icon: '☀️',
                location: 'Sydney, NSW'
            },
            forecast: [
                { day: 'Today', icon: '☀️', high: 22, low: 18, condition: 'sunny' },
                { day: 'Tomorrow', icon: '⛅', high: 20, low: 16, condition: 'partly-cloudy' },
                { day: 'Wednesday', icon: '🌧️', high: 18, low: 14, condition: 'rainy' },
                { day: 'Thursday', icon: '☀️', high: 24, low: 19, condition: 'sunny' },
                { day: 'Friday', icon: '⛅', high: 21, low: 17, condition: 'partly-cloudy' }
            ]
        };
    }

    // Update weather display elements
    updateWeatherDisplay() {
        if (!this.weatherData) return;

        const { current, forecast } = this.weatherData;

        // Update weather preview in hero
        const weatherPreview = document.getElementById('weatherPreview');
        if (weatherPreview) {
            const iconEl = weatherPreview.querySelector('.weather-icon');
            const tempEl = weatherPreview.querySelector('.weather-temp');
            const descEl = weatherPreview.querySelector('.weather-desc');

            if (iconEl) iconEl.textContent = current.icon;
            if (tempEl) tempEl.textContent = `${current.temp}°C`;
            if (descEl) descEl.textContent = current.description;
        }

        // Update current weather section
        const currentTemp = document.getElementById('currentTemp');
        const currentDesc = document.getElementById('currentDesc');
        const currentLocation = document.getElementById('currentLocation');
        const currentIcon = document.getElementById('currentWeatherIcon');

        if (currentTemp) currentTemp.textContent = `${current.temp}°C`;
        if (currentDesc) currentDesc.textContent = current.description;
        if (currentLocation) currentLocation.textContent = current.location;
        if (currentIcon) currentIcon.textContent = current.icon;

        // Update forecast
        this.updateForecastDisplay(forecast);
    }

    // Update forecast display
    updateForecastDisplay(forecast) {
        const forecastContainer = document.getElementById('weatherForecast');
        if (!forecastContainer || !forecast) return;

        forecastContainer.innerHTML = forecast.map(day => `
            <div class="forecast-item">
                <span class="forecast-day">${day.day}</span>
                <span class="forecast-icon">${day.icon}</span>
                <span class="forecast-temp">${day.high}°/${day.low}°</span>
            </div>
        `).join('');
    }

    // Handle weather errors
    handleWeatherError() {
        const weatherPreview = document.getElementById('weatherPreview');
        if (weatherPreview) {
            const tempEl = weatherPreview.querySelector('.weather-temp');
            const descEl = weatherPreview.querySelector('.weather-desc');

            if (tempEl) tempEl.textContent = '--°C';
            if (descEl) descEl.textContent = 'Weather unavailable';
        }
    }

    // Load and display events
    loadEvents() {
        this.events = [
            {
                id: 1,
                title: 'Bondi Beach Cleanup',
                location: 'Bondi Beach, Sydney',
                date: '2025-06-15',
                time: '9:00 AM - 12:00 PM',
                participants: 23,
                description: 'Join us for a morning cleanup at iconic Bondi Beach!'
            },
            {
                id: 2,
                title: 'Manly Cove Challenge',
                location: 'Manly Cove, NSW',
                date: '2025-06-22',
                time: '8:00 AM - 11:00 AM',
                participants: 18,
                description: 'Team challenge cleanup with prizes for most trash collected!'
            }
        ];

        this.renderEvents();
    }

    // Render events in the events section
    renderEvents() {
        const eventsGrid = document.getElementById('eventsGrid');
        if (!eventsGrid) return;

        // Keep existing static events and add dynamic ones if needed
        console.log('Events loaded:', this.events.length);
    }

    // Interactive functions for buttons
    findNearbyCleanups() {
        if (!this.currentLocation) {
            alert('Please enable location access to find nearby cleanups!');
            this.requestLocation();
            return;
        }

        // Scroll to map section
        const mapSection = document.getElementById('map');
        if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Highlight nearby events on map
        console.log('🔍 Finding cleanups near:', this.currentLocation);
        this.showNotification('Found 4 cleanups within 10km!', 'success');
    }

    createNewEvent() {
        // Simple event creation (could be expanded to a modal)
        const eventName = prompt('What would you like to call your cleanup event?');
        if (eventName) {
            console.log('🎉 Creating event:', eventName);
            this.showNotification(`"${eventName}" event created! Invite your crew to join.`, 'success');
        }
    }

    locateUser() {
        if (!this.map) return;

        if (this.currentLocation) {
            this.map.setView([this.currentLocation.lat, this.currentLocation.lng], 15);
            this.showNotification('Centered on your location!', 'info');
        } else {
            this.requestLocation();
            this.showNotification('Requesting location access...', 'info');
        }
    }

    filterEvents() {
        const filters = ['All Events', 'This Week', 'Near Me', 'My Crew'];
        const currentFilter = prompt(`Choose filter:\n${filters.map((f, i) => `${i + 1}. ${f}`).join('\n')}`);

        if (currentFilter) {
            const filterIndex = parseInt(currentFilter) - 1;
            if (filterIndex >= 0 && filterIndex < filters.length) {
                console.log('🔍 Filtering by:', filters[filterIndex]);
                this.showNotification(`Showing: ${filters[filterIndex]}`, 'info');
            }
        }
    }

    inviteCrew() {
        const message = "Join me for beach cleanup with ShoreSquad! 🌊 Let's make our oceans cleaner together.";

        if (navigator.share) {
            navigator.share({
                title: 'Join ShoreSquad',
                text: message,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback for browsers without Web Share API
            const shareText = `${message}\n${window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Invite link copied to clipboard!', 'success');
            }).catch(() => {
                alert(`Share this with your crew:\n\n${shareText}`);
            });
        }
    }

    shareProgress() {
        const stats = {
            events: 7,
            bags: 42,
            crew: 15
        };

        const message = `I've cleaned ${stats.events} beaches and collected ${stats.bags} bags of trash with my ${stats.crew}-person crew! 🌊♻️ #ShoreSquad #BeachCleanup`;

        if (navigator.share) {
            navigator.share({
                title: 'My ShoreSquad Progress',
                text: message,
                url: window.location.href
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(message).then(() => {
                this.showNotification('Progress shared to clipboard!', 'success');
            }).catch(() => {
                alert(`Share your progress:\n\n${message}`);
            });
        }
    }

    joinEvent(button) {
        const eventCard = button.closest('.event-card');
        const eventTitle = eventCard.querySelector('.event-title')?.textContent || 'Event';

        button.textContent = 'Joined!';
        button.style.background = '#20B2AA';
        button.disabled = true;

        console.log('🎉 Joined event:', eventTitle);
        this.showNotification(`You've joined "${eventTitle}"! Check your calendar.`, 'success');

        // Update participant count
        const participantEl = eventCard.querySelector('.event-participants');
        if (participantEl) {
            const currentCount = parseInt(participantEl.textContent.match(/\d+/)[0]);
            participantEl.textContent = `👥 ${currentCount + 1} participants`;
        }
    }

    joinEventFromMap(locationName) {
        console.log('🎉 Joined cleanup at:', locationName);
        this.showNotification(`You've joined the cleanup at ${locationName}!`, 'success');
    }

    updateLocationDisplay() {
        if (!this.currentLocation) return;

        // Update location-dependent elements
        const locationElements = document.querySelectorAll('[data-location]');
        locationElements.forEach(el => {
            if (el.dataset.location === 'current') {
                el.textContent = 'Your Location';
            }
        });
    }

    // Scroll animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe feature cards and other elements
        const animatedElements = document.querySelectorAll('.feature-card, .event-card, .stat-item');
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }

    // Utility function for notifications
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#20B2AA' : type === 'error' ? '#FF6B6B' : '#0077BE'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }
}

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
            console.log('📊 Page load time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
        }
    });
});

if ('PerformanceObserver' in window) {
    performanceObserver.observe({ entryTypes: ['navigation'] });
}

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
    });
}

// Initialize the app
const shoreSquad = new ShoreSquadApp();

// Make shoreSquad available globally for popup callbacks
window.shoreSquad = shoreSquad;

// Additional utility functions
window.addEventListener('online', () => {
    shoreSquad.showNotification('Back online! 🌐', 'success');
});

window.addEventListener('offline', () => {
    shoreSquad.showNotification('You\'re offline. Some features may be limited.', 'info');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + M = Open map
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
    }

    // Ctrl/Cmd + W = Check weather
    if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        document.getElementById('weather')?.scrollIntoView({ behavior: 'smooth' });
    }
});

console.log('🌊 ShoreSquad JavaScript loaded successfully!');
