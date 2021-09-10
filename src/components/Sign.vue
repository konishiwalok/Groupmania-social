<!--composant de signupVieuw-->
<template>
  <div class="bg-primary pt-3 pb-5">
    <div class=" card col-8 col-lg-4 mx-auto bg-white py-4 ">
      <h1 class="h3 text-secondary mt-3">Créer un compte</h1>
      <form
        id="form"
        class="mt-3 mb-4"
        @submit.prevent="signup()"
        method="post"
        novalidate="true"
      >
        <div
          class="form-group form-group-sm"
          :class="{ 'form-group--error': $v.pseudo.$error }"
        >
          <div class="col mx-auto position-relative">
            <label for="pseudo">Pseudo</label>

            <div class="d-flex justify-content-center input-group">
              <span class="icon position-absolute input-group-addon"> </span>
              <input
                id="pseudo"
                name="pseudo"
                type="text"
                class="col-7 col-lg-6 form-control form-control-sm"
                v-model.trim="$v.pseudo.$model"
                required
              />
            </div>
            <span class="badge badge-danger" v-if="!$v.pseudo.minLength"
              >{{ $v.pseudo.$params.minLength.min }} caractères min !</span
            >
          </div>
        </div>
        <div
          class="form-group form-group-sm"
          :class="{ 'form-group--error': $v.email.$error }"
        >
          <div class="col mx-auto position-relative ">
            <label for="email">Email</label>

            <div class="d-flex justify-content-center input-group">
              <span class="icon position-absolute input-group-addon"> </span>
              <input
                id="email"
                name="email"
                type="email"
                class="col-7 col-lg-6 form-control form-control-sm"
                v-model.trim="$v.email.$model"
                required
              />
            </div>
          </div>
        </div>
        <div
          class="form-group form-group-sm"
          :class="{ 'form-group--error': $v.password.$error }"
        >
          <div class="col mx-auto position-relative">
            <label for="password">Mot de passe</label>

            <div class="d-flex justify-content-center input-group">
              <span class="icon position-absolute input-group-addon"> </span>
              <input
                id="password"
                name="password"
                type="password"
                class="col-7 col-lg-6 form-control form-control-sm"
                v-model.trim="$v.password.$model"
                required
              />
            </div>
            <span class="badge badge-danger" v-if="!$v.password.minLength"
              >{{ $v.password.$params.minLength.min }} caractères min !.</span
            >
          </div>
        </div>
        <div class="form-group form-group-sm">
          <div class="col mx-auto position-relative">
            <label for="confirmPassword">Confirmation</label>

            <div class="d-flex justify-content-center input-group">
              <span class="icon position-absolute input-group-addon"> </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                class="col-7 col-lg-6 form-control form-control-sm"
                v-model.trim="$v.confirmPassword.$model"
                required
              />
            </div>
          </div>
        </div>
        <button
          class="btn  btn-sm mt-3 bg-info"
          type="submit"
          @click.prevent="signup"
        >
          S'inscrire
        </button>
      </form>
      <div>
        <!-- alert from axios'response -->
        <b-alert v-if="blankFields" show dismissible variant="danger"
          >Veuillez compléter tous les champs</b-alert
        >
        <b-alert v-if="this.alert == 400" show dismissible variant="danger"
          >Veuillez respecter le format des champs</b-alert
        >
        <b-alert v-if="this.alert == 409" show dismissible variant="danger"
          >Pseudo ou Email déjà utilisé</b-alert
        >
        <b-alert v-if="this.alert == 500" show dismissible variant="danger"
          >Une erreur est survenue</b-alert
        >
        <b-alert
          v-if="differentConfirmPassword"
          show
          dismissible
          variant="danger"
          >Les mots de passe sont différents</b-alert
        >
      </div>
      <hr class="line w-80" />
      <div class="">
        <button class="btn  btn-sm  bg-info" @click.prevent="goLogin">
          Connexion
        </button>
        <p>Déjà inscrit ? Vous connectez ici !</p>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, email } from "vuelidate/lib/validators";
import axios from "axios";

export default {
  name: "signup",

  data() {
    return {
      pseudo: "",
      email: "",
      password: "",
      confirmPassword: "",
      submited: false,
      blankFields: false,
      differentConfirmPassword: false,
      alert: [],
    };
  },

  validations: {
    pseudo: {
      required,
      minLength: minLength(5),
    },
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(6),
    },
    confirmPassword: {
      required,
    },
  },

  methods: {
    goLogin() {
      this.$router.push("Login");
    },

    signup() {
      this.blankFields = false;
      this.differentConfirmPassword = false;
      this.alert = [0]; // reboot alerte avant chaque essaie
      this.$v.$touch(); // verifie les erreurs

      if (
        !this.email ||
        !this.password ||
        !this.pseudo ||
        !this.confirmPassword
      ) {
        this.blankFields = true;
      } else {
        if (this.password == this.confirmPassword) {
          this.submited = true;
          axios
            .post("http://localhost:3000/api/users/signup", {
              pseudo: this.pseudo,
              email: this.email,
              password: this.password,
            })
            .then(() => {
              alert("Félicitations vous venez de  créé votre compte avec succès");
              localStorage.setItem("pseudo", this.pseudo);
              this.$router.push("Login");
            })
            .catch((error) => {
              if (error.response) {
                this.alert = error.response.status;
              }
            });
        } else {
          this.differentConfirmPassword = true;
        }
      }
    },
  },
};
</script>

<style scoped>
.btn {
  margin-bottom: 20px;
  font-weight: bold;
}
.icon {
  left: 10%;
}
</style>
