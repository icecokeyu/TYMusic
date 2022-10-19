const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricStrings) {
  const lyricArray = lyricStrings.split('\n')
  const lyricInfo = []

  for(let lineString of lyricArray) {
    const timeResult = timeRegExp.exec(lineString)
    if(!timeResult) continue
    const minute = timeResult[1] * 60 *1000
    const second = timeResult[2] * 1000
    const millisecond = timeResult[3].length === 2 ? timeResult[3] * 10 : timeResult[3] * 1
    const lyricTime = minute + second + millisecond

    const txt = lineString.replace(timeResult[0], "")

    lyricInfo.push({lyricTime, txt})
  }
  return lyricInfo 
}