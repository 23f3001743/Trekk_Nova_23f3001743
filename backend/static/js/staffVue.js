

const StaffPanel = {
    template: `
    <div class="container-fluid fade-page">
        <div class="row">
            <div class="col-md-2 side-nav d-none d-md-block">
                <div class="px-3 py-3">
                    <small class="text-muted text-uppercase fw-bold"
                        style="font-size:10px">Staff Panel</small>
                </div>
                <nav>
                    <a class="side-link active">
                        <i class="bi bi-grid"></i>Dashboard
                    </a>
                </nav>
            </div>
            <div class="col-md-10 p-4">
                <h4 class="fw-bold mb-4">
                    <i class="bi bi-person-badge me-2" style="color:#1B4F72"></i>
                    Staff Dashboard
                </h4>
                <div class="nova-card p-4 text-center">
                    <i class="bi bi-map" style="font-size:3rem; color:#1B4F72"></i>
                    <h5 class="mt-3">Staff Panel</h5>
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
