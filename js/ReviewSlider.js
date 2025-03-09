class ReviewSlider extends HTMLElement {
    constructor() {
        super();
        this.reviews = [];
        this.currentPage = 0;
        this.itemsPerPage = 4;
        this.baseImagePath = '../../../images/reviews/review-thumbnail/';
    }

    connectedCallback() {
        this.loadReviews();
    }

    async loadReviews() {
        try {
            const response = await fetch('../../data/reviews.json');
            const data = await response.json();
            // ID 역순으로 정렬
            this.reviews = data.reviews
                .sort((a, b) => b.id - a.id)
                .map(review => ({
                    ...review,
                    thumbnail: this.getImageUrl(review.thumbnail)
                }));
            this.render();
            this.initializeSlider();
        } catch (error) {
            console.error('리뷰 데이터 로딩 실패:', error);
        }
    }

    getImageUrl(path) {
        // 절대 경로면 그대로 사용
        if (path.startsWith('http') || path.startsWith('/')) {
            return path;
        }
        // 상대 경로면 baseImagePath와 결합
        return this.baseImagePath + path.split('/').pop();
    }

    get totalPages() {
        return Math.ceil(this.reviews.length / this.itemsPerPage);
    }

    getCurrentPageItems() {
        const start = this.currentPage * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.reviews.slice(start, end);
    }

    render() {
        this.innerHTML = `
            <div class="review-slider">
                <div class="slider-header">
                    <h3>다른 고객님의 리뷰</h3>
                </div>
                <div class="slider-content">
                    <div class="reviews-grid">
                        ${this.generateReviews()}
                    </div>
                </div>
                <div class="pagination">
                    ${this.generatePagination()}
                </div>
            </div>
        `;
    }

    generateReviews() {
        return this.getCurrentPageItems().map(review => `
            <div class="review-item">
                <a href="${review.link}" class="review-card">
                    <div class="review-thumbnail">
                        <img src="${review.thumbnail}" 
                             alt="${review.title}"
                             onerror="this.src='${this.baseImagePath}default.jpg'">
                    </div>
                    <div class="review-content">
                        <h3 class="review-title">${review.title}</h3>
                        <div class="review-info">
                            <span>${review.siteInfo.design}</span>
                            <span class="separator">|</span>
                            <span>${review.siteInfo.size}</span>
                            <span class="separator">|</span>
                            <span>${review.siteInfo.location}</span>
                            <span class="separator">|</span>
                            <span>${review.siteInfo.area}</span>
                        </div>
                    </div>
                </a>
            </div>
        `).join('');
    }

    generatePagination() {
        let html = '';
        for (let i = 0; i < this.totalPages; i++) {
            html += `
                <button class="page-btn ${i === this.currentPage ? 'active' : ''}" 
                        data-page="${i}">
                    ${i + 1}
                </button>
            `;
        }
        return html;
    }

    initializeSlider() {
        if (this.reviews.length <= this.itemsPerPage) return;

        const pageButtons = this.querySelectorAll('.page-btn');
        pageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                this.goToPage(page);
            });
        });
    }

    goToPage(page) {
        this.currentPage = page;
        this.render();
        this.initializeSlider();
    }
}

customElements.define('review-slider', ReviewSlider); 