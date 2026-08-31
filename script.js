document.addEventListener('DOMContentLoaded', () => {

  // 1. 스크롤 위치 감지 및 등장 애니메이션 (Intersection Observer)
  const observerOptions = {
    root: document.querySelector('.scroll-container'),
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-target').forEach(el => observer.observe(el));

// 메인 2: 2초 간격 자동 이미지 슬라이더 로직
  const slideImages = document.querySelectorAll('.slide-frame .slide-img');
  let currentSlideIndex = 0;

  if (slideImages.length > 0) {
    setInterval(() => {
      // 현재 활성화된 이미지 숨기기
      slideImages[currentSlideIndex].classList.remove('active');
      
      // 다음 이미지 인덱스 계산 (마지막이면 다시 첫 번째로)
      currentSlideIndex = (currentSlideIndex + 1) % slideImages.length;
      
      // 다음 이미지 보여주기
      slideImages[currentSlideIndex].classList.add('active');
    }, 2000); // 2000ms = 2초
  }


  // 2. 3*3 그리드: A1 -> A2 이미지 교체 & 툴팁 제어 (PC 마우스 + 모바일 터치 대응)
  const gridItems = document.querySelectorAll('.grid-item');
  const tooltip = document.getElementById('cursorTooltip');
  let activeTouchItem = null; // 모바일에서 현재 터치 선택된 항목 추적

  gridItems.forEach(item => {
    const img = item.querySelector('img');
    const originalSrc = img.src;
    const hoverSrc = img.getAttribute('data-hover-src');
    const tooltipText = item.getAttribute('data-tooltip');

    // [PC] 마우스 진입 시 A2 이미지로 교체 및 툴팁 활성화
    item.addEventListener('mouseenter', () => {
      if (hoverSrc) img.src = hoverSrc;
      if (tooltipText) {
        tooltip.textContent = tooltipText;
        tooltip.classList.add('active');
      }
    });

    // [PC] 마우스 이동 시 커서 상단에 툴팁 따라다님
    item.addEventListener('mousemove', (e) => {
      const offsetX = 12;
      const offsetY = -35;
      tooltip.style.transform = `translate(${e.clientX + offsetX}px, ${e.clientY + offsetY}px)`;
    });

    // [PC] 마우스 이탈 시 원본 A1 이미지로 복구 및 툴팁 비활성화
    item.addEventListener('mouseleave', () => {
      img.src = originalSrc;
      tooltip.classList.remove('active');
    });

    // [모바일 터치 대응] 첫 번째 터치는 A2 이미지+툴팁 노출, 두 번째 터치 시 상세페이지 이동
    item.addEventListener('click', (e) => {
      const isTouchDevice = window.matchMedia('(hover: none)').matches;

      if (isTouchDevice) {
        if (activeTouchItem !== item) {
          e.preventDefault(); // 첫 터치 시 페이지 즉시 이동 방지

          if (activeTouchItem) {
            const prevImg = activeTouchItem.querySelector('img');
            prevImg.src = prevImg.getAttribute('data-original-src') || prevImg.src;
          }

          img.setAttribute('data-original-src', originalSrc);
          if (hoverSrc) img.src = hoverSrc;

          if (tooltipText) {
            tooltip.textContent = tooltipText;
            tooltip.classList.add('active');
            const rect = item.getBoundingClientRect();
            tooltip.style.transform = `translate(${rect.left}px, ${rect.top - 30}px)`;
          }

          activeTouchItem = item;
        }
      }
    });
  });

  // 모바일에서 그리드 외부 영역 터치 시 툴팁 및 호버 이미지 해제
  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.grid-item') && activeTouchItem) {
      const prevImg = activeTouchItem.querySelector('img');
      const originalSrc = prevImg.getAttribute('data-original-src');
      if (originalSrc) prevImg.src = originalSrc;

      tooltip.classList.remove('active');
      activeTouchItem = null;
    }
  });

});

// 3. 네비게이션 버튼 클릭 시 해당 섹션 스크롤 이동 함수
function scrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth' });
  }
}