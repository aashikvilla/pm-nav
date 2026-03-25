type LogLevel = "info" | "warn" | "error"

function log(level: LogLevel, message: string, data?: unknown) {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`
  if (process.env.NODE_ENV === "production") {
    // In production, structured logging only
    process.stdout.write(JSON.stringify({ timestamp, level, message, data }) + "\n")
  } else {
    if (level === "error") {
      process.stderr.write(`${prefix} ${message} ${data ? JSON.stringify(data) : ""}\n`)
    } else {
      process.stdout.write(`${prefix} ${message} ${data ? JSON.stringify(data) : ""}\n`)
    }
  }
}

export const logger = {
  info: (msg: string, data?: unknown) => log("info", msg, data),
  warn: (msg: string, data?: unknown) => log("warn", msg, data),
  error: (msg: string, data?: unknown) => log("error", msg, data),
}
