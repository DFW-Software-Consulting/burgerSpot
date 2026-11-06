'use strict';

/**
 * The Burger Spot - demo site by DFW Software Consulting.
 * Plain JavaScript, no dependencies. Every query below targets an element
 * that exists in index.html; optional pieces are guarded.
 */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/**
 * Navbar toggle (mobile)
 */
const navbar = $("[data-navbar]");
const navbarLinks = $$("[data-nav-link]");
const navbarCloseTargets = $$("[data-nav-link], [data-nav-link-cta]");
const menuToggleBtn = $("[data-menu-toggle-btn]");

const setNav = (open) => {
  navbar.classList.toggle("active", open);
  menuToggleBtn.classList.toggle("active", open);
  menuToggleBtn.setAttribute("aria-expanded", String(open));
  menuToggleBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};

menuToggleBtn.addEventListener("click", () => {
  setNav(!navbar.classList.contains("active"));
});

navbarCloseTargets.forEach((link) => {
  link.addEventListener("click", () => setNav(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navbar.classList.contains("active")) {
    setNav(false);
    menuToggleBtn.focus();
  }
});

/**
 * Header sticky state & back to top
 */
const header = $("[data-header]");
const backTopBtn = $("[data-back-top-btn]");

const onScrollState = () => {
  const scrolled = window.scrollY >= 100;
  header.classList.toggle("active", scrolled);
  backTopBtn.classList.toggle("active", scrolled);
};

window.addEventListener("scroll", onScrollState, { passive: true });
onScrollState();

/**
 * Highlight the nav link of the section currently in view
 */
if ("IntersectionObserver" in window) {
  const linkFor = new Map(
    navbarLinks.map((link) => [link.getAttribute("href").slice(1), link])
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navbarLinks.forEach((link) => link.removeAttribute("aria-current"));
      const active = linkFor.get(entry.target.id);
      if (active) active.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  linkFor.forEach((_link, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

/**
 * Delivery rider: slides sideways in step with the scroll position.
 * Skipped entirely when the visitor prefers reduced motion.
 */
const deliveryBoy = $("[data-delivery-boy]");

if (deliveryBoy) {
  let ticking = false;

  const moveRider = () => {
    ticking = false;
    if (reduceMotion.matches) {
      deliveryBoy.style.removeProperty("--dx");
      return;
    }
    const rect = deliveryBoy.getBoundingClientRect();
    const range = window.innerHeight + rect.height;
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / range));
    const travel = rect.width * 0.18;
    deliveryBoy.style.setProperty("--dx", `${(progress * travel - travel * 0.7).toFixed(1)}px`);
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(moveRider);
    }
  }, { passive: true });

  reduceMotion.addEventListener("change", moveRider);
  moveRider();
}

/**
 * Menu: category filter + text search (the search overlay filters the menu)
 */
const menuItems = $$("[data-menu-item]");
const filterButtons = $$("[data-filter]");
const menuStatus = $("[data-menu-status]");
const menuEmpty = $("[data-menu-empty]");

const menuState = { category: "all", query: "" };

// Search only the dish name, description and category (not prices or button labels)
const searchText = new Map(menuItems.map((item) => [
  item,
  $$(".card-title, .card-text, .category", item).map((el) => el.textContent).join(" ").toLowerCase(),
]));

const applyMenuFilters = () => {
  const query = menuState.query.trim().toLowerCase();
  let shown = 0;

  menuItems.forEach((item) => {
    const matchesCategory = menuState.category === "all" || item.dataset.category === menuState.category;
    const matchesQuery = !query || searchText.get(item).includes(query);
    const visible = matchesCategory && matchesQuery;
    item.hidden = !visible;
    if (visible) shown += 1;
  });

  menuEmpty.hidden = shown !== 0;

  const parts = [`Showing ${shown} of ${menuItems.length} dishes`];
  if (menuState.category !== "all") {
    const label = $(`[data-filter="${menuState.category}"]`).textContent.trim();
    parts.push(`in ${label}`);
  }
  if (query) parts.push(`matching “${menuState.query.trim()}”`);

  menuStatus.textContent = parts.join(" ") + ".";

  if (query) {
    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "link-btn";
    clear.textContent = "Clear search";
    clear.addEventListener("click", () => {
      menuState.query = "";
      searchInput.value = "";
      applyMenuFilters();
    });
    menuStatus.append(clear);
  }
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    menuState.category = button.dataset.filter;
    filterButtons.forEach((other) => {
      other.setAttribute("aria-pressed", String(other === button));
    });
    applyMenuFilters();
  });
});

/**
 * Search overlay: Esc closes, focus is trapped while open and restored on close
 */
const searchContainer = $("[data-search-container]");
const searchBtn = $("[data-search-btn]");
const searchForm = $("[data-search-form]");
const searchInput = $("[data-search-input]");
const searchClose = $("[data-search-close-btn]");
const searchBackdrop = $("[data-search-backdrop]");

const searchOpen = () => searchContainer.classList.contains("active");

const openSearch = () => {
  setNav(false);
  searchContainer.classList.add("active");
  searchContainer.removeAttribute("aria-hidden");
  document.body.classList.add("active");
  searchBtn.setAttribute("aria-expanded", "true");
  // wait a beat: the overlay's visibility transition must start before it can take focus
  setTimeout(() => {
    searchInput.focus();
    searchInput.select();
  }, 60);
};

const closeSearch = ({ restoreFocus = true } = {}) => {
  searchContainer.classList.remove("active");
  searchContainer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("active");
  searchBtn.setAttribute("aria-expanded", "false");
  if (restoreFocus) searchBtn.focus();
};

searchBtn.addEventListener("click", openSearch);
searchClose.addEventListener("click", () => closeSearch());
searchBackdrop.addEventListener("click", () => closeSearch());

searchInput.addEventListener("input", () => {
  menuState.query = searchInput.value;
  applyMenuFilters();
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  menuState.query = searchInput.value;
  applyMenuFilters();
  closeSearch({ restoreFocus: false });
  const menu = document.getElementById("food-menu");
  menu.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
  menuStatus.setAttribute("tabindex", "-1");
  menuStatus.focus({ preventScroll: true });
});

document.addEventListener("keydown", (event) => {
  if (!searchOpen()) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeSearch();
    return;
  }

  if (event.key === "Tab") {
    const focusable = [searchInput, $(".search-submit", searchForm), searchClose];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

applyMenuFilters();

/**
 * "Order Now" buttons: no ordering backend on a demo, so say so clearly
 */
const toast = $("[data-toast]");
const toastText = $("[data-toast-text]");
const toastClose = $("[data-toast-close]");
let toastTimer;

const hideToast = () => {
  toast.classList.remove("active");
  clearTimeout(toastTimer);
};

const showToast = (message) => {
  toastText.textContent = message;
  toast.classList.add("active");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 9000);
};

toastClose.addEventListener("click", hideToast);

$$("[data-demo-order]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.dataset.demoOrder;
    const what = item ? `“${item}”` : "Your order";
    showToast(`Demo site: online ordering isn't connected, so ${what} wasn't placed. Nothing was sent.`);
  });
});

/**
 * Forms: labelled fields, client-side validation, inline demo confirmation
 */
const dateInput = $("[data-min-today]");

if (dateInput) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  dateInput.min = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

const fieldMessage = (field) => {
  const v = field.validity;
  if (v.valid) return "";
  if (v.valueMissing) return field.dataset.msgRequired || "This field is required.";
  if (v.typeMismatch || v.patternMismatch) return field.dataset.msgInvalid || "Please check this value.";
  if (v.tooShort) return field.dataset.msgInvalid || "That looks too short.";
  if (v.rangeUnderflow) return field.dataset.msgRange || "Please choose a valid value.";
  return field.validationMessage;
};

const showFieldError = (field) => {
  const message = fieldMessage(field);
  const error = document.getElementById(field.getAttribute("aria-describedby"));
  if (message) {
    field.setAttribute("aria-invalid", "true");
  } else {
    field.removeAttribute("aria-invalid");
  }
  if (error) error.textContent = message;
  return !message;
};

const formatDate = (value) => {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

$$("[data-demo-form]").forEach((form) => {
  const fields = $$("input[required], select[required], textarea[required], input[type='email'], input[type='date']", form);
  const status = $("[data-form-status]", form);

  fields.forEach((field) => {
    field.addEventListener("blur", () => showFieldError(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") showFieldError(field);
    });
    field.addEventListener("change", () => {
      if (field.getAttribute("aria-invalid") === "true") showFieldError(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    const invalid = fields.filter((field) => !showFieldError(field));

    if (invalid.length) {
      status.classList.add("is-error");
      status.textContent = invalid.length === 1
        ? "Please fix the highlighted field and try again."
        : `Please fix the ${invalid.length} highlighted fields and try again.`;
      invalid[0].focus();
      return;
    }

    const data = new FormData(form);
    let message;

    if (form.dataset.demoForm === "reservation") {
      const first = String(data.get("name")).trim().split(/\s+/)[0];
      message = `Thanks, ${first}! This is a demo site, so nothing was sent and no table was reserved `
        + `(requested: ${data.get("party")} on ${formatDate(String(data.get("date")))} at ${data.get("time")}).`;
    } else {
      message = "Thanks for subscribing! This is a demo site, so nothing was sent and your email wasn't saved.";
    }

    status.classList.add("is-success");
    status.textContent = message;
    form.reset();
  });
});
