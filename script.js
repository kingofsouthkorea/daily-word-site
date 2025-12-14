/* ===== 기본 설정 ===== */
const LIMIT_TIME = 3 * 1000;
const LAST_SUBMIT_KEY = "lastSubmitTime";
const WORD_COUNTS_KEY = "wordCounts";
const HISTORY_KEY = "dailyHistory";
const LAST_DATE_KEY = "lastDate";

/* ===== DOM ===== */
const form = document.getElementById("wordForm");
const input = document.getElementById("wordInput");
const feedback = document.getElementById("feedback");
const wordEl = document.getElementById("todayWord");
const rankingEl = document.getElementById("ranking");

/* ===== 오늘 날짜 ===== */
function getToday() {
  const d = new Date();
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/* ===== 날짜 변경 감지 ===== */
function checkDateChange() {
  const today = getToday();
  const lastDate = localStorage.getItem(LAST_DATE_KEY);

  if (lastDate && lastDate !== today) {
    saveDailyHistory(lastDate);
  }

  localStorage.setItem(LAST_DATE_KEY, today);
}

/* ===== 기록 저장 ===== */
function saveDailyHistory(date) {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  const counts = getWordCounts();

  if (counts.length === 0) return;

  history.push({
    date,
    topWord: counts[0].word,
  });

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/* ===== 단어 카운트 ===== */
function getWordCounts() {
  const data = JSON.parse(localStorage.getItem(WORD_COUNTS_KEY)) || {};
  return Object.entries(data)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
}

function addWord(word) {
  const data = JSON.parse(localStorage.getItem(WORD_COUNTS_KEY)) || {};
  data[word] = (data[word] || 0) + 1;
  localStorage.setItem(WORD_COUNTS_KEY, JSON.stringify(data));
}

/* ===== 화면 갱신 ===== */
function render() {
  const counts = getWordCounts();

  if (counts.length === 0) return;

  // 1위 단어
  const top = counts[0].word;
  wordEl.textContent = top;
  document.title = top;
  document.querySelector("h1").textContent = top;

  // 랭킹 표시
  rankingEl.innerHTML = "";
  counts.slice(0, 5).forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}위 · ${item.word} (${item.count})`;
    rankingEl.appendChild(li);
  });
}

/* ===== 제출 처리 ===== */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const word = input.value.trim();
  if (!word) return;

  const now = Date.now();
  const lastTime = localStorage.getItem(LAST_SUBMIT_KEY);

  if (lastTime && now - lastTime < LIMIT_TIME) {
    feedback.textContent = "⏳ 3초 후 다시 입력하세요";
    return;
  }

  localStorage.setItem(LAST_SUBMIT_KEY, now);
  addWord(word);
  render();

  feedback.textContent = "단어가 반영되었습니다";
  input.value = "";
});

/* ===== 초기 실행 ===== */
checkDateChange();
render();
