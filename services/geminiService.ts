import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const GeminiService = {
  generateBlogIdeas: async (topic: string): Promise<string> => {
    const client = getClient();
    if (!client) return "AI service unavailable. Please check API Key.";

    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate 3 catchy blog post titles and short descriptions for the topic: "${topic}". Return them as a simple numbered list.`,
      });
      return response.text || "No ideas generated.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Failed to generate ideas. Please try again.";
    }
  },

  enhanceContent: async (content: string): Promise<string> => {
    const client = getClient();
    if (!client) return content;

    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Improve the following blog content for readability, engagement, and SEO. Keep the tone professional yet accessible. \n\nContent:\n${content}`,
      });
      return response.text || content;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return content;
    }
  },

  generateImagePrompt: async (title: string): Promise<string> => {
      const client = getClient();
      if (!client) return "A beautiful abstract background image";
      
      try {
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Describe a visually striking, abstract, and modern image that would serve as a perfect cover for a blog post titled: "${title}". Keep the description under 30 words.`
        });
        return response.text || "A modern abstract digital art background";
      } catch (error) {
          return "A modern abstract digital art background";
      }
  }
};