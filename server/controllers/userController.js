import sql from "../configs/db.js";


export const getUserCreations = async (req, res) => {
    try {
        const { userId } = req.auth()

        const creations = await sql`SELECT * FROM creations 
               WHERE user_id=${userId}
               ORDER BY created_at DESC`;

        res.json({
            success: true,
            creations
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });

    }
}
// --------------------for published creations--------------------------

export const getPublishedCreations = async (req, res) => {
    try {


        const creations = await sql`SELECT * FROM creations 
               WHERE publish = true
               ORDER BY created_at DESC`;

        res.json({
            success: true,
            creations
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });

    }
}

//----------------------------toggle function------------

export const toggleLikeCreation = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { id } = req.body

        const [creation] = await sql` SELECT * FROM creations WHERE id=${id}`

        if (!creation) {
            return res.json({
                success: false,
                message: 'Creation not found'
            })
        }

        const currentLikes = creation.likes || [];
        const userIdStr = String(userId).trim();
        let updatedLikes;
        let message;

        if (currentLikes.includes(userIdStr)) {
            updatedLikes = currentLikes.filter(
                (like) => String(like).trim() !== userIdStr
            );
            message = 'Creation Unliked'
        } else {
            updatedLikes = [...currentLikes, userIdStr]
            message = 'Creation Liked'
        }
        console.log("Before:", currentLikes);
        console.log("After:", updatedLikes);

        const formattedArray = `{${updatedLikes.join(',')}}`

        await sql`UPDATE creations SET likes = ${updatedLikes}
        WHERE id = ${id}`;

        const [updatedCreation] =
            await sql`SELECT likes FROM creations WHERE id=${id}`;

        console.log("DB Likes:", updatedCreation.likes);

        res.json({
            success: true,
            message
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });

    }
}