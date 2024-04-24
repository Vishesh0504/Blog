import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_supabase_url;
const supabaseKey = import.meta.env.VITE_supabase_public;

export const retrievePublicURL = async (fullPath: string) => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data } = await supabase.storage
    .from("PostCoverImages")
    .getPublicUrl(fullPath);
  return data.publicUrl;
};
export const handleSupabase = async (file: File, postId: string) => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const id = postId;
  const extension = file.type.split("/")[1];

  try {
    const { data, error } = await supabase.storage
      .from("PostCoverImages")
      .upload(`${id}.${extension}`, file, { upsert: true });

    if (error) {
      throw error;
    } else {
      return retrievePublicURL(data.path);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error("We are facing some error,Please try again");
    }
  }
};
