import { HfInference } from "@huggingface/inference";

const HF_TOKEN = "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";
export const inference = new HfInference(process.env.HUGGINGFACE_API_TOKEN || HF_TOKEN);