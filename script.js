/* ==========================================================================
   FRAME ALCHEMY — script.js
   Vanilla JS only. Organized by feature, all DOM-ready guarded.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------------------------------------------
     0. DATA — placeholder catalog powering cards, search & AI replies
     ------------------------------------------------------------------ */
  const poster = (label, tone) =>
    `https://placehold.co/400x600/${tone}/f5f3ee?text=${encodeURIComponent(label)}&font=playfair-display`;

  const MOVIES = [
    { title: "Crimson Horizon", year: 2024, genre: "Sci-Fi / Drama", rating: 9.1, type: "Movie" },
    { title: "The Last Reel", year: 2023, genre: "Mystery", rating: 8.7, type: "Movie" },
    { title: "Gold Dust", year: 2022, genre: "Crime / Noir", rating: 8.9, type: "Movie" },
    { title: "Midnight Frame", year: 2024, genre: "Thriller", rating: 8.4, type: "Movie" },
    { title: "Velvet City", year: 2021, genre: "Drama", rating: 8.6, type: "Movie" },
    { title: "Echoes of Silence", year: 2023, genre: "Psychological", rating: 9.0, type: "Movie" },
  ];

  const SHOWS = [
    { title: "Shattered Glass", year: 2024, genre: "Drama · 3 Seasons", rating: 9.2, type: "TV Show" },
    { title: "The Director's Cut", year: 2023, genre: "Mystery · 2 Seasons", rating: 8.8, type: "TV Show" },
    { title: "Static & Signal", year: 2022, genre: "Sci-Fi · 4 Seasons", rating: 8.5, type: "TV Show" },
    { title: "Paper Empires", year: 2024, genre: "Period Drama", rating: 9.0, type: "TV Show" },
    { title: "After Hours", year: 2021, genre: "Comedy · 5 Seasons", rating: 8.3, type: "TV Show" },
    { title: "The Long Take", year: 2023, genre: "Crime", rating: 8.9, type: "TV Show" },
  ];

  const ANIME = [
    { title: "Sakura Requiem", year: 2024, genre: "Fantasy / Action", rating: 9.3, type: "Anime" },
    { title: "Neon Wanderer", year: 2023, genre: "Cyberpunk", rating: 9.1, type: "Anime" },
    { title: "Silent Tide", year: 2022, genre: "Slice of Life", rating: 8.7, type: "Anime" },
    { title: "Iron Blossom", year: 2024, genre: "Mecha / Drama", rating: 8.8, type: "Anime" },
    { title: "Ashen Skies", year: 2021, genre: "Adventure", rating: 8.6, type: "Anime" },
    { title: "Moonlit Duel", year: 2023, genre: "Shonen", rating: 9.0, type: "Anime" },
  ];

  const CATEGORIES = [
    { icon: "🎭", title: "Drama", count: "38 picks" },
    { icon: "🔪", title: "Thriller", count: "24 picks" },
    { icon: "🚀", title: "Sci-Fi", count: "31 picks" },
    { icon: "💘", title: "Romance", count: "19 picks" },
    { icon: "😂", title: "Comedy", count: "27 picks" },
    { icon: "👻", title: "Horror", count: "22 picks" },
    { icon: "⚔️", title: "Action", count: "29 picks" },
    { icon: "🌙", title: "Hidden Gems", count: "15 picks" },
  ];

  const TRENDING = [
    { title: "Crimson Horizon", genre: "Sci-Fi / Drama", score: 98, badge: "hot" },
    { title: "Sakura Requiem", genre: "Fantasy / Action", score: 96, badge: "hot" },
    { title: "Shattered Glass", genre: "Drama", score: 93, badge: "up" },
    { title: "Neon Wanderer", genre: "Cyberpunk", score: 91, badge: "up" },
    { title: "The Director's Cut", genre: "Mystery", score: 88, badge: "up" },
  ];

  const ALL_TITLES = [...MOVIES, ...SHOWS, ...ANIME];

  const toneFor = (type) => (type === "Movie" ? "8f0f28" : type === "TV Show" ? "18181c" : "3a2a12");

  /* ------------------------------------------------------------------
     1. PRELOADER
     ------------------------------------------------------------------ */
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => preloader.classList.add("is-hidden"), 600);
  });
  // Fallback in case 'load' fires very late (slow assets)
  setTimeout(() => preloader.classList.add("is-hidden"), 3200);

  /* ------------------------------------------------------------------
     2. NAVBAR — scroll state + mobile menu
     ------------------------------------------------------------------ */
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  const onScroll = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 40);
    updateScrollFill();
    updateBackToTop();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("is-active");
    navLinks.classList.toggle("is-open");
  });
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("is-active");
      navLinks.classList.remove("is-open");
    });
  });

  /* ------------------------------------------------------------------
     3. FILM STRIP SCROLL PROGRESS
     ------------------------------------------------------------------ */
  const scrollFill = document.getElementById("scrollFill");
  function updateScrollFill() {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    scrollFill.style.height = pct + "%";
  }

  /* ------------------------------------------------------------------
     4. BACK TO TOP
     ------------------------------------------------------------------ */
  const backToTop = document.getElementById("backToTop");
  function updateBackToTop() {
    backToTop.classList.toggle("is-visible", window.scrollY > 600);
  }
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ------------------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll(
    ".reveal, .poster-card, .category-card, .trending-row, .insta-item"
  );
  // Add .reveal class dynamically to generated cards for consistent animation
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  /* ------------------------------------------------------------------
     6. HERO STAT COUNTERS (count up on load)
     ------------------------------------------------------------------ */
  function animateCounters() {
    document.querySelectorAll(".stat__num").forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      let current = 0;
      const duration = 1400;
      const startTime = performance.now();
      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        current = Math.floor(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
    });
  }
  setTimeout(animateCounters, 900);

  /* ------------------------------------------------------------------
     7. CARD RENDERING — Movies / Shows / Anime
     ------------------------------------------------------------------ */
  function renderCardRow(containerId, dataset) {
    const container = document.getElementById(containerId);
    container.innerHTML = dataset
      .map(
        (item) => `
      <article class="poster-card reveal">
        <div class="poster-card__img-wrap">
          <img src="${poster(item.title, toneFor(item.type))}" alt="${item.title} poster" loading="lazy" />
          <span class="poster-card__rating">★ ${item.rating}</span>
          <div class="poster-card__overlay"><span class="poster-card__play">▶</span></div>
        </div>
        <div class="poster-card__body">
          <h3 class="poster-card__title">${item.title}</h3>
          <p class="poster-card__meta">${item.year} · ${item.genre}</p>
        </div>
      </article>`
      )
      .join("");
    container.querySelectorAll(".poster-card").forEach((el) => revealObserver.observe(el));
  }
  renderCardRow("moviesRow", MOVIES);
  renderCardRow("showsRow", SHOWS);
  renderCardRow("animeRow", ANIME);

  /* ------------------------------------------------------------------
     8. CATEGORY GRID
     ------------------------------------------------------------------ */
  const categoryGrid = document.getElementById("categoryGrid");
  categoryGrid.innerHTML = CATEGORIES.map(
    (c) => `
    <div class="category-card reveal">
      <span class="category-card__icon">${c.icon}</span>
      <h3 class="category-card__title">${c.title}</h3>
      <p class="category-card__count">${c.count}</p>
    </div>`
  ).join("");
  categoryGrid.querySelectorAll(".category-card").forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     9. TRENDING LIST
     ------------------------------------------------------------------ */
  const trendingList = document.getElementById("trendingList");
  trendingList.innerHTML = TRENDING.map((t, i) => {
    const badgeClass = t.badge === "hot" ? "trending-row__badge--hot" : "trending-row__badge--up";
    const badgeText = t.badge === "hot" ? "🔥 Hot" : "↑ Rising";
    return `
    <div class="trending-row reveal">
      <span class="trending-row__rank">${String(i + 1).padStart(2, "0")}</span>
      <div class="trending-row__thumb"><img src="${poster(t.title, "18181c")}" alt="${t.title}" loading="lazy" /></div>
      <div>
        <p class="trending-row__title">${t.title}</p>
        <p class="trending-row__genre">${t.genre}</p>
      </div>
      <span class="trending-row__badge ${badgeClass}">${badgeText}</span>
      <span class="trending-row__score">${t.score}%</span>
    </div>`;
  }).join("");
  trendingList.querySelectorAll(".trending-row").forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     10. INSTAGRAM GRID
     ------------------------------------------------------------------ */
  const instaGrid = document.getElementById("instaGrid");
  const instaTones = ["8f0f28", "18181c", "3a2a12", "1a1a1d", "6d1027", "2a2a2e"];
  instaGrid.innerHTML = Array.from({ length: 12 })
    .map((_, i) => `
      <div class="insta-item reveal">
        <img src="https://placehold.co/400x400/${instaTones[i % instaTones.length]}/d4af37?text=%23${i + 1}&font=playfair-display" alt="Instagram post ${i + 1}" loading="lazy" />
        <div class="insta-item__overlay">♥ View Post</div>
      </div>`)
    .join("");
  instaGrid.querySelectorAll(".insta-item").forEach((el) => revealObserver.observe(el));

  // Observe all static .reveal elements already in the DOM
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     11. SEARCH OVERLAY (frontend only)
     ------------------------------------------------------------------ */
  const searchToggle = document.getElementById("searchToggle");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchClose = document.getElementById("searchClose");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  function openSearch() {
    searchOverlay.classList.add("is-open");
    setTimeout(() => searchInput.focus(), 300);
  }
  function closeSearch() {
    searchOverlay.classList.remove("is-open");
    searchInput.value = "";
    searchResults.innerHTML = "";
  }
  searchToggle.addEventListener("click", openSearch);
  searchClose.addEventListener("click", closeSearch);
  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) closeSearch();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearch();
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      openSearch();
    }
  });

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      searchResults.innerHTML = "";
      return;
    }
    const matches = ALL_TITLES.filter(
      (item) => item.title.toLowerCase().includes(q) || item.genre.toLowerCase().includes(q)
    );
    if (matches.length === 0) {
      searchResults.innerHTML = `<p class="search-empty">No matches for "${escapeHtml(searchInput.value)}" — try a genre like "sci-fi".</p>`;
      return;
    }
    searchResults.innerHTML = matches
      .map(
        (item) => `
      <div class="search-result">
        <img src="${poster(item.title, toneFor(item.type))}" alt="${item.title}" loading="lazy" />
        <div>
          <div>${item.title}</div>
          <div class="search-result__meta">${item.type} · ${item.year} · ${item.genre}</div>
        </div>
      </div>`
      )
      .join("");
  });

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ------------------------------------------------------------------
     12. PICKMYMOVIE AI — mock conversational assistant
     ------------------------------------------------------------------ */
  const aiChat = document.getElementById("aiChat");
  const aiForm = document.getElementById("aiForm");
  const aiInput = document.getElementById("aiInput");
  const moodChips = document.getElementById("moodChips");

  const MOOD_REPLIES = {
    cozy: {
      text: "For a cozy night in, I'd hand you 'Velvet City' — slow-burn drama, warm cinematography, and a soundtrack made for a blanket and tea.",
    },
    thrill: {
      text: "Edge-of-your-seat mode: activated. 'Midnight Frame' will keep your heart rate up for a full two hours — no pauses recommended.",
    },
    cry: {
      text: "Grab tissues. 'Echoes of Silence' is the kind of quiet heartbreak that sneaks up on you around minute 40.",
    },
    mind: {
      text: "You want your brain rewired: 'The Last Reel' plays with time and memory in a way that demands a rewatch.",
    },
    laugh: {
      text: "Comedy incoming — 'After Hours' is chaotic, sharp, and exactly the kind of dumb-smart humor you need tonight.",
    },
    epic: {
      text: "Go big: 'Crimson Horizon' is a full-scale sci-fi epic with visuals built for the biggest screen you own.",
    },
  };

  function addMessage(text, who = "bot") {
    const msg = document.createElement("div");
    msg.className = `ai-msg ai-msg--${who}`;
    msg.textContent = text;
    aiChat.appendChild(msg);
    aiChat.scrollTop = aiChat.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.className = "ai-msg ai-msg--bot ai-msg--typing";
    typing.id = "aiTyping";
    typing.innerHTML = "<span></span><span></span><span></span>";
    aiChat.appendChild(typing);
    aiChat.scrollTop = aiChat.scrollHeight;
    return typing;
  }

  function respondTo(userText) {
    addMessage(userText, "user");
    const typing = showTyping();

    setTimeout(() => {
      typing.remove();
      const lower = userText.toLowerCase();
      let reply;

      // Try to match a known mood keyword within free-typed text
      const foundMood = Object.keys(MOOD_REPLIES).find((key) => lower.includes(key));
      if (foundMood) {
        reply = MOOD_REPLIES[foundMood].text;
      } else {
        // Try to match a title from the catalog
        const foundTitle = ALL_TITLES.find((item) => lower.includes(item.title.toLowerCase()));
        if (foundTitle) {
          reply = `Great taste — if you liked "${foundTitle.title}", you'll probably love exploring more ${foundTitle.genre} in the ${foundTitle.type === "Anime" ? "Anime" : foundTitle.type === "TV Show" ? "TV Shows" : "Movies"} section above.`;
        } else {
          const pick = ALL_TITLES[Math.floor(Math.random() * ALL_TITLES.length)];
          reply = `Based on what you're telling me, I'd recommend "${pick.title}" (${pick.genre}, ★ ${pick.rating}). Want another option, or a different mood?`;
        }
      }
      addMessage(reply, "bot");
    }, 1100 + Math.random() * 500);
  }

  aiForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = aiInput.value.trim();
    if (!val) return;
    respondTo(val);
    aiInput.value = "";
  });

  moodChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    moodChips.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    respondTo(chip.textContent);
  });

  /* ------------------------------------------------------------------
     13. CONTACT FORM (frontend only — simulated submit)
     ------------------------------------------------------------------ */
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Basic validity check leans on native `required` + type=email constraints
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    formSuccess.classList.add("is-shown");
    contactForm.reset();
    setTimeout(() => formSuccess.classList.remove("is-shown"), 5000);
  });

  /* ------------------------------------------------------------------
     14. FOOTER YEAR
     ------------------------------------------------------------------ */
  document.getElementById("year").textContent = new Date().getFullYear();
});
