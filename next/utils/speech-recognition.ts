export class SpeechRecognition {
  private recognition: any
  private isListening: boolean = false
  private onResult: ((transcript: string) => void) | null = null
  private onError: ((error: string) => void) | null = null
  private onEnd: (() => void) | null = null

  constructor(
    onResult?: (transcript: string) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ) {
    this.onResult = onResult || null
    this.onError = onError || null
    this.onEnd = onEnd || null

    // Web Speech APIのサポートチェック
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition()
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition()
    } else {
      throw new Error('Speech recognition is not supported in this browser')
    }

    this.setupRecognition()
  }

  private setupRecognition(): void {
    this.recognition.continuous = false
    this.recognition.interimResults = false
    this.recognition.lang = 'ja-JP'

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      if (this.onResult) {
        this.onResult(transcript)
      }
    }

    this.recognition.onerror = (event: any) => {
      let errorMessage = 'Unknown error occurred'

      switch (event.error) {
        case 'no-speech':
          errorMessage = '音声が検出されませんでした'
          break
        case 'audio-capture':
          errorMessage = 'マイクへのアクセスができませんでした'
          break
        case 'not-allowed':
          errorMessage = 'マイクの使用が許可されていません'
          break
        case 'network':
          errorMessage = 'ネットワークエラーが発生しました'
          break
        case 'service-not-allowed':
          errorMessage = '音声認識サービスが利用できません'
          break
        case 'bad-grammar':
          errorMessage = '文法エラーが発生しました'
          break
        case 'language-not-supported':
          errorMessage = 'この言語はサポートされていません'
          break
      }

      if (this.onError) {
        this.onError(errorMessage)
      }
    }

    this.recognition.onend = () => {
      this.isListening = false
      if (this.onEnd) {
        this.onEnd()
      }
    }
  }

  start(): void {
    if (this.isListening) return

    try {
      this.recognition.start()
      this.isListening = true
    } catch (error) {
      if (this.onError) {
        this.onError('音声認識を開始できませんでした')
      }
    }
  }

  stop(): void {
    if (!this.isListening) return

    try {
      this.recognition.stop()
      this.isListening = false
    } catch (error) {
      if (this.onError) {
        this.onError('音声認識を停止できませんでした')
      }
    }
  }

  isActive(): boolean {
    return this.isListening
  }

  setLanguage(lang: string): void {
    this.recognition.lang = lang
  }

  setContinuous(continuous: boolean): void {
    this.recognition.continuous = continuous
  }

  setInterimResults(interim: boolean): void {
    this.recognition.interimResults = interim
  }

  destroy(): void {
    this.stop()
    this.onResult = null
    this.onError = null
    this.onEnd = null
  }
}

// 音声認識の利用可能性をチェックする関数
export function isSpeechRecognitionSupported(): boolean {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
}

// 利用可能な言語のリスト
export const SUPPORTED_LANGUAGES = [
  { code: 'ja-JP', name: '日本語' },
  { code: 'en-US', name: '英語（アメリカ）' },
  { code: 'en-GB', name: '英語（イギリス）' },
  { code: 'ko-KR', name: '韓国語' },
  { code: 'zh-CN', name: '中国語（簡体字）' },
  { code: 'zh-TW', name: '中国語（繁体字）' },
  { code: 'fr-FR', name: 'フランス語' },
  { code: 'de-DE', name: 'ドイツ語' },
  { code: 'es-ES', name: 'スペイン語' },
  { code: 'it-IT', name: 'イタリア語' }
]
