import { ChevronRight, ChevronLeft, Lightbulb, Zap } from "lucide-react";
import "./rightPanel.css";

export default function RightPanel({
  isOpen,
  toggleOpen,
  conversationId,
  onPromptSelect,
}) {
  const tips = [
    "Be specific about your problem.",
    "Include error messages when debugging.",
    "Share relevant code snippets.",
    "Mention your programming language.",
  ];

  const quickPrompts = [
    "Debug this error",
    "Explain this code",
    "Optimize this",
    "Add tests",
  ];

  return (
    <aside
      className="right-panel"
      data-open={isOpen}
      data-conversation-id={conversationId || undefined}
    >
      <button
        className="panel-toggle"
        onClick={toggleOpen}
        title={isOpen ? "Collapse panel" : "Expand panel"}
        aria-label={isOpen ? "Collapse panel" : "Expand panel"}
      >
        {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {isOpen && (
        <div className="panel-body">
          <section className="panel-section">
            <h4 className="panel-section-title">
              <Lightbulb size={14} className="panel-icon lightbulb-icon" />
              <span>Tips for better results</span>
            </h4>
            <ul className="tips-list">
              {tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </section>

          <section className="panel-section">
            <h4 className="panel-section-title">
              <Zap size={14} className="panel-icon zap-icon" />
              <span>Quick prompts</span>
            </h4>
            <div className="quick-prompts">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  className="quick-prompt-btn"
                  onClick={() => onPromptSelect?.(p)}
                  type="button"
                >
                  {p}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </aside>
  );
}
