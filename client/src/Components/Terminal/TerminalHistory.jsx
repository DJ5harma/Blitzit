import { UseTerminal } from '../../Providers/TerminalProvider';

export const TerminalHistory = () => {
    const { history } = UseTerminal();

    return (
        <div className="flex flex-col overflow-auto gap-2 w-3/4  border-r-2 border-gray-500">
            <span className="select-none border-b-2 border-gray-500 pb-1">Terminal</span>
            {history.map((text, i) => {
                return (
                    <span
                        key={i}
                        style={
                            text[0] == '/'
                                ? {
                                      backgroundImage:
                                          'linear-gradient(to right, rgb(220, 220, 220), black)',
                                      color: 'black',
                                      paddingLeft: 12,
                                  }
                                : {}
                        }
                    >
                        {text}
                    </span>
                );
            })}
        </div>
    );
};
