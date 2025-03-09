// 리뷰 데이터 로드 및 페이지네이션 초기화
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // 정렬 방식 설정
        const SORT_TYPE = {
            NEWEST: 'newest',    // 최신순
            OLDEST: 'oldest'     // 오래된순
        };
        const currentSort = SORT_TYPE.NEWEST;  // 현재 정렬 방식

        // JSON 데이터 로드
        const response = await fetch('../../data/reviews.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // 리뷰 데이터 정렬
        const reviews = data.reviews.sort((a, b) => {
            return currentSort === SORT_TYPE.NEWEST ? b.id - a.id : a.id - b.id;
        });

        // 리뷰 카드 생성 함수
        function createReviewCard(review) {
            return `
                <a href="${review.link}" class="review-card">
                    <div class="review-thumbnail">
                        <img src="${review.thumbnail}" alt="리뷰 썸네일">
                    </div>
                    <div class="review-content">
                        <h3 class="review-title">${review.title}</h3>
                        <div class="review-info">
                            <span>${review.siteInfo?.design || review.design}</span>
                            <span class="separator">|</span>
                            <span>${review.siteInfo?.size || review.size}</span>
                            <span class="separator">|</span>
                            <span>${review.siteInfo?.location || review.location}</span>
                            <span class="separator">|</span>
                            <span>${review.siteInfo?.area || review.area}</span>
                        </div>
                    </div>
                </a>
            `;
        }

        const itemsPerPage = 8;
        const totalPages = Math.ceil(reviews.length / itemsPerPage);
        
        // 페이지 표시 함수
        function showPage(pageNum) {
            const start = (pageNum - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageReviews = reviews.slice(start, end);
            
            // 리뷰 그리드 업데이트
            const reviewGrid = document.getElementById('reviewGrid');
            reviewGrid.innerHTML = pageReviews.map(review => createReviewCard(review)).join('');

            // 활성 페이지 표시
            document.querySelectorAll('.pagination-number').forEach(btn => {
                btn.classList.remove('active');
                if(parseInt(btn.textContent) === pageNum) {
                    btn.classList.add('active');
                }
            });
        }

        // 페이지 번호 생성
        const paginationNumbers = document.querySelector('.pagination-numbers');
        paginationNumbers.innerHTML = '';
        for(let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.classList.add('pagination-number');
            if(i === 1) button.classList.add('active');
            button.textContent = i;
            button.addEventListener('click', () => showPage(i));
            paginationNumbers.appendChild(button);
        }

        // 이전/다음 버튼 이벤트
        const prevBtn = document.querySelector('.pagination-btn.prev');
        const nextBtn = document.querySelector('.pagination-btn.next');

        prevBtn.addEventListener('click', () => {
            const currentPage = parseInt(document.querySelector('.pagination-number.active').textContent);
            if(currentPage > 1) showPage(currentPage - 1);
        });

        nextBtn.addEventListener('click', () => {
            const currentPage = parseInt(document.querySelector('.pagination-number.active').textContent);
            if(currentPage < totalPages) showPage(currentPage + 1);
        });

        // 초기 페이지 표시
        showPage(1);

    } catch (error) {
        console.error('리뷰 데이터 로드 중 오류 발생:', error);
        document.getElementById('reviewGrid').innerHTML = '<p class="error">리뷰를 불러오는 중 오류가 발생했습니다.</p>';
    }
}); 