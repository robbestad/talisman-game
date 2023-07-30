import React, { ReactElement } from "react"
import { VARIANT } from "./enums"
import { buttonStyle } from "./styles"

export default function Button  ({ variant, onClick, text }: { variant: VARIANT, onClick?: (e:React.MouseEvent) => void, text: string }): ReactElement {
    if(onClick){
        return (
            <button
                onClick={onClick}
                className={`${buttonStyle} 
                    ${variant === VARIANT.LARGE && "text-3xl"}
                    ${variant === VARIANT.NORMAL && "text-2xl"}
                    ${variant === VARIANT.SMALL && "text-xl"}`
                }>
                {text}</button>
        )
    }
    return (
        <button
            className={`${buttonStyle} 
                ${variant === VARIANT.LARGE && "text-3xl"}
                ${variant === VARIANT.NORMAL && "text-2xl"}
                ${variant === VARIANT.SMALL && "text-xl"}`
            }>
            {text}</button>
    )
}