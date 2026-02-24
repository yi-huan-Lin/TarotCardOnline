import { useState } from 'react';

const useGeminiStreaming = () => {
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const streamInterpretation = async (prompt) => {
    setOutput("");
    setError(null);
    setIsGenerating(true);

    try {
      // 1. 檢查瀏覽器支援度
      if (!window.ai || !window.ai.assistant) {
        throw new Error("您的瀏覽器尚未支援或開啟 Gemini Nano 內建功能");
      }

      // 2. 建立 Assistant 實例
      const assistant = await window.ai.assistant.create();

      // 3. 呼叫流式輸出 API
      const stream = assistant.promptStreaming(prompt);

      // 4. 讀取流式資料
      for await (const chunk of stream) {
        setOutput(chunk); // Gemini Nano 的 chunk 通常是累積性的完整字串
      }
    } catch (err) {
      setError(err.message);
      console.error("AI Streaming Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return { output, isGenerating, error, streamInterpretation };
};

export {useGeminiStreaming};