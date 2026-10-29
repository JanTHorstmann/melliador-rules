# Browser-Klickdummy

Der Klickdummy verwendet dieselben Kernfunktionen aus `03_src/core` wie das Foundry-System.

## Im Browser starten

Im Projektstamm ausführen:

```powershell
python -m http.server 8000
```

Dann `http://localhost:8000/clickdummy/` öffnen. ES-Module können im Browser nicht zuverlässig direkt aus `file://` geladen werden.

Das Feld **Fester W20-Wert** ermöglicht reproduzierbare Grenztests. Leer lassen, um `rollD20()` mit einem zufälligen W20 zu verwenden.

## Rechenbeispiel

Attributswert 14 ergibt Modifikator +2. Bei einem festen W20-Wert 10 und SG 12 ist das Gesamtergebnis 12 und die Probe erfolgreich.
