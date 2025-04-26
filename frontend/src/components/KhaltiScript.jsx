"use client"

import { useEffect } from "react"

const KhaltiScript = () => {
  useEffect(() => {
    // Check if script already exists
    if (!document.getElementById("khalti-script")) {
      const script = document.createElement("script")
      script.id = "khalti-script"
      script.src = "https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.22.0.0.0/khalti-checkout.iffe.js"
      script.async = true

      document.head.appendChild(script)

      return () => {
        // Clean up script when component unmounts
        if (document.getElementById("khalti-script")) {
          document.head.removeChild(document.getElementById("khalti-script"))
        }
      }
    }
  }, [])

  return null
}

export default KhaltiScript
