// HTML 컴포넌트 로드 함수 
async function loadComponent(element) {
    const src = element.getAttribute('src');
    if (!src) return;

    try {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`HTTP 오류: ${response.status}`);

        const html = await response.text();
        element.outerHTML = html;
    } catch (error) {
        console.error('컴포넌트 로드 중 오류 발생:', error);
        element.outerHTML = `<div class="error">컴포넌트 로드 실패: ${src}</div>`;
    }
}

// 문서 준비 시 컴포넌트 로드
document.addEventListener('DOMContentLoaded', function () {
    const includes = document.querySelectorAll('include');
    includes.forEach(loadComponent);
});

// 컴포넌트 로드 함수
async function loadComponents() {
    const includes = document.getElementsByTagName('include');
    const repoName = '/ddasaroomtest'; // 깃허브 리포지토리 이름
    
    // HTMLCollection을 배열로 변환 (실시간 변경 방지)
    const includesArray = Array.from(includes);
    
    for (const element of includesArray) {
        let file = element.getAttribute('src');
        
        // 깃허브 Pages 환경인 경우 경로 수정
        if (window.location.hostname.includes('github.io')) {
            // 상대 경로를 절대 경로로 변환
            if (file.startsWith('./')) {
                file = file.substring(1); // ./를 제거
            }
            // 절대 경로인 경우
            if (file.startsWith('/')) {
                file = repoName + file;
            }
        }
        
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`HTTP 오류: ${response.status}`);
            
            const html = await response.text();
            element.outerHTML = html;
        } catch (error) {
            console.error('컴포넌트 로드 실패:', file, error);
            element.outerHTML = `<div class="error">컴포넌트 로드 실패: ${file}</div>`;
        }
    }

    // 컴포넌트 로드 완료 후 이벤트 발생
    const event = new Event('componentsLoaded');
    document.dispatchEvent(event);
}

// 페이지 로드 시 컴포넌트 로드
document.addEventListener('DOMContentLoaded', loadComponents); 
