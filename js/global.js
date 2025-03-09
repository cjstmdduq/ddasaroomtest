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
    
    for (let i = 0; i < includes.length; i++) {
        const element = includes[i];
        const file = element.getAttribute('src');
        
        try {
            const response = await fetch(file);
            const html = await response.text();
            element.insertAdjacentHTML('afterend', html);
            element.remove();
        } catch (error) {
            console.error('컴포넌트 로드 실패:', file, error);
        }
    }

    // 컴포넌트 로드 완료 후 이벤트 발생
    const event = new Event('componentsLoaded');
    document.dispatchEvent(event);
}

// 페이지 로드 시 컴포넌트 로드
document.addEventListener('DOMContentLoaded', loadComponents); 