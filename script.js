/* 🔥 여기에 본인 Firebase 설정 붙여넣기 */
const firebaseConfig = {
  apiKey: "AIzaSyD3NibqQIrgnmlez1s0WhUZ-H4b8YpnPSY",
  authDomain: "daily-word-site-6402f.firebaseapp.com",
  projectId: "daily-word-site-6402f",
  storageBucket: "daily-word-site-6402f.firebasestorage.app",
  messagingSenderId: "144399874318",
  appId: "1:144399874318:web:0e278d40b251952dc67f5f"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const input = document.getElementById('word-input');
const submitBtn = document.getElementById('submit-btn');
const rankingList = document.getElementById('ranking');
const siteTitle = document.getElementById('site-title');

let lastSubmission = 0;
const MIN_INTERVAL = 1000; // 1초

// 단어-이미지 매핑
const wordImages = {
    sun: "https://images.unsplash.com/photo-1501973801540-537f08ccae7c",
    moon: "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
    tree: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    cat: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131"
    // 원하는 단어 추가 가능
};

// 엔터키 제출
input.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitWord();
});
submitBtn.addEventListener('click', submitWord);

function submitWord() {
    const now = Date.now();
    if(now - lastSubmission < MIN_INTERVAL) return;
    lastSubmission = now;

    const word = input.value.trim().toLowerCase();
    if(!word) return;

    const wordRef = db.ref('words/' + word);
    wordRef.transaction(count => (count || 0) + 1);

    input.value = '';
}

// 실시간 랭킹 업데이트
db.ref('words').on('value', snapshot => {
    const data = snapshot.val() || {};
    const entries = Object.entries(data);
    entries.sort((a,b) => b[1]-a[1]); // 내림차순

    rankingList.innerHTML = '';
    entries.forEach(([word, count], idx) => {
        const li = document.createElement('li');
        li.textContent = `${idx+1}. ${word} (${count})`;
        rankingList.appendChild(li);
    });

    if(entries.length > 0){
        const topWord = entries[0][0];
        siteTitle.textContent = topWord;

        if(wordImages[topWord]){
            document.body.style.backgroundImage = `url('${wordImages[topWord]}')`;
        } else {
            document.body.style.backgroundImage = '';
        }

        // Unsplash API 랜덤 이미지 (선택)
        // fetch(`https://api.unsplash.com/photos/random?query=${topWord}&client_id=YOUR_ACCESS_KEY`)
        //     .then(res => res.json())
        //     .then(data => {
        //         document.body.style.backgroundImage = `url('${data.urls.full}')`;
        //     });
    }
});
