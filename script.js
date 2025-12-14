/**********************************************************
 * Daily Word Site – FINAL script.js
 * 기능:
 * - 엔터키 제출
 * - 1초당 1회 입력 제한
 * - 단어 누적 랭킹
 * - 실시간 1위 단어 → h1 + 브라우저 제목
 * - 날짜 변경 시 "n월 n일의 단어 : 1위" 기록
 **********************************************************/

/* ===== 상수 ===== */
const LIMIT_TIME = 1 * 1000; // 1초 제한
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

/* ===== 날짜 ===== */
function getTodayString() {
  const d = new Date();
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/* ===== 날짜 변경 감지 ===== */
function checkDateChange() {
  const today = getTodayString();
  const lastDate = localStorage.getItem(LAST_DATE_KEY);

  if (lastDate && lastDate !== today) {
    saveDailyHistory(lastDate);
  }

  localStorage.setItem(LAST_DATE_KEY, today);
}

/* ===== 날짜 기록 ===== */
function saveDailyHistory(date) {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  const ranking = getRanking();

  if (ranking.length === 0) return;

  history.push({
    date: date,
    topWord: ranking[0].word,
    count: ranking[0].count,
  });

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/* ===== 단어 데이터 ===== */
function getWordData() {
  return JSON.parse(localStorage.getItem(WORD_COUNTS_KEY)) || {};
}

function saveWordData(data) {
  localStorage.setItem(WORD_COUNTS_KEY, JSON.stringify(data));
}

function addWord(word) {
  const data = getWordData();
  data[word] = (data[word] || 0) + 1;
  saveWordData(data);
}

/* ===== 랭킹 계산 ===== */
function getRanking() {
  const data = getWordData();
  return Object.entries(data)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
}

/* ===== 화면 렌더링 ===== */
function render() {
  const ranking = getRanking();
  if (ranking.length === 0) return;

  // 1위 단어
  const topWord = ranking[0].word;
  wordEl.textContent = topWord;

  // 제목 변경
  document.title = topWord;
  document.querySelector("h1").textContent = topWord;

  // 애니메이션
  wordEl.classList.remove("animate");
  void wordEl.offsetWidth;
  wordEl.classList.add("animate");

  // 랭킹 표시
  rankingEl.innerHTML = "";
  ranking.slice(0, 5).forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}위 · ${item.word} (${item.count})`;
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
    const remain = Math.ceil((LIMIT_TIME - (now - lastTime)) / 1000);
    feedback.textContent = `⏳ ${remain}초 후 다시 입력하세요`;
    return;
  }

  localStorage.setItem(LAST_SUBMIT_KEY, now);
  addWord(word);
  render();

  feedback.textContent = "단어가 반영되었습니다";
  input.value = "";
  input.focus();
});

/* ===== 초기 실행 ===== */
checkDateChange();
render();

console.log("✅ FINAL script.js LOADED");
