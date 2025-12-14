let words = JSON.parse(localStorage.getItem("words")) || {};

function submitWord() {
  const input = document.getElementById("wordInput");
  const word = input.value.trim();

  if (word === "") return;

  words[word] = (words[word] || 0) + 1;
  localStorage.setItem("words", JSON.stringify(words));

  input.value = "";
  updateTodayWord();
}

function updateTodayWord() {
  let topWord = "없음";
  let maxCount = 0;

  for (let word in words) {
    if (words[word] > maxCount) {
      maxCount = words[word];
      topWord = word;
    }
  }

  document.getElementById("todayWord").innerText =
    `오늘의 단어: ${topWord}`;

  document.title = topWord;
  document.getElementById("countInfo").innerText =
    `현재 "${topWord}"가 ${maxCount}번 입력됨`;
}

updateTodayWord();
