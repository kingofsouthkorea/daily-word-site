import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* 🔥 본인 Firebase 설정 */
const firebaseConfig = {
  apiKey: "AIzaSyD3NibqQIrgnmlez1s0WhUZ-H4b8YpnPSY",
  authDomain: "daily-word-site-6402f.firebaseapp.com",
  projectId: "daily-word-site-6402f",
  storageBucket: "daily-word-site-6402f.firebasestorage.app",
  messagingSenderId: "144399874318",
  appId: "1:144399874318:web:0e278d40b251952dc67f5f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ⏱ 1초 제한 */
let lastSubmitTime = 0;

/* 엔터키 제출 */
document.getElementById("wordInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitWord();
});

async function submitWord() {
  const now = Date.now();
  if (now - lastSubmitTime < 1000) return;

  const input = document.getElementById("wordInput");
  let word = input.value.trim().toLowerCase();
  if (!word) return;

  lastSubmitTime = now;
  input.value = "";

  const ref = doc(db, "rankings", word);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, {
      count: increment(1),
      updatedAt: serverTimestamp()
    });
  } else {
    await setDoc(ref, {
      word,
      count: 1,
      updatedAt: serverTimestamp()
    });
  }
}

/* 🔥 실시간 랭킹 + 제목 변경 */
const q = query(
  collection(db, "rankings"),
  orderBy("count", "desc"),
  limit(10)
);

onSnapshot(q, (snapshot) => {
  const list = document.getElementById("rankingList");
  const h1 = document.getElementById("title");

  list.innerHTML = "";
  let rank = 1;
  let topWord = "Live Word";

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (rank === 1) topWord = data.word;

    const li = document.createElement("li");
    li.textContent = `${rank}. ${data.word} (${data.count})`;
    list.appendChild(li);
    rank++;
  });

  h1.textContent = `🔥 ${topWord}`;
  document.title = `🔥 ${topWord}`;
});
