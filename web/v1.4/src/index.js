export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    try {
      // ============================================================
      // 🧩 ① /auto → Upload → Caption → Regenerate → Delete original
      // ============================================================
      if (url.pathname === "/auto") {
        const formData = await request.formData();
        const file = formData.get("file");
        if (!file) {
          return new Response(JSON.stringify({ error: "No file provided" }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        // 1️⃣ Upload to Cloudflare Images
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
        const uploadData = await uploadResp.json();
        if (!uploadData.success) {
          console.error("❌ Upload failed:", uploadData.errors);
          return new Response(
            JSON.stringify({ error: "Upload failed", details: uploadData.errors }),
            { status: 500, headers: corsHeaders }
          );
        }

        const imageUrl = uploadData.result.variants[0];
        const imageId = uploadData.result.id;
        console.log("✅ Uploaded:", imageUrl);

        // 2️⃣ Generate caption
        const capResp = await fetch("https://api.openai.com/v1/chat/completions", {
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
        });

        const capData = await capResp.json();
        const caption = capData.choices?.[0]?.message?.content?.trim() || "AI生成失敗…";
        console.log(`🧠 Caption: ${caption.slice(0, 50)}...`);

        // 3️⃣ Regenerate image
        const regenResp = await fetch("https://api.openai.com/v1/images/generations", {
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
        });

        const regenData = await regenResp.json();
        const regenUrl = regenData.data?.[0]?.url;
        if (!regenUrl) {
          console.error("❌ Regeneration failed:", regenData.error?.message || regenData);
          return new Response(
            JSON.stringify({ error: "Regeneration failed", details: regenData.error }),
            { status: 500, headers: corsHeaders }
          );
        }

        console.log(`🎨 Regenerated image: ${regenUrl}`);

        // 4️⃣ Delete original image (ephemeral storage)
        await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/images/v1/${imageId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${env.CF_IMAGES_TOKEN}` },
          }
        );
        console.log(`🗑️ Deleted source image: ${imageId}`);

        // 5️⃣ Return final response
        return new Response(
          JSON.stringify({ caption, imageUrl: regenUrl }),
          { headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // ============================================================
      // 🖼️ 既存の /upload・/generate・default ハンドラも維持
      // ============================================================

      if (url.pathname === "/upload") {
        const formData = await request.formData();
        const file = formData.get("file");
        if (!file) {
          return new Response(JSON.stringify({ error: "No file provided" }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        const uploadResp = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/images/v1`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${env.CF_IMAGES_TOKEN}` },
            body: formData,
          }
        );

        const result = await uploadResp.json();
        const imageUrl = result.result.variants[0];
        return new Response(JSON.stringify({ imageUrl }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      if (url.pathname === "/generate") {
        const input = await request.json();
        const caption = input.caption || "an abstract visual representation";

        const genResp = await fetch("https://api.openai.com/v1/images/generations", {
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
        });

        const data = await genResp.json();
        if (!data.data?.[0]?.url) {
          console.error("❌ Generation failed:", data.error?.message || "Unknown error");
          return new Response(
            JSON.stringify({ error: "Generation failed", details: data.error }),
            { status: 500, headers: corsHeaders }
          );
        }

        const imageUrl = data.data[0].url;
        console.log(`🎨 Image generated OK for caption: ${caption.slice(0, 30)}...`);

        return new Response(JSON.stringify({ imageUrl }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // default
      return new Response("Semantic Worker v1.4 running!", {
        headers: corsHeaders,
      });
    } catch (err) {
      console.error("Worker Error:", err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};
