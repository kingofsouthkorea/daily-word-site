/* 🔥 여기에 본인 Firebase 설정 붙여넣기 */
const firebaseConfig = {
    apiKey: "AIzaSyD3NibqQIrgnmlez1s0WhUZ-H4b8YpnPSY",
    authDomain: "daily-word-site-6402f.firebaseapp.com",
    databaseURL: "https://daily-word-site-6402f-default-rtdb.firebaseio.com",
    projectId: "daily-word-site-6402f",
    storageBucket: "daily-word-site-6402f.appspot.com",
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
const MIN_INTERVAL = 1000; // 1초 제한

// 단어-이미지 매핑
const wordImages = {
    sun: "https://images.unsplash.com/photo-1501973801540-537f08ccae7c",
    moon: "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
    tree: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    cat: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131"
    // 필요한 단어 추가 가능
};

// 엔터키 제출
input.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitWord();
});
submitBtn.addEventListener('click', submitWord);

// 단어 제출 함수
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

// 배경 이미지 안정적으로 설정
function setBackgroundImage(url){
    const img = new Image();
    img.src = url;
    img.onload = () => { document.body.style.backgroundImage = `url('${url}')`; }
    img.onerror = () => { document.body.style.backgroundImage = "none"; }
}

// 실시간 랭킹 업데이트
db.ref('words').on('value', snapshot => {
    const data = snapshot.val() || {};
    const entries = Object.entries(data);
    entries.sort((a,b) => b[1]-a[1]);

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
            setBackgroundImage(wordImages[topWord]);
        } else {
            document.body.style.backgroundImage = "none";
        }
    }
});
