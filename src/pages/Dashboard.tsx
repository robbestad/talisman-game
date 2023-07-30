import React, { ReactElement } from "react"
import Layout from "../Layout"
import Footer from "./Footer"
import Main from "./Main"

export default function Dashboard({ isDark }: { isDark: boolean }): ReactElement {

  return (
    <Layout
      footer={<Footer />}>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex 
                        max-w-[600px] w-full h-full max-h-[400px]
                        bg-slate-50 dark:bg-slate-700
                        border dark:border-slate-700 rounded-md shadow-2xl">
          <Main isDark={isDark} />
        </div>
      </div>

    </Layout>
  )
}
