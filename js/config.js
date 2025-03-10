// 기본 URL 설정 및 경로 관리를 위한 설정 파일
const config = {
    // 기본 URL 설정
    baseUrl: ['localhost', '127.0.0.1'].includes(window.location.hostname) ? '' : '/ddasaroomtest',
    
    // 경로 초기화 함수
    initializePaths: function() {
        document.addEventListener('DOMContentLoaded', function() {
            // 링크 경로 수정
            document.querySelectorAll('a[href^="index.html"], a[href^="pages/"], a[href^="logos/"]').forEach(link => {
                const href = link.getAttribute('href');
                // 외부 링크(http로 시작하는)는 건너뜀
                if (!href.startsWith('http')) {
                    link.href = config.baseUrl + '/' + href;
                }
            });
            
            // 이미지 경로 수정
            document.querySelectorAll('img[src^="logos/"]').forEach(img => {
                const src = img.getAttribute('src');
                img.src = config.baseUrl + '/' + src;
            });
        });
    }
};

// 경로 초기화 실행
config.initializePaths();

// 다른 파일에서 사용할 수 있도록 export
export default config; 