<template>
  <div>
    <h2 v-if="!isLogin">Cadastro</h2>
    <h2 v-else>Login</h2>
    <input v-model="email" placeholder="email" @keyup.enter="submit" />
    <input
      v-model="password"
      type="password"
      placeholder="senha"
      @keyup.enter="submit"
    />
    <button @click="submit">
      {{ isLogin ? "Entrar" : "Cadastrar" }}
    </button>
    <p @click="isLogin = !isLogin" style="cursor: pointer">
      {{ isLogin ? "Criar conta" : "Já tenho conta" }}
    </p>
  </div>
</template>

<script setup lang="ts">
// import Toast from "~/components/Toast.vue"; // Não precisa mais importar aqui
const supa = useSupabaseClient();
const isLogin = ref(true);
const email = ref("");
const password = ref("");

// Injeta a função showToast provida por app.vue
const showToast = inject("showToast") as (
  msg: string,
  type?: "success" | "error" | "info"
) => void;

async function submit() {
  if (isLogin.value) {
    const { error } = await supa.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) {
      showToast(error.message, "error"); // Substitui alert()
    } else {
      showToast("Login realizado com sucesso!", "success"); // Adiciona toast de sucesso
    }
  } else {
    const { error } = await supa.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (error) {
      showToast(error.message, "error"); // Substitui alert()
    } else {
      showToast("Verifique seu e-mail para confirmar o cadastro.", "info"); // Substitui alert()
    }
  }
}
</script>

<style scoped>
div {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
  margin: 20px auto;
}

h2 {
  color: #f0f0f0; /* Texto claro para títulos */
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8em;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #444444;
  border-radius: 24px;
  font-size: 1em;
  transition: border-color 0.2s;
  background-color: #3a3a3a; /* Fundo escuro para inputs */
  color: #e0e0e0; /* Texto claro para inputs */
}

input:focus {
  border-color: #007bff; /* Borda azul ao focar */
  outline: none;
}

button {
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 24px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

button:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

p {
  text-align: center;
  font-size: 0.95em;
  color: #aaaaaa; /* Texto um pouco mais claro para parágrafos */
  margin-top: 10px;
}

p span {
  color: #61afef; /* Azul mais claro para links */
  cursor: pointer;
  text-decoration: underline;
}

p span:hover {
  color: #348fe8;
}
</style>
