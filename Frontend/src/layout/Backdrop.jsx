import React from "react";

function Backdrop({ show, onClick }) {
    if (!show) return null;
    return (
        <div
            onClick={onClick}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        ></div>
    );
}

export default Backdrop;
