// 🔹 Firebase 설정 (본인 값으로 교체)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
};

// 🔹 Firebase 초기화
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 🔹 오늘 날짜 (UTC 기준)
function getToday() {
  return new Date().toISOString().slice(0, 10);
}

// 🔹 단어 제출
function submitWord() {
  const input = document.getElementById("wordInput");
  let word = input.value.trim().toLowerCase();

  if (!word) return;
  if (word.length > 20) return; // 너무 긴 단어 방지

  const today = getToday();
  const wordRef = database.ref(`words/${today}/${word}`);

  // 숫자 +1 (동시 접속 안전)
  wordRef.transaction(count => (count || 0) + 1);

  input.value = "";
}

// 🔹 오늘의 최다 단어 실시간 감시
function loadTopWord() {
  const today = getToday();

  database.ref(`words/${today}`).on("value", snapshot => {
    const data = snapshot.val();
    if (!data) return;

    let topWord = "";
    let max = 0;

    for (let word in data) {
      if (data[word] > max) {
        max = data[word];
        topWord = word;
      }
    }

    document.title = topWord;
    document.getElementById("todayWord").innerText = topWord;
  });
}

// 실행
loadTopWord();
