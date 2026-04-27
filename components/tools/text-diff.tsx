"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Trash2 } from "lucide-react"
import { diffWords, diffLines } from "diff"

export function TextDiff() {
  const [text1, setText1] = useState("")
  const [text2, setText2] = useState("")
  const [mode, setMode] = useState<"words" | "lines">("lines")

  useEffect(() => {
    const saved1 = localStorage.getItem("text-diff-1")
    const saved2 = localStorage.getItem("text-diff-2")
    if (saved1) setText1(saved1)
    if (saved2) setText2(saved2)
  }, [])

  useEffect(() => {
    localStorage.setItem("text-diff-1", text1)
  }, [text1])

  useEffect(() => {
    localStorage.setItem("text-diff-2", text2)
  }, [text2])

  const diff = useMemo(() => {
    if (mode === "words") {
      return diffWords(text1, text2)
    }
    return diffLines(text1, text2)
  }, [text1, text2, mode])

  const handleClear = () => {
    if (confirm("Clear all content?")) {
      setText1("")
      setText2("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Text Diff Tool</h2>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Button variant={mode === "lines" ? "default" : "outline"} size="sm" onClick={() => setMode("lines")}>
            Lines
          </Button>
          <Button variant={mode === "words" ? "default" : "outline"} size="sm" onClick={() => setMode("words")}>
            Words
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Original Text</h3>
          <Textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Enter original text..."
            className="min-h-[300px] font-mono text-sm"
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Modified Text</h3>
          <Textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Enter modified text..."
            className="min-h-[300px] font-mono text-sm"
          />
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Differences</h3>
        <div className="font-mono text-sm whitespace-pre-wrap break-words">
          {diff.map((part, index) => (
            <span
              key={index}
              className={
                part.added
                  ? "bg-green-500/20 text-green-400"
                  : part.removed
                    ? "bg-red-500/20 text-red-400 line-through"
                    : ""
              }
            >
              {part.value}
            </span>
          ))}
        </div>
      </Card>
    </div>
  )
}
