const TOTAL_SLIDES = 10;
let currentSlide = 0;

// ── 슬라이드 네비게이션 ──
function initSlides() {
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('slideDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `슬라이드 ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    } else if (e.key === 'Home') {
      goToSlide(0);
    } else if (e.key === 'End') {
      goToSlide(TOTAL_SLIDES - 1);
    }
  });

  let touchStartX = 0;
  const viewport = document.getElementById('slide-viewport');
  viewport.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    }
  }, { passive: true });

  updateSlideUI();
}

function goToSlide(index) {
  if (index < 0 || index >= TOTAL_SLIDES) return;

  const slides = document.querySelectorAll('.slide');
  slides[currentSlide].classList.remove('active');
  slides[currentSlide].classList.add('prev');

  currentSlide = index;

  slides.forEach((s, i) => {
    s.classList.toggle('active', i === currentSlide);
    s.classList.toggle('prev', i < currentSlide);
  });

  updateSlideUI();
}

function updateSlideUI() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dots = document.querySelectorAll('.slide-dot');

  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === TOTAL_SLIDES - 1;

  dots.forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i === currentSlide) dot.classList.add('active');
    else if (i < currentSlide) dot.classList.add('done');
  });
}

// ── 별 배경 ──
function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    star.style.animationDuration = `${3 + Math.random() * 3}s`;
    if (Math.random() > 0.75) {
      star.style.width = '3px';
      star.style.height = '3px';
    }
    container.appendChild(star);
  }
}

// ── 프롬프트 실습 ──
const AI_RESPONSES = {
  default: {
    steps: [
      '프롬프트를 분석하고 있어요...',
      '색상과 레이아웃을 적용할게요...',
      '모바일 반응형도 추가할게요...',
      '✅ 완성! 아래 미리보기를 확인해 보세요.',
    ],
    title: '맞춤 웹페이지',
    desc: '요청하신 느낌으로 페이지가 만들어졌어요',
  },
  intro: {
    steps: [
      '소개 페이지 구조를 설계할게요...',
      '보라·금 테마 색상 적용...',
      '부드러운 애니메이션 추가...',
      '✅ 소개 페이지 초안 완성!',
    ],
    title: '소개 페이지',
    desc: '세련된 분위기, 금색 포인트',
  },
  meeting: {
    steps: [
      '모임 소개 레이아웃 구성...',
      '일정·연락처 섹션 추가...',
      '따뜻한 색감 적용...',
      '✅ 모임 소개 페이지 완성!',
    ],
    title: '모임 소개',
    desc: '일정·연락처 포함',
  },
  landing: {
    steps: [
      '랜딩 페이지 구조 설계...',
      '큰 제목과 CTA 버튼 배치...',
      '모바일 최적화 진행...',
      '✅ 랜딩 페이지 완성!',
    ],
    title: '랜딩 페이지',
    desc: '큰 글씨, 모바일 친화적',
  },
};

function detectPromptType(text) {
  if (text.includes('소개') && !text.includes('모임')) return 'intro';
  if (text.includes('모임') || text.includes('일정')) return 'meeting';
  if (text.includes('랜딩') || text.includes('버튼')) return 'landing';
  return 'default';
}

function typeText(element, text, speed = 20) {
  return new Promise((resolve) => {
    let i = 0;
    element.classList.add('typing-cursor');
    const interval = setInterval(() => {
      element.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        element.classList.remove('typing-cursor');
        resolve();
      }
    }, speed);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function simulateAI() {
  const input = document.getElementById('promptInput');
  const responseEl = document.getElementById('aiResponse');
  const previewCard = document.getElementById('previewCard');
  const previewTitle = document.getElementById('previewTitle');
  const previewDesc = document.getElementById('previewDesc');
  const btn = document.getElementById('simulateBtn');

  const prompt = input.value.trim();
  if (!prompt) {
    responseEl.innerHTML = '<span class="text-red-400">프롬프트를 먼저 써 주세요!</span>';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'AI가 작업 중...';
  previewCard.classList.add('hidden');
  responseEl.innerHTML = '';

  const data = AI_RESPONSES[detectPromptType(prompt)];

  for (const step of data.steps) {
    const line = document.createElement('div');
    line.className = 'mb-1 text-gray-400';
    responseEl.appendChild(line);
    await typeText(line, step);
    await sleep(350);
  }

  previewTitle.textContent = data.title;
  previewDesc.textContent = data.desc;
  previewCard.classList.remove('hidden');

  btn.disabled = false;
  btn.textContent = 'AI에게 보내기 (체험)';
  markPromptChecked();
}

function initPromptExamples() {
  const input = document.getElementById('promptInput');
  document.querySelectorAll('.prompt-example').forEach((btn) => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.prompt;
      input.focus();
    });
  });
  document.getElementById('simulateBtn').addEventListener('click', simulateAI);
}

// ── 체크리스트 ──
function initChecklist() {
  const boxes = document.querySelectorAll('.check-box');
  const saved = JSON.parse(localStorage.getItem('vibe-checklist') || '{}');

  boxes.forEach((box) => {
    if (saved[box.dataset.id]) box.checked = true;

    box.addEventListener('change', () => {
      saved[box.dataset.id] = box.checked;
      localStorage.setItem('vibe-checklist', JSON.stringify(saved));
      checkAllComplete();
    });
  });

  checkAllComplete();
}

function checkAllComplete() {
  const boxes = document.querySelectorAll('.check-box');
  const allChecked = [...boxes].every((b) => b.checked);
  document.getElementById('checklistComplete').classList.toggle('hidden', !allChecked);
}

function markPromptChecked() {
  const box = document.querySelector('.check-box[data-id="prompt"]');
  if (box && !box.checked) {
    box.checked = true;
    box.dispatchEvent(new Event('change'));
  }
}

// ── 공유 ──
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

// ── 초기화 ──
document.addEventListener('DOMContentLoaded', () => {
  createStars();
  initSlides();
  initPromptExamples();
  initChecklist();
  initShare();
});
