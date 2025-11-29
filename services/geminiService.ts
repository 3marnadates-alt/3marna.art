import { GoogleGenAI, Type } from "@google/genai";
import { RecipeRequest, RecipeResponse } from "../types";

// Use process.env.API_KEY as requested for secure deployment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Recipe Generator
export const generateDateRecipe = async (request: RecipeRequest): Promise<RecipeResponse> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Create a creative dessert or snack recipe using "${request.dateType}" dates.
    The difficulty level should be "${request.difficulty}".
    The output must be in Arabic.
    Be creative and highlight the flavor profile of this specific date.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are a professional gourmet chef specializing in Middle Eastern sweets and dates. You speak fluent, appetizing Arabic.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The name of the recipe in Arabic" },
            description: { type: Type.STRING, description: "A short, appetizing description in Arabic" },
            ingredients: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of ingredients with quantities in Arabic"
            },
            instructions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Step by step instructions in Arabic"
            },
            prepTime: { type: Type.STRING, description: "Preparation time in Arabic (e.g., 15 دقيقة)" }
          },
          required: ["title", "description", "ingredients", "instructions", "prepTime"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as RecipeResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("فشل في توليد الوصفة. يرجى المحاولة مرة أخرى.");
  }
};

// Chat Bot Service
export const chatWithTamrHenna = async (userMessage: string, contextData: any, chatHistory: {role: string, parts: {text: string}[]}[]): Promise<string> => {
  const model = "gemini-2.5-flash";

  // Prepare system instruction with dynamic store data
  const systemInstruction = `
    أنتِ "تمر حنه"، المساعدة الذكية الودودة لموقع "تمور العمارنة".
    
    معلومات عن الشركة:
    - الاسم: تمور العمارنة.
    - الشعار: "تمرة تستاهل تدخل دارك".
    - الوصف: شركة متخصصة في بيع أجود أنواع التمور العربية الفاخرة (محاصيل القصيم والمدينة).
    - العنوان: المقطم - الهضبة الوسطى - القاهرة.
    - الهاتف/واتساب: 01001933502 (يمكنك اقتراح التواصل عبر واتساب للطلبات الخاصة).
    
    بيانات المنتجات والأسعار الحالية (بالجنيه المصري):
    ${JSON.stringify(contextData.products)}
    
    أسعار التوصيل الحالية:
    ${JSON.stringify(contextData.deliveryRates)}
    
    سياسة الخصم الحالية:
    ${JSON.stringify(contextData.discountInfo)}
    
    قواعد الرد:
    1. تحدثي باللهجة المصرية الودودة والمحترمة (أو العربية الفصحى البسيطة).
    2. وظيفتك مساعدة الزوار في اختيار التمور، معرفة الأسعار، وتفاصيل التوصيل.
    3. إذا سأل العميل عن كيفية الطلب، أخبريه أن يضيف المنتجات للسلة ويملأ بياناته.
    4. كوني مختصرة ومفيدة.
    5. استخدمي الإيموجيز المناسبة (🌴، ✨، ❤️) لإضفاء جو لطيف.
    6. اعتمدي فقط على البيانات المزودة لكِ أعلاه.
  `;

  try {
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      },
      history: chatHistory
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text;

  } catch (error) {
    console.error("Chat Error:", error);
    return "أعتذر، حدثت مشكلة تقنية بسيطة. ممكن تحاول مرة تانية؟ 🌴";
  }
};