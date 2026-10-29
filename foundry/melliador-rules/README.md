# Foundry-Systemordner

Dieser Ordner ist das installierbare Foundry-Systemverzeichnis. Den gesamten Ordner `melliador-rules` in Foundrys `Data/systems/` ablegen. Danach Foundry neu starten und beim Anlegen einer Welt **Melliador Rules** als System wÃ¤hlen.

Das System ist ein frÃ¼hes EntwicklungsgerÃ¼st. Es deklariert einen leeren Actor-Typ `character` und enthÃ¤lt ein **Test-Charakterbogen-Sheet** fÃ¼r WÃ¼rfe. Ein produktives Melliador-Actor-Datenmodell ist weiterhin nicht festgelegt.

`game.melliadorRulesPrototype` ist ein vorlÃ¤ufiger Entwicklungszugang und noch keine freigegebene Schnittstelle fÃ¼r Melliador Helpers.

## Test-Charakterbogen

In einer Welt mit dem Actor-Typ `character` wird das Sheet `Melliador Rules â€“ Testcharakterbogen` als Standardbogen angeboten. Die Startwerte (18, 14, 16, 10, 12, 8) orientieren sich an `assets/charaktersheet_vorlage.png` und sind nur Testdaten.

- `Allgemeinen W20 wÃ¼rfeln` ruft `rollD20()` auf.
- `Probe wÃ¼rfeln` ruft `rollAttribute()` mit Attribut-ID, aktuellem Wert und dem eingegebenen SG auf.
- `Testwerte speichern` speichert die sechs Werte und den SG ausschlieÃŸlich unter dem Actor-Flag `melliador-rules.testCharacter`.
- Das Ergebnis erscheint im Sheet und als Chatkarte im Foundry-Chat.

Die Chatkarte zeigt W20, Modifikator und Gesamtergebnis. Bei Attributsproben
zeigt sie zusÃ¤tzlich SG und Erfolg/Misserfolg. Die Sichtbarkeit folgt dem in
Foundry eingestellten Nachrichtenmodus. `game.melliadorRulesPrototype.postRollToChat`
ist ein vorlÃ¤ufiger Foundry-Adapter; er Ã¼bernimmt ein bereits berechnetes
Ergebnis und wÃ¼rfelt nicht erneut.

Das Flag ist eine temporÃ¤re Testablage und legt keine produktiven `system.*`-Felder oder Actor-Datenpfade fest. Die Sheet-Implementierung liegt unter `module/test-character-sheet.mjs`, die Vorlage unter `templates/test-character-sheet.hbs` und die Gestaltung unter `styles/test-character-sheet.css`.

