import { useEffect, useState } from 'react';
import { useSocket } from '../Providers/SocketProvider';
import { useNavigate } from 'react-router-dom';

const templates = [{ name: 'python-template' }];

export const Home = () => {
    const { skt } = useSocket();
    const [makingTemplate, setMakingTemplate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        skt.on('createContainer -o1', ({ roomId }) => {
            navigate(`room/${roomId}`);
        });
        return () => {
            skt.removeListener('createContainer -o1');
        };
    }, []);

    if (makingTemplate) return <>Making your template.......</>;

    return (
        <>
            {templates.map(({ name }, i) => {
                return (
                    <button
                        onClick={() => {
                            skt.emit('createContainer', { Image: name });
                            setMakingTemplate(true);
                        }}
                        key={i}
                    >
                        {name}
                    </button>
                );
            })}
        </>
    );
};
