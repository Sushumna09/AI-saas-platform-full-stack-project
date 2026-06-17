import OpenAI from "openai";
import sql from "../configs/db.js";
import { createClerkClient } from "@clerk/backend";
import axios from "axios";
import FormData from "form-data";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import * as pdf from "pdf-parse";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// ===================== ARTICLE GENERATOR =====================

export const generateArticle = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const { prompt, length } = req.body;

    if (!prompt || !length) {
      return res.status(400).json({
        success: false,
        message: "Prompt and length are required",
      });
    }

    const requestedLength = parseInt(length);

    if (isNaN(requestedLength) || requestedLength <= 0) {
      return res.status(400).json({
        success: false,
        message: "Length must be a valid number",
      });
    }

    const plan = req.plan;
    const free_usage = req.free_usage || 0;

    if (plan !== "premium" && free_usage >= 10) {
      return res.status(403).json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    let maxTokens;

    if (requestedLength <= 800) {
      maxTokens = 800;
    } else if (requestedLength <= 1200) {
      maxTokens = 1500;
    } else {
      maxTokens = 2000;
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: `
Write a detailed, well-structured article.

Topic: ${prompt}

Requirements:
- Approximately ${requestedLength} words
- Include an engaging introduction
- Include multiple headings and subheadings
- Include examples where appropriate
- Include a conclusion
- Return the article in markdown format
          `,
        },
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    const content =
      response?.choices?.[0]?.message?.content ||
      "No content generated.";

    await sql`
      INSERT INTO creations
      (user_id, prompt, content, type)
      VALUES
      (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    return res.status(200).json({
      success: true,
      content,
    });

  } catch (error) {
    console.error("Generate Article Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// ===================== BLOG TITLE GENERATOR =====================

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const plan = req.plan;
    const free_usage = req.free_usage || 0;

    if (plan !== "premium" && free_usage >= 10) {
      return res.status(403).json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "user",
          
content: `
Generate blog title ideas for:

Keyword: ${prompt}

Requirements:
- Generate 10 catchy blog titles.
- Start with a short introduction sentence.
- Group titles into categories.
- Use markdown headings.
- Use bullet points.
- Return clean markdown.

Example:

Here are a few blog title options for the keyword "React JS" categorized by audience and style.

### Beginner-Friendly
- Title 1
- Title 2

### Professional
- Title 3
- Title 4

### Creative
- Title 5
- Title 6

`,

        },
      ],
      temperature: 0.9,
      max_tokens: 1000,
    });

    const content =
      response?.choices?.[0]?.message?.content ||
      "No titles generated.";

    await sql`
      INSERT INTO creations
      (user_id, prompt, content, type)
      VALUES
      (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    return res.status(200).json({
      success: true,
      content,
    });

  } catch (error) {
    console.error("Generate Blog Title Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// ===================== IMAGE GENERATOR =====================
export const generateImage = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const { prompt, publish } = req.body;

    if (!prompt) {
      return res.json({
        success: false,
        message: "Prompt is required",
      });
    }

    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "This feature is only available for premium subscriptions",
      });
    }

    const formData = new FormData();

    formData.append("prompt", prompt);

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      response.data,
      "binary"
    ).toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(
      base64Image,
      {
        resource_type: "image",
      }
    );

    await sql`
      INSERT INTO creations
      (
        user_id,
        prompt,
        content,
        type,
        publish
      )
      VALUES
      (
        ${userId},
        ${prompt},
        ${uploadResult.secure_url},
        'image',
        ${publish ?? false}
      )
    `;

    return res.json({
      success: true,
      content: uploadResult.secure_url,
    });

  } catch (error) {
    console.error(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// ===================== BACKGROUND REMOVER =====================

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const image = req.file;

    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "This feature is only available for premium subscriptions",
      });
    }



    const uploadResult = await cloudinary.uploader.upload(image.path, {
      transformation: [{
        effect: 'background_removal',
        background_removal: 'remove_the_background'
      }]
    });

    await sql`
      INSERT INTO creations
      (
        user_id,
        prompt,
        content,
        type
      )
      VALUES
      (
        ${userId},
        'Remove background from image',
        ${uploadResult.secure_url},
        'image'
      )
    `;

    return res.json({
      success: true,
      content: uploadResult.secure_url,
    });

  } catch (error) {
    console.error(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// ===================== OBJECT REMOVER =====================

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { object } = await req.body;
    const image = req.file;

    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "This feature is only available for premium subscriptions",
      });
    }



    const { public_id } = await cloudinary.uploader.upload(image.path
    );

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: 'image'
    })

    await sql`
      INSERT INTO creations
      (
        user_id,
        prompt,
        content,
        type
      )
      VALUES
      (
        ${userId},
        ${`Removed ${object} from image`},
        ${imageUrl},
        'image'
      )
    `;

    return res.json({
      success: true,
      content: imageUrl,
    });

  } catch (error) {
    console.error(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// ===================== REVIEW RESUME =====================

export const resumeReview = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "This feature is only available for premium subscriptions",
      });
    }

    if (!resume) {
      return res.json({
        success: false,
        message: "Resume file is required",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file size exceeds allowed size (5MB).",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);

    const parser = new pdf.PDFParse({
      data: dataBuffer,
    });

    const pdfText = await parser.getText();

    const prompt = `
Review the following resume and provide detailed constructive feedback.

Analyze:
1. Overall Resume Quality
2. Strengths
3. Weaknesses
4. Technical Skills Section
5. Projects Section
6. Experience Section
7. Resume Formatting
8. ATS Compatibility Score (out of 100)
9. Suggestions for Improvement

Resume Content:

${pdfText.text}
`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content =
      response?.choices?.[0]?.message?.content ||
      "No review generated.";

    await sql`
      INSERT INTO creations
      (
        user_id,
        prompt,
        content,
        type
      )
      VALUES
      (
        ${userId},
        'Review the uploaded resume',
        ${content},
        'resume-review'
      )
    `;

    return res.json({
      success: true,
      content,
    });

  } catch (error) {
    console.error("Resume Review Error:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};