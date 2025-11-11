/**
 * Formats a number of seconds into a MM:SS string.
 * @param {number} seconds - The total seconds.
 * @returns {string} - The formatted time string.
 */

// We are using "export const" which is a NAMED export.
// This is the key part.
export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`
}


export const todayKey = () => {
    const d = new Date()
    return d.toISOString().slice(0, 10)
}