from diffusers import StableDiffusionPipeline
from PIL import Image

# === 1️⃣ CoreMLモデルのディレクトリを指定 ===
compiled_dir = "./compiled"

# === 2️⃣ CoreMLモデルを使ってパイプラインを構築 ===
pipe = StableDiffusionPipeline.from_pretrained(
    compiled_dir,
    provider="coreml"
)

# === 3️⃣ 入力プロンプト（BLIP出力例） ===
prompt = "A group walking near a snow and car over a forest near a mountain with man."

# === 4️⃣ 画像生成 ===
image = pipe(prompt, num_inference_steps=25, guidance_scale=7.5).images[0]

# === 5️⃣ 出力保存 ===
image.save("out.png")
print("✅ 画像生成完了 → out.png に保存されました！")
