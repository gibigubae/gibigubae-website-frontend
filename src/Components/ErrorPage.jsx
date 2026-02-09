import React, { useEffect } from "react";
import "../styles/SharedFeedback.css";
import Swal from "sweetalert2";

const ErrorPage = ({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  onRetry,
  retryLabel = "Retry",
  compact = false,
}) => {
  // Show a SweetAlert2 notification when an error page mounts or updates
  useEffect(() => {
    const swalOptions = compact
      ? {
          toast: true,
          position: "top-end",
          icon: "error",
          title,
          text: message,
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        }
      : {
          icon: "error",
          title,
          text: message,
        };

    Swal.fire(swalOptions);
  }, [title, message, compact]);
  if (compact) {
    return (
      <div className="error-inline" role="alert">
        <strong>{title}:</strong> {message}
        {onRetry && (
          <button className="retry-btn-inline" onClick={onRetry}>
            {retryLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="feedback-page error-page" role="alert">
      <div className="error-icon" aria-hidden="true">
        !
      </div>
      <h2 className="feedback-title">{title}</h2>
      <p className="feedback-message">{message}</p>
      {onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorPage;
