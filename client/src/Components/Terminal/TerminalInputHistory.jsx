import { UseTerminal } from '../../Providers/TerminalProvider';

export const TerminalInputHistory = () => {
    const { inputHistory } = UseTerminal();

    return (
        <div className="flex flex-col overflow-auto gap-2 px-2">
            <span className="bg-white text-black pl-3 select-none">
                Input History
            </span>
            {inputHistory.map((text, i) => {
                return (
                    <span key={i} className="border-b-2 border-neutral-500">
                        {text}
                    </span>
                );
            })}
        </div>
    );
};
