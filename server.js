// 서버 실행 명령어
// CMD,ZSH 터미널에서 실행
// npm install express (없을떄만)
// node server.js
// 서버 실행 후 브라우저에서 http://localhost:3000 에서 확인    

const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

// 정적 파일 서빙 (css, js, images 등)
app.use(express.static(path.join(__dirname)));

// 루트 경로에서 index.html 서빙
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
});