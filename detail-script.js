document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('audioPlayer');
  const playBtn = document.getElementById('playBtn');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  const progressBar = document.getElementById('progressBar');
  const progressContainer = document.getElementById('progressContainer');

  // 1. 재생 / 일시정지 토글
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = '❚❚'; // 일시정지 아이콘
    } else {
      audio.pause();
      playBtn.textContent = '▶'; // 재생 아이콘
    }
  });

  // 2. 오디오 메타데이터 로드 시 전체 시간 표기
  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
  });

  // 3. 재생 시간 업데이트에 맞춰 시간 및 프로그레스 바 갱신
  audio.addEventListener('timeupdate', () => {
    currentTimeEl.textContent = formatTime(audio.currentTime);
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
  });

  // 4. 오디오 재생 종료 시 버튼 원복
  audio.addEventListener('ended', () => {
    playBtn.textContent = '▶';
    progressBar.style.width = '0%';
  });

  // 5. 프로그레스 바 클릭 시 해당 위치로 재생 시간 이동
  progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
  });

  // 초 단위 시간을 00:00 형태로 포맷팅하는 함수
  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
});