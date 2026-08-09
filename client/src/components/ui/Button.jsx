function Button({
    children,
    type = "button",
    onClick,
    className = "",
    disabled = false
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                px-5
                py-2
                rounded-lg
                bg-blue-600
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
                font-semibold
                transition
                ${className}
            `}
        >
            {children}
        </button>
    );
}

export default Button;
