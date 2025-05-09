import React from "react";
import { FaX } from "react-icons/fa6";

export const ConsoleLog = ({
    logs,
    resetLogs,
}: {
    logs: string[];
    resetLogs: any;
}) => {
    return (
        <>
            {logs.length > 0 && (
                <div className="absolute bottom-5 right-5 bg-muted rounded-lg p-3 px-5 flex flex-col items-stretch">
                    <FaX
                        className="cursor-pointer"
                        size={12}
                        onClick={resetLogs}
                    />
                    {logs.map((log, i) => (
                        <span key={i} className="font-medium">
                            {log}
                        </span>
                    ))}
                </div>
            )}
        </>
    );
};
