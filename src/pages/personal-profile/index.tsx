import React from "react"
import { Link } from "react-router-dom"

export const PersonalProfile = () => {
  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <iframe
        src="张哲成简历.pdf"
        title="iframe"
        id="iframe"
        width={"100%"}
        height={"100%"}
      />
    </div>
  )
}
