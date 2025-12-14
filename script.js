// ===== 날짜 표시 =====
document.getElementById("date").textContent =
  new Date().toLocaleDateString("ko-KR");

// ===== DOM =====
const form = document.getElementById("wordForm");
const input = document.getElementById("wordInput");
const feedback = document.getElementById("feedback");
const wordEl = document.getElementById("todayWord");
const themeToggle = document.getElementById("themeToggle");
const shareBtn = document.getElementById("shareBtn");

// ===== 분당 1회 제한 설정 =====
const LIMIT_TIME = 3 * 1000; // 3초
const LAST_SUBMIT_KEY = "lastSubmitTime";

// ===== 엔터 제출 + 제한 =====
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const word = input.value.trim();
  if (!word) return;

  const lastTime = localStorage.getItem(LAST_SUBMIT_KEY);
  const now = Date.now();

  if (lastTime && now - lastTime < LIMIT_TIME) {
    const remain = Math.ceil((LIMIT_TIME - (now - lastTime)) / 1000);
    feedback.textContent = `⏳ ${remain}초만 기다려 주세요`;
    return;
  }

  localStorage.setItem(LAST_SUBMIT_KEY, now);
  localStorage.setItem("todayWord", word);

  showWord(word);
  feedback.textContent = "오늘의 단어가 기록되었습니다.";
  input.value = "";
  input.focus();
});

// ===== 단어 표시 + 애니메이션 =====
function showWord(word) {
  wordEl.textContent = word;
  wordEl.classList.remove("animate");
  void wordEl.offsetWidth; // 리플로우
  wordEl.classList.add("animate");
}

// 새로고침 시 유지
const savedWord = localStorage.getItem("todayWord");
if (savedWord) showWord(savedWord);

// ===== 다크모드 =====
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") document.body.classList.add("dark");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const mode = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", mode);
});

// ===== 공유 기능 =====
shareBtn.addEventListener("click", () => {
  const word = localStorage.getItem("todayWord");
  if (!word) return;

  const text = `오늘의 단어: ${word}`;

  if (navigator.share) {
    navigator.share({
      title: "Today's Word",
      text: text,
      url: location.href,
    });
  } else {
    navigator.clipboard.writeText(text);
    feedback.textContent = "단어가 클립보드에 복사되었습니다.";
  }
});
