import React from "react"
import Footer from "./pages/Footer"

const GameWrapper = ({  children }: {  children: any }) => {
  return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex 
                          max-w-[600px] w-full h-full max-h-[450px]
                          bg-slate-50 dark:bg-slate-700
                          border dark:border-slate-700 rounded-md shadow-2xl">
          <div className="flex 
                            bg-slate-700 
                            border border-8 border-double dark:border-slate-700 rounded-md shadow-2xl
                            flex-col gap-4 justify-center h-full align-center items-center w-full">
            {children}
          </div>
        </div>
      </div>
  )
}

export default GameWrapper
