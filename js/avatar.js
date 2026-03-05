/**
 * =========================================
 * Avatar Component Logic
 * Handles interactive behaviors, physics,
 * notifications, and haptic feedback.
 * =========================================
 */
function initAvatar() {

  /**
   * Device Haptic Integration Wrapper
   * @param {number|number[]} pattern - Vibration sequence
   */
  const vibrate = window.vibrate || function(pattern = 10) {
    if (navigator && navigator.vibrate) {
      navigator.vibrate(0);
      navigator.vibrate(pattern);
    }
  };
  window.vibrate = vibrate;

  const container = document.querySelector(".avatar-container");
  const av = document.querySelector(".avatar");

  const DETECT_DISTANCE = 80;
  const ESCAPE_SPEED = "0.2s";
  const ESCAPE_RANGE = 45;
  const RETURN_SPEED = "0.6s";
  const LIMIT_TIME = 5000;

  if (!container || !av) {
    console.error("Avatar elements not found.");
    return;
  }

  const sheet = document.createElement("div");
  sheet.className = "cheat-sheet";
  container.appendChild(sheet);

  /**
   * Updates the cheat sheet UI content based on current state and language.
   */
  function updateSheetContent() {
    const isRel = window.isLimitReleased;

    const numText = isRel
      ? window.t("avatar_max_unlocked")
      : window.t("avatar_max_default");

    const numStyle = isRel
      ? "font-size: 18px; color: #ffcc00; font-weight: 800; text-shadow: 0 0 8px rgba(255,204,0,0.5);"
      : "font-size: 11px; color: #e6dcc8;";

    sheet.innerHTML = `
      <h3>${window.t("avatar_title")}</h3>
      <p style="text-align:center; margin:-5px 0 10px;">
        <span style="font-size:10px; color:#e6dcc8; opacity:0.8;">
          ${window.t("avatar_max_stickers")}
        </span><br>
        <span style="${numStyle}">${numText}</span>
      </p>
      <ul>
        <li><strong>${window.t("avatar_pc")}</strong></li>
        <li><kbd>${window.t("avatar_mid_click")}</kbd> ${window.t("avatar_multiply")}</li>
        <li><kbd>${window.t("avatar_right_drag")}</kbd> ${window.t("avatar_move")}</li>
        <li><kbd>${window.t("avatar_wheel")}</kbd> ${window.t("avatar_scale_rotate")}</li>
        <li style="margin-top:8px;"><strong>${window.t("avatar_mobile")}</strong></li>
        <li><kbd>${window.t("avatar_long_press")}</kbd> ${window.t("avatar_multiply")}</li>
        <li><kbd>${window.t("avatar_two_finger")}</kbd> ${window.t("avatar_scale_rotate")}</li>
      </ul>
      ${
        !isRel
          ? `<p style="text-align:center;margin-top:12px;font-size:11px;color:#ffcc00;">
              ${window.t("avatar_warning")}
            </p>`
          : ""
      }
      <div class="sheet-close-btn"
           style="margin-top:15px; padding:8px; background:rgba(255,255,255,0.1); border-radius:5px; font-size:10px; text-align:center; cursor:pointer; border:1px solid rgba(255,255,255,0.2);">
        ${window.t("avatar_close")}
      </div>
    `;

    const closeBtn = sheet.querySelector(".sheet-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", e => {
        e.stopPropagation();
        vibrate(10);
        sheet.classList.remove("is-show");
      });
    }
  }

  let t = 0;
  let lastTime = Date.now();
  let isHidden = false;
  let tapCount = 0;
  let tapTimer = null;
  let firstTapTime = 0;

  window.isLimitReleased = false;

  const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  /**
   * Resets avatar interaction states.
   */
  function resetAllStates() {
    t = 0;
    tapCount = 0;
    firstTapTime = 0;

    if (tapTimer) {
      clearTimeout(tapTimer);
      tapTimer = null;
    }
  }

  /**
   * Handles the avatar respawn logic and animation.
   * @param {string} mode - The mode of respawn ('shatter' or 'escape').
   */
  function performRespawn(mode) {
    isHidden = false;
    resetAllStates();

    av.classList.remove(
      "hidden-mode",
      "is-shattering",
      "is-returning-from-escape",
      "is-respawning-shatter"
    );

    void av.offsetWidth;

    if (mode === "shatter") {
      av.style.transition = "none";
      av.style.opacity = "0";
      av.style.transform = "translate(0,0)";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          av.classList.add("is-respawning-shatter");

          setTimeout(() => {
            av.classList.remove("is-respawning-shatter");
            av.style.opacity = "1";
            av.style.transition = "";
            vibrate([20, 40, 30]);
          }, 500);
        });
      });
    } else {
      av.style.transition = "transform 1.0s cubic-bezier(0.19, 1, 0.22, 1)";
      av.style.transform = "translate(0,0)";
      av.classList.add("is-returning-from-escape");
      
      vibrate([15, 150, 15, 150, 20]);

      setTimeout(() => {
        av.classList.remove("is-returning-from-escape");
      }, 2000);
    }
  }

  if (!isMobileDevice) {
    document.addEventListener("mousemove", e => {
      if (isHidden || !av || av.classList.contains("is-returning-from-escape")) {
        lastTime = Date.now();
        return;
      }

      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      const rect = av.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) +
        Math.pow(e.clientY - centerY, 2)
      );

      if (distance < DETECT_DISTANCE) {
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

        av.style.transition = `transform ${ESCAPE_SPEED} ease-out`;
        av.style.transform = `translate(${-Math.cos(angle) * ESCAPE_RANGE}px, ${-Math.sin(angle) * ESCAPE_RANGE}px)`;

        t += deltaTime;

        if (t > 5000) {
          handleEscape();
        }
      } else {
        t = Math.max(0, t - deltaTime * 0.5);

        if (!isHidden && tapCount === 0) {
          av.style.transition = `transform ${RETURN_SPEED} ease-in-out`;
          av.style.transform = "translate(0,0)";
        }
      }
    });
  }

  av.addEventListener("click", e => {
    e.stopPropagation();

    if (
      isHidden ||
      av.classList.contains("is-returning-from-escape") ||
      av.classList.contains("is-respawning-shatter")
    ) {
      return;
    }

    const now = Date.now();

    if (!tapTimer) {
      tapCount = 0;
      firstTapTime = now;

      tapTimer = setTimeout(() => {
        if (tapCount >= 5) {
          handleEscape();
        } else {
          handleFail();
        }
        resetTapState();
      }, LIMIT_TIME);
    }

    tapCount++;

    if (tapCount < 4) {
      vibrate(15);
    } else if (tapCount < 9) {
      vibrate([20, 30, 20]);
    }

    const elapsed = now - firstTapTime;

    if (tapCount >= 10 && elapsed < LIMIT_TIME) {
      clearTimeout(tapTimer);
      handleShatter();
      resetTapState();
      return;
    }

    const jumpX = (Math.random() - 0.5) * 120;
    const jumpY = (Math.random() - 0.5) * 120;

    av.style.transition = "transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)";
    av.style.transform = `translate(${jumpX}px, ${jumpY}px)`;
  });

  /**
   * Triggers the avatar shatter sequence.
   */
  function handleShatter() {
    isHidden = true;
    vibrate([50, 40, 100, 40, 200, 40, 300]);

    const wasAlreadyReleased = window.isLimitReleased;

    if (!wasAlreadyReleased) {
      window.isLimitReleased = true;
      window.MAX_STICKERS = 10;
      triggerCenteredToast(window.t("avatar_unlock_toast"));
    }

    updateSheetContent();
    sheet.classList.add("is-show");

    shatterAvatarEffect(av);
    setTimeout(() => performRespawn("shatter"), 5000);
  }

  /**
   * Triggers the avatar escape sequence.
   */
  function handleEscape() {
    isHidden = true;
    
    vibrate(10);
    setTimeout(()=>vibrate(20),360);
    setTimeout(()=>vibrate([30,30,100]),480);
    setTimeout(()=>vibrate(Array(52).fill([40,40]).flat()),640);

    av.style.transition = "none";
    av.style.transform = "translate(0,0)";

    void av.offsetWidth;

    av.classList.add("hidden-mode");

    updateSheetContent();
    sheet.classList.add("is-show");

    setTimeout(() => performRespawn("escape"), 5000);
  }

  /**
   * Handles failed interaction attempts.
   */
  function handleFail() {
    av.style.transition = "transform 0.3s ease-out";
    av.style.transform = "translate(0,0)";
  }

  /**
   * Resets the tapping sequence timers.
   */
  function resetTapState() {
    tapTimer = null;
    tapCount = 0;
    firstTapTime = null;
  }

  /**
   * Retrieves or creates the toast notification layer.
   * @returns {HTMLElement} The toast layer element.
   */
  function getToastLayer() {
    let layer = document.querySelector(".toast-layer");

    if (!layer) {
      layer = document.createElement("div");
      layer.className = "toast-layer";
      document.body.appendChild(layer);
    }

    return layer;
  }

  /**
   * Displays a centered toast notification.
   * @param {string} msg - The message to display.
   */
  function triggerCenteredToast(msg) {
    const layer = getToastLayer();
    const toast = document.createElement("div");
    toast.className = "status-toast";
    toast.innerText = msg;

    layer.prepend(toast);

    setTimeout(() => toast.classList.add("is-show"), 10);

    setTimeout(() => {
      toast.classList.remove("is-show");
      setTimeout(() => toast.remove(), 500);
    }, 2500);
  }

  /**
   * Generates particle effects for the shatter animation.
   * @param {HTMLElement} target - The element to shatter.
   */
  function shatterAvatarEffect(target) {
    const rect = target.getBoundingClientRect();
    const cX = rect.left + rect.width / 2;
    const cY = rect.top + rect.height / 2;

    target.classList.add("is-shattering");

    for (let i = 0; i < 35; i++) {
      const p = document.createElement("div");
      p.className = "shatter-piece";

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 130 + 70;

      p.style.setProperty("--tx", Math.cos(angle) * velocity + "px");
      p.style.setProperty("--ty", Math.sin(angle) * velocity + "px");

      p.style.left = cX + "px";
      p.style.top = cY + "px";
      p.style.animation = `shatter-fly ${Math.random() * 0.5 + 0.4}s ease-out forwards`;

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
  }

  sheet.addEventListener("click", e => e.stopPropagation());

  updateSheetContent();
}

/* ===============================
   Global Export
=============================== */
window.initAvatar = initAvatar;