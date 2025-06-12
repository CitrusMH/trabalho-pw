<template>
  <div class="app-container" @mousemove="updateMousePosition">
    <nav v-if="user" class="navbar">
      <div class="nav-content">
        <span class="welcome-text">
          Bem-vindo, {{ profile?.username || "Usuário" }}.
        </span>
        <button @click="handleLogout" class="logout-button">Sair</button>
      </div>
    </nav>

    <main class="main-content">
      <NuxtPage />
    </main>
    <Toast v-bind="toast" />

    <!-- Efeito de brilho que segue o mouse -->
    <div class="mouse-glow" :style="glowStyle"></div>
  </div>
</template>

<script setup lang="ts">
import Toast from "~/components/Toast.vue";

const user = useSupabaseUser();
const router = useRouter();
const client = useSupabaseClient();
const profile = ref<{ username: string } | null>(null);

const toast = ref({
  message: "",
  type: "info" as "success" | "error" | "info",
  visible: false,
});

function showToast(
  message: string,
  type: "success" | "error" | "info" = "info"
) {
  toast.value = { message, type, visible: true };
  setTimeout(() => {
    toast.value.visible = false;
  }, 3000);
}
provide("showToast", showToast);

// Busca o perfil do usuário quando ele estiver logado
watch(
  user,
  async (newUser) => {
    if (newUser) {
      const { data } = await client
        .from("profiles")
        .select("username")
        .eq("id", newUser.id)
        .single();
      profile.value = data;
    } else {
      profile.value = null;
    }
  },
  { immediate: true }
);

async function handleLogout() {
  const { error } = await client.auth.signOut();
  const showToast = inject("showToast") as (
    msg: string,
    type?: "success" | "error" | "info"
  ) => void;
  if (error) {
    showToast("Erro ao fazer logout", "error");
  } else {
    showToast("Sessão encerrada com sucesso!", "success");
    router.push("/");
  }
}

// Lógica para o efeito de brilho do mouse
const mouseX = ref(0);
const mouseY = ref(0);

function updateMousePosition(event: MouseEvent) {
  mouseX.value = event.clientX;
  mouseY.value = event.clientY;
}

const glowStyle = computed(() => ({
  "--mouse-x": `${mouseX.value}px`,
  "--mouse-y": `${mouseY.value}px`,
}));
</script>

<style>
html {
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: #1a1a1a;
  color: #e0e0e0;
}

#__nuxt {
}

.app-container {
  position: relative;
}

.navbar {
  background-color: #00000040;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #444444;
  padding: 1rem;
  color: #ffffff;
}

.nav-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text {
  font-weight: bold;
  color: #ffffff;
}

.logout-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #c82333;
}

.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

* {
  box-sizing: border-box;
}

/* Estilos para o efeito de brilho do mouse */
.mouse-glow {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at var(--mouse-x) var(--mouse-y),
    rgba(0, 157, 255, 0.1) 0%,
    transparent 60%
  );
  filter: blur(80px);
  opacity: 0.7;
  transition: background 0.1s ease-out;
  z-index: -1;
}
</style>
