// 별 배경 생성
function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  const count = window.innerWidth < 768 ? 40 : 80;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    star.style.animationDuration = `${3 + Math.random() * 3}s`;
    if (Math.random() > 0.7) {
      star.style.width = '3px';
      star.style.height = '3px';
    }
    container.appendChild(star);
  }
}

// 스크롤 시 섹션 등장
function initScrollReveal() {
  const reveals = document.querySelectorAll('.section-reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach((el) => observer.observe(el));
}

// 모바일 메뉴
function initMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => menu.classList.add('hidden'));
  });
}

// 도구 아코디언
function initToolAccordion() {
  document.querySelectorAll('.tool-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.tool-card');
      const content = card.querySelector('.tool-content');
      const arrow = card.querySelector('.tool-arrow');
      const isOpen = !content.classList.contains('hidden');

      document.querySelectorAll('.tool-content').forEach((c) => c.classList.add('hidden'));
      document.querySelectorAll('.tool-arrow').forEach((a) => a.classList.remove('rotate-180'));

      if (!isOpen) {
        content.classList.remove('hidden');
        arrow.classList.add('rotate-180');
      }
    });
  });
}

// 4단계 카드 호버 애니메이션
function initStepCards() {
  document.querySelectorAll('.step-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      const circle = card.querySelector('div');
      circle.classList.add('border-saju-gold', 'shadow-lg', 'shadow-saju-gold/20');
    });
    card.addEventListener('mouseleave', () => {
      const circle = card.querySelector('div');
      circle.classList.remove('border-saju-gold', 'shadow-lg', 'shadow-saju-gold/20');
    });
  });
}

// 프롬프트 예시 버튼
function initPromptExamples() {
  const input = document.getElementById('promptInput');
  document.querySelectorAll('.prompt-example').forEach((btn) => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.prompt;
      input.focus();
    });
  });
}

// AI 응답 시뮬레이션
const AI_RESPONSES = {
  default: {
    steps: [
      '프롬프트를 분석하고 있어요...',
      '사주 테마 색상(보라, 금색)을 적용할게요...',
      '레이아웃을 구성하고 있어요...',
      '모바일 반응형도 추가할게요...',
      '✅ 완성! 아래 미리보기를 확인해 보세요.',
    ],
    title: '맞춤 웹페이지',
    desc: '요청하신 느낌으로 페이지가 만들어졌어요',
  },
  사주: {
    steps: [
      '사주 홈페이지 구조를 설계할게요...',
      '신비로운 보라색 배경 + 금색 포인트 적용...',
      '오행(五行) 아이콘과 부드러운 애니메이션 추가...',
      '✅ 사주 홈페이지 초안이 완성됐어요!',
    ],
    title: '사주 명리 홈페이지',
    desc: '보라·금 테마, 신비로운 분위기',
  },
  운세: {
    steps: [
      '운세 페이지 레이아웃을 만들게요...',
      '큰 글씨, 읽기 쉬운 폰트 적용...',
      '모바일 최적화 진행 중...',
      '✅ 오늘의 운세 페이지 완성!',
    ],
    title: '오늘의 운세',
    desc: '큰 글씨, 모바일 친화적 디자인',
  },
  스터디: {
    steps: [
      '스터디 소개 페이지 구조 설계...',
      '따뜻한 색감과 일정 섹션 추가...',
      '연락처 버튼 배치...',
      '✅ 스터디 소개 페이지 완성!',
    ],
    title: '사주 스터디 모임',
    desc: '따뜻한 느낌, 일정·연락처 포함',
  },
};

function detectPromptType(text) {
  if (text.includes('사주') && (text.includes('홈') || text.includes('페이지'))) return '사주';
  if (text.includes('운세')) return '운세';
  if (text.includes('스터디') || text.includes('모임')) return '스터디';
  return 'default';
}

function typeText(element, text, speed = 25) {
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

async function simulateAI() {
  const input = document.getElementById('promptInput');
  const responseEl = document.getElementById('aiResponse');
  const previewCard = document.getElementById('previewCard');
  const previewTitle = document.getElementById('previewTitle');
  const previewDesc = document.getElementById('previewDesc');
  const btn = document.getElementById('simulateBtn');

  const prompt = input.value.trim();
  if (!prompt) {
    responseEl.innerHTML = '<span class="text-saju-crimson">프롬프트를 먼저 써 주세요! 위 예시 버튼을 눌러도 돼요.</span>';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'AI가 작업 중...';
  previewCard.classList.add('hidden');
  responseEl.innerHTML = '';

  const type = detectPromptType(prompt);
  const data = AI_RESPONSES[type];

  for (const step of data.steps) {
    const line = document.createElement('div');
    line.className = 'mb-2 text-gray-400';
    responseEl.appendChild(line);
    await typeText(line, step);
    await sleep(400);
  }

  previewTitle.textContent = data.title;
  previewDesc.textContent = data.desc;
  previewCard.classList.remove('hidden');
  previewCard.style.animation = 'none';
  previewCard.offsetHeight;
  previewCard.style.animation = 'float 0.6s ease';

  btn.disabled = false;
  btn.textContent = 'AI에게 보내기 (체험)';

  updateProgress(2);
  markPromptChecked();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// 체크리스트
function initChecklist() {
  const boxes = document.querySelectorAll('.check-box');
  const saved = JSON.parse(localStorage.getItem('vibe-checklist') || '{}');

  boxes.forEach((box) => {
    if (saved[box.dataset.id]) {
      box.checked = true;
      box.closest('.check-item').classList.add('opacity-70');
    }

    box.addEventListener('change', () => {
      const id = box.dataset.id;
      saved[id] = box.checked;
      localStorage.setItem('vibe-checklist', JSON.stringify(saved));

      const item = box.closest('.check-item');
      item.classList.toggle('opacity-70', box.checked);
      checkAllComplete();
    });
  });

  checkAllComplete();
}

function checkAllComplete() {
  const boxes = document.querySelectorAll('.check-box');
  const allChecked = [...boxes].every((b) => b.checked);
  const completeEl = document.getElementById('checklistComplete');
  if (allChecked) {
    completeEl.classList.remove('hidden');
    updateProgress(3);
  } else {
    completeEl.classList.add('hidden');
  }
}

function markPromptChecked() {
  const promptBox = document.querySelector('.check-box[data-id="prompt"]');
  if (promptBox && !promptBox.checked) {
    promptBox.checked = true;
    promptBox.dispatchEvent(new Event('change'));
  }
}

// 진행 표시
function updateProgress(step) {
  const dots = document.querySelectorAll('.progress-dot');
  dots.forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i < step) dot.classList.add('done');
    else if (i === step) dot.classList.add('active');
  });
}

// 공유 URL
function initShare() {
  const urlInput = document.getElementById('shareUrl');
  const copyBtn = document.getElementById('copyBtn');
  const toast = document.getElementById('copyToast');

  urlInput.value = window.location.href;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(urlInput.value);
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2500);
    } catch {
      urlInput.select();
      document.execCommand('copy');
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2500);
    }
  });
}

// 스크롤 진행도에 따른 dot 업데이트
function initScrollProgress() {
  const sections = ['intro', 'tools', 'practice', 'share'];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = sections.indexOf(entry.target.id);
          if (idx >= 0) updateProgress(idx);
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

// 시뮬레이션 버튼
function initSimulate() {
  document.getElementById('simulateBtn').addEventListener('click', simulateAI);
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  createStars();
  initScrollReveal();
  initMobileMenu();
  initToolAccordion();
  initStepCards();
  initPromptExamples();
  initChecklist();
  initShare();
  initScrollProgress();
  initSimulate();
  updateProgress(0);
});
