function Card({ children }) {

    return (

        <div
            className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-8
                shadow-xl
            "
        >

            {children}

        </div>

    );

}

export default Card;