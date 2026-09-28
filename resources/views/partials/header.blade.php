<header class="site-header bg-white">
    <div class="container">
        <div class="header-inner d-flex align-items-center justify-content-between">

            <a href="/" class="site-logo d-flex align-items-center">
                <img src="{{ asset('images/nemer-logo.svg') }}" alt="Nemer" height="30" class="d-block">
            </a>

            <nav class="desktop-nav d-none d-lg-flex align-items-center">
                <a href="#" class="nav-item text-decoration-none text-nowrap">O nas</a>
                <a href="#" class="nav-item text-decoration-none text-nowrap">Usługi</a>
                <a href="#" class="nav-item text-decoration-none text-nowrap">Cennik</a>
                <a href="https://t.me/ignat_mel" class="nav-item text-decoration-none text-nowrap">Kontakt</a>
                <a href="#" class="nav-item text-decoration-none text-nowrap">Opinie</a>
                <a href="#" class="nav-item text-decoration-none text-nowrap">Pytania i odpowiedzi</a>
            </nav>

            <div class="header-right d-none d-lg-flex align-items-center">
                <div class="phone-block text-end">
                    <a href="tel:+48690590089" class="phone-link text-decoration-none">+48690590089</a>
                    <div class="small">
                        <a href="#" class="text-muted text-decoration-none">Zamów rozmowę</a>
                    </div>
                </div>
                <div class="dropdown">
                    <button class="lang-link dropdown-toggle d-inline-flex align-items-center text-decoration-none text-nowrap"
                            type="button"
                            data-bs-toggle="dropdown" aria-expanded="false" data-bs-offset="0,15"
                            aria-label="Wybierz język">
                        PL
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item active" href="#">Polski</a></li>
                        <li><a class="dropdown-item" href="#">English</a></li>
                        <li><a class="dropdown-item" href="#">Deutsch</a></li>
                    </ul>
                </div>
            </div>

            <button class="burger d-lg-none" type="button"
                    data-bs-toggle="offcanvas" data-bs-target="#mobileMenu"
                    aria-label="Menu">
                <i class="bi bi-list"></i>
            </button>

        </div>
    </div>
</header>

<div class="offcanvas offcanvas-end mobile-menu" tabindex="-1" id="mobileMenu">
    <div class="offcanvas-header">
        <img src="{{ asset('images/nemer-logo.svg') }}" alt="Nemer" height="26" class="d-block">
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Zamknij"></button>
    </div>
    <div class="offcanvas-body">
        <nav class="d-flex flex-column mobile-nav">
            <a href="#" class="text-decoration-none">O nas</a>
            <a href="#" class="text-decoration-none">Usługi</a>
            <a href="#" class="text-decoration-none">Cennik</a>
            <a href="https://t.me/ignat_mel" class="text-decoration-none">Kontakt</a>
            <a href="#" class="text-decoration-none">Opinie</a>
            <a href="#" class="text-decoration-none">Pytania i odpowiedzi</a>
        </nav>

        <div class="mobile-contact pt-4">
            <a href="tel:+48690590089" class="phone-link d-block mb-1 text-decoration-none">+48690590089</a>
            <a href="#" class="text-muted small text-decoration-none d-block mb-3">Zamów rozmowę</a>
            <div class="dropdown">
                <button class="lang-link dropdown-toggle d-inline-flex align-items-center text-decoration-none text-nowrap"
                        type="button"
                        data-bs-toggle="dropdown" data-bs-display="static"
                        aria-label="Wybierz język">
                    PL
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item active" href="#">Polski</a></li>
                    <li><a class="dropdown-item" href="#">English</a></li>
                    <li><a class="dropdown-item" href="#">Deutsch</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>