import {
    FaCss3,
    FaFileAlt,
    FaHtml5,
    FaJava,
    FaJsSquare,
    FaPython,
} from 'react-icons/fa';
import { FaGolang } from 'react-icons/fa6';
import { PiFileCppFill } from 'react-icons/pi';

export const IconFromFileName = ({ name }) => {
    const ext = name.substring(name.lastIndexOf('.') + 1);
    switch (ext) {
        case 'js':
            return <FaJsSquare />;
        case 'py':
            return <FaPython />;
        case 'cpp':
            return <PiFileCppFill />;
        case 'java':
            return <FaJava />;
        case 'go':
            return <FaGolang />;
        case 'rs':
            return <FaRust />;
        case 'html':
            return <FaHtml5 />;
        case 'css':
            return <FaCss3 />;
        default:
            return <FaFileAlt />;
    }
};
