
const CardNote = ({ position, name_zh,note_Str }) => {
    
    
    
    return (
        <div className="absolute top-0 w-full text-xs md:text-lg  bg-black z-10 h-[100%] rounded-md p-[2px] opacity-0 flex justify-center items-center hover:opacity-50">
            <div>
            <div className="bg-black"><p className="text-center   text-white font-bold">{position}</p></div>
            <div className="bg-black"><p className="text-pretty text-center text-green-200 font-bold">{name_zh}&{note_Str}</p></div>
            </div>

        </div>)
}

export { CardNote }