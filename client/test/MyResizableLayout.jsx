import { useResizable } from 'react-resizable-layout';

function XYZ() {
    const { position, separatorProps } = useResizable({
        axis: 'y',
    });

    const h1 = Math.max(position, 200);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100%',
            }}
        >
            <div
                style={{
                    height: h1,

                    width: '100%',
                    backgroundColor: 'green',
                }}
            >
                Left2 Content
            </div>
            <div
                {...separatorProps}
                style={{
                    height: '5px',
                    cursor: 'col-resize',
                    backgroundColor: '#ccc',
                }}
            />
            <div
                style={{
                    height: `calc(100vh - ${h1}px)`,
                    width: '100%',
                    // flex: 1,
                    backgroundColor: 'blue',
                }}
            >
                Right2 Content
            </div>
        </div>
    );
}

export default function Component() {
    const { position, separatorProps } = useResizable({
        axis: 'x',
    });

    const w1 = Math.max(position, 250);

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            <div
                style={{
                    width: w1, // 10
                    backgroundColor: 'red',
                    padding: '10px',
                }}
            >
                Left Content
            </div>
            <div
                {...separatorProps}
                style={{
                    width: '5px',
                    cursor: 'col-resize',
                    backgroundColor: '#ccc',
                }}
            />

            {/* // 90 niche */}

            {/* // 100 - 10 + 30 */}
            <div
                style={{
                    width: `100vw - ${w1}px`,
                    flex: 1,
                    backgroundColor: 'blue',
                }}
            >
                <XYZ />
            </div>
        </div>
    );
}
