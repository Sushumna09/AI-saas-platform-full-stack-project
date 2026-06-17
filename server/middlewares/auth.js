import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const hasPremiumPlan = await has({
      plan: "premium",
    });

    const user = await clerkClient.users.getUser(userId);

    req.free_usage =
      user.privateMetadata?.free_usage || 0;

    if (hasPremiumPlan && req.free_usage !== 0) {
      await clerkClient.users.updateUserMetadata(
        userId,
        {
          privateMetadata: {
            free_usage: 0,
          },
        }
      );

      req.free_usage = 0;
    }

    req.plan = hasPremiumPlan
      ? "premium"
      : "free";

    next();
  } catch (error) {
    console.error(
      "Auth Middleware Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};