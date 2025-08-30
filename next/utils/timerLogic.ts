export class Timer {
  private startTime: number = 0
  private endTime: number = 0
  private isRunning: boolean = false
  private intervalId: NodeJS.Timeout | null = null
  private onTick: ((elapsed: number) => void) | null = null

  constructor(onTick?: (elapsed: number) => void) {
    this.onTick = onTick || null
  }

  start(): void {
    if (this.isRunning) return

    this.isRunning = true
    this.startTime = Date.now() - (this.endTime - this.startTime)

    if (this.onTick) {
      this.intervalId = setInterval(() => {
        const elapsed = this.getElapsedTime()
        this.onTick!(elapsed)
      }, 100)
    }
  }

  stop(): void {
    if (!this.isRunning) return

    this.isRunning = false
    this.endTime = Date.now()

    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  reset(): void {
    this.stop()
    this.startTime = 0
    this.endTime = 0
  }

  getElapsedTime(): number {
    if (this.isRunning) {
      return Date.now() - this.startTime
    }
    return this.endTime - this.startTime
  }

  getFormattedTime(): string {
    const elapsed = this.getElapsedTime()
    const minutes = Math.floor(elapsed / 60000)
    const seconds = Math.floor((elapsed % 60000) / 1000)
    const milliseconds = Math.floor((elapsed % 1000) / 10)

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
  }

  isActive(): boolean {
    return this.isRunning
  }

  destroy(): void {
    this.stop()
    this.onTick = null
  }
}

export class CountdownTimer {
  private duration: number = 0
  private remainingTime: number = 0
  private isRunning: boolean = false
  private intervalId: NodeJS.Timeout | null = null
  private onTick: ((remaining: number) => void) | null = null
  private onComplete: (() => void) | null = null

  constructor(
    duration: number,
    onTick?: (remaining: number) => void,
    onComplete?: () => void
  ) {
    this.duration = duration
    this.remainingTime = duration
    this.onTick = onTick || null
    this.onComplete = onComplete || null
  }

  start(): void {
    if (this.isRunning) return

    this.isRunning = true

    if (this.onTick) {
      this.intervalId = setInterval(() => {
        this.remainingTime -= 100

        if (this.remainingTime <= 0) {
          this.remainingTime = 0
          this.stop()
          if (this.onComplete) {
            this.onComplete()
          }
        } else {
          this.onTick!(this.remainingTime)
        }
      }, 100)
    }
  }

  stop(): void {
    if (!this.isRunning) return

    this.isRunning = false

    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  reset(): void {
    this.stop()
    this.remainingTime = this.duration
  }

  setDuration(duration: number): void {
    this.duration = duration
    this.remainingTime = duration
  }

  getRemainingTime(): number {
    return this.remainingTime
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.remainingTime / 60000)
    const seconds = Math.floor((this.remainingTime % 60000) / 1000)
    const milliseconds = Math.floor((this.remainingTime % 1000) / 10)

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
  }

  isActive(): boolean {
    return this.isRunning
  }

  destroy(): void {
    this.stop()
    this.onTick = null
    this.onComplete = null
  }
}
