import User from "../models/user.model.js";

export const getUserProfileAndRepos = async (req, res) =>{
    const {username} = req.params;
    try {
        const token = process.env.VITE_GITHUB_TOKEN;
        console.log("Token exists:", !!token);
        console.log("Token first 10 chars:", token ? token.substring(0, 10) + "..." : "NO TOKEN");
        
        if (!token) {
            console.error("VITE_GITHUB_TOKEN is not set!");
            return res.status(500).json({ error: "Server configuration error" });
        }
        
        const userRes = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                authorization: `token ${token}`
            }
        });
        const userProfile = await userRes.json();
        console.log("GitHub API response:", userProfile.message || "Success");
        
        if (userProfile.message) {
            return res.status(404).json({ error: userProfile.message });
        }
        
        const repoRes = await fetch(userProfile.repos_url, {
            headers:{
                authorization: `token ${token}`
            }
        })
        const userRepos = await repoRes.json();
        res.json({ userProfile, profile: userProfile, repos: userRepos });
    
    } catch (error) {
        console.error("Error fetching profile:", error);
      	res.status(500).json({ error: error.message });
    }

} 


export const likeProfile = async (req, res) => {
	try {
		const { username } = req.params;
		const user = await User.findById(req.user._id.toString());
		console.log(user, "auth user");
		const userToLike = await User.findOne({ username });

		if (!userToLike) {
			return res.status(404).json({ error: "User is not a member" });
		}

		if (user.likedProfiles.includes(userToLike.username)) {
			return res.status(400).json({ error: "User already liked" });
		}

		userToLike.likedBy.push({ username: user.username, avatarUrl: user.avatarUrl, likedDate: Date.now() });
		user.likedProfiles.push(userToLike.username);

		// await userToLike.save();
		// await user.save();
		await Promise.all([userToLike.save(), user.save()]);

		res.status(200).json({ message: "User liked" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getLikes = async (req, res) => {
	try {
		const user = await User.findById(req.user._id.toString());
		res.status(200).json({ likedBy: user.likedBy });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};