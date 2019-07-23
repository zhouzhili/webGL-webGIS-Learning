for (let i = 0; i < 0.2; i += 1 / 512) {
  for (let j = 0; j < 0.2; j += 1 / 512) {
    var st = Math.sqrt(Math.pow(i - 0.5, 2) + Math.pow(j - 0.5, 2))
    st = st * 10
    var d = st - Math.floor(st)
    console.log(d)
  }
}