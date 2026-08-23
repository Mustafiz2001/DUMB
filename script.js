// Comedy Content Database
const contentDatabase = {
    jokes: [
        {
            text: "Why don't scientists trust atoms? Because they make up everything!",
            category: "jokes"
        },
        {
            text: "I told my computer I needed a break, and now it won't stop sending me Kit-Kat ads.",
            category: "jokes"
        },
        {
            text: "Why did the scarecrow win an award? He was outstanding in his field!",
            category: "jokes"
        },
        {
            text: "What do you call a fake noodle? An impasta!",
            category: "jokes"
        },
        {
            text: "Why don't skeletons fight each other? They don't have the guts!",
            category: "jokes"
        },
        {
            text: "I'm reading a book about anti-gravity. It's impossible to put down!",
            category: "jokes"
        },
        {
            text: "What did the ocean say to the beach? Nothing, it just waved!",
            category: "jokes"
        },
        {
            text: "Why don't eggs tell jokes? They'd crack each other up!",
            category: "jokes"
        },
        {
            text: "How do you organize a space party? You planet!",
            category: "jokes"
        },
        {
            text: "Why did the math book look sad? Because it had too many problems!",
            category: "jokes"
        }
    ],
    facts: [
        {
            text: "Bananas are berries, but strawberries aren't. Nature is confusing.",
            category: "facts"
        },
        {
            text: "A group of flamingos is called a 'flamboyance.' That's fabulous.",
            category: "facts"
        },
        {
            text: "Honey never spoils. Archaeologists have found 3,000-year-old honey that's still edible.",
            category: "facts"
        },
        {
            text: "Octopuses have three hearts and blue blood. They're basically aliens.",
            category: "facts"
        },
        {
            text: "A day on Venus is longer than its year. Time is weird there.",
            category: "facts"
        },
        {
            text: "Sloth fingerprints are nearly identical to human fingerprints. They could commit crimes!",
            category: "facts"
        },
        {
            text: "Wombats poop cubes. Scientists still don't know why.",
            category: "facts"
        },
        {
            text: "Penguins have knees. You just can't see them under their fluff.",
            category: "facts"
        },
        {
            text: "A shrimp's heart is in its head. Party hard, little buddy.",
            category: "facts"
        },
        {
            text: "Cats spend 70% of their lives sleeping. Living the dream!",
            category: "facts"
        }
    ],
    oneliners: [
        {
            text: "I told my wife she was drawing her eyebrows too high. She looked surprised.",
            category: "oneliners"
        },
        {
            text: "I'm reading a book on the history of glue – can't put it down.",
            category: "oneliners"
        },
        {
            text: "I would avoid the sushi if I were you. It's a little fishy.",
            category: "oneliners"
        },
        {
            text: "Did you hear about the guy who invented Lifesavers? He made a mint!",
            category: "oneliners"
        },
        {
            text: "I tried to make a belt out of herbs once. It was a waist of thyme.",
            category: "oneliners"
        },
        {
            text: "What's the difference between a poorly dressed man on a bicycle and a well-dressed man on a tricycle? Attire!",
            category: "oneliners"
        },
        {
            text: "I used to hate facial hair, but then it grew on me.",
            category: "oneliners"
        },
        {
            text: "Did you hear about the claustrophobic astronaut? He just needed a little space.",
            category: "oneliners"
        },
        {
            text: "I'm terrified of elevators, so I'm going to start taking steps to avoid them.",
            category: "oneliners"
        },
        {
            text: "What do you call a man with a rubber toe? Roberto!",
            category: "oneliners"
        }
    ]
};

// Application State
let appState = {
    currentContent: null,
    currentCategory: 'all',
    favorites: [],
    usedIndices: {
        jokes: new Set(),
        facts: new Set(),
        oneliners: new Set()
    },
    contentIndex: {
        jokes: 0,
        facts: 0,
        oneliners: 0
    }
};

// DOM Elements
const jokeText = document.getElementById('jokeText');
const nextBtn = document.getElementById('nextBtn');
const favoriteBtn = document.getElementById('favoriteBtn');
const shareBtn = document.getElementById('shareBtn');
const categoryBtns = document.querySelectorAll('.category-btn');
const favoritesList = document.getElementById('favoritesList');
const favoritesSection = document.getElementById('favoritesSection');
const clearFavoritesBtn = document.getElementById('clearFavoritesBtn');
const toast = document.getElementById('toast');
const mainCard = document.getElementById('mainCard');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadFavoritesFromStorage();
    setupEventListeners();
    displayNextContent();
});

// Event Listeners
function setupEventListeners() {
    nextBtn.addEventListener('click', displayNextContent);
    favoriteBtn.addEventListener('click', toggleFavorite);
    shareBtn.addEventListener('click', shareContent);
    clearFavoritesBtn.addEventListener('click', clearAllFavorites);

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            appState.currentCategory = e.target.dataset.category;
            resetIndices();
            displayNextContent();
        });
    });
}

// Get appropriate content pool
function getContentPool() {
    if (appState.currentCategory === 'all') {
        const allContent = [
            ...contentDatabase.jokes,
            ...contentDatabase.facts,
            ...contentDatabase.oneliners
        ];
        return allContent;
    }
    return contentDatabase[appState.currentCategory] || [];
}

// Display Next Content
function displayNextContent() {
    const pool = getContentPool();
    
    if (pool.length === 0) {
        jokeText.textContent = 'No content available in this category!';
        return;
    }

    // Get random content that hasn't been recently used
    let randomIndex = getRandomUnusedIndex(pool.length);
    appState.currentContent = pool[randomIndex];

    // Animate the card
    mainCard.style.animation = 'none';
    setTimeout(() => {
        mainCard.style.animation = '';
    }, 10);

    // Update content
    jokeText.textContent = appState.currentContent.text;
    
    // Update favorite button state
    updateFavoriteBtnState();
    
    // Track used index
    trackUsedIndex(randomIndex, pool.length);
}

// Get random index that hasn't been recently used
function getRandomUnusedIndex(poolLength) {
    const recentLimit = Math.ceil(poolLength * 0.3); // Track last 30%
    const availableIndices = [];

    for (let i = 0; i < poolLength; i++) {
        if (!appState.usedIndices[appState.currentCategory]?.has(i)) {
            availableIndices.push(i);
        }
    }

    if (availableIndices.length === 0) {
        appState.usedIndices[appState.currentCategory] = new Set();
        return Math.floor(Math.random() * poolLength);
    }

    return availableIndices[Math.floor(Math.random() * availableIndices.length)];
}

// Track used indices
function trackUsedIndex(index, poolLength) {
    if (!appState.usedIndices[appState.currentCategory]) {
        appState.usedIndices[appState.currentCategory] = new Set();
    }
    
    appState.usedIndices[appState.currentCategory].add(index);

    // Keep only recent history (30% of pool size)
    const recentLimit = Math.ceil(poolLength * 0.3);
    if (appState.usedIndices[appState.currentCategory].size > recentLimit) {
        const indices = Array.from(appState.usedIndices[appState.currentCategory]);
        appState.usedIndices[appState.currentCategory] = new Set(
            indices.slice(Math.max(0, indices.length - recentLimit))
        );
    }
}

// Reset indices when category changes
function resetIndices() {
    appState.usedIndices = {
        jokes: new Set(),
        facts: new Set(),
        oneliners: new Set()
    };
}

// Toggle Favorite
function toggleFavorite() {
    if (!appState.currentContent) return;

    const isFavorited = appState.favorites.some(
        fav => fav.text === appState.currentContent.text
    );

    if (isFavorited) {
        appState.favorites = appState.favorites.filter(
            fav => fav.text !== appState.currentContent.text
        );
        showToast('Removed from favorites ♡');
    } else {
        appState.favorites.push({
            ...appState.currentContent,
            id: Date.now()
        });
        showToast('Added to favorites ♥');
    }

    saveFavoritesToStorage();
    updateFavoriteBtnState();
    renderFavorites();
}

// Update favorite button state
function updateFavoriteBtnState() {
    const isFavorited = appState.favorites.some(
        fav => fav.text === appState.currentContent?.text
    );

    if (isFavorited) {
        favoriteBtn.textContent = '♥ Favorited';
        favoriteBtn.style.opacity = '1';
    } else {
        favoriteBtn.textContent = '♡ Favorite';
        favoriteBtn.style.opacity = '0.8';
    }
}

// Share Content
function shareContent() {
    if (!appState.currentContent) return;

    const shareText = `Check out this: "${appState.currentContent.text}" - From DUMB 🤪`;
    
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: 'DUMB Comedy App',
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('Copied to clipboard! 📋');
        }).catch(() => {
            showToast('Failed to copy 😞');
        });
    }
}

// Render Favorites
function renderFavorites() {
    favoritesList.innerHTML = '';

    if (appState.favorites.length === 0) {
        favoritesSection.style.display = 'none';
        clearFavoritesBtn.style.display = 'none';
        return;
    }

    favoritesSection.style.display = 'block';
    clearFavoritesBtn.style.display = 'block';

    appState.favorites.forEach(favorite => {
        const item = document.createElement('div');
        item.className = 'favorite-item';
        item.innerHTML = `
            <p class="favorite-text">${escapeHtml(favorite.text)}</p>
            <button class="favorite-remove" data-id="${favorite.id}">✕</button>
        `;

        const removeBtn = item.querySelector('.favorite-remove');
        removeBtn.addEventListener('click', () => removeFavorite(favorite.id));

        favoritesList.appendChild(item);
    });
}

// Remove single favorite
function removeFavorite(id) {
    appState.favorites = appState.favorites.filter(fav => fav.id !== id);
    saveFavoritesToStorage();
    updateFavoriteBtnState();
    renderFavorites();
    showToast('Removed from favorites');
}

// Clear all favorites
function clearAllFavorites() {
    if (appState.favorites.length === 0) return;
    
    if (confirm('Are you sure you want to clear all favorites?')) {
        appState.favorites = [];
        saveFavoritesToStorage();
        updateFavoriteBtnState();
        renderFavorites();
        showToast('All favorites cleared');
    }
}

// Storage Functions
function saveFavoritesToStorage() {
    try {
        localStorage.setItem('dumb-favorites', JSON.stringify(appState.favorites));
    } catch (e) {
        console.log('Could not save to localStorage:', e);
    }
}

function loadFavoritesFromStorage() {
    try {
        const stored = localStorage.getItem('dumb-favorites');
        if (stored) {
            appState.favorites = JSON.parse(stored);
            renderFavorites();
        }
    } catch (e) {
        console.log('Could not load from localStorage:', e);
    }
}

// Toast Notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault();
        displayNextContent();
    }
});

// Prevent multiple rapid clicks
let isAnimating = false;
const originalNextClick = nextBtn.onclick;
nextBtn.addEventListener('click', function(e) {
    if (isAnimating) return;
    
    isAnimating = true;
    setTimeout(() => {
        isAnimating = false;
    }, 300);
});

// Performance: Lazy load and optimize animations
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.style.animationDuration = '0.01ms';
}
