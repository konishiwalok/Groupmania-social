<!--importantions des composants pour page de connection-->
<template>
  <div class="min-vh-100 d-flex flex-column justify-content-between">
    <Navbar />
    <Log />
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Log from '@/components/Log.vue'
import Footer from '@/components/Footer.vue'


export default {
  name: 'Login',
  components: {
    Navbar, Log, Footer
  }
}
</script>


