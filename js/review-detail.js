class BeforeAfterSlider {
    constructor(element, options = {}) {
        this.slider = element;
        this.beforeContainer = element.querySelector('.before-container');
        this.afterContainer = element.querySelector('.after-container');
        this.handle = element.querySelector('.slider-handle');
        this.beforeImage = this.beforeContainer.querySelector('img');
        this.afterImage = this.afterContainer.querySelector('img');
        this.isMouseDown = false;
        this.position = options.startPosition || 50;
        this.sliderWidth = 0;

        // 슬라이더 초기 상태 설정
        this.slider.style.visibility = 'hidden';

        // 이미지 로드 완료 후 초기화
        Promise.all([
            this.imageLoadPromise(this.beforeImage),
            this.imageLoadPromise(this.afterImage)
        ]).then(() => {
            this.slider.style.height = `${this.beforeImage.offsetHeight}px`;
            this.slider.style.visibility = 'visible';
            this.init();
        });
    }

    imageLoadPromise(img) {
        return new Promise((resolve) => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = () => resolve();
            }
        });
    }

    init() {
        // 초기 위치 설정
        this.updateSliderPosition(this.position);

        // 이벤트 리스너 등록
        this.handle.addEventListener('mousedown', this.startDragging.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDragging.bind(this));

        // 터치 이벤트
        this.handle.addEventListener('touchstart', this.startDragging.bind(this));
        document.addEventListener('touchmove', this.drag.bind(this));
        document.addEventListener('touchend', this.stopDragging.bind(this));
    }

    startDragging(e) {
        this.isMouseDown = true;
        this.slider.classList.add('active');
    }

    stopDragging() {
        this.isMouseDown = false;
        this.slider.classList.remove('active');
    }

    drag(e) {
        if (!this.isMouseDown) return;

        e.preventDefault();
        const sliderRect = this.slider.getBoundingClientRect();
        const x = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        
        // 위치 계산 (0-100%)
        let position = ((x - sliderRect.left) / sliderRect.width) * 100;
        position = Math.max(0, Math.min(100, position));
        
        this.updateSliderPosition(position);
    }

    updateSliderPosition(position) {
        this.position = position;
        const translateX = (position - 100) + '%';
        this.beforeContainer.style.transform = `translateX(${translateX})`;
        this.handle.style.left = `${position}%`;
    }
}

class ReviewDetail {
    constructor() {
        this.reviewData = null;
        this.currentReviewId = this.getReviewIdFromUrl();
        this.init();
    }

    async init() {
        try {
            await this.loadReviewData();
            await this.renderReviewDetail();
            this.initializeSlider();
        } catch (error) {
            console.error('리뷰 데이터 로드 실패:', error);
        }
    }

    initializeSlider() {
        const sliderElement = document.querySelector('.comparison-slider');
        if (sliderElement) {
            new BeforeAfterSlider(sliderElement, {
                startPosition: 90
            });
        }
    }

    getReviewIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        return id ? parseInt(id) : null;
    }

    async loadReviewData() {
        try {
            const response = await fetch('/data/reviews.json');
            const data = await response.json();
            this.reviewData = data.reviews.find(review => review.id === this.currentReviewId);
            
            // 디버깅을 위한 로그 추가
            console.log('현재 ID:', this.currentReviewId);
            console.log('찾은 리뷰:', this.reviewData);
            
            if (!this.reviewData) {
                throw new Error(`ID ${this.currentReviewId}에 해당하는 리뷰를 찾을 수 없습니다.`);
            }
        } catch (error) {
            console.error('리뷰 데이터 로드 실패:', error);
            throw error;
        }
    }

    async renderReviewDetail() {
        if (!this.reviewData) return;

        this.renderTitle();
        this.renderSiteInfo();
        this.renderCustomerRequests();
        await this.renderBeforeAfter();
        this.renderConstructionProcess();
        this.renderReviewContent();
        this.renderRatings();
    }

    renderTitle() {
        const titleElement = document.querySelector('.review-detail-title');
        if (titleElement) {
            titleElement.textContent = this.reviewData.title;
        }
    }

    renderSiteInfo() {
        const infoTable = document.querySelector('.info-table');
        if (!infoTable) return;

        const { design, size, location, area } = this.reviewData.siteInfo;
        infoTable.innerHTML = `
            <tr>
                <th>디자인</th>
                <td>${design}</td>
                <th>평수</th>
                <td>${size}</td>
            </tr>
            <tr>
                <th>시공장소</th>
                <td>${location}</td>
                <th>지역</th>
                <td>${area}</td>
            </tr>
        `;
    }

    renderCustomerRequests() {
        const requestList = document.querySelector('.request-list');
        if (!requestList) return;

        requestList.innerHTML = this.reviewData.customerRequests
            .map(request => `<li>${request}</li>`)
            .join('');
    }

    async renderBeforeAfter() {
        const beforeImg = document.querySelector('.before-container img');
        const afterImg = document.querySelector('.after-container img');
        
        if (beforeImg && afterImg) {
            beforeImg.style.opacity = '0';
            afterImg.style.opacity = '0';
            
            beforeImg.src = this.reviewData.beforeAfter.before;
            afterImg.src = this.reviewData.beforeAfter.after;

            // 슬라이더 안내 문구 추가
            const sliderContainer = document.querySelector('.comparison-slider');
            if (sliderContainer) {
                const guide = document.createElement('div');
                guide.className = 'slider-guide';
                guide.innerHTML = '<i class="fas fa-arrows-left-right"></i> 슬라이더를 움직여 시공 전/후를 비교해보세요';
                sliderContainer.insertAdjacentElement('afterend', guide);
            }

            // 이미지 로드 완료 후 페이드인
            await Promise.all([
                new Promise(resolve => {
                    beforeImg.onload = () => {
                        beforeImg.style.transition = 'opacity 0.3s';
                        beforeImg.style.opacity = '1';
                        resolve();
                    };
                }),
                new Promise(resolve => {
                    afterImg.onload = () => {
                        afterImg.style.transition = 'opacity 0.3s';
                        afterImg.style.opacity = '1';
                        resolve();
                    };
                })
            ]);
        }
    }

    renderConstructionProcess() {
        const processGallery = document.querySelector('.process-gallery');
        if (!processGallery) return;

        processGallery.innerHTML = this.reviewData.constructionProcess
            .map(process => `
                <figure class="process-item">
                    <img src="${process.image}" alt="${process.caption}">
                    <figcaption>${process.caption}</figcaption>
                </figure>
            `).join('');
    }

    renderReviewContent() {
        const content = document.querySelector('.content-editor');
        if (!content) return;

        const { reason, process, review } = this.reviewData.reviewContent;
        content.innerHTML = `
            <div class="editor-section">
                <h3>시공 선택 이유</h3>
                <p>${reason}</p>
            </div>
            <div class="editor-section">
                <h3>시공 과정</h3>
                <p>${process}</p>
            </div>
            <div class="editor-section">
                <h3>사용 후기</h3>
                <p>${review}</p>
            </div>
        `;
    }

    renderRatings() {
        const ratingItems = document.querySelector('.rating-items');
        if (!ratingItems) return;

        const ratings = this.reviewData.ratings;
        const ratingLabels = {
            design: '디자인',
            quality: '품질',
            service: '서비스'
        };

        ratingItems.innerHTML = Object.entries(ratings)
            .map(([key, value]) => `
                <div class="rating-item">
                    <span class="label">${ratingLabels[key]}</span>
                    <div class="stars">${this.generateStars(value)}</div>
                </div>
            `).join('');
    }

    generateStars(count) {
        return Array(5).fill(null)
            .map((_, index) => `
                <i class="fas fa-star${index >= count ? ' inactive' : ''}"></i>
            `).join('');
    }
}

// 페이지 로드 시 ReviewDetail 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    new ReviewDetail();
});