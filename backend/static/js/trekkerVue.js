
const TrekkerPanel = {
    template: `
    <div class="container-fluid fade-page">
        <div class="row">

            <!-- SIDE BAR -->
            <div class="col-md-2 side-nav d-none d-md-block">
                <div class="px-3 py-3">
                    <small class="text-muted text-uppercase fw-bold"
                        style="font-size:10px">Trekker Panel</small>
                </div>
                <nav>
                    <a class="side-link"
                        :class="{active: page==='home'}"
                        @click="page='home'; loadHome()">
                        <i class="bi bi-house"></i>Home
                    </a>
                    <a class="side-link"
                        :class="{active: page==='browse'}"
                        @click="page='browse'; loadTreks()">
                        <i class="bi bi-search"></i>Browse Treks
                    </a>
                    <a class="side-link"
                        :class="{active: page==='bookings'}"
                        @click="page='bookings'; loadMyBookings()">
                        <i class="bi bi-journal-check"></i>My Bookings
                    </a>
                    <a class="side-link"
                        :class="{active: page==='history'}"
                        @click="page='history'; loadHistory()">
                        <i class="bi bi-clock-history"></i>History
                    </a>
                    <a class="side-link"
                        :class="{active: page==='profile'}"
                        @click="page='profile'">
                        <i class="bi bi-person-circle"></i>Profile
                    </a>
                </nav>
            </div>

            <!-- MAIN CONTENT -->

            <div class="col-md-10 p-4">

                <div v-if="notice" class="alert alert-nova py-2 mb-3"
                    :class="isErr ? 'alert-danger' : 'alert-success'">
                    {{ notice }}
                </div>

                <!-- home page -->
                <div v-if="page==='home'">

                    <!-- hero banner -->
                    <div class="nova-card mb-4 overflow-hidden"
                        style="position:relative; height:200px">
                        <img
                            src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80"
                            alt="trekking"
                            style="width:100%; height:100%; object-fit:cover"/>
                        <div style="position:absolute; inset:0;
                            background:rgba(0,0,0,0.45);
                            display:flex; flex-direction:column;
                            align-items:center; justify-content:center;
                            text-align:center; padding:20px">
                            <h3 class="text-white fw-bold mb-2">
                                Hey {{ user?.full_name }}! 🏔️
                            </h3>
                            <p class="text-white-50 mb-3">
                                Ready for your next adventure?
                            </p>
                            <button class="btn btn-coral px-4"
                                @click="page='browse'; loadTreks()">
                                <i class="bi bi-search me-2"></i>
                                Explore Treks
                            </button>
                        </div>
                    </div>

                    <!-- statistic data  boxes -->
                    <div class="row g-3 mb-4" v-if="summary">
                        <div class="col-6 col-md-3">
                            <div class="stat-box">
                                <div class="stat-num">
                                    {{ summary.total_bookings }}
                                </div>
                                <div class="stat-lbl">Total Bookings</div>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="stat-box">
                                <div class="stat-num"
                                    style="color:#1e8449">
                                    {{ summary.active }}
                                </div>
                                <div class="stat-lbl">Active</div>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="stat-box">
                                <div class="stat-num"
                                    style="color:#5499C7">
                                    {{ summary.completed }}
                                </div>
                                <div class="stat-lbl">Completed</div>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="stat-box">
                                <div class="stat-num"
                                    style="color:#e67e22">
                                    {{ openTreks?.length || 0 }}
                                </div>
                                <div class="stat-lbl">Open Treks</div>
                            </div>
                        </div>
                    </div>

                    <!-- available treks data -->
                    <h6 class="fw-bold mb-3">Available Treks</h6>
                    <div class="row g-3">
                        <div class="col-md-6 col-lg-4"
                            v-for="t in (openTreks || []).slice(0,3)" :key="t.id">
                            <div class="nova-card"
                                style="overflow:hidden">
                                <div style="height:130px; position:relative">
                                    <img
                                        :src="getTrekImg(t.region,
                                            t.title, t.image_key)"
                                        :alt="t.title"
                                        style="width:100%; height:100%;
                                        object-fit:cover"/>
                                    <span :class="getDiffTag(t.difficulty_level)"
                                        style="position:absolute;
                                        top:8px; right:8px;
                                        font-size:11px">
                                        {{ t.difficulty_level }}
                                    </span>
                                </div>
                                <div class="p-3">
                                    <div class="fw-bold small mb-1">
                                        {{ t.title }}
                                    </div>
                                    <div class="text-muted small mb-2">
                                        <i class="bi bi-geo-alt me-1"></i>
                                        {{ t.region }}
                                    </div>
                                    <div class="d-flex
                                        justify-content-between
                                        align-items-center">
                                        <span class="fw-bold"
                                            style="color:#1B4F72">
                                            ₹{{ t.cost_per_person }}
                                        </span>
                                        <button class="btn btn-nova btn-sm"
                                            @click="bookNow(t.id)">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- search treks -->
                <div v-if="page==='browse'">
                    <h4 class="fw-bold mb-4">
                        <i class="bi bi-search me-2"
                            style="color:#1B4F72"></i>Browse Treks
                    </h4>

                    <!-- filters -->
                    <div class="nova-card p-3 mb-4">
                        <div class="row g-2">
                            <div class="col-md-4">
                                <input v-model="filters.q"
                                    class="form-control"
                                    placeholder="Search treks..."
                                    @input="loadTreks"/>
                            </div>
                            <div class="col-md-3">
                                <select v-model="filters.difficulty"
                                    class="form-select"
                                    @change="loadTreks">
                                    <option value="">Any Difficulty</option>
                                    <option>Easy</option>
                                    <option>Moderate</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <input v-model="filters.region"
                                    class="form-control"
                                    placeholder="Filter by region"
                                    @input="loadTreks"/>
                            </div>
                            <div class="col-md-2">
                                <button
                                    class="btn btn-outline-secondary w-100"
                                    @click="resetFilters">
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="loading" class="spin-area">
                        <div class="spinner-border"
                            style="color:#1B4F72"></div>
                    </div>

                    <div v-else>
                        <p class="text-muted small mb-3">
                            {{ trekResults.length }} trek(s) found
                        </p>
                        <div class="row g-3">
                            <div v-if="trekResults.length===0"
                                class="col-12 text-center py-5 text-muted">
                                <i class="bi bi-search"
                                    style="font-size:3rem"></i>
                                <p class="mt-2">No treks found</p>
                            </div>
                            <div class="col-md-6 col-lg-4"
                                v-for="t in trekResults" :key="t.id">
                                <div class="nova-card h-100"
                                    style="overflow:hidden">

                                    <!-- image with overlay -->
                                    <div style="height:170px;
                                        position:relative; overflow:hidden">
                                        <img
                                            :src="getTrekImg(t.region,
                                                t.title, t.image_key)"
                                            :alt="t.title"
                                            style="width:100%; height:100%;
                                            object-fit:cover;
                                            transition:transform 0.3s"
                                            @mouseover="$event.target.style.transform='scale(1.05)'"
                                            @mouseout="$event.target.style.transform='scale(1)'"/>
                                        <div style="position:absolute;
                                            bottom:0; left:0; right:0;
                                            background:linear-gradient(
                                                transparent,rgba(0,0,0,0.6));
                                            padding:10px 12px">
                                            <div class="text-white fw-bold
                                                small">
                                                {{ t.title }}
                                            </div>
                                            <div class="text-white-50"
                                                style="font-size:11px">
                                                <i class="bi bi-geo-alt me-1"></i>
                                                {{ t.region }}
                                            </div>
                                        </div>
                                        <span :class="getDiffTag(t.difficulty_level)"
                                            style="position:absolute;
                                            top:10px; right:10px;
                                            font-size:11px">
                                            {{ t.difficulty_level }}
                                        </span>
                                    </div>

                                    <div class="p-3">
                                        <div class="row g-1 small
                                            text-muted mb-3">
                                            <div class="col-6">
                                                <i class="bi bi-calendar me-1"></i>
                                                {{ t.trip_start }}
                                            </div>
                                            <div class="col-6">
                                                <i class="bi bi-clock me-1"></i>
                                                {{ t.days_required }} days
                                            </div>
                                        </div>

                                        <!-- seats availablity data -->
                                        <div class="mb-3">
                                            <div class="d-flex
                                                justify-content-between
                                                small mb-1">
                                                <span class="text-muted">
                                                    Seats left
                                                </span>
                                                <span :class="t.seats_remaining < 5
                                                    ? 'text-danger fw-bold'
                                                    : 'fw-bold'">
                                                    {{ t.seats_remaining }}/{{ t.capacity }}
                                                </span>
                                            </div>
                                            <div class="seat-track">
                                                <div class="seat-fill"
                                                    :style="{
                                                        width:(t.seats_remaining/t.capacity*100)+'%',
                                                        background: t.seats_remaining < 5
                                                            ? '#FF6B5B' : '#5499C7'
                                                    }">
                                                </div>
                                            </div>
                                        </div>

                                        <div class="d-flex
                                            justify-content-between
                                            align-items-center">
                                            <div>
                                                <div class="fw-bold fs-5"
                                                    style="color:#1B4F72">
                                                    ₹{{ t.cost_per_person }}
                                                </div>
                                                <div class="text-muted"
                                                    style="font-size:11px">
                                                    per person
                                                </div>
                                            </div>
                                            <button class="btn btn-nova"
                                                :disabled="t.seats_remaining===0"
                                                @click="bookNow(t.id)">
                                                {{ t.seats_remaining===0
                                                    ? 'Full' : 'Book Now' }}
                                            </button>
                                        </div>

                                        <div v-if="t.guide_name"
                                            class="mt-2 small text-muted">
                                            <i class="bi bi-person-badge me-1"></i>
                                            Guide: {{ t.guide_name }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--trekkers bookings page -->
                <div v-if="page==='bookings'">
                    <h4 class="fw-bold mb-4">
                        <i class="bi bi-journal-check me-2"
                            style="color:#1B4F72"></i>My Bookings
                    </h4>

                    <div v-if="myBookings.length===0"
                        class="text-center py-5 text-muted">
                        <i class="bi bi-journal-x"
                            style="font-size:3rem"></i>
                        <p class="mt-2">No bookings yet</p>
                        <button class="btn btn-nova"
                            @click="page='browse'; loadTreks()">
                            Browse Treks
                        </button>
                    </div>

                    <div class="row g-3">
                        <div class="col-md-6"
                            v-for="b in myBookings" :key="b.id">
                            <div class="nova-card p-3">
                                <div class="d-flex justify-content-between
                                    align-items-start mb-2">
                                    <div>
                                        <div class="fw-bold">
                                            {{ b.trek_title }}
                                        </div>
                                        <div class="text-muted small">
                                            <i class="bi bi-geo-alt me-1"></i>
                                            {{ b.trek_region }}
                                        </div>
                                        <div class="text-muted small">
                                            <i class="bi bi-calendar me-1"></i>
                                            Trip: {{ b.trip_start }}
                                        </div>
                                        <div class="text-muted small">
                                            <i class="bi bi-clock me-1"></i>
                                            Booked: {{ b.booked_at }}
                                        </div>
                                    </div>
                                    <span class="badge"
                                        :class="b.booking_status==='Booked'
                                        ? 'bg-success'
                                        : b.booking_status==='Cancelled'
                                        ? 'bg-danger' : 'bg-secondary'">
                                        {{ b.booking_status }}
                                    </span>
                                </div>

                                <!-- payment badge -->
                                <div class="mb-2">
                                    <span v-if="b.payment_status==='Pending'"
                                        class="badge bg-warning text-dark">
                                        Payment Pending
                                    </span>
                                    <span v-else class="badge bg-success">
                                        Paid — {{ b.payment_ref }}
                                    </span>
                                </div>

                                <!-- payment form page -->
                                <div  v-if="payForms[b.id] &&          
                                b.booking_status==='Booked' &&          
                                b.payment_status==='Pending'"                                   
                                class="p-3 mb-2 rounded"
                                    style="background:#f4f7fa">
                                    <p class="small fw-bold mb-2"
                                        style="color:#1B4F72">
                                        <i class="bi bi-credit-card me-1"></i>
                                        Pay ₹{{ b.cost_per_person }}
                                    </p>
                                    <div class="row g-2">
                                        <div class="col-12">
                                            <input
                                                v-model="(payForms[b.id] ||= {}).card_number"
                                                class="form-control form-control-sm"
                                                placeholder="Card Number (16 digits)"
                                                maxlength="16"/>
                                        </div>
                                        <div class="col-12">
                                            <input
                                                v-model="payForms[b.id].card_name"
                                                class="form-control form-control-sm"
                                                placeholder="Name on Card"/>
                                        </div>
                                        <div class="col-6">
                                            <input
                                                v-model="payForms[b.id].card_expiry"
                                                class="form-control form-control-sm"
                                                placeholder="MM/YY"/>
                                        </div>
                                        <div class="col-6">
                                            <input
                                                v-model="payForms[b.id].card_cvv"
                                                class="form-control form-control-sm"
                                                placeholder="CVV"
                                                maxlength="3"/>
                                        </div>
                                        <div class="col-12">
                                            <button
                                                class="btn btn-nova btn-sm w-100"
                                                @click="doPay(b.id)"
                                                :disabled="payingId===b.id">
                                                <span v-if="payingId===b.id"
                                                    class="spinner-border
                                                    spinner-border-sm me-1">
                                                </span>
                                                {{ payingId===b.id
                                                    ? 'Processing...'
                                                    : 'Pay Now' }}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- cancel button -->
                                <button
                                    v-if="b.booking_status==='Booked'"
                                    class="btn btn-sm btn-outline-danger w-100"
                                    @click="doCancel(b.id)">
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- history page -->
                <div v-if="page==='history'">    
                <div class="d-flex justify-content-between        
                align-items-center mb-4">        
                <h4 class="fw-bold mb-0">            
                <i class="bi bi-clock-history me-2"                
                style="color:#1B4F72"></i>Trek History        
                </h4>        
                <button class="btn btn-coral"            
                @click="doExport">            
                <i class="bi bi-download me-1"></i>            
                Export CSV        
                </button>   
                </div>

    
                <!-- status filter tabs -->
                <div class="d-flex gap-2 mb-4">
                <button class="btn btn-sm"
                :class="historyFilter===''
                ? 'btn-nova' : 'btn-outline-secondary'"
                @click="historyFilter=''; loadHistory()">
                All
                </button>
        
                <button class="btn btn-sm"
                :class="historyFilter==='Booked'
                ? 'btn-nova' : 'btn-outline-secondary'"
                @click="historyFilter='Booked'; loadHistory()">
                Active
                </button>
                <button class="btn btn-sm"
                :class="historyFilter==='Completed'
                ? 'btn-nova' : 'btn-outline-secondary'"
                @click="historyFilter='Completed'; loadHistory()">
                Completed
                </button>
                <button class="btn btn-sm"
                :class="historyFilter==='Cancelled'
                ? 'btn-danger' : 'btn-outline-danger'"
                @click="historyFilter='Cancelled'; loadHistory()">
                Cancelled
                </button>
                </div>
                <div v-if="historyList.length===0"
                class="text-center py-5 text-muted">
                <i class="bi bi-clock-history"
                style="font-size:3rem"></i>
                <p class="mt-2">No records found</p>
                </div>
                <div class="nova-card" v-else>        
                <table class="table tbl-nova table-hover mb-0">            
                <thead>                
                <tr>
                    <th>Trek</th>
                    <th>Region</th>
                    <th>Booked On</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="b in historyList" :key="b.id">
                    <td class="fw-bold">{{ b.trek_title }}</td>
                    <td>{{ b.trek_region }}</td>
                    <td>{{ b.booked_at }}</td>
                    <td>₹{{ b.amount_paid || 0 }}</td>
                    <td>
                        <span class="badge"
                            :class="b.payment_status==='Paid'
                            ? 'bg-success'
                            : 'bg-warning text-dark'">
                            {{ b.payment_status }}
                        </span>
                    </td>
                    <td>
                        <span class="badge"
                            :class="b.booking_status==='Booked'
                            ? 'bg-success'
                            : b.booking_status==='Cancelled'
                            ? 'bg-danger' : 'bg-info text-dark'">
                            {{ b.booking_status }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

                <!-- profile page -->
                <div v-if="page==='profile'">
                    <h4 class="fw-bold mb-4">
                        <i class="bi bi-person-circle me-2"
                            style="color:#1B4F72"></i>My Profile
                    </h4>
                    <div class="nova-card p-4" style="max-width:540px">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Full Name</label>
                                <input v-model="myProfile.full_name"
                                    class="form-control"/>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Contact No</label>
                                <input v-model="myProfile.contact_no"
                                    class="form-control"/>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Age</label>
                                <input v-model="myProfile.age"
                                    type="number" class="form-control"/>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">
                                    Fitness Level
                                </label>
                                <select v-model="myProfile.fitness_level"
                                    class="form-select">
                                    <option value="beginner">
                                        Beginner
                                    </option>
                                    <option value="intermediate">
                                        Intermediate
                                    </option>
                                    <option value="expert">Expert</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">About Me</label>
                                <textarea v-model="myProfile.about_me"
                                    class="form-control" rows="3"
                                    placeholder="Tell us about yourself...">
                                </textarea>
                            </div>
                            <div class="col-12">
                                <label class="form-label">
                                    New Password
                                    <small class="text-muted">
                                        (leave blank to keep same)
                                    </small>
                                </label>
                                <input v-model="myProfile.new_password"
                                    type="password" class="form-control"/>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-nova"
                                    @click="saveProfile"
                                    :disabled="loading">
                                    <span v-if="loading"
                                        class="spinner-border
                                        spinner-border-sm me-1"></span>
                                    Save Changes
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

        const page        = ref('home')
        const loading     = ref(false)
        const notice      = ref('')
        const historyFilter = ref('')
        const isErr       = ref(false)
        const summary     = ref(null)
        const openTreks   = ref([])
        const myBookings  = ref([])
        const trekResults = ref([])
        const historyList = ref([])
        const payForms    = ref({})
        const payingId    = ref(null)

        const filters = ref({
            q: '', difficulty: '', region: ''
        })

        const myProfile = ref({
            full_name   : props.user?.full_name    || '',
            contact_no  : props.user?.contact_no   || '',
            age         : props.user?.age          || '',
            fitness_level: props.user?.fitness_level || 'beginner',
            about_me    : props.user?.about_me     || '',
            new_password: ''
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

        function getTrekImg(region, title, imageKey='') {
            const map = {
                'kedarnath' : 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=70',
                'roopkund'  : 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70',
                'hampta'    : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70',
                'triund'    : 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&q=70',
                'valley'    : 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=70',
                'manali'    : 'https://images.unsplash.com/photo-1626017740083-3c29e524e3f5?w=400&q=70',
                'ladakh'    : 'https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6?w=400&q=70',
                'himachal'  : 'https://images.unsplash.com/photo-1597977084860-23cf629c5588?w=400&q=70',
                'uttarakhand':'https://images.unsplash.com/photo-1623838978580-ef52ec53b4b1?w=400&q=70',
            }
            if (imageKey && map[imageKey.toLowerCase()])
                return map[imageKey.toLowerCase()]
            const t = title.toLowerCase()
            const r = region.toLowerCase()
            for (const key in map) {
                if (t.includes(key)) return map[key]
            }
            for (const key in map) {
                if (r.includes(key)) return map[key]
            }
            return 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=70'
        }

        function initPayForm(id) {
            if (!payForms.value[id]) {
                payForms.value[id] = {
                    card_number: '',
                    card_name  : '',
                    card_expiry: '',
                    card_cvv   : ''
                }
            }
        }

        async function loadHome() {    
          try {        
            const r = await axios.get('/api/trekker/home')        
            summary.value    = r.data.summary     || {}        
            openTreks.value  = r.data.open_treks  || []        
            myBookings.value = r.data.my_bookings || []        
            if (myBookings.value && myBookings.value.length > 0) {            
              myBookings.value.forEach(b => initPayForm(b.id))        
            }    
          } catch(e) {        
            const s = e.response?.status        
            if (s===401 || s===422) {            
              localStorage.clear()            
              window.location.reload()        
            } else {            
              showNotice('Failed to load dashboard', true)        
            }    
          }
        }

        async function loadTreks() {    
          loading.value = true    
          try {        
            const p = new URLSearchParams({
            q         : filters.value.q          || '',
            difficulty: filters.value.difficulty || '',
            region    : filters.value.region     || ''        
          }).toString()
                  const r  = await axios.get(`/api/trekker/treks?${p}`)
                  trekResults.value = r.data.treks || []
            } catch(e) {
                  showNotice('Could not load treks', true)
                  trekResults.value = []
            } finally {
          loading.value = false    
        }
      }

        function resetFilters() {
            filters.value = { q: '', difficulty: '', region: '' }
            loadTreks()
        }

        async function loadMyBookings() {
          try {
            const r          = await axios.get('/api/trekker/my-bookings')
            myBookings.value = r.data.bookings || []
            if (myBookings.value.length > 0) {
              myBookings.value.forEach(b => initPayForm(b.id))
            }
          } catch(e) {
            showNotice('Could not load bookings', true)
          }
        }

        async function loadHistory() {
          try {
            const params = historyFilter.value
            ? `?status=${historyFilter.value}` : ''
            const r = await axios.get(
            `/api/trekker/my-history${params}`
          )
          historyList.value = r.data.bookings || []
        } catch(e) {
          showNotice('Could not load history', true)
        }
      }

        async function bookNow(tid) {
            try {
                const r = await axios.post('/api/trekker/book',
                    { trek_id: tid })
                showNotice(r.data.msg)
                loadHome()
                if (trekResults.value.length > 0) loadTreks()
            } catch(e) {
                showNotice(e.response?.data?.msg || 'Booking failed', true)
            }
        }

        async function doCancel(bid) {
            if (!confirm('Cancel this booking?')) return
            try {
                await axios.put(`/api/trekker/bookings/${bid}/cancel`)
                showNotice('Booking cancelled')
                loadMyBookings()
            } catch(e) {
                showNotice(e.response?.data?.msg || 'Failed', true)
            }
        }

        async function doPay(bid) {
            payingId.value = bid
            try {
                const r = await axios.post(
                    `/api/trekker/bookings/${bid}/pay`,
                    payForms.value[bid]
                )
                showNotice(r.data.msg)
                loadMyBookings()
            } catch(e) {
                showNotice(e.response?.data?.msg || 'Payment failed', true)
            } finally {
                payingId.value = null
            }
        }

        async function saveProfile() {
            loading.value = true
            try {
                await axios.put('/api/auth/me', myProfile.value)
                showNotice('Profile saved!')
                myProfile.value.new_password = ''
            } catch(e) {
                showNotice(e.response?.data?.msg || 'Failed', true)
            } finally {
                loading.value = false
            }
        }

        async function doExport() {
            try {
                loading.value = true
                await axios.post('/api/trekker/export')
                showNotice('CSV export started! Check your email.')
            } catch(e) {
                showNotice(e.response?.data?.msg || 'Export failed', true)
            } finally {
                loading.value = false
            }
        }

        onMounted(() => loadHome())

        return {
            page, loading, notice, isErr,
            summary, openTreks, myBookings,
            trekResults, historyList,
            filters, myProfile,
            payForms, payingId,historyFilter,
            loadHome, loadTreks, loadMyBookings,
            loadHistory, resetFilters,
            bookNow, doCancel, doPay,
            saveProfile, doExport,
            getDiffTag, getTrekImg
        }
    }
}
