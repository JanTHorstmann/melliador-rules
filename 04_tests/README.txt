TESTKONZEPT – MELLlADOR RULES

ZIEL
Prüfen, ob die technische Umsetzung die dokumentierten
Regelspezifikationen korrekt erfüllt.

GRUNDSATZ
Tests prüfen die Umsetzung einer festgelegten Regel.
Sie ersetzen nicht die fachliche Prüfung der Regelquelle.

UNIT-TESTS
Einzelne Funktionen werden isoliert getestet.

BEISPIEL rollD20()
- Ergebnis ist eine ganze Zahl.
- Ergebnis liegt zwischen 1 und 20 einschließlich.

BEISPIEL WURFBERECHNUNG
Für Berechnungstests werden feste Würfelwerte und
eindeutige Eingaben verwendet.

Beispiel:
Würfelwert: 12
Gesamtmodifikator: +3
Zielwert: 15

Erwartetes Gesamtergebnis: 15
Erwarteter Erfolg: true

INTEGRATIONSTESTS
Prüfen später das Zusammenspiel zwischen öffentlicher
Schnittstelle, Charakterdaten und Regelkern.

TESTDATEN
Beispielcharaktere und weitere Testdaten werden getrennt
vom Produktivcode abgelegt.

FEHLERFÄLLE
Ungültige und fehlende Pflichtwerte müssen explizit
getestet werden.

WICHTIG
Fehlende Werte werden nicht pauschal durch 0 ersetzt.
Ein Ersatzwert darf nur verwendet werden, wenn die
jeweilige Regel oder Datendefinition dies vorsieht.