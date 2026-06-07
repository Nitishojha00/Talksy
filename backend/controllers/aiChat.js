const { GoogleGenAI } = require("@google/genai");
const AIMessage = require("../models/AIMessage");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

module.exports.chat = async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({
            success: false,
            message: "Message is required",
        });
    }

    const userId = req.user._id;

    // Save user message first
    await AIMessage.create({
        userId,
        role: "user",
        content: message,
    });

    // Fetch latest 20 messages
    const history = await AIMessage.find({
        userId,
    })
        .sort({ createdAt: -1 })
        .limit(20);

    history.reverse();

    // Convert to Gemini format
    const contents = history.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [
            {
                text: msg.content,
            },
        ],
    }));

    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",

    config: {
        systemInstruction: `
        You are Talksy AI.

        Rules:
        - Answer in a clear, concise, and direct manner.
        - Keep responses short by default.
        - Avoid unnecessary explanations and filler text.
        - Use bullet points when listing items.
        - For coding questions, provide optimized code first, then a brief explanation.
        - If the user asks for details, provide a detailed answer.
        - Be friendly and professional.
        - Format answers neatly.
        `,
            },

            contents,
        });

    const reply = response.text;

    // Save AI reply
    await AIMessage.create({
        userId,
        role: "assistant",
        content: reply,
    });

    return res.status(200).json({
        success: true,
        reply,
    });
};

module.exports.getHistory = async (req, res) => {
    const userId = req.user._id;

    const messages = await AIMessage.find({
        userId,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
        success: true,
        messages,
    });
};