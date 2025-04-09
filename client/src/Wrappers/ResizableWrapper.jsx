import { useResizable } from 'react-resizable-layout';

export const ResizableWrapper = ({ child1, child2, axis, initial }) => {
    const { position, separatorProps } = useResizable({
        axis: axis || 'x',
        initial: initial || 250,
    });

    if(!child1 || !child2) return <div className='w-full h-full'>{child1 || child2}</div>

    if (axis === 'y')
        return (
            <div className="flex flex-col w-full h-full">
                <div
                    style={{
                        height: position,
                    }}
                >
                    {child1}
                </div>
                <div
                    {...separatorProps}
                    className="min-h-1 cursor-n-resize"
                    style={{ backgroundColor: 'rgb(0, 120, 212)' }}
                />
                <div
                    style={{
                        height: `calc(100% - ${position + 4}px)`,
                        minHeight: 15
                    }}
                >
                    {child2}
                </div>
            </div>
        );
    return (
        <div className="flex h-full w-full">
            <div
                style={{
                    width: position,
                }}
            >
                {child1}
            </div>
            <div
                {...separatorProps}
                className="min-w-1 cursor-e-resize"
                style={{ backgroundColor: 'rgb(0, 120, 212)' }}
            />
            <div
                style={{
                    width: `calc(100% - ${position + 4}px)`,
                }}
            >
                {child2}
            </div>
        </div>
    );
};
