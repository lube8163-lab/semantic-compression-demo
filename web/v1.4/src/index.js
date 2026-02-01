export default {
  async fetch(request, env) {

    /* =========================
       🔐 基本セキュリティ設定
    ========================== */

    const ALLOWED_ORIGIN = "https://your-demo-site.example"; // ←変更
    const PUBLIC_APP_KEY = "semantic-demo-v1";               // ←フロントと一致

    const corsHeaders = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-App-Key",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 🔑 簡易アプリキー検証
    if (request.headers.get("X-App-Key") !== PUBLIC_APP_KEY) {
      return new Response("Forbidden", { status: 403, headers: corsHeaders });
    }

    const url = new URL(request.url);

    try {
      /* ============================================================
         🧩 /auto SAFE MODE
      ============================================================ */
      if (url.pathname === "/auto") {

        const formData = await request.formData();
        const file = formData.get("file");

        // 🛑 ファイル検証
        if (!file) {
          return new Response(JSON.stringify({ error: "No file provided" }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        if (!file.type.startsWith("image/")) {
          return new Response(JSON.stringify({ error: "Invalid file type" }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        if (file.size > 5 * 1024 * 1024) {
          return new Response(JSON.stringify({ error: "File too large (max 5MB)" }), {
            status: 413,
            headers: corsHeaders,
          });
        }

        /* ---------- 1️⃣ Upload (ephemeral) ---------- */
        const uploadResp = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/images/v1`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.CF_IMAGES_TOKEN}`,
            },
            body: formData,
          }
        );

        if (!uploadResp.ok) {
          console.error(await uploadResp.text());
          throw new Error("Image upload failed");
        }

        const uploadData = await uploadResp.json();
        const imageUrl = uploadData.result.variants[0];
        const imageId = uploadData.result.id;

        /* ---------- 2️⃣ Caption ---------- */
        const capResp = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "user",
                  content: [
                    { type: "text", text: "この画像の内容を短く説明して" },
                    { type: "image_url", image_url: { url: imageUrl } },
                  ],
                },
              ],
            }),
          }
        );

        if (!capResp.ok) {
          console.error(await capResp.text());
          throw new Error("Caption generation failed");
        }

        const capData = await capResp.json();
        const caption =
          capData.choices?.[0]?.message?.content?.trim() ||
          "AI生成に失敗しました";

        /* ---------- 3️⃣ Regenerate image ---------- */
        const regenResp = await fetch(
          "https://api.openai.com/v1/images/generations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "dall-e-3",
              prompt: caption,
              size: "1024x1024",
            }),
          }
        );

        if (!regenResp.ok) {
          console.error(await regenResp.text());
          throw new Error("Image regeneration failed");
        }

        const regenData = await regenResp.json();
        const regenUrl = regenData.data?.[0]?.url;

        /* ---------- 4️⃣ Delete original ---------- */
        await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/images/v1/${imageId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${env.CF_IMAGES_TOKEN}`,
            },
          }
        );

        /* ---------- 5️⃣ Response ---------- */
        return new Response(
          JSON.stringify({ caption, imageUrl: regenUrl }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      /* ============================================================
         ❌ 危険な旧エンドポイントは無効化
      ============================================================ */

      /*
      if (url.pathname === "/upload") {}
      if (url.pathname === "/generate") {}
      */

      return new Response("Semantic Worker v1.4 SAFE running", {
        headers: corsHeaders,
      });

    } catch (err) {
      console.error("Worker Error:", err);
      return new Response(
        JSON.stringify({ error: "Internal error" }),
        { status: 500, headers: corsHeaders }
      );
    }
  },
};
