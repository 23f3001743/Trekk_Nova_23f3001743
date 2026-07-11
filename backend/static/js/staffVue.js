// guide dashboard WHERE guide can see and manage only their assigned treks

const StaffPanel = {
    template: `
    <div class="container-fluid fade-page">
        <div class="row">

            <!-- SIDEBAR -->
            <div class="col-md-2 side-nav d-none d-md-block">
                <div class="px-3 py-3">
                    <small class="text-dark text-uppercase fw-semibold "
                        style="font-size:13px">Guide Panel</small>
                </div>
                <nav>
                    <a class="side-link"
                        :class="{active: page==='home'}"
                        @click="page='home'; loadHome()">
                        <i class="bi bi-grid"></i>Dashboard
                    </a>
                    <a class="side-link"
                        :class="{active: page==='treks'}"
                        @click="page='treks'; loadMyTreks()">
                        <i class="bi bi-map"></i>My Treks
                    </a>
                </nav>
            </div>

            <!-- MAIN CONTENT -->
            <div class="col-md-10 p-4">

                 
                <div v-if="notice" class="alert alert-nova py-2 mb-3"
                    :class="isErr ? 'alert-danger' : 'alert-success'">
                    {{ notice }}
                </div>

                <!-- ──  DASHBOARD ── -->
                <div v-if="page==='home'">

                    <!-- WELCOME GREET -->
                    <div class="nova-card mb-4 overflow-hidden"
                        style="position:relative; height:120px">
                        <img
                            src="https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&q=80"
                            alt="mountains"
                            style="width:100%; height:100%; object-fit:cover"/>
                        <div style="position:absolute; inset:0;
                            background:rgba(91, 164, 212, 0.72);
                            display:flex; align-items:center; padding:24px">
                            <div>
                                <h4 class="text-white fw-bold mb-2 fs-3  ">
                                    <i class="bi bi-compass  me-2 "></i>
                                    Welcome, {{ user?.full_name }}!
                                </h4>
                                <p class="text-white mb-1 "style="font-size:15px">
                                    Manage your assigned treks from here
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- STAT BOXES -->

                    <div class="row g-3 mb-4 " v-if="dashStats">
                        <div class="col-6">
                            <div class="nova-card p-3 d-flex align-items-center " style="min-height:110px">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="rounded-circle d-flex 
                                        align-items-center justify-content-center"
                                        style="width:46px;height:46px;
                                        background:purple">
                                        <i class="bi bi-map"
                                            style="color:navy;
                                            font-size:1.3rem"></i>
                                    </div>
                                    <div>
                                        <div class="stat-num ">
                                            {{ dashStats.assigned_treks }}
                                        </div>
                                        <div class="stat-lbl fs-6 ">
                                            Assigned Treks
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="nova-card p-3">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="rounded-circle d-flex
                                        align-items-center justify-content-center"
                                        style="width:46px;height:46px;
                                        background:#41E7A7">
                                        <i class="bi bi-people"
                                            style="color:dark;
                                            font-size:1.3rem"></i>
                                    </div>
                                    <div>
                                        <div class="stat-num  "
                                            style="color:#1e8449 ">
                                            {{ dashStats.total_participants }}
                                        </div>
                                        <div class="stat-lbl">
                                            Total Participants
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
      
                    <h6 class="fw-bold mb-3 mt-5 fs-5 ">
                        <i class="bi bi-map me-2 fw-semibold "
                            style="color:black"></i>My Assigned Treks
                    </h6>

                    <div class="row g-3">
                        <div v-if="myTreks.length===0"
                            class="col-12 text-center py-4 text-muted">
                            No treks assigned yet. Contact admin.
                        </div>
                        <div class="col-md-6 col-lg-4"
                            v-for="t in myTreks" :key="t.id">
                            <div class="nova-card p-3">

                                <!-- trek image -->

                                <div style="height:300px; overflow:hidden;
                                    border-radius:10px; margin-bottom:10px;
                                    position:relative">
                                    <img
                                        :src="getTrekImage(t.region, t.title,t.image_key)"
                                        :alt="t.title"
                                        style="width:100%; height:100%;
                                        object-fit:cover; transition:transform 0.3s"
                                        @mouseover="$event.target.style.transform='scale(1.05)'"
                                        @mouseout="$event.target.style.transform='scale(1)'""/>
                                    <span class="badge"
                                        :class="getStatusColor(t.current_status)"
                                        style="position:absolute;
                                        top:8px; left:8px">
                                        {{ t.current_status }}
                                    </span>
                                </div>

                                <div class="fw-semibold mb-1 fs-5">{{ t.title }}</div>
                                <div class="text-dark small fw-semibold  mb-3">
                                    <i class="bi bi-geo-alt fw-bold text-dark me-1"></i>
                                    {{ t.region }}
                                </div>
                                <div class="d-flex
                                            justify-content-between
                                            small mb-1">
                                            <span class="text-dark fw-semibold fs-6 ">
                                                Seats
                                            </span>
                                            <span class="fw-bold fs-6">
                                                {{ t.seats_remaining }}/{{ t.capacity }}
                                            </span>
                                </div>

                                <!-- SEAT CAPACITY -->

                                <div class="seat-track mb-3">
                                    <div class="seat-fill"
                                        :style="{
                                            width:(t.seats_remaining/t.capacity*100)+'%',
                                            background: t.seats_remaining < 3
                                                ? '#FF6B5B' : '#5499C7'
                                        }">
                                    </div>
                                </div>

                                <button class="btn btn-nova btn-sm w-100"
                                    @click="page='treks';openTrek(t)">
                                    <i class="bi bi-people me-1"></i>
                                    Manage Participants
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── MY TREKS PAGE ── -->
                <div v-if="page==='treks'">
                    <h4 class="fw-bold mb-4">
                        <i class="bi bi-map me-2 "
                            style="color:#1B4F72 "></i>My Assigned Treks
                    </h4>

                    <!-- participants panel -->
                    <div v-if="activeTrek"
                        class="nova-card p-4 mb-4">
                        <div class="d-flex justify-content-between
                            align-items-center mb-3">
                            <h6 class="fw-bold mb-0">
                                <i class="bi bi-people me-2"
                                    style="color:#1B4F72"></i>
                                Participants — {{ activeTrek.title }}
                            </h6>
                            <button class="btn btn-sm btn-outline-warning text-dark fw-semibold "
                                @click="activeTrek=null">
                                Close
                            </button>
                        </div>

                        <!-- UPDATE PAGE -->
                        <div class="d-flex gap-2 mb-4 flex-wrap
                            align-items-end ">
                            <div>
                                <label class="form-label  mb-1">
                                    Trek Status
                                </label>
                                <select v-model="newStatus"
                                    class="form-select form-select-sm "
                                    style="width:150px">
                                    <option>Open</option>
                                    <option>Closed</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                            <div>
                                <label class="form-label   mb-1">
                                    Seats Remaining
                                </label>
                                <input v-model="newSeats"
                                    type="number"
                                    class="form-control form-control-sm"
                                    style="width:100px"
                                    placeholder="Seats"/>
                            </div>
                            <button class="btn btn-nova btn-sm"
                                @click="doUpdate(activeTrek.id)">
                                <i class="bi bi-check me-1"></i>Update
                            </button>
                            <button class="btn btn-coral btn-sm text-dark"
                                @click="doFinish(activeTrek.id)">
                                <i class="bi bi-flag me-1"></i>
                                Mark Complete
                            </button>
                        </div>

                        <!-- PARTICIPANTS DETAIL TABLE -->

                        <table class="table tbl-nova table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Contact</th>
                                    <th>Fitness</th>
                                    <th>Booked On</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="peopleList.length===0">
                                    <td colspan="6"
                                        class="text-center py-4 text-muted">
                                        No participants yet
                                    </td>
                                </tr>
                                <tr v-for="p in peopleList"
                                    :key="p.booking_id">
                                    <td class="fw-bold">{{ p.name }}</td>
                                    <td>{{ p.email }}</td>
                                    <td>{{ p.contact_no }}</td>
                                    <td>
                                        <span class="badge bg-light text-dark">
                                            {{ p.fitness_level || 'N/A' }}
                                        </span>
                                    </td>
                                    <td>{{ p.booked_on }}</td>
                                    <td>
                                        <span class="badge"
                                            :class="p.status==='Booked'
                                            ? 'bg-success'
                                            : p.status==='Cancelled'
                                            ? 'bg-danger' : 'bg-info text-dark'">
                                            {{ p.status }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- trek cards -->

                    <div class="row g-3">
                        <div v-if="myTreks.length===0"
                            class="col-12 text-center py-5 text-muted">
                            <i class="bi bi-map"
                                style="font-size:3rem"></i>
                            <p class="mt-2">
                                No treks assigned to you yet
                            </p>
                        </div>
                    <div class="col-md-6 col-lg-4"    
                        v-for="t in myTreks" :key="t.id">
                        <div class="nova-card p-3">
                         
                            <div style="height:300px; overflow:hidden;
                                border-radius:10px; margin-bottom:10px;
                                position:relative">            
                                <img
                                    :src="getTrekImage(t.region, t.title, t.image_key)"
                                    :alt="t.title"
                                    style="width:100%; height:100%;
                                    object-fit:cover;transition:transform 0.3s"
                                    @mouseover="$event.target.style.transform='scale(1.05)'"
                                    @mouseout="$event.target.style.transform='scale(1)'"/>
                                <span class="badge"
                                    :class="getStatusColor(t.current_status)"
                                    style="position:absolute;
                                    top:8px; left:8px">
                                    {{ t.current_status }}
                                </span>
                            </div>

                            <div class="d-flex justify-content-between
                                mb-2">
                                <div class="fw-semibold fs-5">{{ t.title }}</div>
                                    <span class="badge"
                                        :class="getStatusColor(t.current_status)">
                                        {{ t.current_status }}
                                    </span>
                                </div>
        

                                <div class="text-muted fw-semibold small mb-3">
                                    <i class="bi bi-geo-alt me-1"></i>
                                    {{ t.region }}
                                </div>

                                <div class="text-dark  mb-3 fw-semibold">
                                    <i class="bi bi-calendar me-1 fw-bold"></i>
                                    {{ t.trip_start }}
                                    &nbsp;|&nbsp;
                                    <i class="bi bi-clock me-1 fw-bold"></i>
                                    {{ t.days_required }} days
                                </div>

                                <!-- SEAT CAPACITY -->
                                
                                <div class="mb-3">
                                    <div class="d-flex
                                        justify-content-between  fw-semibold mb-1">
                                        <span class="text-dark">
                                            Seats Remaining
                                        </span>
                                        <span class="fw-bold fs-6">
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

                                <button class="btn btn-nova btn-sm w-100 mt-2"
                                    @click="openTrek(t)">
                                    <i class="bi bi-people me-1"></i>
                                    View and Manage Participants
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    `,

    props: ['user'],

    setup(props) {
        const { ref, onMounted } = Vue

        const page       = ref('home')
        const notice     = ref('')
        const isErr      = ref(false)
        const dashStats  = ref(null)
        const myTreks    = ref([])
        const activeTrek = ref(null)
        const peopleList = ref([])
        const newStatus  = ref('Open')
        const newSeats   = ref('')

        function showNotice(msg, err=false) {
            notice.value = msg
            isErr.value  = err
            setTimeout(() => notice.value = '', 4000)
        }

        function getStatusColor(s) {
            const m = {
                Open     : 'bg-success',
                Closed   : 'bg-secondary',
                Completed: 'bg-info text-dark'
            }
            return m[s] || 'bg-secondary'
        }

  

        async function loadHome() {
            try {
                const r      = await axios.get('/api/staff/dashboard')
                dashStats.value = r.data.stats
                myTreks.value   = r.data.treks
            } catch(e) {
                const s = e.response?.status
                if (s===401||s===422) {
                    localStorage.clear()
                    window.location.reload()
                } else {
                    showNotice('Failed to load dashboard', true)
                }
            }
        }

        async function loadMyTreks() {
            const r      = await axios.get('/api/staff/treks')
            myTreks.value = r.data.treks
        }

        async function openTrek(trek) {
            activeTrek.value = trek
            newStatus.value  = trek.current_status
            newSeats.value   = trek.seats_remaining
            const r          = await axios.get(
                `/api/staff/treks/${trek.id}/participants`
            )
            peopleList.value = r.data.participants
        }

        async function doUpdate(id) {
            try {
                await axios.put(`/api/staff/treks/${id}`, {
                    current_status : newStatus.value,
                    seats_remaining: parseInt(newSeats.value)
                })
                showNotice('Trek updated!')
                loadMyTreks()
            } catch(e) {
                showNotice(e.response?.data?.msg || 'Update failed', true)
            }
        }

        async function doFinish(id) {
            if (!confirm('Mark this trek as completed? This cannot be undone.'))
                return
            try {
                await axios.put(`/api/staff/treks/${id}/finish`)
                showNotice('Trek marked as completed!')
                activeTrek.value = null
                loadMyTreks()
            } catch(e) {
                showNotice(e.response?.data?.msg || 'Failed', true)
            }
        }

        onMounted(() => loadHome())

        return {
            page, notice, isErr,
            dashStats, myTreks,
            activeTrek, peopleList,
            newStatus, newSeats,
            loadHome, loadMyTreks,
            openTrek, doUpdate, doFinish,
            getStatusColor, getTrekImage
        }
    }
}
