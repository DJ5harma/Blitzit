export const TerminalHistory = ({ history }) => {
    return (
        <div className="flex flex-col overflow-auto gap-2 w-3/4">
            <span className="bg-blue-950 pl-3 select-none">Terminal</span>
            {history.map((text, i) => {
                return (
                    <span
                        key={i}
                        style={
                            text[0] == '/'
                                ? {
                                      backgroundImage:
                                          'linear-gradient(to right, aliceblue, black)',
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
