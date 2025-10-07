const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const originalFetch = global.fetch;
global.fetch = async (...args) => {
  console.log("FETCH:", args[0]);
  try {
    return await originalFetch(...args);
  } catch (err) {
    console.error(`FETCH ERROR on ${args[0]}:`, err);
    throw err;
  }
};

module.exports = supabase;
