"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download, Upload, Minimize2, Maximize2 } from "lucide-react"

export function JsonBeautifier() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("json-beautifier")
    if (saved) setInput(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem("json-beautifier", input)

    if (!input.trim()) {
      setOutput("")
      setError("")
      return
    }

    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError("")
    } catch (e) {
      setError((e as Error).message)
      setOutput("")
    }
  }, [input])

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input)
      setInput(JSON.stringify(parsed))
    } catch (e) {
      // Error already shown
    }
  }

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input)
      setInput(JSON.stringify(parsed, null, 2))
    } catch (e) {
      // Error already shown
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output || input)
  }

  const handleDownload = () => {
    const blob = new Blob([output || input], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setInput(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">JSON Beautifier</h2>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Button variant="outline" size="sm" onClick={handleMinify}>
            <Minimize2 className="w-4 h-4 mr-2" />
            Minify
          </Button>
          <Button variant="outline" size="sm" onClick={handleFormat}>
            <Maximize2 className="w-4 h-4 mr-2" />
            Format
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <label className="flex">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </span>
            </Button>
            <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Input</h3>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="min-h-[500px] font-mono text-sm"
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Output</h3>
          <pre className="min-h-[500px] text-sm font-mono overflow-auto">
            {output || "Valid JSON will appear here..."}
          </pre>
        </Card>
      </div>
    </div>
  )
}
