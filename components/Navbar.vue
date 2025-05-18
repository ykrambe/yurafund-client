<template>
<header class="flex items-center px-4 py-2 bg-transparent relative">
  <!-- Left: Logo or Burger and Navigation -->
  <div class="flex items-center">
    <!-- Hamburger (mobile only) -->
    <button
      @click="toggleMobileMenu"
      class="text-white block md:hidden focus:outline-none"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>

    <!-- Navigation -->
    <nav :class="['w-full md:flex md:items-center md:w-auto', showMobileMenu ? 'block' : 'hidden']">
      <ul class="md:flex md:items-center">
        <li><nuxt-link class="text-white hover:text-teal-500 text-lg px-4 py-3 block" to="/">Home</nuxt-link></li>
        <li><a class="text-white hover:text-teal-500 text-lg px-4 py-3 block" href="#projects">Project</a></li>
        <li><a class="text-white hover:text-teal-500 text-lg px-4 py-3 block" href="#features">Features</a></li>
        <li><a class="text-white hover:text-teal-500 text-lg px-4 py-3 block" href="#testimonials">Success Stories</a></li>
        <li v-if="showMobileMenu">
          <nuxt-link
            to="/register"
            class="text-white hover:text-teal-500 text-lg px-4 py-3 block"
          >
            Sign Up
          </nuxt-link>
        </li>
        <li v-if="showMobileMenu">
          <nuxt-link
            to="/login"
            class="text-white hover:text-teal-500 text-lg px-4 py-3 block"
          >
            Sign In
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </div>

  <!-- Right: Auth buttons -->
  <div class="hidden md:flex items-center ml-auto">
    <ul v-if="!$store.state.auth.loggedIn" class="flex items-center">
      <li>
        <nuxt-link
          to="/register"
          class="inline-block bg-transparent border-white border hover:bg-white hover:bg-opacity-25 text-white font-light w-40 text-center px-6 py-1 text-lg rounded-full mr-4"
        >
          Sign Up
        </nuxt-link>
      </li>
      <li>
        <nuxt-link
          to="/login"
          class="inline-block bg-transparent border-white border hover:bg-white hover:bg-opacity-25 text-white font-light w-40 text-center px-6 py-1 text-lg rounded-full"
        >
          My Account
        </nuxt-link>
      </li>
    </ul>

    <!-- Logged-in dropdown -->
    <div v-else class="dropdown relative z-10">
      <!-- Avatar & name button -->
      <button
        @click="toggleDropdown"
        class="bg-white text-gray-700 font-semibold py-4 px-6 rounded inline-flex items-center"
      >
        <img
          v-if="$store.state.auth.user.image_url"
          :src="$axios.defaults.baseURL + '/' + $store.state.auth.user.image_url"
          alt=""
          class="h-8 rounded-full mr-2"
        />
        <span class="mr-1">{{ $store.state.auth.user.name }}</span>
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </button>

      <!-- Dropdown menu -->
      <ul
        v-show="showDropdown"
        @click.outside="closeDropdown"
        class="dropdown-menu absolute text-gray-700 pt-1 shadow w-full mt-2 bg-white rounded z-20"
      >
        <li>
          <nuxt-link to="/dashboard" class="block px-4 py-2 hover:bg-gray-100 hover:text-orange-500">My Dashboard</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/dashboard" class="block px-4 py-2 border-t hover:bg-gray-100 hover:text-orange-500">Account Settings</nuxt-link>
        </li>
        <li>
          <a @click="logout()" class="cursor-pointer block px-4 py-2 border-t hover:bg-gray-100 hover:text-orange-500">Logout</a>
        </li>
      </ul>

    </div>
  </div>
</header>

</template>

<script>
export default {
  data() {
    return {
      showMobileMenu: false,
      showDropdown: false,
    };
  },
  methods: {
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    },
    async logout() {
      await this.$auth.logout();
    },
    toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    },
    closeDropdown() {
      this.showDropdown = false;
    },
  },
};
</script>

<style scoped>
.dropdown:hover .dropdown-menu {
  display: block;
}
</style>
