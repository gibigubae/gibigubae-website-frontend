import React from "react";
import "../styles/SharedFeedback.css";

const LoadingPage = ({ message = "Loading..." }) => {
  return (
    <div className="feedback-page loading-page">
      <div className="spinner-lg" aria-hidden="true" />
      <p className="feedback-message" aria-live="polite">
        {message}
      </p>
    </div>
  );
};

export default LoadingPage;
