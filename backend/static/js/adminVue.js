
const myCharts = {}

const AdminPanel = {
    template: `
    <div class="container-fluid fade-page">
        <div class="row">

            <!-- SIDEBAR -->

            <div class="col-md-2 side-nav d-none d-md-block">
                <div class="px-3 py-3">
                    <small class="text-muted text-uppercase fw-bold"
                        style="font-size:10px">Admin Panel</small>
                </div>
                <nav>
                    <a class="side-link" :class="{active: page==='home'}"
                        @click="goToDashboard()">
                        <i class="bi bi-grid"></i>Dashboard
                    </a>
                    <a class="side-link" :class="{active: page==='treks'}"
                        @click="page='treks'; fetchTreks()">
                        <i class="bi bi-map"></i>Treks
                    </a>
                    <a class="side-link" :class="{active: page==='guides'}"
                        @click="page='guides'; fetchGuides()">
                        <i class="bi bi-person-badge"></i>Guides
                    </a>
                    <a class="side-link" :class="{active: page==='trekkers'}"
                        @click="page='trekkers'; fetchTrekkers()">
                        <i class="bi bi-people"></i>Trekkers
                    </a>
                    <a class="side-link" :class="{active: page==='bookings'}"
                        @click="page='bookings'; fetchBookings()">
                        <i class="bi bi-journal-check"></i>Bookings
                    </a>
                </nav>
            </div>

            <!-- MAIN CONTENT -->

            <div class="col-md-10 p-4">

                <!-- notice alert -->
                <div v-if="notice" class="alert alert-nova py-2 mb-3"
                    :class="isErr ? 'alert-danger' : 'alert-success'">
                    {{ notice }}
                </div>

                <!-- ──  DASHBOARD ── -->
                <div v-if="page==='home'">

                    <!-- Welcome Greet -->
                    <div class="nova-card mb-4 overflow-hidden"
                        style="position:relative; height:140px">
                        <img
                            src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=70"
                            alt="mountains"
                            style="width:100%; height:100%; object-fit:cover"/>
                        <div style="position:absolute; inset:0;
                            background:rgba(27,79,114,0.75);
                            display:flex; align-items:center; padding:24px">
                            <div>
                                <h4 class="text-white fw-bold mb-1">
                                    <i class="bi bi-compass me-2"></i>
                                    Welcome, {{ user?.full_name }}!
                                </h4>
                                <p class="text-white-50 mb-0 small">
                                    Manage your TrekkNova operations from here
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- STATS CARD BOXES  -->

                    <div class="row g-3 mb-4" v-if="dashStats">
                        <div class="col-6 col-md-3">
                            <div class="nova-card p-3">
                                <div class="d-flex align-items-center gap-3 mb-2">
                                    <div class="rounded-circle d-flex align-items-center
                                        justify-content-center"
                                        style="width:46px;height:46px;
                                        background:#d6eaf8">
                                        <i class="bi bi-map"
                                            style="color:#1B4F72;font-size:1.2rem"></i>
                                    </div>
                                    <div>
                                        <div class="stat-num">
                                            {{ dashStats.total_treks }}
                                        </div>
                                        <div class="stat-lbl">Total Treks</div>
                                    </div>
                                </div>
                                <a class="small text-decoration-none"
                                    style="color:#1B4F72; cursor:pointer"
                                    @click="page='treks'; fetchTreks()">
                                    View all treks
                                    <i class="bi bi-chevron-right"></i>
                                </a>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="nova-card p-3">
                                <div class="d-flex align-items-center gap-3 mb-2">
                                    <div class="rounded-circle d-flex align-items-center
                                        justify-content-center"
                                        style="width:46px;height:46px;
                                        background:#d5f5e3">
                                        <i class="bi bi-people"
                                            style="color:#1e8449;font-size:1.2rem"></i>
                                    </div>
                                    <div>
                                        <div class="stat-num"
                                            style="color:#1e8449">
                                            {{ dashStats.total_trekkers }}
                                        </div>
                                        <div class="stat-lbl">Registered Trekkers</div>
                                    </div>
                                </div>
                                <a class="small text-decoration-none"
                                    style="color:#1e8449; cursor:pointer"
                                    @click="page='trekkers'; fetchTrekkers()">
                                    View all trekkers
                                    <i class="bi bi-chevron-right"></i>
                                </a>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="nova-card p-3">
                                <div class="d-flex align-items-center gap-3 mb-2">
                                    <div class="rounded-circle d-flex align-items-center
                                        justify-content-center"
                                        style="width:46px;height:46px;
                                        background:#fdebd0">
                                        <i class="bi bi-calendar-check"
                                            style="color:#e67e22;font-size:1.2rem"></i>
                                    </div>
                                    <div>
                                        <div class="stat-num"
                                            style="color:#e67e22">
                                            {{ dashStats.active_treks }}
                                        </div>
                                        <div class="stat-lbl">Upcoming Treks</div>
                                    </div>
                                </div>
                                <a class="small text-decoration-none"
                                    style="color:#e67e22; cursor:pointer"
                                    @click="page='treks'; fetchTreks()">
                                    View schedule
                                    <i class="bi bi-chevron-right"></i>
                                </a>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="nova-card p-3">
                                <div class="d-flex align-items-center gap-3 mb-2">
                                    <div class="rounded-circle d-flex align-items-center
                                        justify-content-center"
                                        style="width:46px;height:46px;
                                        background:#f9ebea">
                                        <i class="bi bi-journal-check"
                                            style="color:#FF6B5B;font-size:1.2rem"></i>
                                    </div>
                                    <div>
                                        <div class="stat-num"
                                            style="color:#FF6B5B">
                                            {{ dashStats.total_bookings }}
                                        </div>
                                        <div class="stat-lbl">Total Bookings</div>
                                    </div>
                                </div>
                                <a class="small text-decoration-none"
                                    style="color:#FF6B5B; cursor:pointer"
                                    @click="page='bookings'; fetchBookings()">
                                    View bookings
                                    <i class="bi bi-chevron-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- RECENTLY ACTION -->

                    <div class="nova-card p-3">
                        <h6 class="fw-bold mb-3">
                            <i class="bi bi-activity me-2"
                                style="color:#1B4F72"></i>
                            Recent Activities
                        </h6>
                        <div v-if="latestActivity.length===0"
                            class="text-center py-3 text-muted">
                            No bookings yet
                        </div>
                        <table v-else
                            class="table tbl-nova table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Trekker</th>
                                    <th>Trek</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="b in latestActivity" :key="b.id">
                                    <td>{{ b.trekker_name }}</td>
                                    <td>{{ b.trek_title }}</td>
                                    <td>{{ b.booked_at }}</td>
                                    <td>
                                        <span class="badge bg-success">
                                            {{ b.booking_status }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- ── TREKS PAGE ── -->

                <div v-if="page==='treks'">
                    <div class="d-flex justify-content-between
                        align-items-center mb-4">
                        <h4 class="fw-bold mb-0">
                            <i class="bi bi-map me-2"
                                style="color:#1B4F72"></i>Manage Treks
                        </h4>
                        <button class="btn btn-nova"
                            @click="showForm=true">
                            <i class="bi bi-plus me-1"></i>Add Trek
                        </button>
                    </div>

                    <!-- TREK FORM -->

                    <div v-if="showForm" class="nova-card p-4 mb-4">
                        <h6 class="fw-bold mb-3">
                            {{ editId ? 'Edit Trek' : 'New Trek' }}
                        </h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Trek Title</label>
                                <input v-model="tripForm.title"
                                    class="form-control"
                                    placeholder="e.g. Kedarnath Trek"/>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Region</label>
                                <input v-model="tripForm.region"
                                    class="form-control"
                                    placeholder="e.g. Uttarakhand"/>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Overview</label>
                                <textarea v-model="tripForm.overview"
                                    class="form-control" rows="2"
                                    placeholder="Brief description...">
                                </textarea>
                            </div>
                            <div class="col-md-6">
                            <label class="form-label">
                            Image Theme
                            <small class="text-muted">
                           
                            </small>
                            </label>
                            <input v-model="tripForm.image_key"
                            class="form-control"
                            placeholder="type a theme word for image"/>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Difficulty</label>
                                <select v-model="tripForm.difficulty_level"
                                    class="form-select">
                                    <option>Easy</option>
                                    <option>Moderate</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Days Required</label>
                                <input v-model="tripForm.days_required"
                                    type="number" class="form-control"/>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Total Capacity</label>
                                <input v-model="tripForm.capacity"
                                    type="number" class="form-control"/>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Cost Per Person (₹)</label>
                                <input v-model="tripForm.cost_per_person"
                                    type="number" class="form-control"/>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Trip Start</label>
                                <input v-model="tripForm.trip_start"
                                    type="date" class="form-control"/>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Trip End</label>
                                <input v-model="tripForm.trip_end"
                                    type="date" class="form-control"/>
                            </div>
                            <div class="col-12 d-flex gap-2">
                                <button class="btn btn-nova"
                                    @click="submitTrek" :disabled="busy">
                                    <span v-if="busy"
                                        class="spinner-border
                                        spinner-border-sm me-1"></span>
                                    {{ editId ? 'Update' : 'Create Trek' }}
                                </button>
                                <button class="btn btn-outline-secondary"
                                    @click="resetForm">Cancel</button>
                            </div>
                        </div>
                    </div>

                    <!-- ASSIGN GUIDE PANNEL -->

                    <div v-if="showAssign"
                        class="nova-card p-4 mb-4"
                        style="border-left:4px solid #e67e22">
                        <h6 class="fw-bold mb-3">
                            Assign Guide → {{ targetTrek?.title }}
                        </h6>
                        <div class="row g-2 align-items-end">
                            <div class="col-md-8">
                                <select v-model="pickedGuide"
                                    class="form-select">
                                    <option value="">
                                        Select a guide
                                    </option>
                                    <option v-for="g in guideList"
                                        :key="g.id" :value="g.id">
                                        {{ g.full_name }} — {{ g.email }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-4 d-flex gap-2">
                                <button class="btn btn-nova"
                                    @click="doAssign">Assign</button>
                                <button class="btn btn-outline-secondary"
                                    @click="showAssign=false">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- TREK CARD PAGE -->

                    <div v-if="busy" class="spin-area">
                        <div class="spinner-border"
                            style="color:#1B4F72"></div>
                    </div>
                    <div v-else class="row g-3">
                        <div v-if="trekList.length===0"
                            class="col-12 text-center py-5 text-muted">
                            No treks yet. Create your first trek!
                        </div>
                        <div class="col-md-6 col-lg-4"
                            v-for="t in trekList" :key="t.id">
                            <div class="nova-card h-100"
                                style="overflow:hidden">

                                <!-- trek image -->

                                <div style="height:150px;
                                    position:relative; overflow:hidden">
                                    <img
                                        :src="getTrekImage(t.region, t.title)"
                                        :alt="t.title"
                                        style="width:100%; height:100%;
                                        object-fit:cover"/>
                                    <span :class="getDiffTag(t.difficulty_level)"
                                        style="position:absolute;
                                        top:10px; right:10px">
                                        {{ t.difficulty_level }}
                                    </span>
                                    <span class="badge"
                                        :class="getStatusTag(t.current_status)"
                                        style="position:absolute;
                                        top:10px; left:10px">
                                        {{ t.current_status }}
                                    </span>
                                </div>

                                <div class="p-3">
                                    <h6 class="fw-bold mb-1">
                                        {{ t.title }}
                                    </h6>
                                    <p class="text-muted small mb-2">
                                        <i class="bi bi-geo-alt me-1"></i>
                                        {{ t.region }}
                                    </p>
                                    <div class="d-flex gap-3 small
                                        text-muted mb-3">
                                        <span>
                                            <i class="bi bi-calendar me-1"></i>
                                            {{ t.trip_start }}
                                        </span>
                                        <span>
                                            <i class="bi bi-clock me-1"></i>
                                            {{ t.days_required }}d
                                        </span>
                                        <span class="fw-bold"
                                            style="color:#1B4F72">
                                            ₹{{ t.cost_per_person }}
                                        </span>
                                    </div>

                                    <!-- SEAT CAPACITY -->

                                    <div class="mb-3">
                                        <div class="d-flex
                                            justify-content-between
                                            small mb-1">
                                            <span class="text-muted">
                                                Seats
                                            </span>
                                            <span class="fw-bold">
                                                {{ t.seats_remaining }}/{{ t.capacity }}
                                            </span>
                                        </div>
                                        <div class="seat-track">
                                            <div class="seat-fill"
                                                :style="{
                                                    width:(t.seats_remaining/t.capacity*100)+'%',
                                                    background: t.seats_remaining < 3
                                                        ? '#FF6B5B' : '#5499C7'
                                                }">
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="t.guide_name"
                                        class="small text-muted mb-3">
                                        <i class="bi bi-person-badge me-1"></i>
                                        Guide: {{ t.guide_name }}
                                    </div>

                                    <!-- buttons -->

                                    <div class="d-flex gap-1">
                                        <button
                                            class="btn btn-sm
                                            btn-outline-secondary flex-fill"
                                            @click="startAssign(t)"
                                            title="Assign Guide">
                                            <i class="bi bi-person-check"></i>
                                        </button>
                                        <button
                                            class="btn btn-sm
                                            btn-outline-primary flex-fill"
                                            @click="openEdit(t)"
                                            title="Edit">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button
                                            class="btn btn-sm
                                            btn-outline-danger flex-fill"
                                            @click="removeTrek(t.id)"
                                            title="Delete">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── GUIDES PAGE ── -->

                <div v-if="page==='guides'">
                    <div class="d-flex justify-content-between
                        align-items-center mb-4">
                        <h4 class="fw-bold mb-0">
                            <i class="bi bi-person-badge me-2"
                                style="color:#1B4F72"></i>Trek Guides
                        </h4>
                        <button class="btn btn-nova"
                            @click="showGuideForm=!showGuideForm">
                            <i class="bi bi-plus me-1"></i>Add Guide
                        </button>
                    </div>

                    <div v-if="showGuideForm"
                        class="nova-card p-4 mb-4">
                        <h6 class="fw-bold mb-3">New Guide</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Full Name</label>
                                <input v-model="guideForm.full_name"
                                    class="form-control"/>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Email</label>
                                <input v-model="guideForm.email"
                                    type="email" class="form-control"/>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Password</label>
                                <input v-model="guideForm.password"
                                    type="password" class="form-control"/>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Contact No</label>
                                <input v-model="guideForm.contact_no"
                                    class="form-control"/>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-nova"
                                    @click="addGuide" :disabled="busy">
                                    <span v-if="busy"
                                        class="spinner-border
                                        spinner-border-sm me-1"></span>
                                    Add Guide
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-md-6 col-lg-4"
                            v-for="g in guideList" :key="g.id">
                            <div class="nova-card p-3">
                                <div class="d-flex align-items-center
                                    gap-3">
                                    <div class="rounded-circle d-flex
                                        align-items-center
                                        justify-content-center"
                                        style="width:46px;height:46px;
                                        background:#d6eaf8;
                                        color:#1B4F72;font-weight:700;
                                        font-size:17px">
                                        {{ g.full_name[0] }}
                                    </div>
                                    <div>
                                        <div class="fw-bold">
                                            {{ g.full_name }}
                                        </div>
                                        <div class="text-muted small">
                                            {{ g.email }}
                                        </div>
                                        <div class="text-muted small">
                                            <i class="bi bi-phone me-1"></i>
                                            {{ g.contact_no }}
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-2 mb-2">
                                    <span v-if="!g.is_active"
                                        class="badge bg-warning text-dark">
                                        Inactive
                                    </span>
                                    <span v-else
                                        class="badge bg-success">Active</span>
                                </div>
                                <button class="btn btn-sm
                                    btn-outline-danger w-100"
                                    @click="changeStatus(g.id,
                                        {is_active:!g.is_active})">
                                    {{ g.is_active
                                        ? 'Deactivate' : 'Activate' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── TREKKERS PAGE ── -->
                <div v-if="page==='trekkers'">
                    <h4 class="fw-bold mb-4">
                        <i class="bi bi-people me-2"
                            style="color:#1B4F72"></i>Trekkers
                    </h4>
                    <input v-model="searchInput"
                        class="form-control mb-3"
                        placeholder="Search by name or email..."
                        @input="fetchTrekkers"/>
                    <div class="nova-card">
                        <table class="table tbl-nova
                            table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Fitness</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="trekkerList.length===0">
                                    <td colspan="6"
                                        class="text-center py-4
                                        text-muted">
                                        No trekkers found
                                    </td>
                                </tr>
                                <tr v-for="u in trekkerList" :key="u.id">
                                    <td class="fw-bold">
                                        {{ u.full_name }}
                                    </td>
                                    <td>{{ u.email }}</td>
                                    <td>{{ u.contact_no }}</td>
                                    <td>
                                        <span class="badge
                                            bg-light text-dark">
                                            {{ u.fitness_level || 'N/A' }}
                                        </span>
                                    </td>
                                    <td>
                                        <span v-if="u.is_banned"
                                            class="badge bg-danger">
                                            Banned
                                        </span>
                                        <span v-else-if="!u.is_active"
                                            class="badge bg-warning
                                            text-dark">
                                            Inactive
                                        </span>
                                        <span v-else
                                            class="badge bg-success">
                                            Active
                                        </span>
                                    </td>
                                    <td>
                                        <div class="d-flex gap-1">
                                            <button
                                                class="btn btn-sm
                                                btn-outline-warning"
                                                @click="changeStatus(u.id,
                                                {is_active:!u.is_active})">
                                                {{ u.is_active
                                                    ? 'Deactivate'
                                                    : 'Activate' }}
                                            </button>
                                            <button
                                                class="btn btn-sm
                                                btn-outline-danger"
                                                @click="changeStatus(u.id,
                                                {is_banned:!u.is_banned})">
                                                {{ u.is_banned
                                                    ? 'Unban' : 'Ban' }}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- ── BOOKINGS PAGE ── -->
                <div v-if="page==='bookings'">
                    <h4 class="fw-bold mb-4">
                        <i class="bi bi-journal-check me-2"
                            style="color:#1B4F72"></i>All Bookings
                    </h4>
                    <div class="nova-card">
                        <table class="table tbl-nova
                            table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Trekker</th>
                                    <th>Trek</th>
                                    <th>Region</th>
                                    <th>Booked On</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="bookingList.length===0">
                                    <td colspan="7"
                                        class="text-center py-4
                                        text-muted">
                                        No bookings yet
                                    </td>
                                </tr>
                                <tr v-for="b in bookingList" :key="b.id">
                                    <td>{{ b.id }}</td>
                                    <td class="fw-bold">
                                        {{ b.trekker_name }}
                                    </td>
                                    <td>{{ b.trek_title }}</td>
                                    <td>{{ b.trek_region }}</td>
                                    <td>{{ b.booked_at }}</td>
                                    <td>
                                        <span class="badge"
                                            :class="b.payment_status==='Paid'
                                            ? 'bg-success'
                                            : 'bg-warning text-dark'">
                                            {{ b.payment_status || 'Pending' }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge"
                                            :class="b.booking_status==='Booked'
                                            ? 'bg-success'
                                            : b.booking_status==='Cancelled'
                                            ? 'bg-danger' : 'bg-secondary'">
                                            {{ b.booking_status }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>
    `,

    props: ['user'],

    setup(props) {
        const { ref, onMounted } = Vue

        const page          = ref('home')
        const busy          = ref(false)
        const notice        = ref('')
        const isErr         = ref(false)
        const dashStats     = ref(null)
        const latestActivity= ref([])
        const trekList      = ref([])
        const guideList     = ref([])
        const trekkerList   = ref([])
        const bookingList   = ref([])
        const searchInput   = ref('')

        const showForm      = ref(false)
        const showGuideForm = ref(false)
        const showAssign    = ref(false)
        const editId        = ref(null)
        const targetTrek    = ref(null)
        const pickedGuide   = ref('')

        const tripForm = ref({
            title:'', region:'', overview:'',
            difficulty_level:'Moderate', days_required:'',
            capacity:'', cost_per_person:'',
            trip_start:'', trip_end:'',image_key      : ''
        })
        const guideForm = ref({
            full_name:'', email:'',
            password:'', contact_no:''
        })

        function showNotice(msg, err=false) {
            notice.value = msg
            isErr.value  = err
            setTimeout(() => notice.value = '', 4000)
        }

        function getDiffTag(d) {
            return d==='Easy'     ? 'tag-easy'     :
                   d==='Moderate' ? 'tag-moderate' :
                   'tag-hard'
        }

        function getStatusTag(s) {
            const m = {
                Open     : 'bg-success',
                Closed   : 'bg-secondary',
                Completed: 'bg-info text-dark'
            }
            return m[s] || 'bg-secondary'
        }

        function getTrekImage(region, title, imageKey='') {

          const myImageMap = {

        // specific trek names
        'kedarnath' : 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=70',
        'roopkund'  : 'https://images.unsplash.com/photo-1612438214708-f428a707dd4e?w=400&q=70',
        'hampta'    : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70',
        'triund'    : 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&q=70',
        'valley'    : 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=70',

        
        'snow'      : 'https://images.unsplash.com/photo-1542332213-31f87348057f?w=400&q=70',
        'forest'    : 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=70',
        'river'     : 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=70',
        'lake'      : 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&q=70',
        'glacier'   : 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70',
        'sunrise'   : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70',
        'desert'    : 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&q=70',
        'temple'    : 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=70',

        // regions
        'manali'    : 'https://images.unsplash.com/photo-1626017740083-3c29e524e3f5?w=400&q=70',
        'ladakh'    : 'https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6?w=400&q=70',
        'kashmir'   : 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=400&q=70',
        'sikkim'    : 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=70',
        'himachal'  : 'https://images.unsplash.com/photo-1597977084860-23cf629c5588?w=400&q=70',
        'uttarakhand':'https://images.unsplash.com/photo-1623838978580-ef52ec53b4b1?w=400&q=70',
    }

    
    if (imageKey && imageKey.trim() !== '') {
        const k = imageKey.toLowerCase().trim()
        if (myImageMap[k]) return myImageMap[k]
    }

    
    const t = title.toLowerCase()
    for (const key in myImageMap) {
        if (t.includes(key)) return myImageMap[key]
    }

    
    const r = region.toLowerCase()
    for (const key in myImageMap) {
        if (r.includes(key)) return myImageMap[key]
    }

    //  default
    return 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=70'
}
        
        function destroyMyChart(id) {
            try {
                if (myCharts[id]) {
                    myCharts[id].destroy()
                    delete myCharts[id]
                }
            } catch(e) {}
        }

        async function goToDashboard() {
            page.value = 'home'
            await fetchDashboard()
        }

        async function fetchDashboard() {
            try {
                const r          = await axios.get('/api/admin/dashboard')
                dashStats.value  = r.data.stats
                latestActivity.value = r.data.recent_activity
            } catch(e) {
                const s = e.response?.status
                if (s===401||s===422) {
                    localStorage.clear()
                    window.location.reload()
                } else {
                    showNotice('Dashboard load failed', true)
                }
            }
        }

        async function fetchTreks() {
            busy.value = true
            try {
                const r      = await axios.get('/api/admin/treks')
                trekList.value = r.data.treks
            } finally { busy.value = false }
        }

        async function fetchGuides() {
            const r        = await axios.get('/api/admin/guides')
            guideList.value = r.data.guides
        }

        async function fetchTrekkers() {
            const r = await axios.get(
                `/api/admin/trekkers?q=${searchInput.value}`
            )
            trekkerList.value = r.data.trekkers
        }

        async function fetchBookings() {
            const r          = await axios.get('/api/admin/bookings')
            bookingList.value = r.data.bookings
        }

        async function submitTrek() {
            busy.value = true
            try {
                if (editId.value) {
                    await axios.put(
                        `/api/admin/treks/${editId.value}`,
                        tripForm.value
                    )
                    showNotice('Trek updated!')
                } else {
                    await axios.post('/api/admin/treks', tripForm.value)
                    showNotice('Trek created!')
                }
                resetForm()
                fetchTreks()
            } catch(e) {
                showNotice(e.response?.data?.msg || 'Failed', true)
            } finally { busy.value = false }
        }

        function openEdit(t) {
            editId.value    = t.id
            tripForm.value  = { ...t }
            showForm.value  = true
        }

        function resetForm() {
            showForm.value = false
            editId.value   = null
            tripForm.value = {
                title:'', region:'', overview:'',
                difficulty_level:'Moderate', days_required:'',
                capacity:'', cost_per_person:'',
                trip_start:'', trip_end:''
            }
        }

        async function removeTrek(id) {
            if (!confirm('Remove this trek?')) return
            await axios.delete(`/api/admin/treks/${id}`)
            showNotice('Trek removed')
            fetchTreks()
        }

        async function addGuide() {
            busy.value = true
            try {
                await axios.post('/api/admin/guides', guideForm.value)
                showNotice('Guide added!')
                showGuideForm.value = false
                guideForm.value = {
                    full_name:'', email:'',
                    password:'', contact_no:''
                }
                fetchGuides()
            } catch(e) {
                showNotice(e.response?.data?.msg || 'Failed', true)
            } finally { busy.value = false }
        }

        function startAssign(trek) {
            targetTrek.value  = trek
            pickedGuide.value = trek.guide_id || ''
            showAssign.value  = true
            fetchGuides()
        }

        async function doAssign() {
            if (!pickedGuide.value)
                return showNotice('Pick a guide first', true)
            try {
                await axios.put(
                    `/api/admin/treks/${targetTrek.value.id}/assign`,
                    { guide_id: pickedGuide.value }
                )
                showNotice('Guide assigned!')
                showAssign.value = false
                fetchTreks()
            } catch(e) { showNotice('Failed to assign', true) }
        }

        async function changeStatus(uid, data) {
            try {
                await axios.put(
                    `/api/admin/users/${uid}/status`, data
                )
                showNotice('Status updated')
                fetchTrekkers()
                fetchGuides()
            } catch(e) { showNotice('Failed', true) }
        }

        onMounted(async () => {
            await fetchDashboard()
        })

        return {
            page, busy, notice, isErr,
            dashStats, latestActivity,
            trekList, guideList, trekkerList, bookingList,
            searchInput, showForm, showGuideForm, showAssign,
            editId, targetTrek, pickedGuide,
            tripForm, guideForm,
            goToDashboard, fetchTreks, fetchGuides,
            fetchTrekkers, fetchBookings,
            submitTrek, openEdit, resetForm, removeTrek,
            addGuide, startAssign, doAssign, changeStatus,
            getDiffTag, getStatusTag, getTrekImage, showNotice
        }
    }
}
