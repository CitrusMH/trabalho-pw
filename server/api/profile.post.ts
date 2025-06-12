import { z } from "zod";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

type Profile = {
  id: string;
  username: string;
};

export default defineEventHandler(async (event) => {
  const supa = await serverSupabaseClient<Profile>(event);
  const user = await serverSupabaseUser(event);
  const body = await readBody(event);
  const username = z.string().min(3).max(50).parse(body.username);

  if (!user)
    throw createError({ statusCode: 401, statusMessage: "Não autenticado" });

  // Verifica se já existe um perfil
  const { data: existingProfile } = await supa
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (existingProfile) {
    throw createError({
      statusCode: 400,
      statusMessage: "Perfil já existe",
    });
  }

  // Verifica se o username já está em uso
  const { data: existingUsername } = await supa
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (existingUsername) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nome de usuário já está em uso",
    });
  }

  const { error } = await supa
    .from("profiles")
    .insert({ id: user.id, username });

  if (error)
    throw createError({ statusCode: 400, statusMessage: error.message });

  return { ok: true };
});
