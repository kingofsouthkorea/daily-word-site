// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyD3NibqQIrgnmlez1s0WhUZ-H4b8YpnPSY",
  authDomain: "daily-word-site-6402f.firebaseapp.com",
  projectId: "daily-word-site-6402f",
  storageBucket: "daily-word-site-6402f.firebasestorage.app",
  messagingSenderId: "144399874318",
  appId: "1:144399874318:web:0e278d40b251952dc67f5f"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 오늘 날짜 (YYYY-MM-DD)
function getToday() {
  return new Date().toISOString().slice(0, 10);
}

// 단어 제출
async function submitWord() {
  const input = document.getElementById("wordInput");
  const word = input.value.trim();
  if (word === "") return;

  const today = getToday();
  const ref = db.collection("dailyWords").doc(today);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    if (!doc.exists) {
      transaction.set(ref, { [word]: 1 });
    } else {
      const data = doc.data();
      const count = data[word] || 0;
      transaction.update(ref, { [word]: count + 1 });
    }
  });

  input.value = "";
}

// 실시간으로 오늘의 단어 갱신
db.collection("dailyWords")
  .doc(getToday())
  .onSnapshot((doc) => {
    if (!doc.exists) {
      document.getElementById("todayWord").innerText =
        "오늘의 단어: 없음";
      document.title = "오늘의 단어";
      return;
    }

    const data = doc.data();
    let topWord = "없음";
    let max = 0;

    for (let word in data) {
      if (data[word] > max) {
        max = data[word];
        topWord = word;
      }
    }

    document.getElementById("todayWord").innerText =
      `오늘의 단어: ${topWord}`;
    document.getElementById("countInfo").innerText =
      `"${topWord}"가 ${max}번 입력됨`;
    document.title = topWord;
  });
