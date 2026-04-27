"use client"

import { useEffect, useState } from "react"
import type { CSSProperties } from "react"
import { MarkdownEditor } from "@/components/tools/markdown-editor"
import { CrontabParser } from "@/components/tools/crontab-parser"
import { JsonBeautifier } from "@/components/tools/json-beautifier"
import { TextDiff } from "@/components/tools/text-diff"
import { TextStats } from "@/components/tools/text-stats"
import { PasswordGenerator } from "@/components/tools/password-generator"
import { CaseConverter } from "@/components/tools/case-converter"
import { TimestampConverter } from "@/components/tools/timestamp-converter"
import {
  FileText,
  Clock,
  Code2,
  GitCompare,
  Type,
  Key,
  CaseSensitive,
  Calendar,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Moon,
  Sun,
} from "lucide-react"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"
import { useTheme } from "next-themes"

const tools = [
  { id: "markdown", name: "Markdown Editor", icon: FileText, component: MarkdownEditor },
  { id: "crontab", name: "Crontab Parser", icon: Clock, component: CrontabParser },
  { id: "json", name: "JSON Beautifier", icon: Code2, component: JsonBeautifier },
  { id: "diff", name: "Text Diff", icon: GitCompare, component: TextDiff },
  { id: "stats", name: "Text Stats", icon: Type, component: TextStats },
  { id: "password", name: "Password Generator", icon: Key, component: PasswordGenerator },
  { id: "case", name: "Case Converter", icon: CaseSensitive, component: CaseConverter },
  { id: "timestamp", name: "Timestamp Converter", icon: Calendar, component: TimestampConverter },
]

export default function DevToolbox() {
  const [activeTool, setActiveTool] = useState("markdown")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { resolvedTheme, setTheme } = useTheme()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
  }

  const themeIsDark = resolvedTheme === "dark"
  const themeToggleLabel = themeIsDark ? "Switch to light theme" : "Switch to dark theme"
  const themeToggleText = themeIsDark ? "Light mode" : "Dark mode"

  const sidebarWidth = isSidebarOpen ? "16rem" : "0rem"
  const layoutStyle = { "--sidebar-width": sidebarWidth } as CSSProperties
  const mainWidthStyles = {
    "--content-max-width": isSidebarOpen ? "72rem" : "90rem",
  } as CSSProperties

  const activeToolMeta = tools.find((t) => t.id === activeTool) || tools[0]
  const ActiveComponent = activeToolMeta.component || MarkdownEditor

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card hidden md:block">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-balance">Toolbox</h1>
            <p className="text-sm text-muted-foreground mt-1">Fast, local utilities with no ads</p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {hasMounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label={themeToggleLabel}
                title={themeToggleLabel}
              >
                {themeIsDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="hidden sm:inline">{themeToggleText}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="hidden items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:inline-flex min-w-[128px] justify-center"
              aria-pressed={isSidebarOpen}
              aria-label={isSidebarOpen ? "Collapse tool navigation" : "Expand tool navigation"}
            >
              {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              <span className="whitespace-nowrap">{isSidebarOpen ? "Hide tools" : "Show tools"}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden" style={layoutStyle}>
        <aside
          className={`hidden flex-shrink-0 overflow-hidden border-border bg-card transition-[width,opacity] duration-300 ease-in-out md:flex md:flex-col ${
            isSidebarOpen ? "md:opacity-100 md:border-r" : "md:opacity-0 md:pointer-events-none md:border-r-0"
          }`}
          style={{ width: sidebarWidth }}
          aria-hidden={!isSidebarOpen}
        >
          <nav className="p-4 space-y-1">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTool === tool.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  aria-label={tool.name}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate whitespace-nowrap">{tool.name}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card z-50">
          <Sheet>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Active tool</p>
                <p className="text-sm font-medium">{activeToolMeta.name}</p>
              </div>
              <div className="flex items-center gap-2">
                {hasMounted && (
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="rounded-md border border-border bg-background p-2 text-foreground shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-label={themeToggleLabel}
                    title={themeToggleLabel}
                  >
                    {themeIsDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </button>
                )}
                <SheetTrigger asChild>
                  <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm">
                    <Menu className="h-4 w-4" />
                    All tools
                  </button>
                </SheetTrigger>
              </div>
            </div>
            <SheetContent side="bottom" className="px-4 pb-6 pt-2">
              <SheetHeader className="px-0">
                <SheetTitle>Select a tool</SheetTitle>
                <SheetDescription>Quick switch between utilities</SheetDescription>
              </SheetHeader>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {tools.map((tool) => {
                  const Icon = tool.icon
                  const isActive = activeTool === tool.id
                  return (
                    <SheetClose asChild key={tool.id}>
                      <button
                        onClick={() => setActiveTool(tool.id)}
                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                          isActive
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-foreground hover:bg-secondary"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="truncate">{tool.name}</span>
                      </button>
                    </SheetClose>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0 min-w-0" style={mainWidthStyles}>
          <div
            className="mx-auto w-full p-4 md:p-6 transition-[max-width] duration-300 ease-in-out"
            style={{ maxWidth: "var(--content-max-width)" }}
          >
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  )
}
