"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import cronstrue from "cronstrue"

export function CrontabParser() {
  const [cronExpression, setCronExpression] = useState("0 9 * * 1-5")
  const [description, setDescription] = useState("")
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    try {
      const desc = cronstrue.toString(cronExpression)
      setDescription(desc)
      setIsValid(true)
    } catch (error) {
      setDescription("Invalid cron expression")
      setIsValid(false)
    }
  }, [cronExpression])

  const examples = [
    { cron: "0 9 * * 1-5", desc: "Every weekday at 9:00 AM" },
    { cron: "*/15 * * * *", desc: "Every 15 minutes" },
    { cron: "0 0 * * 0", desc: "Every Sunday at midnight" },
    { cron: "0 12 1 * *", desc: "First day of month at noon" },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Crontab Parser</h2>
        <p className="text-sm text-muted-foreground mt-1">Parse cron expressions into human-readable descriptions</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="cron">Cron Expression</Label>
            <Input
              id="cron"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              placeholder="0 9 * * 1-5"
              className="font-mono mt-2"
            />
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary">
            {isValid ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium text-sm">{isValid ? "Valid Expression" : "Invalid Expression"}</p>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-medium mb-3">Examples</h3>
        <div className="space-y-2">
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => setCronExpression(example.cron)}
              className="w-full text-left p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <code className="text-sm font-mono text-primary">{example.cron}</code>
              <p className="text-sm text-muted-foreground mt-1">{example.desc}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
