## TO FIX

- Nello stile generato per i componenti (ad esempio testo e border Input) il colore viene valorizzato con quello del progetto di spaceyard e viene persa la classe che lo genera (questo perché uso @apply). Si dovrebbe quindi o impostare il colore a partire dalla variabile oppure impostare la classe sul componente e non sul css.

## ComboboxMultiple

- Quando seleziono un oggetto sbagliato focusare l'index 0, potrebbe provocare dello scroll, sarebbe piu appropriato focusare l'elemento prima quello appena selezionato?
- Ha senso rimuovere gli oggetti selezionati dalla lista delle opzioni? Non si potrebbero mostrare con uno stile che faccia capire che sono già selezionati, e cliccando posso de-selezionarli?
- Aggiungere tasto per rimuovere tutti gli elementi selezionati in un colpo solo?

## Select

- Per come funziona `downshift` non è possibile usare il `<FieldWrapper>` per renderizzare label e combobox associate, bisognerebbe implementare la cosa in maniera diversa?