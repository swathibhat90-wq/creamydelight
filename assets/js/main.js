/**
* Template Name: Craftivo
* Template URL: https://bootstrapmade.com/craftivo-bootstrap-portfolio-template/
* Updated: Oct 04 2025 with Bootstrap v5.3.8
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout, filters and pagination
   */
  const PORTFOLIO_PAGE_SIZE = 12;

  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let defaultFilter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    const container = isotopeItem.querySelector('.isotope-container');
    const pagination = isotopeItem.querySelector('.portfolio-pagination');
    const allItems = Array.from(isotopeItem.querySelectorAll('.isotope-item'));

    let initIsotope;
    let currentFilter = defaultFilter;
    let currentPage = 1;

    function matchesFilter(el, selector) {
      return selector === '*' ? true : el.matches(selector);
    }

    function loadImages(items) {
      items.forEach(function(el) {
        const img = el.querySelector('img[data-src]');
        if (img && img.src !== img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    }

    function renderPage() {
      if (!initIsotope) return;

      const matching = allItems.filter(el => matchesFilter(el, currentFilter));
      const totalPages = Math.max(1, Math.ceil(matching.length / PORTFOLIO_PAGE_SIZE));
      currentPage = Math.min(Math.max(1, currentPage), totalPages);

      const start = (currentPage - 1) * PORTFOLIO_PAGE_SIZE;
      const pageSlice = matching.slice(start, start + PORTFOLIO_PAGE_SIZE);
      const pageItems = new Set(pageSlice);

      loadImages(pageSlice);

      initIsotope.arrange({
        filter: function(el) {
          return matchesFilter(el, currentFilter) && pageItems.has(el);
        }
      });

      if (pagination) {
        renderPaginationControls(totalPages);
      }

      if (typeof aosInit === 'function') {
        aosInit();
      }
    }

    function renderPaginationControls(totalPages) {
      const pagesList = pagination.querySelector('.pagination-pages');
      const prevBtn = pagination.querySelector('.pagination-prev');
      const nextBtn = pagination.querySelector('.pagination-next');

      pagination.classList.toggle('pagination-hidden', totalPages <= 1);
      if (totalPages <= 1) return;

      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;

      const pageNumbers = getPageNumbers(currentPage, totalPages);
      pagesList.innerHTML = '';
      pageNumbers.forEach(function(page) {
        const li = document.createElement('li');
        if (page === '...') {
          li.textContent = '...';
          li.classList.add('pagination-ellipsis');
        } else {
          li.textContent = page;
          if (page === currentPage) li.classList.add('pagination-active');
          li.addEventListener('click', function() {
            currentPage = page;
            renderPage();
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
        pagesList.appendChild(li);
      });
    }

    function getPageNumbers(current, total) {
      const pages = [];
      const window = 1;
      for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - window && i <= current + window)) {
          pages.push(i);
        } else if (pages[pages.length - 1] !== '...') {
          pages.push('...');
        }
      }
      return pages;
    }

    imagesLoaded(container, function() {
      initIsotope = new Isotope(container, {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        sortBy: sort,
        transitionDuration: 0
      });
      renderPage();
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        currentFilter = this.getAttribute('data-filter');
        currentPage = 1;
        renderPage();
      }, false);
    });

    if (pagination) {
      pagination.querySelector('.pagination-prev').addEventListener('click', function() {
        if (currentPage > 1) {
          currentPage -= 1;
          renderPage();
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      pagination.querySelector('.pagination-next').addEventListener('click', function() {
        currentPage += 1;
        renderPage();
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();