

const TrekkerPanel = {
    template: `
    <div class="container-fluid fade-page">
        <div class="row">
            <div class="col-md-2 side-nav d-none d-md-block">
                <div class="px-3 py-3">
                    <small class="text-muted text-uppercase fw-bold"
                        style="font-size:10px">Trekker Panel</small>
                </div>
                <nav>
                    <a class="side-link active">
                        <i class="bi bi-house"></i>Home
                    </a>
                </nav>
            </div>
            <div class="col-md-10 p-4">
                <h4 class="fw-bold mb-4">
                    <i class="bi bi-house me-2" style="color:#1B4F72"></i>
                    Welcome, {{ user?.full_name }}! 🏔️
                </h4>
                <div class="nova-card p-4 text-center">
                    <i class="bi bi-binoculars"
                        style="font-size:3rem; color:#1B4F72"></i>
                    <h5 class="mt-3">Trekker Panel</h5>
                    <p class="text-muted">
                        Full dashboard coming soon!
                    </p>
                </div>
            </div>
        </div>
    </div>
    `,
    props: ['user'],
    setup() { return {} }
}
