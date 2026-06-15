const data = {};
const pageSize = 100;

let filtered = [];
let currentPage = 1;

["SP", "DP"].forEach(playmode => {
  Papa.parse(`data_${playmode}.csv`, {
    download: true,
    header: false,
    skipEmptyLines: true,
    complete: function(results) {
      data[playmode] = results.data;
    }
  });
});

/**
 * 検索する
 */
function search() {
  const playmode = document.querySelector('input[name="playmode"]:checked').value;

  const selected_version = Array.from(document.querySelectorAll('input[name="version"]:checked'))
                        .map(cb => cb.value.toLowerCase());

  const selected_difficulty = Array.from(document.querySelectorAll('input[name="difficulty"]:checked'))
                        .map(cb => cb.value.toLowerCase());

  const selected_level = Array.from(document.querySelectorAll('input[name="level"]:checked'))
                        .map(cb => cb.value.toLowerCase());

  const selected_notesradar = Array.from(document.querySelectorAll('input[name="notesradar"]:checked'))
                        .map(cb => cb.value.toLowerCase());

  const keyword_songname = document.getElementById("keyword_songname").value.toLowerCase();

  filtered = data[playmode].filter(row => {
    const col1 = String(row[0] || "").toLowerCase();
    const col2 = String(row[1] || "").toLowerCase();
    const col3 = String(row[2] || "").toLowerCase();
    const col4 = String(row[3] || "").toLowerCase();
    const col5 = String(row[4] || "").toLowerCase();

    const match1 =
      selected_version.length === 0 ||
      selected_version.some(v => col1.includes(v));

    const match2 =
      selected_difficulty.length === 0 ||
      selected_difficulty.some(v => col3.includes(v));

    const match3 =
      selected_level.length === 0 ||
      selected_level.some(v => col4.includes(v));

    const match4 =
      selected_notesradar.length === 0 ||
      selected_notesradar.some(v => {
        if(v === "empty")
          return col5 === "";
        else
          return col5.includes(v);
      });

    const match5 =
      keyword_songname === "" || col2.includes(keyword_songname);

    return match1 && match2 && match3 && match4 && match5;
  });

  currentPage = 1;

  renderPage();
}

/**
 * 検索結果をレンダリングする
 */
function renderPage() {
  const table = document.getElementById("result");
  const pager = document.getElementById("pager");

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageRows = filtered.slice(start, end);

  let html = "";
  html += "<tr><th>バージョン</th><th>曲名</th><th>難易度</th><th>レベル</th><th>レーダー</th></tr>"
  pageRows.forEach(row => {
    html += "<tr>" + row.map(v => `<td>${v}</td>`).join("") + "</tr>";
  });
  table.innerHTML = html || "<tr><td>該当なし</td></tr>";

  const totalPages = Math.ceil(filtered.length / pageSize);

  let pagerHtml = `${filtered.length} 件`;
  if (currentPage > 1)
    pagerHtml += `<button onclick="prevPage()">前へ</button>`;
  else
    pagerHtml += `<button onclick="prevPage()" disabled>前へ</button>`;
  pagerHtml += ` ${currentPage} / ${totalPages} `;
  if (currentPage < totalPages)
    pagerHtml += `<button onclick="nextPage()">次へ</button>`;
  else
    pagerHtml += `<button onclick="nextPage() disabled">次へ</button>`;

  pager.innerHTML = pagerHtml;
}

/**
 * 次のページに移動する
 */
function nextPage() {
  currentPage++;
  renderPage();
}

/**
 * 前のページに移動する
 */
function prevPage() {
  currentPage--;
  renderPage();
}
