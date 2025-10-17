import React from "react";

export default function FormActions({ canSubmit, submitting }) {
  return (
    <div className="np-actions">
      <button
        type="button"
        className="btn"
        onClick={() => window.history.back()}
        disabled={submitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="btn btn--primary"
        disabled={!canSubmit || submitting}
      >
        {submitting ? 'Posting...' : 'Post'}
      </button>
    </div>
  );
}
