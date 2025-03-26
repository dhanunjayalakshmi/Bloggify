const supabase = require("../config/supabaseClient");
const path = require("path");
const crypto = require("crypto");

const uploadImage = async (file) => {
  try {
    if (!file) throw new Error("File not found");

    const fileExt = path.extname(file?.originalname);
    const fileName = crypto.randomUUID() + fileExt;

    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("Upload Error:", error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    return { "Image upload failed: ": error?.message };
  }
};

module.exports = { uploadImage };
