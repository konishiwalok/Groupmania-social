<!--composant de ProfileView -->
<template>
  <div class="container-fluid  ">
    <div class="card col-8 mx-auto elborde jumbotron  ">
      <h1 class="h3 auto-margin ">mon profil 🎉</h1>
        <hr class="line w-100" />
      <div class="row  ">
        <div class="col-8 mx-auto my-4 ">
          <div class="d-flex justify-content-center align-items-center ">
            <b-img id="imgProfile" :src="user.imageUrl" fluid></b-img>
           <div> 
            <p class=" auto-margin ">username: </p>
            <h1 class="ml-2 h3 align-self-end">{{ user.pseudo }}</h1>
             </div>
          </div>
          <hr class="line w-75" />
        </div>
      </div>

      <div class="form-group mt-4  ">
        <div class="row">
          <div class="col-10 mx-auto mb-3">
            <b-link
              v-b-toggle.newPassword
              class="btn bg-info font-weight-bold px-2 mr-2"
              >Modifier mes infos</b-link
            >
            <b-collapse id="newPassword">
              <form
                class="card col col-lg-8 mx-auto bg-white py-4"
                @submit.prevent="updateProfile"
                enctype="multipart/form-data"
              >
                <div class="form-group mt-3">
                  <label id="imageLabel" for="image" class="font-weight-bold"
                    >Modifier mon image</label
                  >
                  
                  <input
                    type="file"
                    name="image"
                    id="image"
                    ref="image"
                    v-on:change="handleFileUpload()"
                  />
                  <span class="text-center font-weight-bold">{{
                    image.name
                  }}</span>
                  <div
                    class="form-group form-group-sm"
                    :class="{ 'form-group--error': $v.pseudo.$error }"
                  >
                    <div class="col mx-auto position-relative">
                      <label for="pseudo"></label>
                      <div class="d-flex justify-content-center input-group">
                      
                        <input
                          id="pseudo"
                          name="pseudo"
                          type="text"
                          class="col-7 col-lg-6 form-control form-control-sm"
                          v-model.trim="$v.pseudo.$model"
                          :placeholder="user.pseudo"
                        />
                      </div>
                      <span
                        class="badge badge-danger"
                        v-if="!$v.pseudo.minLength"
                        >{{ $v.pseudo.$params.minLength.min }} caractères min
                        !</span
                      >
                    </div>
                  </div>
                  <div
                    class="form-group form-group-sm"
                    :class="{ 'form-group--error': $v.email.$error }"
                  >
                    <div class="col mx-auto position-relative">
                      <label for="email"></label>
                      <div class="d-flex justify-content-center input-group">
                        <span class="icon position-absolute input-group-addon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="30"
                            fill="currentColor"
                            class="bi bi-envelope-fill"
                            viewBox="0 0 16 16"
                          >
                            <path
                              d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"
                            />
                          </svg>
                        </span>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          class="col-7 col-lg-6 form-control form-control-sm"
                          v-model.trim="$v.email.$model"
                          :placeholder="user.email"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    class="form-group form-group-sm"
                    :class="{ 'form-group--error': $v.password.$error }"
                  >
                    <div class="col mx-auto position-relative">
                      <label for="password"></label>
                      <div class="d-flex justify-content-center input-group">
                  
                        <input
                          id="password"
                          name="password"
                          type="password"
                          class="col-7 col-lg-6 form-control form-control-sm"
                          v-model.trim="$v.password.$model"
                          placeholder="Mot de passe"
                        />
                      </div>
                      <span
                        class="badge badge-danger"
                        v-if="!$v.password.minLength"
                        >{{ $v.password.$params.minLength.min }} caractères min
                        !.</span
                      >
                    </div>
                  </div>
                  <div class="form-group form-group-sm">
                    <div class="col mx-auto position-relative">
                      <label for="confirmPassword"></label>
                      <div class="d-flex justify-content-center input-group">

                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          class="col-7 col-lg-6 form-control form-control-sm"
                          v-model.trim="$v.confirmPassword.$model"
                          placeholder="Confirmation"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    v-b-toggle.newPassword
                    class="btn btn-dark btn-sm mt-3"
                    type="submit"
                  >
                    Valider
                  </button>
                </div>
              </form>
            </b-collapse>
            <hr class="line w-75" />
            <b-link class="btn bg-info font-weight-bold px-2 " to="allpost"
              >Rédiger un post</b-link
            >
          </div>
        </div>
        <div class="row">
          <div class="col-8 mx-auto my-5">
           <b-link
              v-if="this.user.isAdmin == 1"
              class="delete badge badge-light font-weight-bold py-1 mr-2"
              to="AllProfiles"
              >Consulter les profiles</b-link
            >
            <!--delate user -->
            <b-buton
              v-b-modal.modal-center
              class="delete badge badge-light py-1  bg-danger"
              >Supprimer mon compte 🗑️</b-buton
            >

            <b-modal
              id="modal-center"
              centered
              content-class="shadow"
              title="confirmation modal"
              header-bg-variant="danger"
            >
              <p class="my-2">
                Êtes-vous sûr de vouloir <strong>supprimer</strong> votre compte
                ?
              </p>
              <template #modal-footer="{ cancel }">
                <b-button size="sm" @click="cancel()">
                  Cancel
                </b-button>
                <b-button size="sm" variant="danger" @click.prevent="deleteUser"
                  >Confirmer</b-button
                >
              </template>
            </b-modal>
          </div>
        </div>
      </div>

      <b-alert v-if="errorInputs" show dismissible variant="danger"
        >Pseudo ou Email déjà utilisé</b-alert
      >
      <b-alert v-if="confirmUpdate" show dismissible variant="success"
        >Profil mis à jour</b-alert
      >
      <b-alert v-if="errorDelete" show dismissible variant="danger"
        >Une erreur est survenue.Ressayez plus tard</b-alert
      >
      <b-alert v-if="differentConfirmPassword" show dismissible variant="danger"
        >Les mots de passe sont différents</b-alert
      >
    </div>
  </div>

</template>

<script>
import { minLength, email } from "vuelidate/lib/validators";
import axios from "axios";

export default {
  name: "profile",

  async created() {
    await axios
      .get("http://localhost:3000/api/users/profile", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + this.token,
        },
      })
      .then((response) => {
        this.user = response.data;
        console.log(response);
      })
      .catch((e) => {
        console.log(e + "User inconnu");
        this.$router.push("/login");
      });
  },

  data() {
    return {
      user: [],
      token: localStorage.getItem("token"),
      userId: parseInt(localStorage.getItem("userId")),

      pseudo: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
      isAdmin: "",

      submited: false,
      isActive: false,
      errorInputs: false,
      confirmUpdate: false,
      errorDelete: false,
      differentConfirmPassword: false,
    };
  },

  validations: {
    pseudo: {
      minLength: minLength(5),
    },
    email: {
      email,
    },
    password: {
      minLength: minLength(6),
    },
    confirmPassword: {},
  },

  methods: {
    handleFileUpload() {
      this.image = this.$refs.image.files[0];
      this.user.imageUrl = URL.createObjectURL(this.image); //remplace l'image de l'utilisateur par celle téléchargée
    },

    updateProfile() {
      this.$v.$touch();

      this.errorInputs = false; // l'erreur de redémarrage est signalée avant chaque essai
      this.errorDelete = false;
      this.differentConfirmPassword = false;

      // Vérifie si la saisie du mot de passe est remplie
      if (this.password !== null) {
        // Vérifie si les deux correspondent
        if (this.password !== this.confirmPassword) {
          // Throw error if not
          this.differentConfirmPassword = true;

          // Envoie la demande si OK
        } else {
          const formData = new FormData();

          if (this.image) {
            formData.append("image", this.image);
            formData.append("userId", this.userId);
            formData.append("pseudo", this.pseudo);
            formData.append("email", this.email);
            formData.append("password", this.password);
          } else {
            formData.append("userId", this.userId);
            formData.append("pseudo", this.pseudo);
            formData.append("email", this.email);
            formData.append("password", this.password);
          }

          axios
            .put(`http://localhost:3000/api/users/${this.userId}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + this.token,
              },
            })
            .then(() => {
              localStorage.setItem("pseudo", this.pseudo);
              this.confirmUpdate = true;
              this.$router.go();
            })
            .catch(() => {
              this.errorInputs = true;
            });
        }

       // Si la saisie du mot de passe n'est pas renseignée,
      } else {
        //  envoyer la requête avec d'autres entrées

        const formData = new FormData();
        // S'il y a une image téléchargée:
        if (this.image) {
          formData.append("image", this.image);
          formData.append("userId", this.userId);
          formData.append("pseudo", this.pseudo);
          formData.append("email", this.email);
          // sinon :
        } else {
          formData.append("userId", this.userId);
          formData.append("pseudo", this.pseudo);
          formData.append("email", this.email);
        }

        axios
          .put(`http://localhost:3000/api/users/${this.userId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + this.token,
            },
          })
          .then(() => {
            localStorage.setItem("pseudo", this.pseudo);
            this.confirmUpdate = true;
            this.$router.go();
          })
          .catch(() => {
            this.errorInputs = true;
            this.$router.go();
          });
      }
    },

    deleteUser() {
      axios
        .delete(`http://localhost:3000/api/users/${this.userId}`, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + this.token,
          },
        })
        .then((res) => {
          console.log(res);
          alert("Votre compte à bien été supprimé !");
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("pseudo");
          this.$router.push("/signup");
        })
        .catch((error) => console.log("cannot delete user " + error));
    },
  },
};
</script>

<style>
#imgProfile {
  border-radius: 50%;
  border: solid #ffd7d8;
  height: 120px;
  width: 120px;
}

#imageLabel {
  cursor: pointer;
  border: 1px solid lightgray;
  padding: 5px;
  border-radius: 5px;
}

#image {
  opacity: 100;
  position: absolute;
  z-index: -1;
}
.bg-groupomania {
  background-color: #d1515a;
}
.delete {
  border: 1px solid #ffd7d8;
  color: black;
}
.jumbotron {
  margin-top: 50px;
  background-color: white !important;
}
.elborde {
  -webkit-box-shadow: 1px 1px 16px 3px #5a4dff;
  box-shadow: 1px 1px 16px 3px #ebf1fb;
}
.semicua{
border-radius:20px 50px 20px 50px;
background-color:black;}
</style>
