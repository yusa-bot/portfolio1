export class SpeechSynthesis {
  private utterance: SpeechSynthesisUtterance | null = null
  private isSpeaking: boolean = false
  private onStart: (() => void) | null = null
  private onEnd: (() => void) | null = null
  private onError: ((error: string) => void) | null = null

  constructor(
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ) {
    this.onStart = onStart || null
    this.onEnd = onEnd || null
    this.onError = onError || null

    // Web Speech APIのサポートチェック
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis is not supported in this browser')
    }
  }

  speak(text: string, options?: {
    lang?: string
    pitch?: number
    rate?: number
    volume?: number
    voice?: SpeechSynthesisVoice
  }): void {
    if (this.isSpeaking) {
      this.stop()
    }

    this.utterance = new SpeechSynthesisUtterance(text)

    // デフォルト設定
    this.utterance.lang = options?.lang || 'ja-JP'
    this.utterance.pitch = options?.pitch || 1
    this.utterance.rate = options?.rate || 1
    this.utterance.volume = options?.volume || 1

    if (options?.voice) {
      this.utterance.voice = options.voice
    }

    // イベントハンドラーの設定
    this.utterance.onstart = () => {
      this.isSpeaking = true
      if (this.onStart) {
        this.onStart()
      }
    }

    this.utterance.onend = () => {
      this.isSpeaking = false
      if (this.onEnd) {
        this.onEnd()
      }
    }

    this.utterance.onerror = (event) => {
      this.isSpeaking = false
      let errorMessage = '音声合成でエラーが発生しました'

      switch (event.error) {
        case 'canceled':
          errorMessage = '音声合成がキャンセルされました'
          break
        case 'interrupted':
          errorMessage = '音声合成が中断されました'
          break
        case 'audio-busy':
          errorMessage = '音声デバイスが使用中です'
          break
        case 'audio-hardware':
          errorMessage = '音声ハードウェアでエラーが発生しました'
          break
        case 'network':
          errorMessage = 'ネットワークエラーが発生しました'
          break
        case 'synthesis-not-supported':
          errorMessage = '音声合成がサポートされていません'
          break
        case 'synthesis-unavailable':
          errorMessage = '音声合成が利用できません'
          break
        case 'text-too-long':
          errorMessage = 'テキストが長すぎます'
          break
        case 'invalid-argument':
          errorMessage = '無効な引数が指定されました'
          break
        case 'language-unavailable':
          errorMessage = '指定された言語が利用できません'
          break
        case 'voice-unavailable':
          errorMessage = '指定された音声が利用できません'
          break
      }

      if (this.onError) {
        this.onError(errorMessage)
      }
    }

    // 音声合成の開始
    window.speechSynthesis.speak(this.utterance)
  }

  stop(): void {
    if (this.isSpeaking) {
      window.speechSynthesis.cancel()
      this.isSpeaking = false
    }
  }

  pause(): void {
    if (this.isSpeaking) {
      window.speechSynthesis.pause()
    }
  }

  resume(): void {
    if (this.isSpeaking) {
      window.speechSynthesis.resume()
    }
  }

  isActive(): boolean {
    return this.isSpeaking
  }

  getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      let voices = window.speechSynthesis.getVoices()

      if (voices.length > 0) {
        resolve(voices)
      } else {
        // 音声の読み込みを待つ
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices()
          resolve(voices)
        }
      }
    })
  }

  getAvailableLanguages(): Promise<string[]> {
    return this.getVoices().then(voices => {
      const languages = new Set<string>()
      voices.forEach(voice => {
        if (voice.lang) {
          languages.add(voice.lang)
        }
      })
      return Array.from(languages).sort()
    })
  }

  destroy(): void {
    this.stop()
    this.onStart = null
    this.onEnd = null
    this.onError = null
  }
}

// 音声合成の利用可能性をチェックする関数
export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window
}

// 音声合成の状態をチェックする関数
export function getSpeechSynthesisState(): {
  speaking: boolean
  paused: boolean
  pending: boolean
} {
  if (!('speechSynthesis' in window)) {
    return { speaking: false, paused: false, pending: false }
  }

  return {
    speaking: window.speechSynthesis.speaking,
    paused: window.speechSynthesis.paused,
    pending: window.speechSynthesis.pending
  }
}

// 音声合成を一時停止する関数
export function pauseSpeechSynthesis(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause()
  }
}

// 音声合成を再開する関数
export function resumeSpeechSynthesis(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.resume()
  }
}

// 音声合成を停止する関数
export function cancelSpeechSynthesis(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
