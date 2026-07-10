
const { createApp, ref, computed, onMounted } = Vue


axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

const TrekkNova = {
    template: `

    <div>
        <div v-if="loggedIn"
            class="top-nav d-flex justify-content-between align-items-center">
            <span class="brand">
                <i class="bi bi-binoculars me-2"></i>TrekkNova
            </span>
            <div class="d-flex align-items-center gap-3">
                <span class="user-info">
                    <i class="bi bi-person-circle me-1"></i>
                    {{ activeUser?.full_name }}
                </span>
                <span class="badge bg-warning text-dark text-capitalize">
                    {{ activeUser?.role }}
                </span>
                <button class="btn btn-sm btn-outline-light"
                    @click="doLogout">
                    <i class="bi bi-box-arrow-right me-1"></i>Logout
                </button>
            </div>
        </div>

        <!-- RELOGIN -->

        <div v-if="!loggedIn">
            <login-page @on-login="handleLogin"></login-page>
        </div>

        <!-- DASHBOARD BASED ON ROLES -->

        <div v-else>
            <admin-panel
                v-if="activeUser?.role === 'admin'"
                :user="activeUser">
            </admin-panel>

            <staff-panel
                v-else-if="activeUser?.role === 'staff'"
                :user="activeUser">
            </staff-panel>

            <trekker-panel
                v-else-if="activeUser?.role === 'trekker'"
                :user="activeUser">
            </trekker-panel>
        </div>
    </div>
    `,

    setup() {
        const activeUser = ref(null)
        const loggedIn   = computed(() => !!activeUser.value)

   
        onMounted(() => {
            const token = localStorage.getItem('token')
            const saved = localStorage.getItem('user')
            if (token && saved) {
                try {
                    activeUser.value = JSON.parse(saved)
                } catch(e) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                }
            }
        })

        function handleLogin(userData) {
            activeUser.value = userData
        }

        function doLogout() {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            activeUser.value = null
        }

        return { activeUser, loggedIn, handleLogin, doLogout }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const app = createApp(TrekkNova)
    app.component('login-page',    LoginPage)
    app.component('admin-panel',   AdminPanel)
    app.component('staff-panel',   StaffPanel)
    app.component('trekker-panel', TrekkerPanel)
    app.mount('#app')
})
