import React from "react";

const Input = React.forwardRef((props, ref) => {

    return (

        <input

            ref={ref}

            {...props}

            className="
                w-full
                px-4
                py-3
                rounded-lg
                bg-slate-800
                border
                border-slate-700
                text-white
                focus:outline-none
                focus:border-blue-500
            "

        />

    );

});

export default Input;