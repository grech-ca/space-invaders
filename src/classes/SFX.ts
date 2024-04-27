export class SFX {
  private static soundNames = ['explosion', 'hit', 'shoot']
  private static sounds: Map<string, HTMLAudioElement> = new Map()

  static init() {
    this.soundNames.forEach(sound => this.sounds.set(sound, new Audio(`/audio/${sound}.wav`)))
  }
  
  static play(sound: string) {
    (this.sounds.get(sound)?.cloneNode(true) as HTMLAudioElement | undefined)?.play()
  }
}
