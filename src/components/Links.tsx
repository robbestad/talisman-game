import { ExternalLinkIcon, LinkIcon, MenuIcon } from "./icons"
import React, { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import useOuterClick from "./effects/useOuterClick";
import { buttonStyleWithoutBg } from "./styles";

export default function Links({menuOpen, setMenuOpen}: {menuOpen: boolean, setMenuOpen: (arg0: boolean) => void}) {
  let buttonStyle = (isActive: boolean) => `${isActive && "underline"} 

  ${buttonStyleWithoutBg}
  `
  const ref = useOuterClick<HTMLDivElement>(() => setMenuOpen(false));

  let containerStyle = `uppercase cursor-pointer z-10`
  const navigate = useNavigate()
  return (
    <section className="relative" ref={ref}>
      <button
        className="ml-4 mt-4 dark:text-slate-400 dark:hover:text-slate-200 text-slate-600 hover:text-slate-900 w-fit"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <MenuIcon />
      </button>
      <div
        className={`
        fixed md:absolute
        left-0
        shadow-xl
        top-[53px]
        transition
        duration-350
        ease-out
        flex
        ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } flex-col justify-start gap-2 text-md dark:bg-slate-700 bg-slate-50 text-slate-900 ${containerStyle} h-screen md:h-fit w-screen md:w-[320px] `}
      >
        <NavLink
          onClick={() => {
            setMenuOpen(false)
            navigate("/search/files")
          }}
          className={({ isActive }) => buttonStyle(isActive)}
          to={"/search/files"}
        >
          {"Shadow Search"}
        </NavLink>
        <NavLink
          onClick={() => {
            setMenuOpen(false)
            navigate("/dashboard")
          }}
          className={({ isActive }) => buttonStyle(isActive)}
          to={"/dashboard"}
        >
          {"Shadow Stats"}
        </NavLink>
        <NavLink
          onClick={() => {
            setMenuOpen(false)
            navigate("/search/drive")
          }}
          className={({ isActive }) => buttonStyle(isActive)}
          to={"/search/drive"}
        >
          {"Drive Inspector"}
        </NavLink>
        <NavLink
          onClick={() => {
            setMenuOpen(false)
            navigate("/websites")
          }}
          className={({ isActive }) => buttonStyle(isActive)}
          to={"/websites"}
        >
          {"Decentralized websites"}
        </NavLink>

        <NavLink
          onClick={() => {
            setMenuOpen(false)
            navigate("/shorts")
          }}
          className={({ isActive }) => buttonStyle(isActive)}
          to={"/shorts"}
        >
          {"Daily Video shorts"}
        </NavLink>

        <NavLink
          onClick={() => {
            setMenuOpen(false)
            navigate("/savetwitter")
          }}
          className={({ isActive }) => buttonStyle(isActive)}
          to={"/savetwitter"}
        >
          {"Save Video From Twitter"}
        </NavLink>
        <NavLink
          onClick={() => {
            setMenuOpen(false)
            navigate("/upload")
          }}
          className={({ isActive }) => buttonStyle(isActive)}
          to={"/upload"}
        >
          {"Upload & share"}
        </NavLink>
        <NavLink
          onClick={() => {
            setMenuOpen(false)
            navigate("/profile/account")
          }}
          className={({ isActive }) => buttonStyle(isActive)}
          to={"/profile/account"}
        >
          {"Your Account"}
        </NavLink>
        <NavLink
          onClick={() => {
            setMenuOpen(false)
            navigate("/pricecalc")
          }}
          className={({ isActive }) => buttonStyle(isActive)}
          to={"/pricecalc"}
        >
          {"SHDW Price calculator"}
        </NavLink>
        <hr />
        <div>
          <a
            className={`flex gap-1 flex-row ${buttonStyle(false)}`}
            href={"https://www.shadowtube.io"}
            target="_blank"
          >
            {"Shadow Tube "}
            <span className="mt-1">
              <ExternalLinkIcon width={10} height={10} />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
