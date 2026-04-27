"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Clock } from "lucide-react"

export function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("")
  const [dateTime, setDateTime] = useState("")
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (timestamp) {
      try {
        const ts = timestamp.length === 10 ? Number(timestamp) * 1000 : Number(timestamp)
        const date = new Date(ts)
        if (!isNaN(date.getTime())) {
          setDateTime(date.toISOString())
        }
      } catch (e) {
        setDateTime("Invalid timestamp")
      }
    }
  }, [timestamp])

  const handleDateTimeChange = (value: string) => {
    setDateTime(value)
    try {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setTimestamp(Math.floor(date.getTime() / 1000).toString())
      }
    } catch (e) {
      // Invalid date
    }
  }

  const handleNow = () => {
    const now = Date.now()
    setTimestamp(Math.floor(now / 1000).toString())
    setDateTime(new Date(now).toISOString())
  }

  const copyTimestamp = () => {
    navigator.clipboard.writeText(timestamp)
  }

  const copyDateTime = () => {
    navigator.clipboard.writeText(dateTime)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Timestamp Converter</h2>
        <p className="text-sm text-muted-foreground mt-1">Convert between Unix timestamps and human-readable dates</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Time</p>
            <p className="text-2xl font-bold font-mono mt-1">{Math.floor(currentTime / 1000)}</p>
            <p className="text-sm text-muted-foreground mt-1">{new Date(currentTime).toLocaleString()}</p>
          </div>
          <Button onClick={handleNow} className="w-full sm:w-auto">
            <Clock className="w-4 h-4 mr-2" />
            Use Now
          </Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <Label htmlFor="timestamp">Unix Timestamp (seconds)</Label>
          <div className="flex flex-col gap-2 mt-2 sm:flex-row">
            <Input
              id="timestamp"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="1234567890"
              className="font-mono"
            />
            <Button onClick={copyTimestamp} size="icon" variant="outline" className="self-start sm:self-auto">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Enter timestamp in seconds or milliseconds</p>
        </Card>

        <Card className="p-4">
          <Label htmlFor="datetime">ISO 8601 Date/Time</Label>
          <div className="flex flex-col gap-2 mt-2 sm:flex-row">
            <Input
              id="datetime"
              value={dateTime}
              onChange={(e) => handleDateTimeChange(e.target.value)}
              placeholder="2024-01-01T00:00:00.000Z"
              className="font-mono"
            />
            <Button onClick={copyDateTime} size="icon" variant="outline" className="self-start sm:self-auto">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)</p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Formatted Outputs</h3>
        {timestamp && dateTime !== "Invalid timestamp" && (
          <div className="space-y-2 text-sm font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Local:</span>
              <span>{new Date(Number(timestamp) * 1000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">UTC:</span>
              <span>{new Date(Number(timestamp) * 1000).toUTCString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ISO:</span>
              <span>{dateTime}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
