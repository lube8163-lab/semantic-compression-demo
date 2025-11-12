# convert_blip1_encoder.py
from transformers import BlipForConditionalGeneration, BlipProcessor
import torch
import torch.nn as nn
import coremltools as ct
from PIL import Image

model_id = "Salesforce/blip-image-captioning-base"
processor = BlipProcessor.from_pretrained(model_id)
blip = BlipForConditionalGeneration.from_pretrained(model_id)
blip.eval()

# Vision encoder部分だけ取り出し
vision = blip.vision_model.eval()

class BlipVisionWrapper(nn.Module):
    def __init__(self, vision_model):
        super().__init__()
        self.vision = vision_model

    def forward(self, pixel_values):
        out = self.vision(pixel_values=pixel_values)
        return out.last_hidden_state  # shape: [1, seq_len, hidden_size]

wrapped = BlipVisionWrapper(vision).eval()

# ダミー入力
image = Image.new("RGB", (384, 384), (128, 128, 128))
inputs = processor(images=image, return_tensors="pt")
dummy_pixel = inputs["pixel_values"]

# TorchScriptに変換
traced = torch.jit.trace(wrapped, (dummy_pixel,))

# CoreML変換
mlmodel = ct.convert(
    traced,
    convert_to="mlprogram",
    inputs=[
        ct.ImageType(
            name="pixel_values",
            shape=dummy_pixel.shape,
            scale=1/255.0,
            bias=[0, 0, 0],
        )
    ],
    compute_precision=ct.precision.FLOAT32,  # 🔹 BLIPはfloat16だと破綻しやすい
    minimum_deployment_target=ct.target.iOS17,
)

mlmodel.save("BLIP1_vision_encoder.mlpackage")  # 🔹 mlmodelとして保存
print("✅ saved BLIP1_vision_encoder.mlpackage")
