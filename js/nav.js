// 네비게이션 초기화
document.addEventListener('componentsLoaded', function () {
    console.log('Components Loaded');
    const nav = document.querySelector('.nav-container');
    const toggleButton = nav?.querySelector('.mobile-menu-toggle');
    const navMenu = nav?.querySelector('.nav-menu');

    console.log('Initial elements:', {
        nav: !!nav,
        toggleButton: !!toggleButton,
        navMenu: !!navMenu
    });

    if (nav) {
        // 모바일 메뉴 토글 이벤트 설정
        if (toggleButton && navMenu) {
            setupMobileMenuToggle(toggleButton, navMenu);
        } else {
            console.error('Missing elements:', {
                toggleButton: !!toggleButton,
                navMenu: !!navMenu
            });
        }

        // 드롭다운 메뉴 토글 (모바일)
        setupMobileDropdowns();

        // 메뉴 외부 클릭시 닫기
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                document.body.classList.remove('menu-open');
                toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
});

// 모바일 메뉴 토글 기능 설정
function setupMobileMenuToggle(toggleButton, navMenu) {
    const toggleMenu = () => {
        const isMenuOpen = navMenu.classList.contains('show');
        console.log('Toggle menu clicked. Current state:', {
            isMenuOpen,
            classList: navMenu.classList.toString()
        });
        
        // 메뉴 토글
        navMenu.classList.toggle('show');
        document.body.classList.toggle('menu-open');

        console.log('After toggle:', {
            isMenuOpen: navMenu.classList.contains('show'),
            classList: navMenu.classList.toString()
        });

        // 아이콘 변경
        toggleButton.innerHTML = isMenuOpen
            ? '<i class="fas fa-bars"></i>'
            : '<i class="fas fa-times"></i>';

        // 메뉴가 닫힐 때 모든 드롭다운도 닫기
        if (!isMenuOpen) {
            const dropdowns = navMenu.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
            const activeLinks = navMenu.querySelectorAll('a.active');
            activeLinks.forEach(link => {
                link.classList.remove('active');
            });
        }
    };

    // 클릭 이벤트
    toggleButton.addEventListener('click', function(e) {
        console.log('Toggle button clicked');
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    // 터치 이벤트
    toggleButton.addEventListener('touchend', function(e) {
        console.log('Toggle button touched');
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
}

// 추가 콘텐츠 처리 함수
function handleAdditionalContent(navMenu) {
    const existingContent = navMenu.querySelector('.additional-content');

    if (navMenu.classList.contains('show')) {
        if (!existingContent) {
            const additionalContent = document.createElement('div');
            additionalContent.className = 'additional-content';
            additionalContent.innerHTML = `
                <div class="mobile-additional-menu">
                    <div class="mobile-contact">
                        <a href="tel:000-0000-0000">전화문의</a>
                    </div>
                    <div class="mobile-social">
                        <a href="#" aria-label="카카오톡"><i class="fab fa-kakao"></i></a>
                        <a href="#" aria-label="인스타그램"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            `;
            navMenu.appendChild(additionalContent);
        }
    } else {
        existingContent?.remove();
    }
}

// 모바일 드롭다운 메뉴 설정
function setupMobileDropdowns() {
    const menuItems = document.querySelectorAll('.nav-menu > li');
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        const dropdown = item.querySelector('.dropdown');

        if (dropdown && link) {
            const toggleDropdown = (e) => {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 다른 모든 드롭다운 닫기
                    const allDropdowns = document.querySelectorAll('.dropdown');
                    const allLinks = document.querySelectorAll('.nav-menu > li > a');
                    
                    allDropdowns.forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('show');
                        }
                    });
                    
                    allLinks.forEach(l => {
                        if (l !== link) {
                            l.classList.remove('active');
                        }
                    });

                    // 현재 드롭다운 토글
                    dropdown.classList.toggle('show');
                    link.classList.toggle('active');
                }
            };

            // 클릭 이벤트
            link.addEventListener('click', toggleDropdown);
            
            // 터치 이벤트
            link.addEventListener('touchend', toggleDropdown);
        }
    });
} 