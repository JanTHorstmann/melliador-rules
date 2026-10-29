# Melliador Rules â€“ Kernaufgaben und Arbeitsschritte

## Zweck und Leitlinien

Diese AufgabenÃ¼bersicht zerlegt das Projekt in groÃŸe Kernaufgaben und die konkreten Schritte, die jeweils zum Ziel fÃ¼hren. Die aktuelle Kernaufgabe ist bis auf benÃ¶tigte Daten, Berechnungen, Funktionen, Schnittstellen, Validierung und Tests ausgearbeitet. SpÃ¤tere Kernaufgaben bleiben zunÃ¤chst grob. Die offiziellen Melliador-Regeln sind maÃŸgeblich. Technische Beispiele aus D&D5e dienen ausschlieÃŸlich als Anschauung fÃ¼r Foundry-Integration und mÃ¼ssen auf das Melliador-Datenmodell Ã¼bertragen werden.

- **BELEGT** kennzeichnet Aussagen aus einer offiziellen Regelquelle mit Seite.
- **ABGELEITET** kennzeichnet technische oder organisatorische Entscheidungen.
- **OFFEN** kennzeichnet Fragen, die vor einer fachlich oder technisch folgenreichen Implementierung geklÃ¤rt werden mÃ¼ssen.
- Der Regelkern bleibt unabhÃ¤ngig von Foundry und Charakterbogen.
- Foundry-Zugriff liegt im Adapter; Charakterbogen und Darstellung bleiben bei Melliador Helpers.
- Keine Regelwerte, IDs, Datenpfade, FehlervertrÃ¤ge oder Ã¶ffentlichen APIs stillschweigend erfinden.

## Projektstand

- Die Projektstruktur mit Projektmanagement, Quellenreferenz, Spezifikationen, Quellcode, Tests und technischer Dokumentation ist angelegt.
- Der Regelkern enthÃ¤lt jetzt `rollD20()` und `rollAttribute()` unter `03_src/core`; `03_src/index.js` bÃ¼ndelt deren Exporte.
- `foundry/melliador-rules` enthÃ¤lt das Foundry-System, einen Test-Charakterbogen und einen Chat-Adapter fÃ¼r W20- und AttributswÃ¼rfe; produktive Melliador-Actor-Felder sind nicht festgelegt.
- `clickdummy` enthÃ¤lt eine BrowseroberflÃ¤che, die denselben Regelkern nutzt.
- Unter `04_tests` liegen ein Testkonzept und `test_charakter.json`; automatisierte Testdateien wurden nicht gefunden.
- Die Testfigur ist ein Foundry-Export eines D&D5e-Actors (`type: character`, `systemId: dnd5e`, Exportangabe `systemVersion: 6.0.5`). Attribute stehen in diesem Beispiel unter `system.abilities.<id>.value`. Das beschreibt nur diese Testdatei und legt kein Melliador-Datenmodell fest.
- Als offizielle Regelquelle ist der â€žMelliador-Schnellstarter, Version 1.2â€œ dokumentiert. Das PDF hat 94 Seiten.
- Die Ã¶ffentliche API, Actor-AuflÃ¶sung fÃ¼r Token, FehlervertrÃ¤ge und die Datenpfade des spÃ¤teren Melliador-Actors sind noch nicht entschieden.

## Kernaufgabe 1 â€“ Attributswurf erstellen

**Ziel:** Eine Spielleitung oder ein Charakterbogen kann eine Attributsprobe anfordern. Der Regelkern berechnet den Wurf unabhÃ¤ngig von Foundry; ein spÃ¤terer Adapter liest die benÃ¶tigten Actor-Werte aus, sobald Melliador-Datenpfade und die Ã¶ffentliche Schnittstelle geklÃ¤rt sind.

**Erfolgskriterium:** FÃ¼r einen vollstÃ¤ndig spezifizierten und gÃ¼ltigen Auftrag werden die regelrelevanten Werte nachvollziehbar kombiniert; derselbe Regelkern kann mit Testdaten ohne Foundry ausgefÃ¼hrt werden. Fehlerhafte oder unvollstÃ¤ndige Pflichtdaten ergeben einen ausdrÃ¼cklich definierten Fehler statt eines stillen Ersatzwertes.

### Arbeitsschritte

### 1.1 Herausfinden, was ein Attributswurf benÃ¶tigt

- [ ] **Attribut-ID und Attributswert:** Welche sechs Attribute verarbeitet die erste Version? Welche stabile englische ID gehÃ¶rt zu jedem Regelattribut?
- [ ] **Attributsmodifikator:** Aus welchem Attributswert wird er ermittelt? Die Tabelle und Randwerte aus der Quelle vollstÃ¤ndig verifizieren.
- [ ] **Ãœbung:** KlÃ¤ren, ob die angeforderte Probe nur das Attribut oder zusÃ¤tzlich eine Fertigkeit bzw. ein Werkzeug umfasst und wann Ãœbungsbonus gilt.
- [ ] **Vorteil/Nachteil:** Entscheiden, ob diese Mechanik in den ersten Attributswurf fÃ¤llt. Falls ja, muss der WÃ¼rfelzugriff mehr als einen W20 unterstÃ¼tzen kÃ¶nnen.
- [ ] **Zielwert:** Festlegen, dass der SG aus der Spielleitungsanfrage kommt und nicht durch den Regelkern bestimmt wird.
- [ ] **Gesamtergebnis:** Die belegte Erfolgskante `total >= target` spezifizieren.
- [ ] **SonderfÃ¤lle:** PrÃ¼fen, ob kritische Ergebnisse oder weitere Ausnahmen auf AttributswÃ¼rfe anzuwenden sind.

### 1.2 BenÃ¶tigte Eingangsdaten festlegen

- [ ] Probenanforderung: Actor-Bezug, Attribut-ID und SG; optionale Eingaben nur aufnehmen, wenn sie fachlich benÃ¶tigt sind.
- [ ] Actor-Daten: benÃ¶tigten Attributswert und gegebenenfalls Ãœbungs-/Fertigkeits-/Werkzeugdaten benennen.
- [ ] Zwischen Actor-Rohdaten und Regelkern ein kleines, dokumentiertes Eingabemodell festlegen.
- [ ] GeklÃ¤rt haben, ob eine Anforderung einen Welt-Actor (`actorId`) oder einen tokengebundenen Actor adressieren darf.
- [ ] Keine Feldpfade aus der Testfigur als Melliador-Datenmodell festschreiben.

### 1.3 Ã–ffentliche Anforderung und Verantwortungsgrenzen entwerfen

- [ ] Ablauf verfolgen: Chat-Probenanfrage â†’ Ã¶ffentliche API â†’ Foundry-Adapter â†’ Regelkern â†’ strukturiertes Ergebnis.
- [ ] Festlegen, welche Funktion Helpers aufrufen und wie der SG Ã¼bermittelt wird.
- [ ] Festlegen, ob der API-Aufruf synchron oder asynchron ist und wie sein Fehlerfall signalisiert wird.
- [ ] Abgrenzen: API nimmt Anfrage entgegen; Adapter lÃ¶st Actor auf und liest Daten; Kern validiert Regelwerte und berechnet; Darstellung/Chat-Ausgabe bleibt Integrations- bzw. Helpers-Aufgabe.
- [ ] Ergebnisfelder vor Implementierung verbindlich benennen; vorgeschlagene Namen in vorhandener Dokumentation prÃ¼fen.

### 1.4 Berechnungsfunktionen und Funktionsaufrufe festlegen

- [ ] `rollD20()` als zufÃ¤llige W20-Quelle verwenden. Die bestehende Spezifikation sieht eine ganze Zahl von 1 bis 20 vor.
- [ ] WÃ¼rfelquelle fÃ¼r regelkernunabhÃ¤ngige, reproduzierbare Tests austauschbar halten.
- [ ] Eine reine Kernfunktion fÃ¼r Attributswurf-Berechnung definieren, die keine Foundry-Objekte kennt.
- [ ] Reihenfolge der Verarbeitung festschreiben: Eingaben validieren â†’ WÃ¼rfelwert(e) beziehen â†’ regelbelegte Modifikatoren bestimmen/anwenden â†’ `total` berechnen â†’ mit `target` vergleichen â†’ Ergebnis zurÃ¼ckgeben.
- [ ] Falls Vorteil/Nachteil umgesetzt wird, das WÃ¼rfelziehen dafÃ¼r explizit spezifizieren; nicht in `rollD20()` versteckte Regelentscheidungen aufnehmen.
- [ ] Im Foundry-Adapter eine Anforderungsfunktion vorsehen, die Actor auflÃ¶st und nur benÃ¶tigte Werte an den Kern Ã¼bergibt.
- [ ] Vorhandene Ã¶ffentliche API-Dokumentation auf Funktionsnamen und Ergebnisformat abgleichen; keine konkurrierende API erfinden.

### 1.5 Eingaben, Fehler und Ergebnis spezifizieren

- [ ] Fehlerfall: Actor nicht gefunden oder im angesprochenen Kontext nicht verfÃ¼gbar.
- [ ] Fehlerfall: unbekannte oder fehlende Attribut-ID.
- [ ] Fehlerfall: Attributwert fehlt, ist nicht numerisch oder liegt auÃŸerhalb des spezifizierten Bereichs.
- [ ] Fehlerfall: SG fehlt, ist nicht numerisch oder verletzt die festgelegte Eingaberegel.
- [ ] Fehlerfall: ungÃ¼ltige/unerwartete WÃ¼rfelquelle.
- [ ] Einheitliche Fehlerantwort und stabile Fehlerkennungen fÃ¼r die Ã¶ffentliche Schnittstelle abstimmen.
- [ ] Ergebnis mindestens hinsichtlich Wurfart, Actor-Bezug, Attribut-ID, WÃ¼rfelwert, angewandtem Modifikator, Ziel, Gesamt und Erfolg spezifizieren; endgÃ¼ltige Felder erst nach API-Abgleich festlegen.
- [ ] Keine fehlenden Pflichtwerte stillschweigend durch `0` ersetzen.

### 1.6 QuellenprÃ¼fung und Quellenreferenz abschlieÃŸen

- [ ] Schnellstarter-Version und relevante Seiten nachvollziehbar festhalten.
- [ ] Attributswerte/Modifikatoren, Ãœbungsbonus, Fertigkeiten, WerkzeugÃ¼bung, Vorteil/Nachteil und SG getrennt erfassen.
- [ ] FÃ¼r jeden verwendeten Regelbestandteil Quelle und Seitenverweis in `01_rules_reference` dokumentieren.
- [ ] Beispiele und vorgefertigte Charaktere nicht ohne PrÃ¼fung als allgemeine Regel verallgemeinern.

### 1.7 Spezifikation und Implementierung vorbereiten

- [ ] `02_rule_specifications` um vollstÃ¤ndige Eingaben, Verarbeitung, Ausgaben und FehlerfÃ¤lle der Attributsprobe ergÃ¤nzen.
- [ ] Architektur-/API-Entscheidungen vor einer Ã¶ffentlichen oder systemprÃ¤genden Festlegung in Projektmanagement-Dokumentation festhalten.
- [ ] Erst nach KlÃ¤rung fachlicher und datenmodellrelevanter Fragen Kernfunktion und Adapter implementieren.
- [ ] Regeltests mit kontrollierten WÃ¼rfelwerten: Erfolg, Misserfolg, exakter Zielwert, minimale/maximale gÃ¼ltige Attribute und ungÃ¼ltige Eingaben.
- [ ] Adaptertests getrennt: Actor nicht gefunden, erwarteter Actor-Kontext, benÃ¶tigte Felder vorhanden/fehlend.
- [ ] Ã–ffentliche API und technische Dokumentation mit der tatsÃ¤chlichen Implementierung abgleichen.

### PrÃ¼fstand der Regelquelle fÃ¼r diese Kernaufgabe

- **BELEGT â€“ Basiswurf:** Ein einzelner W20, Modifikationen addieren, Vergleich mit SG; Erfolg bei Erreichen oder Ãœberschreiten des SG (PDF S. 24).
- **BELEGT â€“ Wurfarten:** AttributswÃ¼rfe betreffen aktives Handeln auÃŸerhalb von Angriffen; die Spielleitung legt deren Schwierigkeit situationsabhÃ¤ngig fest. RettungswÃ¼rfe reagieren auf externe Gefahren; Angriffe vergleichen gegen RK (PDF S. 24).
- **BELEGT â€“ Attribute:** STÃ„, KON, GES, INT, WEI und CHA; SC-Attributswerte liegen laut Schnellstarter zwischen 8 und 20 (PDF S. 24).
- **BELEGT â€“ Attributsmodifikator:** Tabelle auf PDF S. 25 fÃ¼hrt 4â€“5 = âˆ’3, 6â€“7 = âˆ’2, 8â€“9 = âˆ’1, 10â€“11 = +0, 12â€“13 = +1, 14â€“15 = +2, 16â€“17 = +3 und 18â€“19 = +4 auf.
- **VOM PROJEKTVERANTWORTLICHEN VORGEGEBEN â€“ Wert 20:** Die Implementierung verwendet +5. Der Schnellstarter nennt SC-Attributswerte bis 20 (PDF S. 24), aber die Tabelle auf S. 25 zeigt keinen Eintrag fÃ¼r 20. Der Regelstatus als Quellenbeleg bleibt daher offen.
- **BELEGT â€“ Ãœbung:** Modifikatoren stammen vor allem aus Attributsmodifikator und Ãœbungsbonus. Ãœbungsbonus fÃ¼r SC auf Stufen 1â€“4 ist +2; bei einer Fertigkeit oder einem Werkzeug wird er nur einmal addiert, wenn beide einschlÃ¤gig sind (PDF S. 25â€“26).
- **BELEGT â€“ Vorteil/Nachteil:** Zweiter W20, hÃ¶heres bzw. niedrigeres Ergebnis; mehrere Quellen kumulieren nicht, und Vorteil/Nachteil heben sich gegenseitig auf (PDF S. 26).
- **OFFEN fÃ¼r dieses Arbeitspaket:** Welche optionalen Wurfbestandteile die erste API unterstÃ¼tzt, wie Fertigkeit/WerkzeugÃ¼bung aus einem Melliador-Actor gelesen wird, ob das Ergebnisformat bestehende Benennungsvorgaben hat und welche Fehlerantworten Ã¶ffentlich stabil sein sollen.

## Kernaufgabe 2 â€“ RettungswÃ¼rfe erstellen (vorlÃ¤ufig)

Diese Punkte sind zunÃ¤chst ThemenÃ¼berschriften. Umfang und Reihenfolge werden nach Abschluss der Attributsprobe anhand der Quellen und Projektentscheidungen konkretisiert.

1. Regelquelle und benÃ¶tigte Werte identifizieren.
2. Eingaben, Berechnung, Ausgabe und FehlerfÃ¤lle spezifizieren.
3. Kernfunktion, Adapter und Tests ergÃ¤nzen.

## Kernaufgabe 3 â€“ AngriffswÃ¼rfe erstellen (vorlÃ¤ufig)

1. Waffen- und Zauberangriffe anhand der Quelle unterscheiden.
2. Ziel-RK, Attribute, Ãœbungsbonus, Waffenmerkmale und SonderfÃ¤lle spezifizieren.
3. Kernfunktion, Adapter und Tests ergÃ¤nzen.

## Kernaufgabe 4 â€“ Weitere Regeln und WÃ¼rfelmechaniken umsetzen (vorlÃ¤ufig)

Regelreferenzen und Spezifikationen fÃ¼r Vorteil/Nachteil, kritische Ergebnisse sowie Kampf, Schaden/Heilung, AusrÃ¼stung, Magie und Sonderregeln schrittweise vervollstÃ¤ndigen.

## Kernaufgabe 5 â€“ Ã–ffentliche Schnittstelle und Foundry-Integration vervollstÃ¤ndigen (vorlÃ¤ufig)

Versionierten Vertrag mit Melliador Helpers abstimmen; Chat-Anfragen, Actor-/Token-Kontext, RÃ¼ckgabe, Fehlerverhalten und KompatibilitÃ¤t integrieren.

## Kernaufgabe 6 â€“ Test- und VerÃ¶ffentlichungsgrundlage festlegen (vorlÃ¤ufig)

Testframework, Paket-/Build-Entscheidungen, Foundry-KompatibilitÃ¤t, Installation und Wartung entsprechend dem wachsenden Codebestand festlegen.

## Entscheidungspunkte

| Thema | Status | NÃ¤chster KlÃ¤rungsschritt |
|---|---|---|
| Quellenbeleg fÃ¼r Attributsmodifikator +5 bei Wert 20 | OFFEN; Implementierungsvorgabe +5 | PDF-Seite visuell prÃ¼fen und vollstÃ¤ndige offizielle Quelle abgleichen |
| Regelumfang des ersten Attributswurf-Vertrags (nur Attribut oder auch Fertigkeit/Werkzeug/Vorteil) | OFFEN | Nach QuellenprÃ¼fung konkret vorschlagen und abstimmen |
| Melliador-Actor-Feldpfade | OFFEN | Melliador-Actor-Beispiel bzw. Schema bereitstellen/prÃ¼fen |
| Actor aus Welt-Sammlung oder Token-Kontext | OFFEN | Integrationsfall und gewÃ¼nschte Zuordnung klÃ¤ren; derzeitiger Entwurf nutzt `game.actors.get(actorId)` |
| API-Funktionssignatur und RÃ¼ckgabeformat | OFFEN | Vor Umsetzung als Ã¶ffentlichen Vertrag festlegen |
| Fehlerformat und ungÃ¼ltige Eingaben | OFFEN | Einheitliches Fehlerverhalten vor Ã¶ffentlicher API festlegen |
| Foundry- und D&D5e-Beispielversion | OFFEN | Nur fÃ¼r KompatibilitÃ¤tsanalyse festlegen; keine LaufzeitabhÃ¤ngigkeit ableiten |
| Testframework, Build, Paketmanagement | OFFEN | Nach erstem isolierten Kernmodul anhand vorhandener Umgebung entscheiden |

## Quellen und technische Referenzen

- Melliador-Schnellstarter 1.2, Datei `Melliador_Schnellstarter_1_2__261002.pdf`, insbesondere PDF S. 24â€“26 fÃ¼r BasiswÃ¼rfe, Attribute, Modifikatoren, Ãœbung und Vorteil/Nachteil.
- Foundry VTT API: Actor-Dokument und `game.actors.get(actorId)`: https://foundryvtt.com/api/classes/foundry.documents.Actor.html
- Foundry VTT System Development: Datenmodelle, Dokumentklassen und Vorbereitung abgeleiteter Daten: https://foundryvtt.com/article/system-development/
- D&D5e System-Wiki: Roll-Formeln und Actor-Roll-Daten, Stand laut Wiki 6.0.0: https://github.com/foundryvtt/dnd5e/wiki/Roll-Formulas
- D&D5e System-Wiki: Roll-Hooks, als systemspezifisches Integrationsbeispiel: https://github.com/foundryvtt/dnd5e/wiki/Hooks

Die Foundry- und D&D5e-Referenzen erklÃ¤ren technische Muster. Sie belegen keine Melliador-Regeln und legen weder Melliador-Datenpfade noch die Melliador-API fest.

