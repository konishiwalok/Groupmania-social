<!--composant navbar signup/login-->
<template>
    <div class="Navbar">
        <b-navbar toggleable="lg" type="dark" variant="info">
            <a href="/"><img class="img-fluid logo" src="../assets/icon-left-font-monochrome-white.svg" aria-label="logo groupomania" alt="Logo groupomania"></a>
        </b-navbar>
    </div>
</template>

<script>
export default {
    name: 'Navbar',
    user: true
}
</script>

<style scoped>
.navbar-dark .navbar-nav .nav-link {
    color: white;
}
.logo {
    max-height: 80px;
    max-width: 220px;
}
</style>