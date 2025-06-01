<template>
  <div class="h-screen flex justify-center items-center">
    <div class="bg- w-auto md:w-2/4 lg:w-2/3 flex justify-center items-center">
      <div class="w-full lg:w-1/2 px-10 lg:px-0">
        <h2 class="font-normal mb-6 text-3xl">
          Sign In to Your Account
        </h2>
        <div class="mb-6">
          <div class="mb-4">
            <label class="font-normal text-lg block mb-3"
              >Email Address</label
            >
            <input
              type="email"
              v-model="login.email"
              class="auth-form focus:outline-none focus:bg-orange-secondary focus:shadow-outline focus:border-purple-hover-stroke"
              placeholder="Write your email address here"
            />
          </div>
        </div>
        <div class="mb-6">
          <div class="mb-4">
            <label class="font-normal text-lg block mb-3"
              >Password</label
            >
            <input
              @keyup.enter="userLogin"
              type="password"
              v-model="login.password"
              class="auth-form focus:outline-none focus:bg-orange-secondary focus:shadow-outline focus:border-purple-hover-stroke"
              placeholder="Write your password here"
            />
          </div>
        </div>
        <div class="mb-6">
          <div class="mb-4">
            <button
              @click="userLogin"
              class="block w-full bg-orange-button hover:bg-green-button font-semibold px-6 py-4 text-lg rounded-full"
            >
              Sign In
            </button>
          </div>
        </div>
        <div class="text-center">
          <p class="text-md">
            Don't have account?
            <nuxt-link to="/register" class="no-underline text-white hero-underline"
              >Sign Up</nuxt-link
            >.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  data() {
    return {
      login: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    async userLogin() {
      try {
        let response = await this.$auth.loginWith('local', { data: this.login })
        this.$auth.setUser(response.data.data)
        // Redirect ke dashboard setelah login berhasil
        // this.$router.push('/dashboard')
      } catch (err) {
        console.log(err)
      }
    },
  },
}
</script>

<style scoped>
</style>
