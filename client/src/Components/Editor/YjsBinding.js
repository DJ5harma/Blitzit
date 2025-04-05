import { useEffect } from 'react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { CONSTANTS } from '../../Utils/CONSTANTS';

const yDocMap = new Map();

export function useYjsBinding(path, roomId, setPathToContent, initialContent) {
    useEffect(() => {
        if (!path || !roomId) return;

        const key = `${roomId}:${path}`;

        if (yDocMap.has(key)) return; // already set

        const ydoc = new Y.Doc();
        const provider = new WebrtcProvider(key, ydoc, {
            signaling: [CONSTANTS.WEBRTC_SERVER_URL],
        });

        const yText = ydoc.getText('monaco');

        // Only initialize if this Y.Text is empty (first user)
        setTimeout(() => {
            const isAlone =
                (provider.webrtcConns?.size || 0) === 0 ||
                Array.from(provider.awareness.getStates().keys()).length === 1;

            if (yText.length === 0 && isAlone && initialContent) {
                yText.insert(0, initialContent);
            }
        }, 500);

        // Push initial content to state
        setPathToContent((prev) => ({
            ...prev,
            [path]: yText.toString(),
        }));

        // Listen to changes in yText
        yText.observe(() => {
            setPathToContent((prev) => ({
                ...prev,
                [path]: yText.toString(),
            }));
        });

        // Save to map
        yDocMap.set(key, { ydoc, provider, yText });

        // Optional awareness
        provider.awareness.setLocalStateField('user', {
            name: 'User-' + Math.floor(Math.random() * 1000),
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        });

        return () => {
            // provider.destroy();
            // ydoc.destroy();
            // yDocMap.delete(key);
        };
    }, [initialContent, path, roomId, setPathToContent]);
}

export function getYText(path, roomId) {
    const key = `${roomId}:${path}`;
    return yDocMap.get(key)?.yText ?? null;
}
