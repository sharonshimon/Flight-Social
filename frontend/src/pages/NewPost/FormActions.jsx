import React from "react";

export default function FormActions({ canSubmit }) {
  return (
    <div className="np-actions">
      <button
        type="button"
        className="btn"
        onClick={() => window.history.back()}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="btn btn--primary"
        disabled={!canSubmit}
      >
        Post
      </button>
    </div>
  );
}
