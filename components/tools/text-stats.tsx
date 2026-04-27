"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function TextStats() {
  const [text, setText] = useState("")
  const [limit, setLimit] = useState(280)

  useEffect(() => {
    const saved = localStorage.getItem("text-stats")
    if (saved) setText(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem("text-stats", text)
  }, [text])

  const stats = useMemo(() => {
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, "").length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const lines = text ? text.split("\n").length : 0
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter(Boolean).length : 0

    return { chars, charsNoSpaces, words, lines, sentences, paragraphs }
  }, [text])

  const isOverLimit = stats.chars > limit

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Text Statistics</h2>
        <p className="text-sm text-muted-foreground mt-1">Count characters, words, lines and more</p>
      </div>

      <Card className="p-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter or paste your text here..."
          className="min-h-[300px] text-sm"
        />
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Characters</p>
          <p className="text-2xl font-bold mt-1">{stats.chars.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Characters (no spaces)</p>
          <p className="text-2xl font-bold mt-1">{stats.charsNoSpaces.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Words</p>
          <p className="text-2xl font-bold mt-1">{stats.words.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Lines</p>
          <p className="text-2xl font-bold mt-1">{stats.lines.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Sentences</p>
          <p className="text-2xl font-bold mt-1">{stats.sentences.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Paragraphs</p>
          <p className="text-2xl font-bold mt-1">{stats.paragraphs.toLocaleString()}</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="limit">Character Limit</Label>
            <Input
              id="limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="mt-2"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className={`text-2xl font-bold mt-1 ${isOverLimit ? "text-destructive" : ""}`}>
              {(limit - stats.chars).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
