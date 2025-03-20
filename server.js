const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let ideas = []; // Stores ideas in memory (Upgrade to DB if needed)

// Function to generate implementation guidelines
function generateGuidelines(title) {
    const steps = [
        "Research the core concept and validate its feasibility.",
        "Identify the required technologies and tools.",
        "Build a prototype to test the idea.",
        "Iterate based on feedback and refine the product.",
        "Launch and market the final version."
    ];

    const skills = ["Project Management", "Problem-Solving", "Software Development", "Business Strategy"];

    if (title.toLowerCase().includes("ai")) {
        steps.push(
            "Train AI models using data related to your idea.",
            "Optimize AI accuracy and performance.",
            "Deploy the AI system in a web or mobile app."
        );
        skills.push("Machine Learning", "Python (TensorFlow, PyTorch)", "Data Science");
    }

    if (title.toLowerCase().includes("app")) {
        steps.push(
            "Design the UI/UX for user-friendly experience.",
            "Develop the app using React Native or Flutter.",
            "Deploy on Google Play Store and App Store."
        );
        skills.push("UI/UX Design", "React Native", "Flutter", "App Deployment");
    }

    if (title.toLowerCase().includes("iot") || title.toLowerCase().includes("smart")) {
        steps.push(
            "Select microcontrollers (e.g., Arduino, Raspberry Pi).",
            "Write embedded code to control hardware.",
            "Connect to the cloud for remote access."
        );
        skills.push("Embedded Systems", "Arduino Programming", "IoT Networking");
    }

    return { steps, skills };
}

// API Endpoint to submit an idea (Prevents duplicate ideas)
app.post("/api/ideas", (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required!" });
    }

    // Check if the same idea already exists
    const existingIdea = ideas.find(idea => 
        idea.title.toLowerCase() === title.toLowerCase() && 
        idea.description.toLowerCase() === description.toLowerCase()
    );

    if (existingIdea) {
        return res.status(200).json({ message: "Idea already exists!", existingIdea });
    }

    // Generate new guidelines
    const { steps, skills } = generateGuidelines(title);
    const newIdea = { id: ideas.length + 1, title, description, steps, skills };
    ideas.push(newIdea);

    res.status(201).json(newIdea);
});

// API Endpoint to fetch all ideas
app.get("/api/ideas", (req, res) => {
    res.json(ideas);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
