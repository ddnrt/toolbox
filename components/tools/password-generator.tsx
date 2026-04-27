"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Copy, RefreshCw } from "lucide-react"

export function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })

  const generatePassword = () => {
    let chars = ""
    if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz"
    if (options.numbers) chars += "0123456789"
    if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (!chars) {
      setPassword("")
      return
    }

    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
  }

  useEffect(() => {
    generatePassword()
  }, [length, options])

  const getStrength = () => {
    if (password.length < 8) return { label: "Weak", color: "text-red-500" }
    if (password.length < 12) return { label: "Medium", color: "text-yellow-500" }
    return { label: "Strong", color: "text-green-500" }
  }

  const strength = getStrength()

  const handleCopy = () => {
    navigator.clipboard.writeText(password)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Password Generator</h2>
        <p className="text-sm text-muted-foreground mt-1">Generate secure random passwords</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <Label>Generated Password</Label>
            <div className="flex flex-col gap-2 mt-2 sm:flex-row sm:items-center">
              <Input value={password} readOnly className="font-mono text-lg sm:flex-1" />
              <div className="flex gap-2">
                <Button onClick={handleCopy} size="icon">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button onClick={generatePassword} size="icon" variant="outline">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className={`text-sm mt-2 font-medium ${strength.color}`}>Strength: {strength.label}</p>
          </div>

          <div>
            <Label>Length: {length}</Label>
            <Slider
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              min={4}
              max={64}
              step={1}
              className="mt-2"
            />
          </div>

          <div className="space-y-3">
            <Label>Options</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="uppercase"
                  checked={options.uppercase}
                  onCheckedChange={(checked) => setOptions({ ...options, uppercase: checked as boolean })}
                />
                <label htmlFor="uppercase" className="text-sm cursor-pointer">
                  Uppercase (A-Z)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="lowercase"
                  checked={options.lowercase}
                  onCheckedChange={(checked) => setOptions({ ...options, lowercase: checked as boolean })}
                />
                <label htmlFor="lowercase" className="text-sm cursor-pointer">
                  Lowercase (a-z)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="numbers"
                  checked={options.numbers}
                  onCheckedChange={(checked) => setOptions({ ...options, numbers: checked as boolean })}
                />
                <label htmlFor="numbers" className="text-sm cursor-pointer">
                  Numbers (0-9)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="symbols"
                  checked={options.symbols}
                  onCheckedChange={(checked) => setOptions({ ...options, symbols: checked as boolean })}
                />
                <label htmlFor="symbols" className="text-sm cursor-pointer">
                  Symbols (!@#$%^&*)
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
