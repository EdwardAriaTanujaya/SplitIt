
function InputErrorMessage(message: string){
    return (
        <div>
            <p className="text-[var(--color-error)] text-left text-xs mt-1">{message}</p>
        </div>
    )
}

export default InputErrorMessage;