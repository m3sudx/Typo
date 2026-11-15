import { Bug, Code, BookOpen, Terminal } from "lucide-react";
import "./welcomeScreen.css";

export default function WelcomeScreen({ onPromptSelect }) {
  const cards = [
    {
      icon: <Bug size={20} />,
      title: "Debug Code",
      description: "Find bugs, understand errors, and fix problems.",
      prompt: "Help me debug this code:\n\n```\n// paste your code here\n```",
    },
    {
      icon: <Code size={20} />,
      title: "Code Review",
      description: "Improve code quality and discover potential issues.",
      prompt: "Please review this code for quality, bugs, and improvements:\n\n```\n// paste your code here\n```",
    },
    {
      icon: <BookOpen size={20} />,
      title: "Learn Programming",
      description: "Understand difficult concepts with clear explanations.",
      prompt: "Explain the following programming concept in simple terms: ",
    },
    {
      icon: <Terminal size={20} />,
      title: "Generate Code",
      description: "Turn your ideas into practical code.",
      prompt: "Generate code for the following requirement:\n\n",
    },
  ];

  return (
    <div className="welcome-screen">
      <div className="welcome-hero">
        <h1>Your next great idea starts here.</h1>
        <p>Debug, understand, and build better software with your AI coding companion.</p>
      </div>

      <div className="suggestions-grid">
        {cards.map((card) => (
          <button
            key={card.title}
            className="suggestion-card"
            onClick={() => onPromptSelect?.(card.prompt)}
          >
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
