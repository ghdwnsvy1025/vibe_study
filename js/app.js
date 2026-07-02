let currentSlide = 0;
let totalSlides = 0;

function initSlides() {
  const slides = document.querySelectorAll('.slide');
  totalSlides = slides.length;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const counter = document.getElementById('slideCounter');

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToSlide(currentSlide + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToSlide(currentSlide - 1);
  });

  let touchStartX = 0;
  const viewport = document.getElementById('slide-viewport');
  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    }
  }, { passive: true });

  updateSlideUI();
}

function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;

  const slides = document.querySelectorAll('.slide');
  slides[currentSlide].classList.remove('active');
  slides[currentSlide].classList.add('prev');

  currentSlide = index;

  slides.forEach((s, i) => {
    s.classList.toggle('active', i === currentSlide);
    s.classList.toggle('prev', i < currentSlide);
    if (i === currentSlide) s.scrollTop = 0;
  });

  updateSlideUI();
}

function updateSlideUI() {
  document.getElementById('prevBtn').disabled = currentSlide === 0;
  document.getElementById('nextBtn').disabled = currentSlide === totalSlides - 1;
  document.getElementById('slideCounter').textContent = `${currentSlide + 1} / ${totalSlides}`;
}

function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  for (let i = 0; i < 45; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    container.appendChild(star);
  }
}

function initChecklist() {
  const boxes = document.querySelectorAll('.check-box');
  const saved = JSON.parse(localStorage.getItem('vibe-checklist') || '{}');

  boxes.forEach((box) => {
    if (saved[box.dataset.id]) box.checked = true;
    box.addEventListener('change', () => {
      saved[box.dataset.id] = box.checked;
      localStorage.setItem('vibe-checklist', JSON.stringify(saved));
      const all = [...boxes].every((b) => b.checked);
      document.getElementById('checklistComplete').classList.toggle('hidden', !all);
    });
  });

  const all = [...boxes].every((b) => b.checked);
  document.getElementById('checklistComplete').classList.toggle('hidden', !all);
}

function initShare() {
  const urlInput = document.getElementById('shareUrl');
  const copyBtn = document.getElementById('copyBtn');
  const toast = document.getElementById('copyToast');

  urlInput.value = window.location.href;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(urlInput.value);
    } catch {
      urlInput.select();
      document.execCommand('copy');
    }
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2500);
  });
}

function initPromptCopy() {
  const promptEl = document.getElementById('cursorPrompt');
  const copyBtn = document.getElementById('copyPromptBtn');
  const toast = document.getElementById('promptCopyToast');
  if (!promptEl || !copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const text = promptEl.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    toast.classList.remove('hidden');
    copyBtn.textContent = '✓ 복사 완료!';
    setTimeout(() => {
      toast.classList.add('hidden');
      copyBtn.textContent = '📋 프롬프트 복사하기';
    }, 2500);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  createStars();
  initSlides();
  initChecklist();
  initShare();
  initPromptCopy();
});
