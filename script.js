document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------------------------------
  // 1. LOADING SCREEN ENGINE
  // ----------------------------------------------------
  const loadingScreen = document.getElementById("loading-screen");
  
  // Simulate progress bar increase then hide loader
  const fillBar = document.querySelector(".loader-bar-fill");
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.classList.add("hidden");
        // Start counter animation once loader is hidden
        startCounters();
      }, 500);
    }
  }, 150);

  // ----------------------------------------------------
  // 2. NAVBAR SCROLL EFFECT
  // ----------------------------------------------------
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    // Update active nav links based on scroll section
    updateActiveNavOnScroll();
  });

  // ----------------------------------------------------
  // 3. MOBILE HAMBURGER MENU
  // ----------------------------------------------------
  const menuHamburger = document.querySelector(".menu-hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  menuHamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    // Animate hamburger lines
    const lines = menuHamburger.querySelectorAll("span");
    lines[0].style.transform = navLinks.classList.contains("active") ? "rotate(45deg) translate(6px, 6px)" : "none";
    lines[1].style.opacity = navLinks.classList.contains("active") ? "0" : "1";
    lines[2].style.transform = navLinks.classList.contains("active") ? "rotate(-45deg) translate(6px, -6px)" : "none";
  });

  // Close menu on link click
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navLinks.classList.remove("active");
      const lines = menuHamburger.querySelectorAll("span");
      lines[0].style.transform = "none";
      lines[1].style.opacity = "1";
      lines[2].style.transform = "none";
    });
  });

  // ----------------------------------------------------
  // 4. THEME TOGGLE ENGINE (DARK / LIGHT)
  // ----------------------------------------------------
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = themeToggleBtn.querySelector("i");
  
  // Set default theme to dark-theme for premium aesthetic
  if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "dark-theme");
  }

  const currentTheme = localStorage.getItem("theme");
  document.body.classList.add(currentTheme);
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener("click", () => {
    if (document.body.classList.contains("dark-theme")) {
      document.body.classList.replace("dark-theme", "light-theme");
      localStorage.setItem("theme", "light-theme");
      updateThemeIcon("light-theme");
    } else {
      document.body.classList.replace("light-theme", "dark-theme");
      localStorage.setItem("theme", "dark-theme");
      updateThemeIcon("dark-theme");
    }
    // Re-render chart with new colors to match theme
    updateChartTheme();
  });

  function updateThemeIcon(theme) {
    if (theme === "dark-theme") {
      themeIcon.className = "lucide-sun";
      themeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    } else {
      themeIcon.className = "lucide-moon";
      themeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    }
  }

  // ----------------------------------------------------
  // 5. STATS COUNTER ANIMATION ENGINE
  // ----------------------------------------------------
  function startCounters() {
    const stats = document.querySelectorAll(".stat-number");
    stats.forEach(stat => {
      const target = parseFloat(stat.getAttribute("data-target"));
      const isFloat = stat.getAttribute("data-target").includes(".");
      const duration = 2000; // ms
      const startTime = performance.now();
      
      function updateCount(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function (easeOutQuad)
        const ease = progress * (2 - progress);
        
        let currentValue = ease * target;
        
        if (isFloat) {
          stat.innerText = currentValue.toFixed(2).replace(".", ",");
        } else {
          stat.innerText = Math.floor(currentValue).toLocaleString("id-ID");
        }
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          // Final exact values with formatting
          if (isFloat) {
            stat.innerText = target.toFixed(2).replace(".", ",") + (stat.id === "stat-inflation" || stat.id === "stat-gdp" ? "%" : "");
          } else {
            if (stat.id === "stat-exchange") {
              stat.innerText = "Rp " + target.toLocaleString("id-ID");
            } else {
              stat.innerText = target.toLocaleString("id-ID") + " T";
            }
          }
        }
      }
      
      requestAnimationFrame(updateCount);
    });
  }

  // ----------------------------------------------------
  // 6. SCROLL SPY FOR ACTIVE NAVBAR LINKS
  // ----------------------------------------------------
  const sections = document.querySelectorAll("section");
  function updateActiveNavOnScroll() {
    let scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        const id = section.getAttribute("id");
        navItems.forEach(item => {
          item.classList.remove("active");
          if (item.getAttribute("href") === `#${id}`) {
            item.classList.add("active");
          }
        });
      }
    });
  }

  // ----------------------------------------------------
  // 7. INTERACTIVE TIMELINE SELECTOR
  // ----------------------------------------------------
  const timelineItems = document.querySelectorAll(".timeline-item");
  timelineItems.forEach(item => {
    item.addEventListener("click", () => {
      timelineItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // ----------------------------------------------------
  // 8. UPAYA PEMERINTAH TAB SWITCHER
  // ----------------------------------------------------
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active from all buttons & contents
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      // Add active to current
      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // ----------------------------------------------------
  // 9. DYNAMIC CHART.JS (KURS RUPIAH VS USD 1998 - 2026)
  // ----------------------------------------------------
  const chartCtx = document.getElementById("rupiahChart").getContext("2d");
  
  // Historical Kurs data (1998 - 2026)
  const fullYears = [
    1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007,
    2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
    2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026
  ];
  
  const fullRates = [
    16800, 7000, 9500, 10400, 8900, 8400, 9300, 9800, 9000, 9400,
    12000, 9400, 9000, 9100, 9600, 12200, 12400, 13800, 13400, 13500,
    14500, 13900, 16300, 14300, 15600, 15400, 16400, 16200, 16250
  ];

  // Specific descriptive descriptions for chart tooltips to make them interactive and educational
  const historicalAnotations = {
    1998: "Krisis Moneter Asia: Rupiah terdepresiasi parah hingga Rp 16.800/USD, memicu inflasi hebat & pergantian Orde Baru.",
    2008: "Krisis Finansial Global: Likuiditas dolar yang ketat di pasar internasional menekan Rupiah hingga menyentuh Rp 12.000.",
    2013: "Taper Tantrum Fed: Pengumuman pengurangan stimulus kuantitatif AS (QE) memicu capital outflow dari pasar berkembang.",
    2020: "Pandemi COVID-19: Kepanikan global menyebabkan pelemahan instan Rupiah ke Rp 16.300/USD sebelum intervensi kuat BI.",
    2024: "Kenaikan Suku Bunga AS (Fed Rate Hikes): Tekanan geopolitik Timur Tengah dan tingginya imbal hasil US Treasury menekan Rupiah.",
    2026: "Era Stabilitas Reformasi: Nilai kurs berkisar Rp 16.250 didukung penguatan devisa ekspor (hilirisasi) & BI-Rate adaptif."
  };

  let chartInstance;

  function buildChart(years, rates) {
    const isDark = document.body.classList.contains("dark-theme");
    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
    const textColor = isDark ? "#94A3B8" : "#475569";
    const accentColor = "#FF6B8B";
    const goldColor = "#D4AF37";

    // Dynamic gradient
    const gradient = chartCtx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(255, 107, 139, 0.3)");
    gradient.addColorStop(0.5, "rgba(212, 175, 55, 0.1)");
    gradient.addColorStop(1, "rgba(255, 107, 139, 0)");

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(chartCtx, {
      type: "line",
      data: {
        labels: years,
        datasets: [{
          label: "Kurs Rupiah per USD",
          data: rates,
          borderColor: accentColor,
          borderWidth: 3.5,
          pointBackgroundColor: rates.map((r, i) => {
            const year = years[i];
            return historicalAnotations[year] ? goldColor : accentColor;
          }),
          pointBorderColor: "#FFFFFF",
          pointRadius: rates.map((r, i) => {
            const year = years[i];
            return historicalAnotations[year] ? 8 : 4;
          }),
          pointHoverRadius: 10,
          backgroundColor: gradient,
          fill: true,
          tension: 0.3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
            titleColor: isDark ? "#FFFFFF" : "#0F172A",
            bodyColor: isDark ? "#E2E8F0" : "#334155",
            borderColor: isDark ? "rgba(255, 107, 139, 0.3)" : "rgba(255, 107, 139, 0.15)",
            borderWidth: 1,
            padding: 15,
            cornerRadius: 12,
            titleFont: {
              family: "'Outfit', sans-serif",
              size: 14,
              weight: "bold"
            },
            bodyFont: {
              family: "'Inter', sans-serif",
              size: 12
            },
            callbacks: {
              label: function(context) {
                const year = context.label;
                const value = context.parsed.y;
                let text = ` Nilai Kurs: Rp ${value.toLocaleString("id-ID")}`;
                
                if (historicalAnotations[year]) {
                  text += `\n\n📌 Catatan: ${historicalAnotations[year]}`;
                }
                return text;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: gridColor,
              drawTicks: false
            },
            ticks: {
              color: textColor,
              font: {
                family: "'Outfit', sans-serif",
                size: 11
              }
            }
          },
          y: {
            grid: {
              color: gridColor,
              drawTicks: false
            },
            ticks: {
              color: textColor,
              callback: function(value) {
                return "Rp " + value.toLocaleString("id-ID");
              },
              font: {
                family: "'Outfit', sans-serif",
                size: 11
              }
            }
          }
        }
      }
    });
  }

  // Initialize main chart
  buildChart(fullYears, fullRates);

  function updateChartTheme() {
    if (chartInstance) {
      const isDark = document.body.classList.contains("dark-theme");
      const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
      const textColor = isDark ? "#94A3B8" : "#475569";
      
      chartInstance.options.scales.x.grid.color = gridColor;
      chartInstance.options.scales.x.ticks.color = textColor;
      chartInstance.options.scales.y.grid.color = gridColor;
      chartInstance.options.scales.y.ticks.color = textColor;
      chartInstance.options.plugins.tooltip.backgroundColor = isDark ? "#1E293B" : "#FFFFFF";
      chartInstance.options.plugins.tooltip.titleColor = isDark ? "#FFFFFF" : "#0F172A";
      chartInstance.options.plugins.tooltip.bodyColor = isDark ? "#E2E8F0" : "#334155";
      chartInstance.options.plugins.tooltip.borderColor = isDark ? "rgba(255, 107, 139, 0.3)" : "rgba(255, 107, 139, 0.15)";
      
      chartInstance.update();
    }
  }

  // Chart Filtering logic
  const filterBtns = document.querySelectorAll(".chart-filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const range = btn.getAttribute("data-range");
      let filteredYears = [];
      let filteredRates = [];
      
      if (range === "all") {
        filteredYears = fullYears;
        filteredRates = fullRates;
      } else if (range === "krismon") {
        // Crisis and post stability (1998 - 2004)
        filteredYears = fullYears.slice(0, 7);
        filteredRates = fullRates.slice(0, 7);
      } else if (range === "global") {
        // Global economic boom and crisis (2005 - 2012)
        filteredYears = fullYears.slice(7, 15);
        filteredRates = fullRates.slice(7, 15);
      } else if (range === "recent") {
        // Recent 10 years (2016 - 2026)
        filteredYears = fullYears.slice(18);
        filteredRates = fullRates.slice(18);
      }
      
      buildChart(filteredYears, filteredRates);
    });
  });

  // ----------------------------------------------------
  // 10. NEWS AGGREGATOR & SEARCH ENGINE
  // ----------------------------------------------------
  const mockNews = [
    {
      source: "Bank Indonesia",
      sourceUrl: "https://www.bi.go.id?utm_source=chatgpt.com",
      title: "BI Naikkan BI-Rate Menjadi 6,25% Guna Memperkuat Stabilitas Nilai Tukar Rupiah",
      excerpt: "Bank Indonesia memutuskan meningkatkan suku bunga acuan sebagai respons preemptive mengatasi tekanan depresiasi rupiah terhadap mata uang global.",
      date: "22 Mei 2026",
      tag: "Kebijakan Moneter",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80"
    },
    {
      source: "Kementerian Keuangan RI",
      sourceUrl: "https://www.kemenkeu.go.id?utm_source=chatgpt.com",
      title: "Menkeu Sri Mulyani Tekankan Kebijakan APBN Responsif Jaga Daya Beli Di Tengah Gejolak Kurs",
      excerpt: "Menteri Keuangan mematangkan alokasi subsidi domestik agar depresiasi rupiah tidak memicu guncangan harga barang pokok di kalangan masyarakat kelas bawah.",
      date: "18 Mei 2026",
      tag: "Fiskal & APBN",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80"
    },
    {
      source: "BPS Indonesia",
      sourceUrl: "https://www.bps.go.id?utm_source=chatgpt.com",
      title: "Neraca Perdagangan Indonesia April 2026 Surplus USD 3,5 Miliar Didorong Ekspor Komoditas",
      excerpt: "Badan Pusat Statistik merilis laporan ekspor RI yang kokoh, membantu memperkuat cadangan devisa dan menahan pelemahan nilai rupiah lebih lanjut.",
      date: "15 Mei 2026",
      tag: "Data Statistik",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&q=80"
    },
    {
      source: "CNBC Indonesia",
      sourceUrl: "https://www.cnbcindonesia.com?utm_source=chatgpt.com",
      title: "Rupiah Menguat Tipis Ke Rp 16.220 Setelah Rilis Fed Minutes Isyaratkan Pemotongan Suku Bunga",
      excerpt: "Mata uang rupiah mendapat angin segar dari sinyal melunaknya prospek suku bunga acuan The Fed, memicu aliran modal kembali masuk ke pasar SBN domestik.",
      date: "12 Mei 2026",
      tag: "Pasar Keuangan",
      image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=400&q=80"
    },
    {
      source: "Kompas.com",
      sourceUrl: "https://www.kompas.com?utm_source=chatgpt.com",
      title: "Dampak Kurs Rupiah Melemah, Importir Elektronik Mulai Sesuaikan Harga Jual Produk",
      excerpt: "Asosiasi importir mengemukakan penyesuaian harga ritel komputer dan suku cadang sebesar 5% guna meminimalisir rugi selisih kurs yang terjadi.",
      date: "10 Mei 2026",
      tag: "Sektor Ritel",
      image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=400&q=80"
    },
    {
      source: "Bank Indonesia",
      sourceUrl: "https://www.bi.go.id?utm_source=chatgpt.com",
      title: "Cadangan Devisa RI Tetap Tinggi Sebesar USD 140,2 Miliar pada Akhir Periode Laporan",
      excerpt: "Cadangan devisa memadai menjamin ketahanan sektor eksternal dan membuktikan kapasitas BI melakukan stabilisasi rupiah bila gejolak global kembali memanas.",
      date: "07 Mei 2026",
      tag: "Cadangan Devisa",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80"
    }
  ];

  const newsGrid = document.getElementById("news-grid");
  const newsSearchInput = document.getElementById("news-search-input");

  function renderNews(newsList) {
    newsGrid.innerHTML = "";
    if (newsList.length === 0) {
      newsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted-current);">
          <i class="lucide-alert-circle" style="font-size: 3rem; color: var(--primary-pink); margin-bottom: 15px; display: inline-block;"></i>
          <p style="font-size: 1.1rem; font-weight: 600;">Tidak ada berita ekonomi yang sesuai dengan kata kunci.</p>
        </div>
      `;
      return;
    }

    newsList.forEach(news => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.innerHTML = `
        <div class="news-image">
          <img src="${news.image}" alt="${news.title}">
          <span class="news-tag">${news.tag}</span>
        </div>
        <div class="news-body">
          <div class="news-meta">
            <span><i class="lucide-globe" style="width:14px;height:14px;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg></i> ${news.source}</span>
            <span><i class="lucide-calendar" style="width:14px;height:14px;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg></i> ${news.date}</span>
          </div>
          <h3 class="news-title">${news.title}</h3>
          <p class="news-excerpt">${news.excerpt}</p>
          <a href="${news.sourceUrl}" target="_blank" class="news-link">
            Baca Selengkapnya 
            <i class="lucide-arrow-right" style="width:16px;height:16px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></i>
          </a>
        </div>
      `;
      newsGrid.appendChild(card);
    });
  }

  // Initial news render
  renderNews(mockNews);

  // Instant News Search Filter
  newsSearchInput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    const filteredNews = mockNews.filter(news => {
      return news.title.toLowerCase().includes(keyword) || 
             news.excerpt.toLowerCase().includes(keyword) || 
             news.source.toLowerCase().includes(keyword) ||
             news.tag.toLowerCase().includes(keyword);
    });
    renderNews(filteredNews);
  });

  // ----------------------------------------------------
  // 11. INTERACTIVE TRIVIA QUIZ ENGINE
  // ----------------------------------------------------
  const quizData = [
    {
      question: "Pada tahun krisis moneter 1998, Rupiah mengalami kejatuhan nilai tukar yang sangat parah. Berapa kisaran nilai tukar terendah Rupiah terhadap Dolar AS saat puncak Krismon tersebut?",
      options: [
        "Rp 5.000 per USD",
        "Rp 10.000 per USD",
        "Rp 16.800 per USD",
        "Rp 25.000 per USD"
      ],
      answer: 2,
      explanation: "Saat puncak Krisis Moneter Asia di pertengahan tahun 1998, nilai tukar rupiah jeblok secara drastis dari kisaran Rp 2.400 menjadi Rp 16.800 per dolar AS. Hal ini melumpuhkan industri nasional yang memiliki utang luar negeri besar dalam valuta asing."
    },
    {
      question: "Lembaga negara independen manakah di Indonesia yang memegang otoritas utama dalam merumuskan kebijakan moneter demi menjaga kestabilan nilai Rupiah?",
      options: [
        "Kementerian Keuangan RI",
        "Bank Indonesia (BI)",
        "Otoritas Jasa Keuangan (OJK)",
        "Badan Kebijakan Fiskal (BKF)"
      ],
      answer: 1,
      explanation: "Berdasarkan UU No. 23 Tahun 1999 tentang Bank Indonesia, BI ditetapkan sebagai bank sentral independen yang memiliki tujuan tunggal mencapai dan memelihara kestabilan nilai rupiah, salah satunya melalui regulasi moneter."
    },
    {
      question: "Di era Reformasi modern (seperti pada tahun 2022-2024), pelemahan Rupiah dipengaruhi oleh faktor global 'Fed Rate Hikes'. Apa yang dimaksud dengan istilah tersebut?",
      options: [
        "Kebijakan pengurangan ekspor energi oleh Uni Eropa",
        "Kenaikan suku bunga acuan oleh Bank Sentral Amerika Serikat",
        "Perang tarif dagang antara Tiongkok dan Australia",
        "Penurunan kuota cadangan devisa oleh Bank Dunia"
      ],
      answer: 1,
      explanation: "Fed Rate Hikes merupakan kebijakan kenaikan suku bunga oleh The Federal Reserve (bank sentral AS) untuk mengatasi inflasi domestik AS. Hal ini menarik modal global kembali ke AS (capital outflow dari RI) sehingga menekan nilai tukar Rupiah."
    },
    {
      question: "Apa dampak langsung pelemahan rupiah terhadap sektor pendidikan dan masyarakat kelas bawah di era reformasi?",
      options: [
        "Turunnya biaya SPP sekolah di seluruh Indonesia secara serentak",
        "Kenaikan harga bahan pokok impor serta melonjaknya harga buku & alat laboratorium sekolah berbahan baku impor",
        "Meningkatnya beasiswa luar negeri secara instan",
        "Pemberantasan pengangguran total di pedesaan"
      ],
      answer: 1,
      explanation: "Depresiasi Rupiah meningkatkan harga impor barang (imported inflation). Sektor pendidikan terdampak dari naiknya biaya buku akademis impor, kertas, komputer, serta berkurangnya daya beli keluarga miskin untuk pemenuhan gizi anak sekolah."
    },
    {
      question: "Untuk menstabilkan kurs tanpa memboroskan cadangan devisa, kebijakan struktural jangka panjang apa yang sedang giat diupayakan pemerintah Indonesia saat ini?",
      options: [
        "Menerapkan sistem kurs tetap (Fixed Exchange Rate)",
        "Melakukan hilirisasi komoditas mineral (seperti Nikel & Tembaga) guna mendongkrak nilai tambah ekspor",
        "Melarang transaksi dolar di seluruh hotel domestik saja",
        "Mencetak uang rupiah baru sebanyak-banyaknya"
      ],
      answer: 1,
      explanation: "Kebijakan hilirisasi pertambangan melarang ekspor bijih mentah sehingga Indonesia mengekspor produk olahan bernilai tinggi. Ini memperbaiki neraca transaksi berjalan secara struktural, mendatangkan aliran dolar, dan menopang Rupiah jangka panjang."
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;
  let selectedOptionIndex = null;

  const quizCard = document.getElementById("quiz-card");

  function loadQuestion() {
    selectedOptionIndex = null;
    const currentQ = quizData[currentQuestionIndex];
    
    quizCard.innerHTML = `
      <div class="quiz-header">
        <span class="quiz-badge">Kuis Interaktif Ekonomi</span>
        <span class="quiz-progress">Pertanyaan ${currentQuestionIndex + 1} dari ${quizData.length}</span>
      </div>
      <div class="quiz-question-container">
        <h3>${currentQ.question}</h3>
        <div class="quiz-options">
          ${currentQ.options.map((opt, index) => `
            <div class="quiz-option" data-index="${index}">
              <div class="quiz-option-letter">${String.fromCharCode(65 + index)}</div>
              <div class="quiz-option-text">${opt}</div>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="quiz-controls">
        <button id="quiz-submit-btn" class="btn-primary" disabled>
          Lanjut Pertanyaan 
          <i class="lucide-arrow-right" style="width:16px;height:16px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></i>
        </button>
      </div>
    `;

    // Hook option selection
    const optionsElements = quizCard.querySelectorAll(".quiz-option");
    const submitBtn = document.getElementById("quiz-submit-btn");

    optionsElements.forEach(opt => {
      opt.addEventListener("click", () => {
        optionsElements.forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        selectedOptionIndex = parseInt(opt.getAttribute("data-index"));
        submitBtn.removeAttribute("disabled");
      });
    });

    submitBtn.addEventListener("click", () => {
      // Process Score
      if (selectedOptionIndex === currentQ.answer) {
        score++;
      }
      
      // Next or finish
      currentQuestionIndex++;
      if (currentQuestionIndex < quizData.length) {
        loadQuestion();
      } else {
        showResults();
      }
    });
  }

  function showResults() {
    const percentage = (score / quizData.length) * 100;
    let rank = "";
    let message = "";
    
    if (percentage === 100) {
      rank = "Ekonom Reformasi Ulung";
      message = "Luar biasa! Pemahaman Anda mengenai sejarah, penyebab, dan dampak pelemahan Rupiah di era reformasi sangat mendalam dan sempurna.";
    } else if (percentage >= 70) {
      rank = "Pengamat Ekonomi Berbakat";
      message = "Bagus sekali! Anda memahami poin-poin krusial terkait dinamika ekonomi nasional dan kebijakan moneter pendukung Rupiah.";
    } else {
      rank = "Pelajar Ekonomi Pemula";
      message = "Jangan berkecil hati. Website ini kaya akan literatur ekonomi. Mari pelajari kembali dinamika nilai tukar Rupiah di halaman atas!";
    }

    quizCard.innerHTML = `
      <div class="quiz-results-container">
        <div class="quiz-results-icon">
          <i class="lucide-award"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/></svg></i>
        </div>
        <h3 class="quiz-results-title">Evaluasi Pemahaman Selesai!</h3>
        <p class="quiz-badge" style="display:inline-block; margin-bottom:15px;">Predikat: ${rank}</p>
        <div class="quiz-results-score">${score} / ${quizData.length}</div>
        <p class="quiz-results-desc">${message}</p>
        <button id="quiz-restart-btn" class="btn-secondary" style="margin: 0 auto;">
          Ulangi Evaluasi Kuis 
          <i class="lucide-refresh-cw" style="width:16px;height:16px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg></i>
        </button>
      </div>
    `;

    document.getElementById("quiz-restart-btn").addEventListener("click", () => {
      currentQuestionIndex = 0;
      score = 0;

