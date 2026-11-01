// Mobile Menu Navigation Toggle
const navbar = document.getElementById("navbar");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

if (menuBtn && navLinks) {
  menuBtn.onclick = () => {
    navLinks.classList.toggle("open");
    menuBtn.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
  };
  document.querySelectorAll(".nav-links a").forEach(a => {
    a.onclick = () => {
      navLinks.classList.remove("open");
      menuBtn.textContent = "☰";
    };
  });
}

// Scroll Reveal Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach(e => observer.observe(e));

// Custom Toast Message Function
function showToast(msg) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  if (toast && toastMsg) {
    toastMsg.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }
}

// Form Submission Handler for Feedback
function handleFormSubmit(e) {
  e.preventDefault();
  showToast("Thank you! Your message has been sent to Team Leader Ahmad Zulfaaiz Haikal.");
  e.target.reset();
}

// -------------------------------------------------------------
// Live Simulator Interactive Drag & Detect Engine
// -------------------------------------------------------------
const canvas = document.getElementById("simCanvas");
const wrapper = document.getElementById("canvasWrapper");

if (canvas && wrapper) {
  const ctx = canvas.getContext("2d");
  let width, height;

  function resizeCanvas() {
    width = canvas.width = wrapper.clientWidth;
    height = canvas.height = wrapper.clientHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const trailer = { x: 0, y: 0, w: 110, h: 240 };
  const bike = { x: 120, y: 130, radius: 18, isDragging: false };

  function setBikePos(type) {
    const cx = width / 2;
    const cy = height / 2;
    if (type === 'left') {
      bike.x = cx - 110;
      bike.y = cy;
    } else if (type === 'right') {
      bike.x = cx + 110;
      bike.y = cy;
    } else if (type === 'behind') {
      bike.x = cx;
      bike.y = cy + 170;
    } else if (type === 'clear') {
      bike.x = cx - 180;
      bike.y = cy - 140;
    }
  }
  window.setBikePos = setBikePos;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDrag(e) {
    const pos = getPos(e);
    const dist = Math.hypot(pos.x - bike.x, pos.y - bike.y);
    if (dist < bike.radius + 20) {
      bike.isDragging = true;
      e.preventDefault();
    }
  }

  function moveDrag(e) {
    if (!bike.isDragging) return;
    const pos = getPos(e);
    bike.x = Math.max(30, Math.min(width - 30, pos.x));
    bike.y = Math.max(30, Math.min(height - 30, pos.y));
    e.preventDefault();
  }

  function stopDrag() {
    bike.isDragging = false;
  }

  canvas.addEventListener("mousedown", startDrag);
  canvas.addEventListener("mousemove", moveDrag);
  window.addEventListener("mouseup", stopDrag);

  canvas.addEventListener("touchstart", startDrag, { passive: false });
  canvas.addEventListener("touchmove", moveDrag, { passive: false });
  window.addEventListener("touchend", stopDrag);

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    trailer.x = cx - trailer.w / 2;
    trailer.y = cy - trailer.h / 2;

    const zones = {
      front: { x: cx - 70, y: trailer.y - 70, w: 140, h: 65, name: 'FRONT' },
      left: { x: trailer.x - 90, y: trailer.y, w: 85, h: trailer.h, name: 'LEFT' },
      right: { x: trailer.x + trailer.w + 5, y: trailer.y, w: 85, h: trailer.h, name: 'RIGHT' },
      behind: { x: cx - 70, y: trailer.y + trailer.h + 5, w: 140, h: 65, name: 'BEHIND' }
    };

    let activeZone = null;

    for (const [key, z] of Object.entries(zones)) {
      if (bike.x >= z.x && bike.x <= z.x + z.w && bike.y >= z.y && bike.y <= z.y + z.h) {
        activeZone = z;
        activeZone.key = key;
        break;
      }
    }

    const statusText = document.getElementById("statusText");
    if (statusText) {
      if (activeZone) {
        statusText.textContent = `HAZARD DETECTED IN ${activeZone.name} ZONE!`;
        statusText.style.color = "#ff2a55";
      } else {
        statusText.textContent = "ALL ZONES CLEAR";
        statusText.style.color = "#10b981";
      }
    }

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Radar rings
    ctx.strokeStyle = "rgba(239, 68, 68, 0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.arc(cx, cy, 140, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 210, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    // Zones
    for (const [key, z] of Object.entries(zones)) {
      const isActive = activeZone && activeZone.key === key;
      ctx.fillStyle = isActive ? "rgba(255, 42, 85, 0.28)" : "rgba(255, 255, 255, 0.04)";
      ctx.strokeStyle = isActive ? "#ff2a55" : "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = isActive ? 2 : 1;

      ctx.fillRect(z.x, z.y, z.w, z.h);
      ctx.strokeRect(z.x, z.y, z.w, z.h);

      ctx.fillStyle = isActive ? "#ff2a55" : "#a89a9f";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(z.name, z.x + z.w / 2, z.y + z.h / 2 + 4);
    }

    // Trailer Frame
    ctx.fillStyle = "#1b1115";
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.fillRect(trailer.x, trailer.y, trailer.w, trailer.h);
    ctx.strokeRect(trailer.x, trailer.y, trailer.w, trailer.h);

    // Wheels
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#7f1d1d";
    ctx.fillRect(trailer.x - 8, trailer.y + 20, 8, 40);
    ctx.strokeRect(trailer.x - 8, trailer.y + 20, 8, 40);
    ctx.fillRect(trailer.x + trailer.w, trailer.y + 20, 8, 40);
    ctx.strokeRect(trailer.x + trailer.w, trailer.y + 20, 8, 40);

    ctx.fillRect(trailer.x - 8, trailer.y + trailer.h - 60, 8, 40);
    ctx.strokeRect(trailer.x - 8, trailer.y + trailer.h - 60, 8, 40);
    ctx.fillRect(trailer.x + trailer.w, trailer.y + trailer.h - 60, 8, 40);
    ctx.strokeRect(trailer.x + trailer.w, trailer.y + trailer.h - 60, 8, 40);

    // LiDAR Sensor
    ctx.fillStyle = "#140a0e";
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();

    // Laser Ray
    ctx.strokeStyle = activeZone ? "#ff2a55" : "rgba(239, 68, 68, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bike.x, bike.y); ctx.stroke();
    ctx.setLineDash([]);

    // Motorcycle Target
    ctx.fillStyle = activeZone ? "#ff2a55" : "#06b6d4";
    ctx.beginPath(); ctx.arc(bike.x, bike.y, bike.radius, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🏍️", bike.x, bike.y + 5);

    requestAnimationFrame(draw);
  }

  setBikePos('right');
  draw();
}

// -------------------------------------------------------------
// Live Comments & Feedback Persistence Engine
// -------------------------------------------------------------
const defaultComments = [
  {
    name: "Dr. Fara Ashikin binti Ali (Supervisor)",
    text: "Impressive sub-50ms reaction time with the ESP32 setup! The single 360° LiDAR mounting provides essential coverage for semi-trailers.",
    time: "Sep 6, 2026, 02:45 PM"
  },
  {
    name: "Dr. Mohd Saad bin Hamid",
    text: "Excellent practical innovation for heavy vehicle blind spot elimination. Excited to see the live demonstration at the Grand Final!",
    time: "Sep 6, 2026, 05:10 PM"
  },
  {
    name: "Irsyad",
    text: "Terbaikkkkkk",
    time: "Sep 6, 2026, 01:10 PM"
  }
];

function loadComments() {
  const stored = localStorage.getItem("astss_comments");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch(e) {
      return defaultComments;
    }
  }
  return defaultComments;
}

let commentsData = loadComments();

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderComments() {
  const container = document.getElementById("commentsList");
  const countBadge = document.getElementById("commentCountBadge");
  if (!container) return;

  if (countBadge) {
    countBadge.textContent = `${commentsData.length} Comment${commentsData.length === 1 ? '' : 's'}`;
  }

  if (commentsData.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:30px; background:var(--bg-card); border:1px solid var(--line); border-radius:18px; color:var(--text-muted); font-size:14px;">No comments yet. Be the first to share your feedback!</div>`;
    return;
  }

  container.innerHTML = commentsData.map(c => {
    const initial = c.name ? c.name.trim().charAt(0).toUpperCase() : "?";
    return `
      <div style="background:var(--bg-card); border:1px solid var(--line); border-radius:18px; padding:20px; transition:0.3s;" class="reveal visible">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; gap:12px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg, var(--accent-red), var(--accent-darkred)); color:#fff; display:grid; place-items:center; font-weight:800; font-size:15px; box-shadow:0 0 10px var(--glow-red); flex-shrink:0;">
              ${initial}
            </div>
            <div>
              <strong style="color:#fff; font-size:15px; display:block; line-height:1.2;">${escapeHtml(c.name)}</strong>
              <span style="font-size:11px; color:var(--text-muted); font-family:var(--font-mono);">${escapeHtml(c.time)}</span>
            </div>
          </div>
          <span style="font-size:10px; font-weight:700; background:rgba(255,255,255,0.05); border:1px solid var(--line); color:var(--text-muted); padding:3px 8px; border-radius:6px;">LIVE USER</span>
        </div>
        <p style="color:var(--text-main); font-size:14px; line-height:1.6; margin-top:6px; word-break:break-word;">
          ${escapeHtml(c.text)}
        </p>
      </div>
    `;
  }).join('');
}

function postComment(e) {
  e.preventDefault();
  const nameInput = document.getElementById("commentName");
  const textInput = document.getElementById("commentText");

  if (!nameInput || !textInput) return;

  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  if (!name || !text) return;

  const now = new Date();
  const formattedTime = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }) + ", " + now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  const newComment = {
    name: name,
    text: text,
    time: formattedTime
  };

  commentsData.unshift(newComment);
  localStorage.setItem("astss_comments", JSON.stringify(commentsData));

  renderComments();

  nameInput.value = "";
  textInput.value = "";

  showToast("Comment posted live successfully!");
}

document.addEventListener("DOMContentLoaded", () => {
  renderComments();
});