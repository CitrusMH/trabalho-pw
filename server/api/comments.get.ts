// server/api/comments.get.ts
import { serverSupabaseClient } from "#supabase/server";

type Comment = {
  id: string;
  content: string;
  inserted_at: string;
  profiles: {
    username: string;
  };
};

export default defineEventHandler(async (event) => {
  try {
    const supa = await serverSupabaseClient<Comment>(event);

    // Primeiro, verifica se a tabela comments existe
    const { data: tableExists, error: tableError } = await supa
      .from("comments")
      .select("id")
      .limit(1);

    if (tableError) {
      console.error("Erro ao verificar tabela comments:", tableError);
      throw createError({
        statusCode: 500,
        statusMessage: "Erro ao acessar a tabela de comentários",
      });
    }

    // Busca os comentários com a relação correta de perfis
    const { data, error } = await supa
      .from("comments")
      .select(
        `
        id,
        content,
        inserted_at,
        profiles: user_id (
          username
        )
      `
      )
      .order("inserted_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar comentários:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Erro ao buscar comentários",
      });
    }

    // Se não houver comentários, retorna array vazio
    if (!data) {
      return [];
    }

    return data;
  } catch (error: any) {
    console.error("Erro na API de comentários:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Erro interno do servidor",
    });
  }
});
