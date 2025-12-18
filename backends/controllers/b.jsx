export const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Backend Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password, // hashed automatically via User model pre-save hook
      avatar: avatar
        ? { url: avatar.url, public_id: avatar.public_id }  
        : {
            url: "https://via.placeholder.com/150?text=No+Avatar",
            public_id: null,
          },
    });

    // Send JWT token with custom message
    sendToken(user, 201, res, "Registration successful");
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
