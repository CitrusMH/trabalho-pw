
<template>
  <div class="main-page">
    <div v-if="!user" class="login-section">
      <AuthForm />
    </div>

    <div v-else class="comments-section">
      <div class="comment-form">
        <h2>Novo Comentário</h2>
        <div v-if="!profile" class="profile-warning">
          Você precisa criar um perfil antes de comentar.
          <div class="profile-form">
            <input
              v-model="username"
              placeholder="Digite seu nome de usuário"
              class="username-input"
            />
            <button @click="createProfile" class="create-profile-button">
              Criar Perfil
            </button>
          </div>
        </div>
        <div v-else>
          <textarea
            v-model="newComment"
            placeholder="Escreva seu comentário aqui..."
            class="comment-textarea"
          ></textarea>
          <button
            @click="postComment"
            class="submit-button"
            :disabled="!newComment.trim()"
          >
            Enviar Comentário
          </button>
        </div>
      </div>


      <div class="comments-list">
        <h2>Comentários Recentes</h2>
        <div v-if="comments.length === 0" class="no-comments">
          Nenhum comentário ainda. Seja o primeiro a comentar!
        </div>
        <div
          v-else
          class="comment-item"
          v-for="comment in comments"
          :key="comment.id"
        >
          <div class="comment-header">
            <strong>{{ comment.profiles?.username || "Usuário" }}</strong>
            <span class="comment-date">{{
              formatDate(comment.inserted_at)
            }}</span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supa = useSupabaseClient();
const user = useSupabaseUser();
const comments = ref<any[]>([]);
const newComment = ref("");
const profile = ref<{ username: string } | null>(null);
const username = ref("");

const showToast = inject("showToast") as (
  msg: string,
  type?: "success" | "error" | "info"
) => void;

// Observa as mudanças no objeto user (autenticação)
watch(
  user,
  async (newUser) => {
    if (newUser) {
      // Se houver um usuário logado, verifica perfil e busca comentários
      await checkProfile();
      await fetchComments();
    } else {
      // Se o usuário deslogou, limpa o perfil e os comentários
      profile.value = null;
      comments.value = [];
    }
  },
  { immediate: true }
); // O 'immediate: true' garante que a função execute na montagem inicial também

async function checkProfile() {
  if (!user.value) return;

  const { data, error } = await supa
    .from("profiles")
    .select("username")
    .eq("id", user.value.id)
    .single();

  if (error) {
    console.error("Erro ao buscar perfil:", error);
    profile.value = null;
    showToast("Erro ao buscar perfil.", "error");
  } else {
    profile.value = data;
  }
}

async function createProfile() {
  if (!username.value.trim()) {
    showToast("Por favor, insira um nome de usuário.", "info");
    return;
  }

  try {
    await $fetch("/api/profile", {
      method: "POST",
      body: { username: username.value },
    });
    await checkProfile();
    username.value = "";
    showToast("Perfil criado com sucesso!", "success");
  } catch (error: any) {
    showToast(error.message || "Erro ao criar perfil.", "error");
  }
}

async function fetchComments() {
  try {
    comments.value = await $fetch("/api/comments");
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    showToast("Erro ao carregar comentários.", "error");
  }
}

async function postComment() {
  if (!newComment.value.trim()) return;

  try {
    await $fetch("/api/comments", {
      method: "POST",
      body: { content: newComment.value },
    });
    newComment.value = "";
    await fetchComments();
    showToast("Comentário enviado com sucesso!", "success");
  } catch (error: any) {
    console.error("Erro ao enviar comentário:", error);
    showToast(
      error.message || "Erro ao enviar comentário. Tente novamente.",
      "error"
    );
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<style scoped>
.main-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.login-section {
  text-align: center;
  padding: 2rem;
  background-color: #00000040;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  color: #e0e0e0;
  border: 1px solid #444444;
}

.comments-section {
  width: 100%;
}

h1 {
  color: #f0f0f0;
  margin-bottom: 30px;
}

h2 {
  color: #e0e0e0;
  margin: 16px 0;
}

.comment-form {
  background-color: #00000040;
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #444444;
}

.profile-warning {
  background-color: #3a3a3a;
  color: #ffda6a;
  padding: 15px;
  border-radius: 20px;
  margin-bottom: 15px;
  text-align: center;
  border: 1px solid #444444;
}

.profile-form {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.username-input {
  padding: 8px;
  border: 1px solid #444444;
  border-radius: 20px;
  width: 200px;
  background-color: #1f1f1f;
  color: #e0e0e0;
}

.username-input::placeholder {
  color: #999999;
}

.comment-textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #444444;
  border-radius: 16px;
  resize: vertical;
  background-color: #1f1f1f;
  color: #e0e0e0;
}

.comment-textarea::placeholder {
  color: #999999;
}

.submit-button {
  background-color: #61afef;
  color: white;
  padding: 10px 20px;
  border: 1px solid #444444;
  border-radius: 12px;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: #2f2f2f;
  cursor: not-allowed;
}

.submit-button:hover {
  background-color: #348fe8;
}

.create-profile-button {
  background-color: #61afef;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
}

.create-profile-button:hover {
  background-color: #348fe8;
}

.comments-list {
  margin-top: 20px;
}

.comment-item {
  background-color: #00000040;
  backdrop-filter: blur(10px);
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  color: #e0e0e0;
  border: 1px solid #444444;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.comment-date {
  color: #aaaaaa;
  font-size: 0.9em;
}

.comment-content {
  margin: 0;
  line-height: 1.5;
}

.no-comments {
  text-align: center;
  color: #aaaaaa;
  padding: 20px;
  background-color: #00000040;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid #444444;
}
</style>
