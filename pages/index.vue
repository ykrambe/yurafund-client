<template>
  <div class="bg-white">
    <section class="landing-hero pt-5 relative">
      <div class="header__bg"></div>
      <div class="container mx-auto relative">
        <div class="flex flex-col md:flex-row items-center pt-10 px-5 md:px-0">
          <div class="w-full md:w-1/2 mb-8 md:mb-0">
            <h1 class="text-3xl md:text-4xl text-white mb-5">
              We helps startup to <br />
              getting started & funding <br />
              their truly needs
            </h1>
            <p class="text-white text-lg md:text-xl font-light mb-8">
              Fund the best idea to become <br />
              a real product and be the contributor
            </p>
            <a
              href="#projects"
              class="bg-orange-button hover:bg-green-button text-white font-semibold px-12 py-3 text-xl rounded-full"
            >
              Find a Project
            </a>
          </div>
          <div class="w-full md:w-1/2 flex justify-center">
            <img src="/hero-image@2x.png" alt="crowdfunding project" class="w-full max-w-sm md:max-w-full" />
          </div>
        </div>
      </div>

    </section>
    <section class="container mx-auto pt-24 mt-5" id="features">
      <div class="flex justify-between items-center mb-10">
        <div class="w-auto">
          <h2 class="text-3xl text-gray-900 mb-8">
            Only 3 steps to execute <br />
            your bright ideas
          </h2>
        </div>
      </div>
      <div class="flex">
        <div class="w-full px-56 mb-5">
          <img src="/line-step.svg" alt="" class="w-full" />
        </div>
      </div>
      <div class="flex justify-between items-center text-center">
        <div class="w-1/3">
          <figure class="flex justify-center items-center">
            <img src="/step-1-illustration.svg" alt="" class="h-30 mb-8" />
          </figure>
          <div class="step-content">
            <h3 class="font-medium text-gray-900 text-lg">Sign Up</h3>
            <p class="font-light text-gray-600">
              Sign Up account and start <br />funding project
            </p>
          </div>
        </div>
        <div class="w-1/3">
          <figure class="flex justify-center items-center -mt-24">
            <img src="/step-2-illustration.svg" alt="" class="h-30 mb-8" />
          </figure>
          <div class="step-content">
            <h3 class="font-medium text-gray-900 text-lg">Open Project</h3>
            <p class="font-light text-gray-600">
              Choose some project idea, <br />
              and start funding
            </p>
          </div>
        </div>
        <div class="w-1/3">
          <figure class="flex justify-center items-center -mt-48">
            <img src="/step-3-illustration.svg" alt="" class="h-30 mb-8" />
          </figure>
          <div class="step-content">
            <h3 class="font-medium text-gray-900 text-lg">Execute</h3>
            <p class="font-light text-gray-600">
              Time to makes dream <br />
              comes true
            </p>
          </div>
        </div>
      </div>
    </section>
    <section v-if="campaigns && campaigns.meta.status == 'success'" class="container mx-auto pt-24 bg-white" id="projects">
      <div class="flex justify-between items-center">
        <div class="w-auto">
          <h2 class="text-3xl text-gray-900 mb-8">
            New projects you can <br />
            taken care of
          </h2>
        </div>
        <div class="w-auto mt-5">
          <a class="text-gray-900 hover:underline text-md font-medium" href=""
            >View All</a
          >
        </div>
      </div>
      <div  class="grid grid-cols-3 gap-4 mt-3">
        <div
          v-for="campaign in campaigns.data"
          :key="campaign.id"
          class="mx-h w-full p-5 border border-gray-500 rounded-20"
        >
          <div class="item">
            <figure class="item-image">
              <img v-if="campaign.image_url"
                :src="config.public.apiBase + '/' + campaign.image_url"
                alt=""
                class="rounded-20 w-full"
              />
              <img v-else
                alt=""
                class="rounded-20 w-full"
              />
            </figure>
            <div class="item-meta">
              <h4 class="text-3xl font-medium text-gray-900 mt-5">
                {{ campaign.name }}
              </h4>
              <p class="text-md font-light text-gray-600 h-12">
                {{ campaign.short_description }}
              </p>
              <div class="relative pt-4 progress-bar">
                <div
                  class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 h-3 rounded-lg"
                >
                  <div
                    :style="
                      'width: ' +
                      (campaign.current_amount / campaign.goal_amount) * 100 +
                      '%'
                    "
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-progress progress-striped"
                  ></div>
                </div>
              </div>
              <div class="flex progress-info">
                <div>
                  {{ (campaign.current_amount / campaign.goal_amount) * 100 }}%
                </div>
                <div class="ml-auto font-semibold">
                  Rp {{ new Intl.NumberFormat().format(campaign.goal_amount) }}
                </div>
              </div>
            </div>
            <button
              @click="
                navigateTo({
                  name: 'projects-id',
                  params: { id: campaign.id },
                })
              "
              class="mt-5 button-cta block w-full bg-orange-button hover:bg-green-button text-white font-semibold px-6 py-2 text-lg rounded-full"
            >
              Fund Now
            </button>
          </div>
        </div>
      </div>
    </section>
    <section class="container mx-auto pt-24" id="testimonials" >
      <div class="flex justify-between items-center">
        <div class="w-auto">
          <h2 class="text-3xl text-gray-900 mb-8">
            See What Our <br />
            Clients Say
          </h2>
        </div>
      </div>
      <div class="flex mb-10 bg-secondary">
        <div class="w-2/12 flex justify-center items-start">
          <img src="/testimonial-line.svg" alt="" />
        </div>
        <div class="w-8/12 mt-16">
          <h2 class="text-3xl text-gray-900 font-light">
            "YuraFund makes crowdfunding accessible to everyone. <br />
            Find inspiring projects, back them instantly, and be part of innovation."
          </h2>
          <div class="testimonial-info mt-8">
            <div class="text-gray-900 text-xl font-semibold">John Doe</div>
            <div class="text-xl font-light text-gray-400">
              Product Owner
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="cta-clip"><br></div>
    <CallToAction />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'home'
})

const config = useRuntimeConfig()
const { api } = useApi()

const campaigns = ref(null)

try {
  campaigns.value = await api('/campaigns-limit')
} catch (error) {
  console.error('API connection failed:', error)
}



// SEO
useHead({
  title: 'YuraFund - Home',
  meta: [
    { name: 'description', content: 'YuraFund - Platform crowdfunding for Startup and Inovasion' }
  ]
})
</script>