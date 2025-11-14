import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

const trendingTopics = [
  "OpenAI's new o1 reasoning models and their impact on complex problem-solving",
  "Anthropic's Claude 3.5 Sonnet and the evolution of AI assistants",
  "Google's Gemini 2.0 and multimodal AI capabilities",
  "AI agents and autonomous task completion",
  "Fine-tuning LLMs for enterprise use cases",
  "AI in software development: GitHub Copilot and cursor.ai",
  "Retrieval Augmented Generation (RAG) for accurate AI responses",
  "AI safety and alignment challenges",
  "The rise of open-source AI models (Llama 3, Mistral)",
  "AI-powered productivity tools transforming workflows",
  "Prompt engineering best practices and techniques",
  "AI in customer service and chatbots",
  "Generative AI for content creation and marketing",
  "AI model efficiency and cost optimization",
  "Vector databases and semantic search",
  "AI ethics and responsible AI development",
  "Multi-agent systems and AI collaboration",
  "AI in healthcare diagnostics and drug discovery",
  "Edge AI and on-device machine learning",
  "The future of work with AI augmentation",
];

export async function POST() {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-build') {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY in environment variables.' },
        { status: 500 }
      );
    }

    // Select a random trending topic
    const topic = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];

    // Generate the LinkedIn post
    const postCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert LinkedIn content strategist specializing in AI trends.
Create engaging, professional LinkedIn posts that:
- Start with a compelling hook that stops the scroll
- Include relevant insights and practical takeaways
- Use short paragraphs for readability
- End with a thought-provoking question or call-to-action
- Use emojis sparingly but effectively (1-3 max)
- Are 150-250 words
- Sound authentic and conversational, not overly formal
- Include relevant hashtags at the end (3-5)

Focus on value, insights, and engagement rather than hype.`,
        },
        {
          role: "user",
          content: `Create an engaging LinkedIn post about: ${topic}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const post = postCompletion.choices[0].message.content;

    // Generate the image prompt
    const imagePromptCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Create a concise DALL-E prompt for a professional, modern, minimalist image that would accompany a LinkedIn post. The image should be visually striking, tech-focused, and suitable for professional social media. Limit to 2-3 sentences.",
        },
        {
          role: "user",
          content: `Create an image prompt for a LinkedIn post about: ${topic}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const imagePrompt = imagePromptCompletion.choices[0].message.content;

    // Generate the image
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional LinkedIn post image: ${imagePrompt}. Modern, minimalist, tech-focused, high-quality, suitable for business social media.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = imageResponse.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error('Failed to generate image');
    }

    return NextResponse.json({
      post,
      imageUrl,
      topic,
    });
  } catch (error) {
    console.error('Error generating content:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
