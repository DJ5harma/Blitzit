import {
    FaCss3,
    FaFileAlt,
    FaHtml5,
    FaJava,
    FaJsSquare,
    FaPython,
    FaRust,
} from 'react-icons/fa';
import { BiLogoTypescript } from 'react-icons/bi';
import { FaGolang } from 'react-icons/fa6';
import { PiFileCppFill } from 'react-icons/pi';

export const IconFromFileName = ({ name }) => {
    const ext = name.substring(name.lastIndexOf('.') + 1);
    switch (ext) {
        case 'js':
            return <FaJsSquare color="yellow" />;
        case 'ts':
            return <BiLogoTypescript color='rgb(40, 140, 200)' size={25} />;
        case 'py':
            return <FaPython color="rgb(100, 120, 200)" />;
        case 'cpp':
            return <PiFileCppFill color="rgb(60, 120, 200)" size={25} />;
        case 'c++':
            return <PiFileCppFill color="rgb(60, 120, 200)" size={25} />;
        case 'java':
            return <FaJava color="orange" />;
        case 'go':
            return <FaGolang color="rgb(60, 120, 250)" />;
        case 'rs':
            return <FaRust color="brown" />;
        case 'html':
            return <FaHtml5 color="orange" />;
        case 'htm':
            return <FaHtml5 color="orange" />;
        case 'css':
            return <FaCss3 color="rgb(40, 180, 255)" />;
        default:
            return <FaFileAlt />;
    }
};
