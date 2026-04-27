"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy } from "lucide-react"

export function CaseConverter() {
  const [text, setText] = useState("")
  const [result, setResult] = useState("")
  const [activeCase, setActiveCase] = useState<string>("")

  useEffect(() => {
    const saved = localStorage.getItem("case-converter")
    if (saved) setText(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem("case-converter", text)
  }, [text])

  const convertCase = (type: string) => {
    setActiveCase(type)

    switch (type) {
      case "upper":
        setResult(text.toUpperCase())
        break
      case "lower":
        setResult(text.toLowerCase())
        break
      case "sentence":
        setResult(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()))
        break
      case "camel":
        setResult(text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()))
        break
      case "snake":
        setResult(
          text
            .replace(/\W+/g, " ")
            .split(/ |\B(?=[A-Z])/)
            .map((word) => word.toLowerCase())
            .join("_"),
        )
        break
      case "kebab":
        setResult(
          text
            .replace(/\W+/g, " ")
            .split(/ |\B(?=[A-Z])/)
            .map((word) => word.toLowerCase())
            .join("-"),
        )
        break
      default:
        setResult(text)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
  }

  const cases = [
    { id: "upper", label: "UPPERCASE" },
    { id: "lower", label: "lowercase" },
    { id: "sentence", label: "Sentence case" },
    { id: "camel", label: "camelCase" },
    { id: "snake", label: "snake_case" },
    { id: "kebab", label: "kebab-case" },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Case Converter</h2>
        <p className="text-sm text-muted-foreground mt-1">Convert text between different cases</p>
      </div>

      <Card className="p-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          className="min-h-[150px]"
        />
      </Card>

      <div className="flex flex-wrap gap-2">
        {cases.map((c) => (
          <Button key={c.id} variant={activeCase === c.id ? "default" : "outline"} onClick={() => convertCase(c.id)}>
            {c.label}
          </Button>
        ))}
      </div>

      {result && (
        <Card className="p-4">
          <div className="flex flex-col gap-2 mb-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Result</h3>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
          <p className="font-mono text-sm whitespace-pre-wrap break-words">{result}</p>
        </Card>
      )}
    </div>
  )
}
