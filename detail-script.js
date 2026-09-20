document.addEventListener('DOMContentLoaded', () => {

  // 1. 좌측 2초 간격 자동 이미지 슬라이더
  const slideImages = document.querySelectorAll('.detail-slide-frame .detail-slide-img');
  let currentSlideIndex = 0;

  if (slideImages.length > 0) {
    setInterval(() => {
      slideImages[currentSlideIndex].classList.remove('active');
      currentSlideIndex = (currentSlideIndex + 1) % slideImages.length;
      slideImages[currentSlideIndex].classList.add('active');
    }, 2000); // 2000ms = 2초
  }


  // 2. 우측 2개 탭 전환 제어
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      // 기존 active 해제
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // 선택한 탭 active 부여
      btn.classList.add('active');
      document.getElementById(targetTabId).classList.add('active');
    });
  });


  // 3. 커스텀 MP3 오디오 플레이어 로직
  const audio = document.getElementById('audioPlayer');
  const playBtn = document.getElementById('playBtn');
  const progressBar = document.getElementById('progressBar');
  const progressContainer = document.getElementById('progressContainer');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');

  if (audio && playBtn) {
    // 재생/일시정지 토글
    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playBtn.textContent = '❚❚';
      } else {
        audio.pause();
        playBtn.textContent = '▶';
      }
    });

    // 시간 포맷팅 함수 (초 -> mm:ss)
    const formatTime = (seconds) => {
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    // 재생 시간 업데이트
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
      }
    });

    // 메타데이터 로드 시 전체 시간 표시
    audio.addEventListener('loadedmetadata', () => {
      durationEl.textContent = formatTime(audio.duration);
    });

    // 프로그레스 바 클릭 이동
    progressContainer.addEventListener('click', (e) => {
      const width = progressContainer.clientWidth;
      const clickX = e.offsetX;
      const duration = audio.duration;
      audio.currentTime = (clickX / width) * duration;
    });

    // 재생 종료 시 상태 복원
    audio.addEventListener('ended', () => {
      playBtn.textContent = '▶';
      progressBar.style.width = '0%';
    });
  }

});