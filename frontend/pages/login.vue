<template>
  <div class="flex flex-row justify-center content-center bg-gray-100">
    <div
      class="rounded-md shadow-lg p-8 bg-gray-800 text-white my-auto lg:w-1/2 md:w-2/3 w-full md:mx-4 mx-2 shadow shadow-2xl"
    >
      <img
        src="~/assets/images/logo-1024.png"
        alt="App logo"
        class="w-56 px-10 mx-auto"
      />
      <h1 class="font-bold text-3xl mb-2 uppercase text-center leading-none">
        {{ $t('pages.login.title') }}
      </h1>

      <form ref="form" @submit.prevent="login">
        <t-alert v-if="errorMsg" :message="$t(errorMsg)" type="error"></t-alert>

        <t-input
          id="username"
          v-model="form.username"
          class="w-full sm:px-10 mb-6"
          :label="$t('pages.login.username')"
          icon="user"
          :error="errors.username ? $t(errors.username) : ''"
        />

        <t-input
          id="password"
          v-model="form.password"
          class="w-full sm:px-10 mb-6"
          :label="$t('pages.login.password')"
          icon="lock"
          type="password"
          :error="errors.password ? $t(errors.password) : ''"
        />

        <div class="w-full text-center">
          <t-button
            type="submit"
            icon="sign-in-alt"
            class="md:w-1/3 w-full"
            color="white"
          >
            {{ $t('pages.login.btn') }}
          </t-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import TAlert from '~/components/bases/TAlert.vue'
import TInput from '~/components/forms/TInput.vue'
import TButton from '~/components/forms/TButton.vue'

@Component({
  components: {
    TAlert,
    TInput,
    TButton,
  },
})
export default class Login extends Vue {
  layout() {
    return 'empty'
  }

  errorMsg: string = ''

  form = {
    username: '',
    password: '',
  }

  errors: Partial<String> = {}

  login() {
    this.errorMsg = ''
    this.errors = {}
    this.$auth
      .login({ data: this.form })
      .then(() => {
        this.$i18n.setLocale(this.$auth.user.language)
      })
      .catch((error: any) => {
        if (error.response?.status) {
          const parsedErrors: Partial<String> = {}
          switch (error.response.status) {
            case 400:
              this.errorMsg = 'error.login.wrong_ids'
              break
            case 422:
              for (const e of error.response.data.errors) {
                parsedErrors[e.field] = `error.form.${e.rule}`
              }
              this.errors = parsedErrors
              break
            default:
              this.errorMsg = 'error.unknown'
          }
        }
      })
  }
}
</script>