<!-- composant qui se trouve sur toutes les pages -->
<template>
  <div class="container-fluid bg-light font-weight-bold text-secondary  ">
    <footer class="d-flex flex-column justify-content-center  mt-5">
      <div class="col-md grid-margin stretch-card">
        <div class="card borderopa">
          <div class="card-body">
            <h4 class="card-title "> 👌Tu peux nous joindre ici 😀</h4>

            <div class="template-demo">
              <button 
                type="button" 
                class="btn btn-social-icon btn-outline-facebook"
              >
                <i class="fa fa-facebook"></i>
              </button>
              <button
                type="button"
                class="btn btn-social-icon btn-outline-youtube"
              >
                <i class="fa fa-youtube"></i>
              </button>
              <button
                type="button"
                class="btn btn-social-icon btn-outline-twitter"
              >
                <i class="fa fa-twitter"></i>
              </button>
              <button
                type="button"
                class="btn btn-social-icon btn-outline-linkedin"
              >
                <i class="fa fa-linkedin"></i>
              </button>
              <button
                type="button"
                class="btn btn-social-icon btn-outline-instagram"
              >
                <i class="fa fa-instagram"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.borderopa{
background-image: linear-gradient(to right, #17a2b8, #76acd9, #bcb4e0, #e9c2da, #ffd7d8);
border-radius:20px 20px 20px 20px;

}
</style>
