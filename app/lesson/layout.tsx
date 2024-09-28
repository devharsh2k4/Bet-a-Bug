type Props = {
    children: React.ReactNode;
}

const Lessonlayout = ({children}: Props) => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col h-full">
                {children}
            </div>
        </div>
    )
}

export default Lessonlayout;