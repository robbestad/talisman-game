import React, { useState } from "react"
import { Toaster } from "react-hot-toast"

const Layout = ({ footer, children }: { footer: any, children: any }) => {
  let [count, setCount] = useState(0)


  return (
    <div className="h-screen/header grid grid-rows-[1fr,50px]">
      <div className="w-full md:mx-auto grow 
      ">{children}</div>
      <div className="text-slate-900
                      dark:text-slate-400 w-full 
                      ">
        <section className="flex flex-row justify-center ">
          <section className="px-4 gap-2 flex flex-row pt-2 w-full sm:w-fit">
            <div className="flex gap-2 flex-row w-full sm:w-fit justify-around">
              {footer}
            </div>
          </section>
        </section>
      </div>
      <Toaster />

    </div>
  )
}

export default Layout
