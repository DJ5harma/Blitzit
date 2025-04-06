export function formatDate(mongodb_createdAt_like_date) {
    return new Date(`${mongodb_createdAt_like_date}`).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
    });
}
