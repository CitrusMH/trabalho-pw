<template>
  <div class="main-page">
    <div v-if="!user" class="login-section">
      <AuthForm />
    </div>

    <div v-else class="comments-section">
      <div class="comment-form">
        <h2>Novo Comentário</h2>
        <div v-if="!profile" class="profile-warning">
          Você precisa criar um pnome de usuário antes de comentar.
          <div class="profile-form">
            <input
              v-model="username"
              placeholder="Digite seu nome de usuário"
              class="username-input"
              @keyup.enter="createProfile"
            />
            <button @click="createProfile" class="create-profile-button">
              Criar Nome de Usuário
            </button>
          </div>
        </div>
        <div v-else>
          <textarea
            v-model="newComment"
            placeholder="Escreva seu comentário aqui..."
            class="comment-textarea"
            @keyup.enter.ctrl="postComment"
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
          class="comment"
          v-for="comment in comments"
          :key="comment.id"
          :class="{ 'my-comment': comment.user_id === user?.id }"
        >
          <div
            class="comment-header"
            :class="{ 'my-comment-header': comment.user_id === user?.id }"
          >
            <template v-if="comment.user_id === user?.id">
              <span class="comment-date">{{
                formatDate(comment.inserted_at)
              }}</span>
              <strong>{{ comment.profiles?.username || "Usuário" }}</strong>
            </template>
            <template v-else>
              <strong>{{ comment.profiles?.username || "Usuário" }}</strong>
              <span class="comment-date">{{
                formatDate(comment.inserted_at)
              }}</span>
            </template>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
      </div>

      <!-- Controles de Paginação -->
      <div class="pagination-controls" v-if="totalPages > 1">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-button"
        >
          Anterior
        </button>
        <span class="page-info"
          >Página {{ currentPage }} de {{ totalPages }}</span
        >
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="pagination-button"
        >
          Próxima
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supa = useSupabaseClient();
const user = useSupabaseUser();

interface Comment {
  id: string;
  content: string;
  inserted_at: string;
  user_id: string;
  profiles: {
    username: string;
  };
}

interface Profile {
  id: string;
  username: string;
}

const comments = ref<Comment[]>([]);
const newComment = ref("");
const profile = ref<Profile | null>(null);
const username = ref("");
const currentPage = ref(1);
const commentsPerPage = 6;
const totalPages = ref(1);

const showToast = inject("showToast") as (
  msg: string,
  type?: "success" | "error" | "info"
) => void;

const fetchProfile = async () => {
  if (!user.value) return;

  try {
    const { data, error } = await supa
      .from("profiles")
      .select("username")
      .eq("id", user.value.id)
      .single();

    if (error) throw error;
    profile.value = data;
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    showToast("Erro ao carregar perfil.", "error");
  }
};

const fetchComments = async () => {
  try {
    const { data, error, count } = await supa
      .from("comments")
      .select(
        `
        *,
        profiles:user_id (
          username
        )
      `,
        { count: "exact" }
      )
      .order("inserted_at", { ascending: false })
      .range(
        (currentPage.value - 1) * commentsPerPage,
        currentPage.value * commentsPerPage - 1
      );

    if (error) throw error;

    comments.value = data || [];
    if (count) {
      totalPages.value = Math.ceil(count / commentsPerPage);
    }
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    showToast("Erro ao carregar comentários.", "error");
  }
};

const createProfile = async () => {
  if (!user.value) return;

  try {
    const { error } = await supa.from("profiles").insert({
      id: user.value.id,
      username: username.value,
    });

    if (error) throw error;

    await fetchProfile();
    showToast("Perfil criado com sucesso!", "success");
  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    showToast("Erro ao criar perfil.", "error");
  }
};

const postComment = async () => {
  if (!user.value || !profile.value) return;

  try {
    const { error } = await supa.from("comments").insert({
      content: newComment.value,
      user_id: user.value.id,
    });

    if (error) throw error;

    newComment.value = "";
    await fetchComments();
    showToast("Comentário postado com sucesso!", "success");
  } catch (error) {
    console.error("Erro ao postar comentário:", error);
    showToast("Erro ao postar comentário.", "error");
  }
};

// Observar mudanças no usuário
watch(
  () => user.value,
  async (newUser) => {
    if (newUser) {
      currentPage.value = 1;
      await fetchProfile();
      await fetchComments();
    } else {
      profile.value = null;
      comments.value = [];
    }
  },
  { immediate: true }
);

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Função para mudar de página
const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    fetchComments();
  }
};
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
  color: #ffda6a;
  padding: 15px;
  border-radius: 20px;
  margin-bottom: 15px;
  text-align: center;
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

.comment {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.my-comment {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  flex-direction: row-reverse;
}

.comment-header {
  flex-direction: row;
}

.comment-date {
  color: #888;
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

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.pagination-button {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: white;
  font-size: 0.9rem;
}
</style>
