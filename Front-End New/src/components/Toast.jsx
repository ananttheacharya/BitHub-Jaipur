/**
 * Toast Component
 *
 * A simple notification toast that appears at the bottom of the screen.
 * Auto-dismisses after a configurable duration.
 *
 * Props:
 *   @param {string}  message  - Text to display in the toast
 *   @param {boolean} visible  - Whether the toast is currently shown
 */

function Toast({ message, visible }) {
  return (
    <div
      className={`toast${visible ? ' toast--visible' : ''}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

export default Toast;
