## TO FIX

- Nello stile generato per i componenti (ad esempio testo e border Input) il colore viene valorizzato con quello del progetto di spaceyard e viene persa la classe che lo genera (questo perché uso @apply). Si dovrebbe quindi o impostare il colore a partire dalla variabile oppure impostare la classe sul componente e non sul css.