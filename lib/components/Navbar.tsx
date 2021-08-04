import React from "react";
import { FiMenu, FiX } from "react-icons/fi";

import { useAppContext } from "../hooks/useAppContext";

export function Navbar() {
    const { isMinimized, setIsMinimized } = useAppContext();

    return (
        <div className="fixed w-full top-0 left-0 px-4 py-2 lg:hidden navbar z-10 lg:z-0 bg-gray-800 h-16">
            <div className="flex flex-row h-full items-center">
                <div>
                    <button onClick={() => setIsMinimized(!isMinimized)} className="btn btn-primary --navbar-toggle">
                        {isMinimized ? <FiMenu className="w-5 h-5"/> : <FiX className="w-5 h-5"/>}
                    </button>
                </div>
                <div>
                    <span className="text-3xl text-gray-200 ml-2">{process.env.REACT_APP_NAME}</span>
                </div>
            </div>
        </div>
    );
}
