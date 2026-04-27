"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download, Trash2, Upload } from "lucide-react"
import { marked } from "marked"

marked.setOptions({
  gfm: true,
  breaks: true,
  async: false,
})

export function MarkdownEditor() {
  const [markdown, setMarkdown] = useState("")
  const [html, setHtml] = useState("")

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("markdown-editor")
    if (saved) setMarkdown(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem("markdown-editor", markdown)

    let isCancelled = false

    const renderMarkdown = async () => {
      const rendered = await marked.parse(markdown)
      if (!isCancelled) {
        setHtml(rendered)
      }
    }

    renderMarkdown()

    return () => {
      isCancelled = true
    }
  }, [markdown])

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown)
  }

  const handleClear = () => {
    if (confirm("Clear all content?")) {
      setMarkdown("")
    }
  }

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "document.md"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setMarkdown(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Markdown Editor</h2>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
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
            <input type="file" accept=".md,.markdown" className="hidden" onChange={handleFileUpload} />
          </label>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Markdown</h3>
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="# Enter your markdown here..."
            className="min-h-[500px] font-mono text-sm"
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Preview</h3>
          <div className="markdown-preview min-h-[500px]" dangerouslySetInnerHTML={{ __html: html }} />
        </Card>
      </div>
    </div>
  )
}
