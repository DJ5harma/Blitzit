export const toggleF11 = () => {
    const doc = window.document;
    const docEl = doc.documentElement;

    const isFullScreen =
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement;

    if (!isFullScreen) {
        docEl.requestFullscreen();
        docEl.mozRequestFullScreen();
        docEl.webkitRequestFullscreen();
        docEl.msRequestFullscreen();
    } else {
        doc.exitFullscreen();
        doc.mozCancelFullScreen();
        doc.webkitExitFullscreen();
        doc.msExitFullscreen();
    }
};
