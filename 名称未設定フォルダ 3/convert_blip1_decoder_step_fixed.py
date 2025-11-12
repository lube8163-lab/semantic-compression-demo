# convert_blip1_decoder_step_fixed.py
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch
import torch.nn as nn
import coremltools as ct

model_id = "Salesforce/blip-image-captioning-base"
processor = BlipProcessor.from_pretrained(model_id)
model = BlipForConditionalGeneration.from_pretrained(model_id)
model.eval()

# decoder 全体を使う！（transformerだけではなく）
decoder = model.text_decoder
decoder.eval()

class BlipDecoderWrapper(nn.Module):
    def __init__(self, decoder):
        super().__init__()
        self.decoder = decoder

    def forward(self, input_ids, encoder_hidden_states):
        # decoder.forward() は logits を返す
        out = self.decoder(
            input_ids=input_ids,
            encoder_hidden_states=encoder_hidden_states
        )
        return out.logits  # ← これが vocab_size=49408 になる！

wrapped = BlipDecoderWrapper(decoder).eval()

dummy_input_ids = torch.zeros((1, 5), dtype=torch.long)
dummy_encoder_states = torch.zeros((1, 577, 768), dtype=torch.float32)

traced = torch.jit.trace(wrapped, (dummy_input_ids, dummy_encoder_states))

mlmodel = ct.convert(
    traced,
    convert_to="mlprogram",
    inputs=[
        ct.TensorType(name="input_ids", shape=(1, 5)),
        ct.TensorType(name="encoder_hidden_states", shape=(1, 577, 768))
    ],
    minimum_deployment_target=ct.target.iOS17,
)

mlmodel.save("BLIP1_decoder_step_fixed.mlpackage")
print("✅ Saved BLIP1_decoder_step_fixed.mlpackage (vocab=49408)")
