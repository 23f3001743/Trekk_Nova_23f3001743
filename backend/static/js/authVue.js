
const LoginPage = {
    template: `
    <div class="login-wrapper">
        <div class="login-box">

            <!-- SMALL MOUNTAINS IMAGES -->

            <div class="mountain-strip">
                <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&q=70" alt="mountain"/>
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=70" alt="peak"/>
                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=70" alt="trek"/>
                <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&q=70" alt="lake"/>
            </div>

            
            <div class="text-center mb-4">
                <i class="bi bi-binoculars" style="font-size:2.5rem; color:#1B4F72"></i>
                <h4 class="fw-bold mt-1" style="color:#1B4F72">TrekkNova</h4>
                <p class="text-muted small">Discover Your Next Peak</p>
            </div>

            
            <div class="d-flex mb-4 p-1 gap-1"
                style="background:#f0f0f0; border-radius:10px">
                <button class="btn flex-fill fw-500"
                    :class="mode==='login' ? 'btn-nova' : ''"
                    @click="mode='login'">Login</button>
                <button class="btn flex-fill fw-500"
                    :class="mode==='register' ? 'btn-nova' : ''"
                    @click="mode='register'">Register</button>
            </div>

            <!-- ALERT message -->
            <div v-if="notice" class="alert alert-nova py-2"
                :class="isErr ? 'alert-danger' : 'alert-success'">
                {{ notice }}
            </div>

            <!-- LOGIN FORM -->
            <div v-if="mode==='login'">
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-envelope"></i>
                        </span>
                        <input v-model="loginData.email"
                            type="email" class="form-control"
                            placeholder="your@email.com"/>
                    </div>
                </div>
                <div class="mb-4">
                    <label class="form-label">Password</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-lock"></i>
                        </span>
                        <input v-model="loginData.password"
                            type="password" class="form-control"
                            placeholder="Enter password"/>
                    </div>
                </div>
                <button class="btn btn-nova w-100 py-2"
                    @click="doLogin" :disabled="busy">
                    <span v-if="busy"
                        class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                    Login
                </button>
                <p class="text-center mt-3 text-muted" style="font-size:11px">
                    Admin: admin@trekknova.com / Trekk@123
                </p>
            </div>

            <!-- REGISTER FORM -->
            <div v-if="mode==='register'">
                <div class="row g-3">
                    <div class="col-12">
                        <label class="form-label">Full Name</label>
                        <input v-model="regData.full_name"
                            class="form-control"
                            placeholder="Your full name"/>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Email</label>
                        <input v-model="regData.email"
                            type="email" class="form-control"
                            placeholder="your@email.com"/>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Password</label>
                        <input v-model="regData.password"
                            type="password" class="form-control"
                            placeholder="Min 6 chars"/>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Phone</label>
                        <input v-model="regData.contact_no"
                            class="form-control"
                            placeholder="9876543210"/>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Age</label>
                        <input v-model="regData.age"
                            type="number" class="form-control"
                            placeholder="22"/>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Fitness Level</label>
                        <select v-model="regData.fitness_level"
                            class="form-select">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="expert">Expert</option>
                        </select>
                    </div>
                    <div class="col-12">
                        <button class="btn btn-nova w-100 py-2"
                            @click="doRegister" :disabled="busy">
                            <span v-if="busy"
                                class="spinner-border spinner-border-sm me-2">
                            </span>
                            <i v-else class="bi bi-person-plus me-2"></i>
                            Create Account
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
    `,

    emits: ['on-login'],

    setup(props, { emit }) {
        const { ref } = Vue

        const mode    = ref('login')
        const busy    = ref(false)
        const notice  = ref('')
        const isErr   = ref(false)

        const loginData = ref({ email: '', password: '' })
        const regData   = ref({
            full_name    : '',
            email        : '',
            password     : '',
            contact_no   : '',
            age          : '',
            fitness_level: 'beginner'
        })

        function showNotice(msg, err=false) {
            notice.value = msg
            isErr.value  = err
            setTimeout(() => notice.value = '', 4000)
        }

        async function doLogin() {
            if (!loginData.value.email || !loginData.value.password) {
                return showNotice('Please fill all fields', true)
            }
            busy.value = true
            try {
                const res = await axios.post('/api/auth/login', loginData.value)
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('user',  JSON.stringify(res.data.user))
                emit('on-login', res.data.user)
            } catch(e) {
                showNotice(e.response?.data?.msg || 'Login failed', true)
            } finally {
                busy.value = false
            }
        }

        async function doRegister() {
            if (!regData.value.full_name ||
                !regData.value.email ||
                !regData.value.password) {
                return showNotice('Name, email and password needed', true)
            }
            busy.value = true
            try {
                await axios.post('/api/auth/register', regData.value)
                showNotice('Account created! Please login now.')
                mode.value             = 'login'
                loginData.value.email  = regData.value.email
            } catch(e) {
                showNotice(e.response?.data?.msg || 'Registration failed', true)
            } finally {
                busy.value = false
            }
        }

        return {
            mode, busy, notice, isErr,
            loginData, regData,
            doLogin, doRegister
        }
    }
}
