import React from 'react';

function ProgressBar({ progress }) {
  return (
    <div className="progress" style={{ width: '100%' }}>
      <div
        className="progress-bar bg-success progress-bar-striped progress-bar-animated"
        role="progressbar"
        style={{ width: `${progress}%` }}
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
  );
}

export default ProgressBar;