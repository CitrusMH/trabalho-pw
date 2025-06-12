import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

type Comment = {
  id: string;
  user_id: string;
  content: string;
  inserted_at: string;
};

export default defineEventHandler(async (event) => {
  const supa = await serverSupabaseClient<Comment>(event);
  const user = await serverSupabaseUser(event);
  const { content } = await readBody(event);

  if (!user)
    throw createError({ statusCode: 401, statusMessage: "Não autenticado" });
  if (!content || content.length > 500)
    throw createError({ statusCode: 400, statusMessage: "Conteúdo inválido" });

  const { error } = await supa.from("comments").insert([
    {
      user_id: user.id,
      content: content,
    },
  ]);

  if (error)
    throw createError({ statusCode: 400, statusMessage: error.message });
  return { ok: true };
});
